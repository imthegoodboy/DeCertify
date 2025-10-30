import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, CheckCircle, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Certificate",
    description: "Upload your certificate PDF or document to our secure platform.",
  },
  {
    icon: Sparkles,
    title: "AI Verification",
    description: "Our AI validates authenticity, checks for duplicates, and extracts data.",
  },
  {
    icon: CheckCircle,
    title: "Mint NFT",
    description: "Approved certificates are minted as NFTs on Polygon blockchain.",
  },
  {
    icon: TrendingUp,
    title: "Track & Manage",
    description: "Monitor all issued certificates with analytics and management tools.",
  },
];

const InstitutionSection = () => {
  return (
    <section id="institutions" className="py-24 relative bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            For{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Institutions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Issue verifiable, tamper-proof certificates in minutes. Simple, secure, and scalable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="glass-card p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="bg-gradient-primary/10 p-4 rounded-lg w-fit mx-auto mb-4 mt-2">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center space-x-4">
          <Button variant="hero" size="xl" onClick={() => window.location.href = '/register-organization'}>
            Register Organization
          </Button>
          <Button variant="success" size="xl" onClick={() => window.location.href = '/issue-certificate'}>
            Issue Certificate
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstitutionSection;
