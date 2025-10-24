import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const calendarEvents = [
  { day: 9, label: "Send 5 ETH" },
  { day: 15, label: "Swap 10 USDC" },
  { day: 20, label: "Connect Dapp" },
  { day: 25, label: "Team Payment" },
  { day: 28, label: "Send 10 PYUSD" },
];

const daysInMonth = 29;
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendar = () => {
  const getEvent = (day: number) => {
    return calendarEvents.find(event => event.day === day);
  };

  return (
    <div className="relative">
      <Card className="p-6 md:p-8 bg-card border-none shadow-2xl rounded-2xl">
        {/* Status Badges */}
        <div className="absolute -top-3 right-6 flex gap-2 z-10">
          <Badge variant="success" className="shadow-lg">
            Transaction Executed ✓
          </Badge>
        </div>
        
        <div className="absolute -bottom-3 left-6 z-10">
          <Badge variant="default" className="shadow-lg">
            Wallet Connected
          </Badge>
        </div>

        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts (starting on Saturday) */}
          {[...Array(6)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Calendar days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const event = getEvent(day);
            
            return (
              <div
                key={day}
                className="aspect-square border border-border/50 rounded-lg p-2 hover:bg-accent/50 transition-all duration-300 flex flex-col items-start justify-between relative group cursor-pointer"
              >
                <span className="text-sm font-medium">{day}</span>
                {event && (
                  <Badge variant="calendar" className="text-[10px] px-2 py-0.5 mt-auto w-full justify-center">
                    {event.label}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
