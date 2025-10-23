import { Button } from "@/components/ui/button";
import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      // Check if Phantom wallet is available
      const { solana } = window as any;

      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWalletConnected(true);
        setWalletAddress(response.publicKey.toString());
      } else {
        alert("Please install Phantom wallet extension");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana) {
        await solana.disconnect();
        setWalletConnected(false);
        setWalletAddress(null);
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl">CalSol</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#get-started" className="text-sm font-medium hover:text-primary transition-colors">
              Get Started
            </a>
            <a href="#roadmap" className="text-sm font-medium hover:text-primary transition-colors">
              Roadmap
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {walletConnected ? (
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-600 dark:text-green-400">
                  {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnectWallet}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="hero"
                size="sm"
                onClick={handleConnectWallet}
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
