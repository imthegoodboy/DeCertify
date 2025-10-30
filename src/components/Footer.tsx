import { Shield, Github, Twitter, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/20 py-12 glass-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DeCertify
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making trust verifiable with AI and blockchain technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#institutions" className="hover:text-foreground transition-colors">For Institutions</a></li>
              <li><a href="#verify" className="hover:text-foreground transition-colors">Verify</a></li>
              <li><a href="#certibot" className="hover:text-foreground transition-colors">CertiBot</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Smart Contracts</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Whitepaper</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 DeCertify. Built on Polygon. Powered by AI.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
