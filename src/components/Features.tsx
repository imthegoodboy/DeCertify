import { Card } from "@/components/ui/card";
import { FileCheck, Bot, Wallet, QrCode, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "AI Document Verification",
    description: "Advanced AI scans and validates certificate authenticity, detecting duplicates and fakes in seconds.",
  },
  {
    icon: Wallet,
    title: "NFT Certification",
    description: "Each certificate is minted as a unique ERC-721 NFT on Polygon, ensuring immutable proof of achievement.",
  },
  {
    icon: Bot,
    title: "CertiBot AI Assistant",
    description: "Chat with our AI to verify credentials, get insights, or answer questions about certifications.",
  },
  {
    icon: QrCode,
    title: "Instant Verification",
    description: "Employers can scan QR codes or check wallet addresses to verify credentials on-chain instantly.",
  },
  {
    icon: BarChart3,
    title: "Institution Dashboard",
    description: "Manage, track, and analyze all issued certificates with comprehensive analytics and insights.",
  },
  {
    icon: Globe,
    title: "Web3 Resume",
    description: "Learners get a decentralized profile showcasing all verified achievements and skills in one place.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Powerful Features for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on Polygon with AI verification, designed for institutions, learners, and employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
            >
              <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4 group-hover:glow-primary transition-all">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
