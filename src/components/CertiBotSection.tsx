import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";

const CertiBotSection = () => {
  return (
    <section id="certibot" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-8 md:p-12 text-center space-y-6">
            <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto glow-primary">
              <MessageSquare className="w-12 h-12 text-primary-foreground" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              Meet{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                CertiBot
              </span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered certification assistant. Ask questions, verify credentials, 
              or get insights about candidates and institutions—all through natural conversation.
            </p>

            <div className="bg-background/40 rounded-xl p-6 space-y-4 border border-border/20">
              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-lg p-3 mt-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Example questions:</p>
                  <div className="space-y-2">
                    <p className="text-sm bg-gradient-primary/10 p-2 rounded">
                      "Show me all certificates issued to wallet 0x1234..."
                    </p>
                    <p className="text-sm bg-gradient-primary/10 p-2 rounded">
                      "Is this certificate authentic?"
                    </p>
                    <p className="text-sm bg-gradient-primary/10 p-2 rounded">
                      "What skills does this candidate have?"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="hero" size="xl" onClick={() => window.location.href = '/certibot'}>
              <MessageSquare className="w-5 h-5" />
              Chat with CertiBot
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CertiBotSection;
