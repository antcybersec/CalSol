import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Wallet, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Calendar",
      description: "Onboard your Google Calendar with CalSol to enable calendar-based transactions.",
      icon: Calendar,
      details: [
        "Copy the CalSol service account email",
        "Invite it to your Google Calendar",
        "Grant 'Make changes to events' permission",
        "Enter your calendar ID to onboard"
      ]
    },
    {
      number: "02", 
      title: "Create Transaction Events",
      description: "Create calendar events with transaction titles. The CalSol agent will automatically process them.",
      icon: Wallet,
      details: [
        "Create events with titles like 'Send 5 SOL to wallet_address'",
        "Set specific dates and times for execution",
        "Add transaction details in event descriptions",
        "The agent monitors your calendar for new events"
      ]
    },
    {
      number: "03",
      title: "Automatic Execution",
      description: "Transactions execute automatically at the scheduled time on the Solana blockchain.",
      icon: Clock,
      details: [
        "The CalSol agent checks your calendar every few minutes",
        "When an event's time arrives, the transaction is executed",
        "You receive confirmation with transaction signatures",
        "All transactions are recorded on the Solana blockchain"
      ]
    }
  ];

  return (
    <section id="get-started" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How CalSol Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with calendar-based Solana transactions in just three simple steps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="mb-12">
              <Card className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{step.number}</div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                    
                    <div className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-muted-foreground">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Start Using CalSol
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
