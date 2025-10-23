import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roadmapItems = [
  {
    title: "Multi-Chain Support",
    description: "Expand beyond EVM to Ethereum, Polygon, and other major blockchains.",
    status: "Coming Soon",
    variant: "success" as const,
  },
  {
    title: "Advanced DeFi Features",
    description: "Staking, yield farming and liquidity provision directly from calendar events.",
    status: "In Development",
    variant: "default" as const,
  },
  {
    title: "Mobile App",
    description: "Native mobile app for iOS and Android with push notifications for transaction status.",
    status: "Planned",
    variant: "secondary" as const,
  },
  {
    title: "Enterprise Features",
    description: "Advanced approval workflows, compliance tools, and enterprise-grade security.",
    status: "Planned",
    variant: "secondary" as const,
  },
];

export const Roadmap = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What's Coming Next
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're constantly innovating to bring you the most advanced calendar-based financial tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roadmapItems.map((item, index) => (
            <Card key={index} className="border-border/50 bg-background">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <Badge variant={item.variant}>{item.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
