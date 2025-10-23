import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Calendar-Based Transactions",
    description: "Send SOL by creating calendar events with specific titles. Every event becomes a Solana transaction.",
    icon: "📅",
  },
  {
    title: "Scheduled Execution",
    description: "Transactions execute automatically at the event's scheduled time. No manual intervention needed.",
    icon: "⏰",
  },
  {
    title: "RSVP-Based Approval",
    description: "Invite people to transaction events for group approval. Majority rule ensures security.",
    icon: "✅",
  },
  {
    title: "Token Swaps",
    description: "Swap tokens directly from your calendar. Support for SOL, USDC, USDT, and other SPL tokens on Solana.",
    icon: "🔄",
  },
  {
    title: "Group Wallets",
    description: "Each calendar gets its own unique wallet. Perfect for shared calendars and team operations.",
    icon: "👥",
  },
  {
    title: "WalletConnect Integration",
    description: "Connect to any DApp using WalletConnect. Your calendar becomes a universal wallet interface.",
    icon: "🔗",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Modern Finance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your calendar into a powerful Solana financial tool with our innovative blockchain integration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background"
            >
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
