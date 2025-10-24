import { Card } from "@/components/ui/card";
import { Calendar, Wallet, Clock, Shield, Zap, TrendingUp } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Calendar-Based Transactions",
      description: "Send SOL by creating calendar events with transaction titles. Every event becomes a Solana transaction."
    },
    {
      icon: Wallet,
      title: "Autonomous Wallet",
      description: "Your calendar becomes a self-executing Solana wallet that processes transactions automatically."
    },
    {
      icon: Clock,
      title: "Scheduled Execution",
      description: "Set precise times for transactions to execute. Perfect for recurring payments and time-sensitive trades."
    },
    {
      icon: Shield,
      title: "Secure & Trustless",
      description: "Built on Solana's secure blockchain with no central authority controlling your funds."
    },
    {
      icon: Zap,
      title: "Token Swaps",
      description: "Support for SOL, USDC, USDT, and other SPL tokens on Solana. Swap tokens through calendar events."
    },
    {
      icon: TrendingUp,
      title: "DeFi Integration",
      description: "Connect to Solana DeFi protocols for staking, lending, and yield farming through calendar events."
    }
  ];

  return (
    <section id="features" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform your calendar into a powerful Solana financial tool
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CalSol bridges the gap between calendar scheduling and blockchain transactions, 
            making DeFi accessible through familiar calendar interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
