import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateVerificationCode } from "@/lib/utils/certificate";
import { Building2, Mail, User, Phone, MapPin, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactPerson: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const verificationCode = generateVerificationCode();

      const { data, error } = await supabase
        .from("organizations")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            contact_person: formData.contactPerson,
            phone: formData.phone,
            address: formData.address,
            verification_code: verificationCode,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Organization registered successfully!", {
        description: `Your verification code is: ${verificationCode}`,
        duration: 10000,
      });

      // Show modal with verification code
      alert(`✅ Organization Registered!\n\nYour 6-digit verification code is:\n\n${verificationCode}\n\nPlease save this code. Organizations will use this code to issue certificates under your name.`);

      navigate("/");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to register organization", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Register Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Organization
                </span>
              </h1>
              <p className="text-muted-foreground">
                Get a unique 6-digit code to issue verified certificates
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter organization name"
                    className="pl-10"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@organization.com"
                    className="pl-10"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactPerson"
                    placeholder="Full name"
                    className="pl-10"
                    required
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    className="pl-10 min-h-[80px]"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="hero"
                size="lg"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Organization"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ℹ️ After registration, you'll receive a unique 6-digit verification code.
                Use this code to issue certificates on behalf of your organization.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganization;
