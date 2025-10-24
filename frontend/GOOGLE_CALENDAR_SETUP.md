# 🗓️ Google Calendar Integration Setup - Complete Guide

## 🎯 What We're Setting Up

A **real Google Calendar service account** that will:
- ✅ Read events from your Google Calendar
- ✅ Write transaction events to your calendar
- ✅ Update event descriptions with transaction status
- ✅ Automatically execute transactions based on calendar events

---

## ⏱️ Time Required: ~20 minutes

---

## 📋 STEP 1: Create Google Cloud Project (5 minutes)

### 1.1 Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 1.2 Create New Project
- Click "Select a Project" (top left)
- Click "New Project"
- Name: `CalendarFi-Solana`
- Click "Create"
- Wait for project to be created (1-2 minutes)

### 1.3 Verify Project Created
- You should see "CalendarFi-Solana" in the project selector

---

## 🔌 STEP 2: Enable APIs (3 minutes)

### 2.1 Enable Google Calendar API
- Go to: https://console.cloud.google.com/apis/library
- Search for: "Google Calendar API"
- Click on it
- Click "Enable"
- Wait for it to enable

### 2.2 Enable Google Drive API
- Search for: "Google Drive API"
- Click on it
- Click "Enable"
- Wait for it to enable

### 2.3 Verify Both Enabled
- Go to: https://console.cloud.google.com/apis/dashboard
- You should see both APIs listed

---

## 🔑 STEP 3: Create Service Account (5 minutes)

### 3.1 Go to Credentials
- Go to: https://console.cloud.google.com/apis/credentials
- Click "Create Credentials" (top)
- Select "Service Account"

### 3.2 Fill Service Account Details
```
Service account name: calendefi-agent
Service account ID: (auto-filled)
Description: CalendarFi transaction agent
```
- Click "Create and Continue"

### 3.3 Grant Permissions
- Role: Select "Editor"
- Click "Continue"
- Click "Done"

### 3.4 Create JSON Key
- Click on the service account you just created
- Go to "Keys" tab
- Click "Add Key" → "Create new key"
- Select "JSON"
- Click "Create"
- **A JSON file will download automatically**

### 3.5 Save the Key File
- Rename the downloaded file to: `service-account-key.json`
- Move it to: `/Users/anantkumar/Desktop/earn/backend/`
- **Keep this file safe - it's your authentication key**

### 3.6 Copy Service Account Email
- Go back to the service account page
- Copy the email address (looks like: `calendefi-agent@project.iam.gserviceaccount.com`)
- **Save this email - you'll need it**

---

## 📅 STEP 4: Create Google Calendar (3 minutes)

### 4.1 Go to Google Calendar
- Visit: https://calendar.google.com/
- Sign in with your Google account

### 4.2 Create New Calendar
- On the left sidebar, find "Other calendars"
- Click "+" next to it
- Select "Create new calendar"
- Name: `CalendarFi Transactions`
- Description: `Calendar for blockchain transactions`
- Click "Create calendar"

### 4.3 Get Calendar ID
- Click on the calendar settings (gear icon next to calendar name)
- Go to "Settings"
- Scroll down to "Integrate calendar"
- Find "Calendar ID" (looks like: `abc123@group.calendar.google.com`)
- **Copy and save this ID**

---

## 🤝 STEP 5: Share Calendar with Service Account (2 minutes)

### 5.1 Share Calendar
- In calendar settings, go to "Share with specific people"
- Click "Add people"
- Paste the service account email (from Step 3.6)
- Set permission to: **"Make changes to events"**
- Click "Share"

### 5.2 Verify Sharing
- You should see the service account listed with "Make changes to events" permission

---

## 🔧 STEP 6: Update Backend Configuration (2 minutes)

### 6.1 Update .env File
Edit `/Users/anantkumar/Desktop/earn/backend/.env`:

```env
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com

# Google Calendar Configuration
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

Replace `your-calendar-id@group.calendar.google.com` with your actual calendar ID from Step 4.3

### 6.2 Verify Files
```bash
cd /Users/anantkumar/Desktop/earn/backend
ls -la service-account-key.json
```

You should see the file listed.

---

## 📝 STEP 7: Update Backend Server (5 minutes)

The backend needs to be updated to use the Google Calendar API. This will be done in the next phase.

For now, verify your setup:

```bash
# Check if service account key exists
cat /Users/anantkumar/Desktop/earn/backend/service-account-key.json | head -5

# Should show JSON content starting with:
# {
#   "type": "service_account",
#   ...
```

---

## ✅ Verification Checklist

- [ ] Google Cloud Project created
- [ ] Google Calendar API enabled
- [ ] Google Drive API enabled
- [ ] Service account created
- [ ] JSON key downloaded and saved to `backend/service-account-key.json`
- [ ] Service account email copied
- [ ] Google Calendar created
- [ ] Calendar ID obtained
- [ ] Service account added to calendar with "Make changes to events" permission
- [ ] `.env` file updated with calendar ID

---

## 📊 Information You Should Have Saved

```
Service Account Email: calendefi-agent@project.iam.gserviceaccount.com
Calendar ID: abc123@group.calendar.google.com
Service Account Key: backend/service-account-key.json
```

---

## 🚀 Next Steps

Once you've completed all steps:

1. **Restart Backend**
   ```bash
   cd /Users/anantkumar/Desktop/earn/backend
   node server.js
   ```

2. **Test Calendar Integration**
   - Go to http://localhost:8080/dashboard
   - Onboard your calendar
   - Create an event
   - Execute a transaction

3. **Verify in Google Calendar**
   - Go to https://calendar.google.com
   - Check your "CalendarFi Transactions" calendar
   - You should see events created by the app

---

## 🐛 Troubleshooting

### Issue: "service-account-key.json not found"
**Solution:**
1. Download the key again from Google Cloud Console
2. Save it to: `/Users/anantkumar/Desktop/earn/backend/service-account-key.json`
3. Restart backend

### Issue: "Calendar ID not found"
**Solution:**
1. Go to calendar settings
2. Look for "Calendar ID" in "Integrate calendar" section
3. Copy the full ID (including @group.calendar.google.com)
4. Update `.env` file

### Issue: "Permission denied"
**Solution:**
1. Verify service account was added to calendar
2. Check permission is set to "Make changes to events"
3. Wait 1-2 minutes for permissions to propagate
4. Restart backend

### Issue: "Invalid credentials"
**Solution:**
1. Verify service-account-key.json is valid JSON
2. Check file is in correct location
3. Verify GOOGLE_SERVICE_ACCOUNT_KEY_PATH in .env is correct
4. Restart backend

---

## 📚 Resources

- Google Cloud Console: https://console.cloud.google.com/
- Google Calendar API Docs: https://developers.google.com/calendar/api
- Service Account Setup: https://cloud.google.com/docs/authentication/getting-started

---

## 🎉 You're All Set!

Your Google Calendar is now configured and ready to use with CalendarFi!

**Next:** Follow STEP_BY_STEP_TESTING.md to test the integration.

