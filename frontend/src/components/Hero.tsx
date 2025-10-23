import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/Calendar";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-secondary/40">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="bg-background">New</Badge>
            <span className="text-sm text-muted-foreground">Solana Calendar-Based Finance</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Your Calendar<br />is Now a Solana Wallet
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            With CalSol, every calendar event is a Solana transaction — stake, swap, or pay — scheduled in time. 
            Convert your Google Calendar into an autonomous Solana blockchain wallet.
          </p>

          <p className="text-sm text-muted-foreground mb-6">
            Get early access to production features and be among the first to experience Solana calendar-based finance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-16">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full whitespace-nowrap">
                Launch Dashboard
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </Link>
          </div>

          <Calendar />
        </div>
      </div>
    </section>
  );
};
