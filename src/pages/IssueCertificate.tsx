import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateCertificateNumber, generatePinCode, formatDate } from "@/lib/utils/certificate";
import { downloadCertificatePDF } from "@/lib/pdfGenerator";
import { Key, User, Mail, GraduationCap, Building2, ArrowLeft, Download, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import { connectWallet, issueCertificateOnChain } from "@/lib/web3";

const IssueCertificate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [organizationCode, setOrganizationCode] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    collegeName: "",
    courseName: "",
  });

  const verifyOrganization = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("verification_code", organizationCode)
        .single();

      if (error || !data) {
        toast.error("Invalid organization code");
        return;
      }

      setOrganization(data);
      setStep(2);
      toast.success(`Organization verified: ${data.name}`);
    } catch (error: any) {
      toast.error("Failed to verify organization");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      console.log("Connecting wallet...");
      const address = await connectWallet();
      console.log("Wallet connected:", address);
      setWalletAddress(address);
      toast.success(`Wallet connected successfully!`, {
        description: `Address: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast.error("Wallet Connection Failed", {
        description: error.message || "Please make sure MetaMask is installed and unlocked.",
      });
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);

    try {
      const certificateNumber = generateCertificateNumber();
      const pinCode = generatePinCode();
      
      // Issue on blockchain
      console.log("Issuing certificate with:", {
        certificateNumber,
        walletAddress
      });
      
      const txHash = await issueCertificateOnChain(
        certificateNumber,
        walletAddress
      );
      
      console.log("Certificate issued with hash:", txHash);
      toast.success("Certificate recorded on blockchain!");


      // Save to database with blockchain hash
      const { data, error } = await supabase
        .from("certificates")
        .insert([
          {
            organization_id: organization.id,
            recipient_name: formData.recipientName,
            recipient_email: formData.recipientEmail,
            college_name: formData.collegeName,
            course_name: formData.courseName,
            certificate_number: certificateNumber,
            pin_code: pinCode,
            blockchain_hash: txHash,
            blockchain_tx: txHash,
            issue_date: new Date().toISOString().split('T')[0],
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCertificateData({ ...data, pin_code: pinCode, blockchain_tx: txHash });
      setStep(3);
      
      toast.success("Certificate issued successfully!", {
        description: `PIN: ${pinCode} | TX: ${txHash.slice(0, 10)}...`,
        duration: 10000,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!certificateData) return;

    downloadCertificatePDF({
      recipientName: certificateData.recipient_name,
      collegeName: certificateData.college_name,
      courseName: certificateData.course_name,
      organizationName: organization.name,
      certificateNumber: certificateData.certificate_number,
      issueDate: formatDate(certificateData.issue_date),
    });

    toast.success("Certificate PDF downloaded!");
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
          {step === 1 && (
            <Card className="glass-card p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Issue{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Certificate
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Enter your organization's 6-digit verification code
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgCode">Organization Verification Code</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="orgCode"
                      placeholder="Enter 6-digit code"
                      className="pl-10 text-center text-xl tracking-widest"
                      maxLength={6}
                      value={organizationCode}
                      onChange={(e) => setOrganizationCode(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <Button
                  onClick={verifyOrganization}
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={loading || organizationCode.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify Organization"}
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="glass-card p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Certificate{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Details
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Issuing for: {organization.name}
                </p>
                
                {!walletAddress ? (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                      <div className="flex items-start gap-3">
                        <Wallet className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">MetaMask Required</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            You need to connect your MetaMask wallet to issue certificates on the blockchain.
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                            <li>• Install MetaMask browser extension if you haven't</li>
                            <li>• Make sure MetaMask is unlocked</li>
                            <li>• Click "Connect Wallet" and approve the connection</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleConnectWallet}
                      variant="hero"
                      size="lg"
                      disabled={loading}
                      className="w-full"
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      {loading ? "Connecting..." : "Connect MetaMask Wallet"}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <p className="text-sm text-success">
                      ✓ Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                )}
              </div>

              {walletAddress && (
                <form onSubmit={issueCertificate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recipientName"
                      placeholder="Full name"
                      className="pl-10"
                      required
                      value={formData.recipientName}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={formData.recipientEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeName">College/Institution Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="collegeName"
                      placeholder="College or institution"
                      className="pl-10"
                      value={formData.collegeName}
                      onChange={(e) =>
                        setFormData({ ...formData, collegeName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="courseName"
                      placeholder="Course or program name"
                      className="pl-10"
                      value={formData.courseName}
                      onChange={(e) =>
                        setFormData({ ...formData, courseName: e.target.value })
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
                  {loading ? "Issuing..." : "Issue Certificate"}
                </Button>
              </form>
              )}
            </Card>
          )}

          {step === 3 && certificateData && (
            <Card className="glass-card p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-success">
                  ✅ Certificate Issued!
                </h1>
                <p className="text-muted-foreground">
                  Certificate has been successfully created
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Certificate Number</p>
                  <p className="text-lg font-mono font-bold">{certificateData.certificate_number}</p>
                </div>

                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Verification PIN</p>
                  <p className="text-2xl font-mono font-bold text-success">{certificateData.pin_code}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Save this PIN - required for verification
                  </p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg space-y-2">
                  <p><strong>Recipient:</strong> {certificateData.recipient_name}</p>
                  {certificateData.course_name && (
                    <p><strong>Course:</strong> {certificateData.course_name}</p>
                  )}
                  {certificateData.college_name && (
                    <p><strong>Institution:</strong> {certificateData.college_name}</p>
                  )}
                  <p><strong>Issued by:</strong> {organization.name}</p>
                  <p><strong>Date:</strong> {formatDate(certificateData.issue_date)}</p>
                  {certificateData.blockchain_tx && (
                    <p className="text-xs">
                      <strong>Blockchain TX:</strong>{" "}
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${certificateData.blockchain_tx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {certificateData.blockchain_tx.slice(0, 10)}...{certificateData.blockchain_tx.slice(-8)}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full"
                  variant="success"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate PDF
                </Button>

                <Button
                  onClick={() => {
                    setStep(2);
                    setFormData({
                      recipientName: "",
                      recipientEmail: "",
                      collegeName: "",
                      courseName: "",
                    });
                    setCertificateData(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Issue Another Certificate
                </Button>

                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;
