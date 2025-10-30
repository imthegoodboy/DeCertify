import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/certificate";
import { Shield, Key, FileText, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import QRCode from "react-qr-code";

const VerifyCertificate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [certificate, setCertificate] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [verified, setVerified] = useState(false);

  const verifyCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerified(false);
    setCertificate(null);
    setOrganization(null);

    try {
      const { data: certData, error: certError } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_number", certificateNumber)
        .eq("pin_code", pinCode)
        .single();

      if (certError || !certData) {
        toast.error("Invalid certificate number or PIN");
        setLoading(false);
        return;
      }

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", certData.organization_id)
        .single();

      if (orgError || !orgData) {
        toast.error("Organization not found");
        setLoading(false);
        return;
      }

      setCertificate(certData);
      setOrganization(orgData);
      setVerified(true);
      toast.success("Certificate verified successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to verify certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Verify{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Certificate
                </span>
              </h1>
              <p className="text-muted-foreground">
                Enter certificate number and PIN to verify authenticity
              </p>
            </div>

            <form onSubmit={verifyCertificate} className="space-y-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="certNumber">Certificate Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="certNumber"
                    placeholder="CERT-XXXX-XXXX"
                    className="pl-10"
                    required
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">6-Digit PIN</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pin"
                    placeholder="Enter 6-digit PIN"
                    className="pl-10 text-center tracking-widest"
                    maxLength={6}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="hero"
                size="lg"
                disabled={loading || !certificateNumber || pinCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Certificate"}
              </Button>
            </form>

            {verified && certificate && organization && (
              <div className="space-y-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-2 text-success">
                  <CheckCircle className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">Verified Certificate</h2>
                </div>

                <div className="grid gap-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Recipient</p>
                    <p className="text-xl font-bold">{certificate.recipient_name}</p>
                  </div>

                  {certificate.course_name && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Course</p>
                      <p className="text-lg font-semibold">{certificate.course_name}</p>
                    </div>
                  )}

                  {certificate.college_name && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Institution</p>
                      <p className="text-lg font-semibold">{certificate.college_name}</p>
                    </div>
                  )}

                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Issued By</p>
                    <p className="text-lg font-semibold">{organization.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{organization.email}</p>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                    <p className="text-lg font-semibold">{formatDate(certificate.issue_date)}</p>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Certificate Number</p>
                    <p className="text-sm font-mono">{certificate.certificate_number}</p>
                  </div>
                </div>

                <div className="flex justify-center p-6 bg-white rounded-lg">
                  <div className="space-y-2 text-center">
                    <QRCode
                      value={`DECERTIFY:${certificate.certificate_number}:${certificate.pin_code}`}
                      size={200}
                    />
                    <p className="text-xs text-muted-foreground">QR Code for quick verification</p>
                  </div>
                </div>

                <div className="p-4 bg-success/10 rounded-lg text-center">
                  <p className="text-sm font-medium text-success">
                    ✅ This certificate is authentic and verified
                  </p>
                </div>
              </div>
            )}

            {!verified && certificateNumber && pinCode.length === 6 && !loading && (
              <div className="flex items-center justify-center space-x-2 text-destructive pt-6 border-t">
                <XCircle className="h-6 w-6" />
                <p className="font-medium">Certificate not found or invalid PIN</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
