import { Button } from "@/components/ui/button";
import { Calendar, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-20 pb-16 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Calendar is Now a Solana Wallet
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your calendar into a powerful Solana financial tool. Every calendar event becomes a Solana transaction — stake, swap, or pay — scheduled in time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Start Using CalSol
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Wallet className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Calendar-Based Finance</h3>
              <p className="text-sm text-muted-foreground">
                Schedule Solana transactions through your calendar events
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Solana Blockchain Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Every calendar becomes an autonomous Solana wallet
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Automated Execution</h3>
              <p className="text-sm text-muted-foreground">
                Transactions execute automatically at scheduled times
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
