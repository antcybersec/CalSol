const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

// Load service account key
const keyPath = path.join(__dirname, '../service-account-key.json')

let auth = null
let calendar = null

// Initialize Google Calendar API
function initializeCalendarAPI() {
  try {
    if (!fs.existsSync(keyPath)) {
      console.warn('⚠️  service-account-key.json not found. Calendar API disabled.')
      console.warn('📝 Follow GOOGLE_CALENDAR_SETUP.md to set up Google Calendar integration.')
      return false
    }

    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

    auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    calendar = google.calendar({ version: 'v3', auth })
    console.log('✅ Google Calendar API initialized')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize Google Calendar API:', error.message)
    return false
  }
}

// Get upcoming events from calendar
async function getUpcomingEvents(calendarId, maxResults = 10) {
  try {
    if (!calendar) {
      console.warn('Calendar API not initialized')
      return []
    }

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: maxResults,
      orderBy: 'startTime',
      singleEvents: true,
    })

    return response.data.items || []
  } catch (error) {
    console.error('Error fetching events:', error.message)
    return []
  }
}

// Get all events (past and future)
async function getAllEvents(calendarId, maxResults = 50) {
  try {
    if (!calendar) {
      console.warn('Calendar API not initialized')
      return []
    }

    const response = await calendar.events.list({
      calendarId: calendarId,
      maxResults: maxResults,
      orderBy: 'startTime',
      singleEvents: true,
    })

    return response.data.items || []
  } catch (error) {
    console.error('Error fetching all events:', error.message)
    return []
  }
}

// Create event in calendar
async function createEvent(calendarId, title, description, startTime, endTime) {
  try {
    if (!calendar) {
      console.warn('Calendar API not initialized')
      return null
    }

    const event = {
      summary: title,
      description: description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
    }

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    })

    console.log(`✅ Event created: ${title}`)
    return response.data
  } catch (error) {
    console.error('Error creating event:', error.message)
    throw error
  }
}

// Update event description with transaction status
async function updateEventStatus(calendarId, eventId, status, signature, explorerUrl) {
  try {
    if (!calendar) {
      console.warn('Calendar API not initialized')
      return null
    }

    // Get the event first
    const event = await calendar.events.get({
      calendarId: calendarId,
      eventId: eventId,
    })

    // Update description with transaction info
    const updatedDescription = `
${event.data.description || ''}

---
**Transaction Status:** ${status}
**Signature:** ${signature}
**Explorer:** ${explorerUrl}
**Updated:** ${new Date().toISOString()}
    `.trim()

    event.data.description = updatedDescription

    const response = await calendar.events.update({
      calendarId: calendarId,
      eventId: eventId,
      resource: event.data,
    })

    console.log(`✅ Event updated: ${eventId}`)
    return response.data
  } catch (error) {
    console.error('Error updating event:', error.message)
    throw error
  }
}

// Delete event
async function deleteEvent(calendarId, eventId) {
  try {
    if (!calendar) {
      console.warn('Calendar API not initialized')
      return false
    }

    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    })

    console.log(`✅ Event deleted: ${eventId}`)
    return true
  } catch (error) {
    console.error('Error deleting event:', error.message)
    throw error
  }
}

// Verify calendar access
async function verifyCalendarAccess(calendarId) {
  try {
    if (!calendar) {
      console.warn('Calendar API not initialized')
      return false
    }

    const response = await calendar.calendars.get({
      calendarId: calendarId,
    })

    console.log(`✅ Calendar verified: ${response.data.summary}`)
    return true
  } catch (error) {
    console.error('Error verifying calendar:', error.message)
    return false
  }
}

module.exports = {
  initializeCalendarAPI,
  getUpcomingEvents,
  getAllEvents,
  createEvent,
  updateEventStatus,
  deleteEvent,
  verifyCalendarAccess,
}

