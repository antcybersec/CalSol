# 🎉 Google Calendar Integration - Create Tasks Directly in Calendar!

## 🚀 How to Use Google Calendar for Transactions

### **Method 1: Create Events in Google Calendar (Recommended)**

#### **Step 1: Open Google Calendar**
1. Go to [calendar.google.com](https://calendar.google.com)
2. Find your calendar (the one you onboarded with CalendarFi)
3. Click on any date/time to create a new event

#### **Step 2: Create Transaction Event**
**Event Title:** Use this exact format:
```
Send 0.1 SOL to DUBFa3jP1YNvefUx62WGgLnLMPTE8jyC8B5hQ2mzBRYH
```

**Event Description (Optional):**
```
Payment to John for services
Transaction will execute automatically at scheduled time
```

**Date & Time:** Set when you want the transaction to execute

#### **Step 3: Save Event**
- Click "Save" in Google Calendar
- The event is now in your calendar!

#### **Step 4: Automatic Detection**
- CalendarFi checks for new events every 60 seconds
- Or click "Check Calendar" button in the app
- Transaction will be detected and scheduled automatically

### **Method 2: Use the App Form (Current Method)**
- Click "New Event" in the CalendarFi app
- Fill in the form
- Event is created in both Google Calendar and the app

## 🎯 Supported Transaction Formats

### **SOL Transfers:**
```
Send 0.1 SOL to DUBFa3jP1YNvefUx62WGgLnLMPTE8jyC8B5hQ2mzBRYH
Send 5 SOL to 9B5X4z6G8H2K1L3M5N7P9Q1R3S5T7V9X
Send 0.5 SOL to wallet_address
```

### **Future Support (Coming Soon):**
```
Swap 10 USDC to SOL
Send 100 USDC to address
```

## 🔄 How It Works

### **Automatic Detection:**
1. **Google Calendar** → You create event with transaction title
2. **CalendarFi Backend** → Checks every 60 seconds for new events
3. **Parse Transaction** → Extracts amount, token, recipient from title
4. **Add to Scheduler** → Event added to automatic execution queue
5. **Execute at Time** → Transaction runs automatically when time arrives
6. **Update Status** → Calendar event updated with transaction signature

### **Manual Detection:**
1. **Click "Check Calendar"** button in the app
2. **Immediate Check** → Backend checks for new events right away
3. **Parse & Schedule** → New transaction events are detected and scheduled

## 🧪 Test It Now

### **Quick Test:**
1. **Go to Google Calendar**
2. **Create event with title:** `Send 0.1 SOL to DUBFa3jP1YNvefUx62WGgLnLMPTE8jyC8B5hQ2mzBRYH`
3. **Set time:** 2-3 minutes from now
4. **Save event**
5. **Go to CalendarFi app**
6. **Click "Check Calendar"** button
7. **Watch the magic!** Transaction will be detected and executed automatically

## 📊 What You'll See

### **In Google Calendar:**
- Your event with transaction title
- Event description (optional)
- Scheduled time

### **In CalendarFi App:**
- Event appears in the dashboard
- Shows "pending" status
- Automatically changes to "executed" when transaction runs
- Shows transaction signature when complete

### **In Console Logs:**
```
📅 New calendar event detected: Send 0.1 SOL to DUBFa3jP1YNvefUx62WGgLnLMPTE8jyC8B5hQ2mzBRYH at 2025-10-23T08:05:00.000Z
⏰ Executing scheduled event: Send 0.1 SOL to DUBFa3jP1YNvefUx62WGgLnLMPTE8jyC8B5hQ2mzBRYH
✅ Event executed: Send 0.1 SOL to DUBFa3jP1YNvefUx62WGgLnLMPTE8jyC8B5hQ2mzBRYH - <signature>
```

## 🎯 Key Benefits

### **Workflow Integration:**
- Use your existing Google Calendar
- No need to switch between apps
- Create transactions like any other calendar event
- Perfect for recurring payments

### **Automatic Execution:**
- No manual intervention needed
- Transactions execute at scheduled times
- Real-time status updates
- Google Calendar events updated with transaction status

### **Flexible Creation:**
- Create events on mobile, desktop, or web
- Use Google Calendar's natural language processing
- Set recurring events for regular payments
- Invite others to transaction events (for approval workflows)

## 🔧 Technical Details

### **Detection Frequency:**
- **Automatic:** Every 60 seconds
- **Manual:** Click "Check Calendar" button
- **Real-time:** Events detected within 1 minute

### **Supported Formats:**
- **Title Parsing:** `Send X SOL to address`
- **Description Parsing:** Falls back to description if title doesn't parse
- **Case Insensitive:** Works with any capitalization
- **Flexible Addresses:** Supports any valid Solana address

### **Error Handling:**
- Invalid formats are ignored
- Failed transactions are tracked
- Status updates in both app and calendar
- Console logging for debugging

## 🚀 Advanced Usage

### **Recurring Payments:**
1. Create recurring event in Google Calendar
2. Set frequency (daily, weekly, monthly)
3. Each occurrence will be detected and executed
4. Perfect for subscription payments

### **Team Approvals:**
1. Create event in Google Calendar
2. Invite team members
3. Use RSVP for approval workflow
4. Transaction executes when majority approves

### **Mobile Creation:**
1. Use Google Calendar mobile app
2. Create events with voice commands
3. "Send 0.1 SOL to John's wallet"
4. Events sync automatically

---

**Now you can create transaction events directly in Google Calendar and they'll be executed automatically by CalendarFi!** 🎉