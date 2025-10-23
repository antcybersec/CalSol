import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-muted-foreground">
            Set up your CalSol wallet in minutes and start scheduling Solana transactions.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 space-y-8">
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Copy Service Account Email</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy the CalSol agent's service account email below. This is your unique agent identifier.
                </p>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="calendefi-agent@coders-connect-450316.iam.gserviceaccount.com"
                    className="bg-secondary/30 border-border font-mono text-sm"
                  />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Onboard Your Calendar</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  After inviting the service account to your calendar, enter your calendar ID below to onboard it with CalSol.
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 mb-3 ml-4 list-decimal">
                  <li>Open Google Calendar</li>
                  <li>Click "+" next to "Add new calendar"</li>
                  <li>Invite the service account email as a collaborator</li>
                  <li>Grant "Make changes to events" permission</li>
                  <li>Copy your calendar ID from the calendar settings</li>
                </ol>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your calendar ID (e.g., smith@group.calendar.google.com)"
                    className="bg-background border-border"
                  />
                  <Button className="whitespace-nowrap">Onboard</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Start Creating Transactions</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create calendar events with transaction titles. The agent will automatically process them.
                </p>
                <div className="bg-secondary/30 border border-border rounded-lg p-4 font-mono text-sm space-y-1">
                  <div><span className="text-muted-foreground">Event Title:</span> "Send 5 SOL to wallet_address"</div>
                  <div><span className="text-muted-foreground">Time:</span> When you want the transaction to execute</div>
                  <div><span className="text-muted-foreground">Attendees:</span> Optional - for group approval</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center">
            <Button size="lg" className="w-full md:w-auto">
              Start Using CalSol
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Need help? Check our documentation or contact support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
