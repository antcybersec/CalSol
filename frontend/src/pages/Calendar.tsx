import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Play, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGoogleCalendarEvents, parseTransactionFromTitle } from "@/services/googleCalendarService";
import { executeTransaction } from "@/services/solanaService";

interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  status: "pending" | "executed" | "failed";
  signature?: string;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [calendarId, setCalendarId] = useState<string>("");

  useEffect(() => {
    const storedCalendarId = localStorage.getItem("calendefi_calendar_id");
    if (!storedCalendarId) {
      navigate("/onboard");
      return;
    }
    setCalendarId(storedCalendarId);
    fetchCalendarEvents(storedCalendarId);
  }, [navigate]);

  const fetchCalendarEvents = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const googleEvents = await getGoogleCalendarEvents(id);
      const formattedEvents: CalendarEvent[] = googleEvents.map((event) => ({
        id: event.id,
        summary: event.summary,
        description: event.description || "",
        start: event.start,
        end: event.end,
        status: "pending",
      }));
      setEvents(formattedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch calendar events");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransaction = async (eventId: string) => {
    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      const result = await executeTransaction(eventId, calendarId);

      setEvents(
        events.map((e) =>
          e.id === eventId
            ? { ...e, status: "executed", signature: result.signature }
            : e
        )
      );
    } catch (err) {
      setEvents(
        events.map((e) =>
          e.id === eventId ? { ...e, status: "failed" } : e
        )
      );
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
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

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString();
    } catch {
      return dateTime;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading calendar events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Google Calendar Events</h1>
              <p className="text-sm text-muted-foreground">{calendarId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => fetchCalendarEvents(calendarId)}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => navigate("/onboard")}
              variant="outline"
              size="sm"
            >
              Change Calendar
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">No events found in your calendar</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create events in Google Calendar to see them here
              </p>
            </div>
          ) : (
            events.map((event) => {
              const transaction = parseTransactionFromTitle(event.summary);
              return (
                <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg flex-1">{event.summary}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </div>

                    {transaction.type !== "unknown" && (
                      <div className="bg-muted p-2 rounded text-xs space-y-1">
                        <p>
                          <strong>Type:</strong> {transaction.type}
                        </p>
                        {transaction.amount && (
                          <p>
                            <strong>Amount:</strong> {transaction.amount} {transaction.token || transaction.fromToken}
                          </p>
                        )}
                        {transaction.recipient && (
                          <p>
                            <strong>To:</strong> {transaction.recipient}
                          </p>
                        )}
                        {transaction.toToken && (
                          <p>
                            <strong>To:</strong> {transaction.toToken}
                          </p>
                        )}
                      </div>
                    )}

                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <p>
                        <strong>Start:</strong> {formatDateTime(event.start.dateTime)}
                      </p>
                      <p>
                        <strong>End:</strong> {formatDateTime(event.end.dateTime)}
                      </p>
                    </div>

                    {event.signature && (
                      <div className="text-xs bg-muted p-2 rounded font-mono break-all">
                        <strong>Signature:</strong> {event.signature.slice(0, 20)}...
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

