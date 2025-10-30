import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import InstitutionSection from "@/components/InstitutionSection";
import CertiBotSection from "@/components/CertiBotSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <InstitutionSection />
      <CertiBotSection />
      <Footer />
    </div>
  );
};

export default Index;
