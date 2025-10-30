import { Button } from "@/components/ui/button";
import { Shield, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // Placeholder for wallet connection
    setIsConnected(!isConnected);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg glow-primary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DeCertify
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            <a href="/register-organization" className="text-muted-foreground hover:text-foreground transition-colors">
              Register Org
            </a>
            <a href="/issue-certificate" className="text-muted-foreground hover:text-foreground transition-colors">
              Issue
            </a>
            <a href="/verify-certificate" className="text-muted-foreground hover:text-foreground transition-colors">
              Verify
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isConnected ? "success" : "hero"}
              size="lg"
              onClick={handleConnect}
              className="hidden sm:inline-flex"
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
            <Button variant="glass" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
