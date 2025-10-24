import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star } from "lucide-react";

export const Roadmap = () => {
  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "Core Infrastructure",
      status: "completed",
      items: [
        "Calendar integration with Google Calendar API",
        "Basic Solana transaction execution",
        "Event-based transaction scheduling",
        "Wallet generation and management"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Enhanced Features",
      status: "in-progress",
      items: [
        "Multi-token support (USDC, USDT, SPL tokens)",
        "Advanced transaction types (swaps, staking)",
        "Recurring transaction support",
        "Transaction history and analytics"
      ]
    },
    {
      phase: "Phase 3",
      title: "DeFi Integration",
      status: "planned",
      items: [
        "Integration with Solana DeFi protocols",
        "Automated yield farming through calendar events",
        "Cross-chain bridge support",
        "Advanced scheduling (conditional transactions)"
      ]
    },
    {
      phase: "Phase 4",
      title: "Enterprise Features",
      status: "planned", 
      items: [
        "Team calendar management",
        "Multi-signature wallet support",
        "Enterprise security features",
        "API for third-party integrations"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "planned":
        return <Star className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      default:
        return null;
    }
  };

  return (
    <section id="roadmap" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Development Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our journey to make calendar-based finance the standard for Solana DeFi.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      {item.phase}
                    </div>
                    
                    <div className="space-y-2">
                      {item.items.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want to contribute to CalSol's development?
          </p>
          <a 
            href="https://github.com/antcybersec/CalSol" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
};
