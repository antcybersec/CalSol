import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Plus, Trash2, Play, Copy, Check, AlertCircle } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: "pending" | "executed" | "failed";
  signature?: string;
}

function Dashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [calendarOnboarded, setCalendarOnboarded] = useState(false);
  const [calendarId, setCalendarId] = useState("");
  const [copied, setCopied] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");
  const [calendarWallet, setCalendarWallet] = useState<{
    address: string;
    balance: string;
    explorerUrl: string;
  } | null>(null);
  const [, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    recipientAddress: "",
    amount: "",
  });

  const serviceAccountEmail = "calsol-agent@coders-connect-450316.iam.gserviceaccount.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(serviceAccountEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOnboardCalendar = async () => {
    if (!calendarId.trim()) {
      setOnboardingError("Please enter your calendar ID");
      return;
    }

    try {
      const response = await fetch("https://calsol-backend.onrender.com/api/calendar/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to onboard calendar");
      }

      setCalendarOnboarded(true);
      setShowOnboarding(false);
      setOnboardingError("");

      // Fetch calendar events after successful onboarding
      await fetchCalendarEvents(calendarId);
      
      // Fetch calendar wallet info
      await fetchCalendarWallet(calendarId);
    } catch (error) {
      setOnboardingError(error instanceof Error ? error.message : "Failed to onboard calendar");
    }
  };

  const fetchCalendarWallet = async (calId: string) => {
    try {
      const response = await fetch(
        `https://calsol-backend.onrender.com/api/calendar/wallet/${encodeURIComponent(calId)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch calendar wallet");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setCalendarWallet(data.data);
      }
    } catch (error) {
      console.error("Error fetching calendar wallet:", error);
    }
  };

  const pollEventStatuses = async () => {
    if (!calendarOnboarded || !calendarId) return;
    
    try {
      const response = await fetch(
        `https://calsol-backend.onrender.com/api/calendar/event-statuses/${encodeURIComponent(calendarId)}`
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.success && data.data) {
        // Update events with new statuses
        setEvents(prevEvents => 
          prevEvents.map(event => {
            const status = data.data[event.id];
            if (status) {
              return {
                ...event,
                status: status.status,
                signature: status.signature
              };
            }
            return event;
          })
        );
      }
    } catch (error) {
      console.error("Error polling event statuses:", error);
    }
  };

  // Start polling when calendar is onboarded
  useEffect(() => {
    if (calendarOnboarded && calendarId) {
      // Poll for status updates every 5 seconds
      const statusInterval = setInterval(pollEventStatuses, 5000);
      
      // Refresh all events every 10 seconds to catch new Google Calendar events
      const refreshInterval = setInterval(() => {
        fetchCalendarEvents(calendarId);
      }, 10000);
      
      setPollingInterval(statusInterval);
      
      return () => {
        clearInterval(statusInterval);
        clearInterval(refreshInterval);
        setPollingInterval(null);
      };
    }
  }, [calendarOnboarded, calendarId]);

  const checkCalendarEvents = async () => {
    if (!calendarId) return;
    
    try {
      const response = await fetch("https://calsol-backend.onrender.com/api/calendar/check-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarId }),
      });

      if (!response.ok) {
        throw new Error("Failed to check calendar events");
      }

      // Clear old events and refresh
      setEvents([]);
      await fetchCalendarEvents(calendarId);
      
      alert("Calendar events checked! New transaction events will be detected automatically.");
    } catch (error) {
      console.error("Error checking calendar events:", error);
      alert("Failed to check calendar events");
    }
  };

  const fetchCalendarEvents = async (calId: string) => {
    try {
      // Fetch both Google Calendar events AND scheduled events from backend
      const [calendarResponse, scheduledResponse] = await Promise.all([
        fetch(`https://calsol-backend.onrender.com/api/calendar/events?calendarId=${encodeURIComponent(calId)}`),
        fetch(`https://calsol-backend.onrender.com/api/calendar/scheduled-events/${encodeURIComponent(calId)}`)
      ]);

      const events = [];

      // Add Google Calendar events
      if (calendarResponse.ok) {
        const calendarData = await calendarResponse.json();
        if (calendarData.success && calendarData.data.events) {
          const calendarEvents = calendarData.data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.start?.split("T")[0] || "",
          time: event.start?.split("T")[1]?.substring(0, 5) || "",
          status: "pending" as const,
            source: "google_calendar"
          }));
          events.push(...calendarEvents);
        }
      }

      // Add scheduled events (including executed ones)
      if (scheduledResponse.ok) {
        const scheduledData = await scheduledResponse.json();
        if (scheduledData.success && scheduledData.data) {
          const scheduledEvents = scheduledData.data.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: "",
            date: new Date(event.startTime).toISOString().split("T")[0],
            time: new Date(event.startTime).toISOString().split("T")[1]?.substring(0, 5) || "",
            status: event.status,
            source: event.source || "app"
          }));
          events.push(...scheduledEvents);
        }
      }

      // Remove duplicates and set events
      const uniqueEvents = events.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      setEvents(uniqueEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const handleAddEvent = async () => {
    if (formData.title && formData.date && formData.time) {
      try {
        // Create event in Google Calendar
        const startTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();
        const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();

        // Create title with transaction format if recipient and amount are provided
        let eventTitle = formData.title;
        let eventDescription = formData.description;
        
        if (formData.recipientAddress && formData.amount) {
          eventTitle = `Send ${formData.amount} SOL to ${formData.recipientAddress}`;
          eventDescription = `Transaction: Send ${formData.amount} SOL to ${formData.recipientAddress}\n\n${formData.description}`;
        }

        const response = await fetch("https://calsol-backend.onrender.com/api/calendar/create-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            calendarId,
            title: eventTitle,
            description: eventDescription,
            startTime,
            endTime,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create calendar event");
        }

        const data = await response.json();

        // Add event to local state
        const newEvent: CalendarEvent = {
          id: data.data.eventId,
          title: eventTitle,
          description: eventDescription,
          date: formData.date,
          time: formData.time,
          status: "pending",
        };
        setEvents([...events, newEvent]);
        setFormData({ title: "", description: "", date: "", time: "", recipientAddress: "", amount: "" });
        setIsOpen(false);
      } catch (error) {
        console.error("Error creating event:", error);
        alert("Failed to create event. Make sure calendar is onboarded.");
      }
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleExecuteTransaction = async (id: string) => {
    try {
      const event = events.find((e) => e.id === id);
      if (!event) return;

      // Mark as pending
      setEvents(
        events.map((e) =>
          e.id === id ? { ...e, status: "pending" } : e
        )
      );

      // Execute transaction via backend
      const response = await fetch("https://calsol-backend.onrender.com/api/transaction/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          calendarId: calendarOnboarded ? calendarId : "default-calendar",
          eventTitle: event.title,
          eventDescription: event.description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEvents(
          events.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: "executed",
                  signature: data.data.signature,
                }
              : e
          )
        );
      } else {
        throw new Error(data.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      setEvents(
        events.map((e) =>
          e.id === id ? { ...e, status: "failed" } : e
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "executed":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Google Calendar Onboarding Section */}
        {showOnboarding && !calendarOnboarded && (
          <div className="mb-8 space-y-4">
            {/* Step 1: Copy Service Account Email */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Copy Service Account Email</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Copy the CalSol agent's service account email below. This is your unique agent identifier.
                  </p>
                  <div className="flex gap-2">
                    <Input value={serviceAccountEmail} readOnly className="font-mono text-sm" />
                    <Button onClick={handleCopyEmail} variant="outline" size="sm" className="flex-shrink-0">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2: Onboard Calendar */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Onboard Your Calendar</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    After inviting the service account to your calendar, enter your calendar ID below to onboard it with CalSol.
                  </p>

                  <div className="bg-muted p-3 rounded text-sm mb-4 space-y-2">
                    <p className="font-semibold">Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                      <li>Open <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Calendar</a></li>
                      <li>Click "+" next to "Add new calendar"</li>
                      <li>Invite the service account email as a collaborator</li>
                      <li>Grant "Make changes to events" permission</li>
                      <li>Copy your calendar ID from settings (e.g., smith@group.calendar.google.com)</li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendarId" className="text-sm">Calendar ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="calendarId"
                        placeholder="e.g., smith@group.calendar.google.com"
                        value={calendarId}
                        onChange={(e) => {
                          setCalendarId(e.target.value);
                          setOnboardingError("");
                        }}
                        className="font-mono text-sm"
                      />
                      <Button onClick={handleOnboardCalendar} className="flex-shrink-0">
                        Onboard
                      </Button>
                    </div>
                  </div>

                  {onboardingError && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{onboardingError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </Card>

            {/* Step 3: Start Creating Transactions */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Start Creating Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create calendar events with transaction titles. The Solana agent will automatically process them.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm space-y-2">
                    <p className="font-semibold">Example Transaction Titles:</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• "Send 5 SOL to wallet_address"</li>
                      <li>• "Send 5 PH100 to PablosPro.eth"</li>
                      <li>• "Swap 10 USDC to SOL"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Wallet Info Section */}
        {calendarOnboarded && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Calendar ID</p>
                <p className="font-mono text-sm font-semibold">{calendarId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                Change Calendar
              </Button>
            </div>
          </Card>
        )}

        {/* Wallet Info Section */}
        {calendarOnboarded && calendarWallet && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Calendar Wallet (Sender)</p>
                <p className="font-mono text-sm font-semibold mb-2">{calendarWallet.address}</p>
                <p className="text-sm text-green-600 font-semibold">
                  Balance: {calendarWallet.balance} SOL
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(calendarWallet.address)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Address
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(calendarWallet.explorerUrl, '_blank')}
                >
                  View on Explorer
                </Button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Fund this wallet with devnet SOL to send transactions. 
                Use: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">solana airdrop 2 {calendarWallet.address} --url https://api.devnet.solana.com</code>
              </p>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">CalSol Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={checkCalendarEvents}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Check Calendar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEvents([])}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Send 5 SOL to wallet"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Event description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                  
                  {/* Transaction Fields */}
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-semibold text-sm text-primary">Transaction Details (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount (SOL)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.1"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipientAddress">Recipient Address</Label>
                        <Input
                          id="recipientAddress"
                          placeholder="Enter recipient's Solana wallet address"
                          value={formData.recipientAddress}
                          onChange={(e) =>
                            setFormData({ ...formData, recipientAddress: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          The SOL will be sent FROM your calendar wallet TO this address
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      If you fill these fields, the event title will automatically be formatted as "Send X SOL to address"
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddEvent} className="w-full">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">No events yet. Create one to get started!</p>
            </div>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    <p>{event.date} at {event.time}</p>
                  </div>

                  {event.signature && (
                    <div className="text-xs bg-muted p-2 rounded font-mono break-all">
                      {event.signature.slice(0, 20)}...
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {event.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleExecuteTransaction(event.id)}
                        className="flex-1 flex items-center gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Execute
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 flex items-center gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
