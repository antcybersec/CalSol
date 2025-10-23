const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { Connection, PublicKey, SystemProgram, Transaction, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const calendarService = require('./services/calendarService')

dotenv.config()

// Create service account key from environment variable (for Vercel deployment)
if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  const serviceAccountKey = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
  fs.writeFileSync(path.join(__dirname, 'service-account-key.json'), serviceAccountKey)
  console.log('✅ Service account key created from environment variable')
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Google Calendar API
calendarService.initializeCalendarAPI()

// Solana Configuration
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

// In-memory storage for demo (replace with database in production)
const calendars = new Map()
const transactions = new Map()
const wallets = new Map() // Store wallets for calendars
// Store scheduled events with better tracking
const scheduledEvents = new Map() // Store events waiting for execution
const eventStatuses = new Map() // Store event statuses for frontend polling

// ============================================
// WALLET GENERATION & MANAGEMENT
// ============================================

// Generate deterministic wallet from calendar ID
function generateWalletFromCalendarId(calendarId) {
  // Create a deterministic seed from calendar ID using proper Solana keypair generation
  const seed = crypto.createHash('sha256').update(calendarId).digest()
  
  // Use the seed to generate a proper Solana keypair
  const keypair = Keypair.fromSeed(seed)
  return keypair
}

// Get or create wallet for calendar
function getWalletForCalendar(calendarId) {
  if (wallets.has(calendarId)) {
    return wallets.get(calendarId)
  }

  const keypair = generateWalletFromCalendarId(calendarId)
  wallets.set(calendarId, keypair)
  return keypair
}

// Get wallet balance
async function getWalletBalance(publicKey) {
  try {
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Error fetching balance:', error)
    throw error
  }
}

// Parse transaction from event title
// Examples:
// "Send 5 SOL to wallet_address"
// "Send 5 PH100 to PablosPro.eth"
// "Swap 10 USDC to SOL"
function parseTransactionFromTitle(title, description = '') {
  // Send pattern: "Send X TOKEN to ADDRESS"
  const sendRegex = /Send\s+([\d.]+)\s+([A-Za-z]+)\s+to\s+([1-9A-HJ-NP-Za-km-z]{32,44}|[\w.]+)/i
  let sendMatch = title?.match(sendRegex)

  if (sendMatch) {
    return {
      type: 'transfer',
      amount: parseFloat(sendMatch[1]),
      token: sendMatch[2],
      recipient: sendMatch[3],
    }
  }

  // Swap pattern: "Swap X TOKEN1 to TOKEN2"
  const swapRegex = /Swap\s+([\d.]+)\s+(\w+)\s+to\s+(\w+)/i
  const swapMatch = title?.match(swapRegex)

  if (swapMatch) {
    return {
      type: 'swap',
      amount: parseFloat(swapMatch[1]),
      fromToken: swapMatch[2],
      toToken: swapMatch[3],
    }
  }

  // Fallback: try parsing from description
  if (description) {
    sendMatch = description.match(sendRegex)
    if (sendMatch) {
      return {
        type: 'transfer',
        amount: parseFloat(sendMatch[1]),
        token: sendMatch[2],
        recipient: sendMatch[3],
      }
    }
  }

  return null
}

// Execute SOL transfer
async function executeSolTransfer(fromKeypair, toAddress, amount) {
  try {
    const toPublicKey = new PublicKey(toAddress)
    const { blockhash } = await connection.getLatestBlockhash()

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromKeypair.publicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    )

    const signature = await connection.sendTransaction(transaction, [fromKeypair])
    await connection.confirmTransaction(signature)

    return {
      success: true,
      signature,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    }
  } catch (error) {
    console.error('Error executing SOL transfer:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// ============================================
// AUTOMATIC EXECUTION SCHEDULER
// ============================================

// Check for events that need to be executed
async function checkScheduledEvents() {
  const now = new Date()
  
  for (const [eventId, event] of scheduledEvents) {
    const eventTime = new Date(event.startTime)
    
    // If event time has passed and not yet executed
    if (eventTime <= now && event.status === 'pending') {
      console.log(`⏰ Executing scheduled event: ${event.title}`)
      
      try {
        // Parse transaction from event
        const txData = parseTransactionFromTitle(event.title, event.description)
        
        if (txData && txData.type === 'transfer' && txData.token.toUpperCase() === 'SOL') {
          // Get wallet for calendar
          const keypair = getWalletForCalendar(event.calendarId)
          
          // Execute transaction
          const result = await executeSolTransfer(keypair, txData.recipient, txData.amount)
          
          if (result.success) {
            // Update event status
            event.status = 'executed'
            event.signature = result.signature
            event.executedAt = new Date()
            
            // Store status for frontend polling
            eventStatuses.set(eventId, {
              status: 'executed',
              signature: result.signature,
              executedAt: new Date(),
              explorerUrl: result.explorerUrl
            })
            
            // Update calendar event
            try {
              await calendarService.updateEventStatus(
                event.calendarId,
                eventId,
                'executed',
                result.signature,
                result.explorerUrl
              )
            } catch (error) {
              console.warn('Could not update calendar event:', error.message)
            }
            
            console.log(`✅ Event executed: ${event.title} - ${result.signature}`)
          } else {
            event.status = 'failed'
            event.error = result.error
            
            // Store failed status
            eventStatuses.set(eventId, {
              status: 'failed',
              error: result.error,
              failedAt: new Date()
            })
            
            console.error(`❌ Event failed: ${event.title} - ${result.error}`)
          }
        }
      } catch (error) {
        console.error(`❌ Error executing event ${eventId}:`, error)
        event.status = 'failed'
        event.error = error.message
      }
    }
  }
}

// Check for new events from Google Calendar
async function checkForNewCalendarEvents(calendarId) {
  try {
    // Get recent events from Google Calendar
    const events = await calendarService.getUpcomingEvents(calendarId, 20)
    
    console.log(`🔍 Checking ${events.length} events from Google Calendar for ${calendarId}`)
    
    for (const event of events) {
      // Check if this event is already in our scheduler
      if (!scheduledEvents.has(event.id)) {
        // Parse transaction from event title
        const txData = parseTransactionFromTitle(event.summary, event.description)
        
        if (txData && txData.type === 'transfer' && txData.token.toUpperCase() === 'SOL') {
          // Add to scheduler
          scheduledEvents.set(event.id, {
            id: event.id,
            calendarId,
            title: event.summary,
            description: event.description || '',
            startTime: event.start?.dateTime || event.start?.date,
            endTime: event.end?.dateTime || event.end?.date,
            status: 'pending',
            createdAt: new Date(),
            txData,
            source: 'google_calendar' // Mark as from Google Calendar
          })
          
          console.log(`📅 New calendar event detected: ${event.summary} at ${event.start?.dateTime}`)
        } else {
          console.log(`⚠️ Event not a transaction: ${event.summary}`)
        }
      } else {
        console.log(`✅ Event already scheduled: ${event.summary}`)
      }
    }
  } catch (error) {
    console.error(`Error checking calendar events for ${calendarId}:`, error)
  }
}

// Run scheduler every 30 seconds
setInterval(checkScheduledEvents, 30000)

// Also check for new events from Google Calendar every 60 seconds
setInterval(async () => {
  try {
    for (const [calendarId, calendar] of calendars) {
      if (calendar.onboarded) {
        await checkForNewCalendarEvents(calendarId)
      }
    }
  } catch (error) {
    console.error('Error checking for new calendar events:', error)
  }
}, 60000) // Check every 60 seconds

// Get event status for frontend polling
app.get('/api/event/status/:eventId', (req, res) => {
  try {
    const { eventId } = req.params
    const status = eventStatuses.get(eventId)
    
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Event status not found'
      })
    }
    
    res.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error fetching event status:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get all event statuses for a calendar
app.get('/api/calendar/event-statuses/:calendarId', (req, res) => {
  try {
    const { calendarId } = req.params
    const statuses = {}
    
    for (const [eventId, status] of eventStatuses) {
      const event = scheduledEvents.get(eventId)
      if (event && event.calendarId === calendarId) {
        statuses[eventId] = status
      }
    }
    
    res.json({
      success: true,
      data: statuses
    })
  } catch (error) {
    console.error('Error fetching event statuses:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Manually check for new calendar events
app.post('/api/calendar/check-events', async (req, res) => {
  try {
    const { calendarId } = req.body
    
    if (!calendarId) {
      return res.status(400).json({ error: 'Calendar ID is required' })
    }
    
    await checkForNewCalendarEvents(calendarId)
    
    res.json({
      success: true,
      message: 'Calendar events checked successfully'
    })
  } catch (error) {
    console.error('Error checking calendar events:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get all scheduled events for a calendar
app.get('/api/calendar/scheduled-events/:calendarId', (req, res) => {
  try {
    const { calendarId } = req.params
    const events = []
    
    for (const [eventId, event] of scheduledEvents) {
      if (event.calendarId === calendarId) {
        events.push({
          id: eventId,
          title: event.title,
          startTime: event.startTime,
          status: event.status,
          source: event.source || 'app',
          createdAt: event.createdAt
        })
      }
    }
    
    res.json({
      success: true,
      data: events
    })
  } catch (error) {
    console.error('Error fetching scheduled events:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// CALENDAR ROUTES
// ============================================

// Get calendar wallet address for funding
app.get('/api/calendar/wallet/:calendarId', async (req, res) => {
  try {
    const { calendarId } = req.params
    const keypair = getWalletForCalendar(calendarId)
    const balance = await getWalletBalance(keypair.publicKey)

    res.json({
      success: true,
      data: {
        address: keypair.publicKey.toString(),
        balance: balance.toFixed(4),
        explorerUrl: `https://explorer.solana.com/address/${keypair.publicKey.toString()}?cluster=devnet`,
      },
    })
  } catch (error) {
    console.error('Error fetching calendar wallet:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// ============================================
// WALLET ROUTES
// ============================================

// Get wallet info for calendar
app.get('/api/wallet/:calendarId', async (req, res) => {
  try {
    const { calendarId } = req.params
    const keypair = getWalletForCalendar(calendarId)
    const balance = await getWalletBalance(keypair.publicKey)

    res.json({
      success: true,
      data: {
        address: keypair.publicKey.toString(),
        balance: balance.toFixed(4),
        balanceLamports: Math.floor(balance * LAMPORTS_PER_SOL),
        explorerUrl: `https://explorer.solana.com/address/${keypair.publicKey.toString()}?cluster=devnet`,
      },
    })
  } catch (error) {
    console.error('Error fetching wallet info:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// ============================================
// TRANSACTION ROUTES
// ============================================

// Execute transaction from calendar event
app.post('/api/transaction/execute', async (req, res) => {
  try {
    const { eventId, calendarId, eventTitle, eventDescription, toAddress, amount } = req.body

    if (!calendarId || !eventTitle) {
      return res.status(400).json({
        success: false,
        error: 'Calendar ID and event title are required',
      })
    }

    // Parse transaction from event title
    let txData = parseTransactionFromTitle(eventTitle, eventDescription)

    // Fallback to explicit body params if provided
    if (!txData && toAddress && amount) {
      txData = { type: 'transfer', amount: parseFloat(amount), token: 'SOL', recipient: toAddress }
    }

    if (!txData) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction. Use: "Send X SOL to <address>" in title/description or provide toAddress and amount.',
      })
    }

    // Get wallet for calendar
    const keypair = getWalletForCalendar(calendarId)

    // Execute based on transaction type
    let result

    if (txData.type === 'transfer') {
      // For now, only support SOL transfers
      if (txData.token.toUpperCase() !== 'SOL') {
        return res.status(400).json({
          success: false,
          error: 'Only SOL transfers are currently supported',
        })
      }

      result = await executeSolTransfer(keypair, txData.recipient, txData.amount)
    } else if (txData.type === 'swap') {
      // Swap functionality - placeholder for now
      result = {
        success: false,
        error: 'Swap functionality coming soon',
      }
    }

    if (result.success) {
      // Store transaction
      transactions.set(eventId, {
        calendarId,
        eventTitle,
        signature: result.signature,
        status: 'executed',
        timestamp: new Date(),
        explorerUrl: result.explorerUrl,
      })

      // Update calendar event with transaction status
      if (eventId && calendarId) {
        try {
          await calendarService.updateEventStatus(
            calendarId,
            eventId,
            'executed',
            result.signature,
            result.explorerUrl
          )
        } catch (error) {
          console.warn('Could not update calendar event:', error.message)
        }
      }

      res.json({
        success: true,
        data: {
          signature: result.signature,
          explorerUrl: result.explorerUrl,
          status: 'executed',
        },
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error) {
    console.error('Error executing transaction:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get transaction status
app.get('/api/transaction/status/:eventId', (req, res) => {
  try {
    const { eventId } = req.params
    const tx = transactions.get(eventId)

    if (!tx) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      })
    }

    res.json({
      success: true,
      data: {
        signature: tx.signature,
        status: tx.status,
        timestamp: tx.timestamp,
        explorerUrl: tx.explorerUrl,
      },
    })
  } catch (error) {
    console.error('Error fetching transaction status:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get service account email
app.get('/api/calendar/service-account', (req, res) => {
  res.json({ email: 'calendefi-agent@coders-connect-450316.iam.gserviceaccount.com' })
})

// Get calendar events
app.get('/api/calendar/events', async (req, res) => {
  try {
    const { calendarId } = req.query

    if (!calendarId) {
      return res.status(400).json({ error: 'Calendar ID is required' })
    }

    // Fetch events from Google Calendar
    const events = await calendarService.getUpcomingEvents(calendarId, 20)

    res.json({
      success: true,
      data: {
        calendarId,
        events: events.map((event) => ({
          id: event.id,
          title: event.summary,
          description: event.description || '',
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create calendar event
app.post('/api/calendar/create-event', async (req, res) => {
  try {
    const { calendarId, title, description, startTime, endTime } = req.body

    if (!calendarId || !title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create event in Google Calendar
    const event = await calendarService.createEvent(
      calendarId,
      title,
      description || '',
      startTime,
      endTime
    )

    // Add to scheduler if it's a transaction event
    const txData = parseTransactionFromTitle(title, description)
    if (txData && txData.type === 'transfer' && txData.token.toUpperCase() === 'SOL') {
      scheduledEvents.set(event.id, {
        id: event.id,
        calendarId,
        title,
        description: description || '',
        startTime,
        endTime,
        status: 'pending',
        createdAt: new Date(),
        txData
      })
      console.log(`📅 Scheduled event: ${title} at ${startTime}`)
    }

    res.json({
      success: true,
      data: {
        eventId: event.id,
        title: event.summary,
        start: event.start?.dateTime,
        end: event.end?.dateTime,
      },
    })
  } catch (error) {
    console.error('Error creating calendar event:', error)
    res.status(500).json({ error: error.message })
  }
})

// Onboard calendar
app.post('/api/calendar/onboard', async (req, res) => {
  try {
    const { calendarId } = req.body

    if (!calendarId || !calendarId.includes('@')) {
      return res.status(400).json({ error: 'Invalid calendar ID format' })
    }

    // Verify calendar access
    const verified = await calendarService.verifyCalendarAccess(calendarId)

    if (!verified) {
      return res.status(400).json({
        error: 'Cannot access calendar. Make sure service account has permission.',
      })
    }

    // Store calendar ID
    calendars.set(calendarId, {
      id: calendarId,
      onboarded: true,
      createdAt: new Date(),
      events: [],
    })

    console.log(`✅ Calendar onboarded: ${calendarId}`)
    res.json({ success: true, message: 'Calendar onboarded successfully', calendarId })
  } catch (error) {
    console.error('Error onboarding calendar:', error)
    res.status(500).json({ error: error.message })
  }
})

// Verify calendar access
app.post('/api/calendar/verify', (req, res) => {
  try {
    const { calendarId } = req.body

    if (!calendarId || !calendarId.includes('@')) {
      return res.status(400).json({ error: 'Invalid calendar ID format' })
    }

    // Store calendar ID
    calendars.set(calendarId, {
      id: calendarId,
      createdAt: new Date(),
      events: [],
    })

    res.json({ success: true, message: 'Calendar verified', calendarId })
  } catch (error) {
    console.error('Error verifying calendar:', error)
    res.status(500).json({ error: error.message })
  }
})

// (Removed duplicate in-memory calendar and mock transaction routes)

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  })
})

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: err.message })
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 CalSol Backend running on http://localhost:${PORT}`)
  console.log(`📅 Calendar API: http://localhost:${PORT}/api/calendar`)
  console.log(`💰 Transaction API: http://localhost:${PORT}/api/transaction`)
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`)
})


// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: err.message })
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 CalSol Backend running on http://localhost:${PORT}`)
  console.log(`📅 Calendar API: http://localhost:${PORT}/api/calendar`)
  console.log(`💰 Transaction API: http://localhost:${PORT}/api/transaction`)
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`)
})
