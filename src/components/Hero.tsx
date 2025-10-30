import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Shield } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="DeCertify Hero"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Verification on Polygon</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Make Trust{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Verifiable
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Issue, verify, and share blockchain-based certificates with AI authenticity checking. 
            No more fake degrees, forged documents, or unverifiable credentials.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="hero" size="xl" onClick={() => window.location.href = '/register-organization'}>
              <Shield className="w-5 h-5" />
              Register Organization
            </Button>
            <Button variant="success" size="xl" onClick={() => window.location.href = '/issue-certificate'}>
              Issue Certificate
            </Button>
            <Button variant="glass" size="xl" onClick={() => window.location.href = '/verify-certificate'}>
              Verify Credential
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { icon: Shield, label: "Blockchain Verified", color: "primary" },
              { icon: Sparkles, label: "AI Authenticated", color: "secondary" },
              { icon: CheckCircle, label: "Instantly Verifiable", color: "accent" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <item.icon className={`w-8 h-8 mx-auto mb-3 text-${item.color}`} />
                <p className="font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
