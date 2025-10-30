import jsPDF from "jspdf";

export interface CertificateData {
  recipientName: string;
  collegeName?: string;
  courseName?: string;
  organizationName: string;
  certificateNumber: string;
  issueDate: string;
}

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Elegant gradient background with geometric patterns
  doc.setFillColor(15, 23, 42); // Dark slate background
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Decorative corner elements
  doc.setFillColor(139, 92, 246); // Purple
  doc.triangle(0, 0, 40, 0, 0, 40, "F");
  doc.triangle(pageWidth, 0, pageWidth - 40, 0, pageWidth, 40, "F");
  
  doc.setFillColor(59, 130, 246); // Blue
  doc.triangle(0, pageHeight, 40, pageHeight, 0, pageHeight - 40, "F");
  doc.triangle(pageWidth, pageHeight, pageWidth - 40, pageHeight, pageWidth, pageHeight - 40, "F");
  
  // Subtle accent circles
  doc.setFillColor(139, 92, 246);
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.3);
  doc.circle(pageWidth * 0.15, pageHeight * 0.2, 35, "S");
  doc.circle(pageWidth * 0.85, pageHeight * 0.8, 45, "S");

  // Premium white content area with shadow effect
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 8, 8, "F");

  // Double border for elegance
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1.5);
  doc.roundedRect(25, 25, pageWidth - 50, pageHeight - 50, 6, 6, "S");
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(28, 28, pageWidth - 56, pageHeight - 56, 6, 6, "S");

  // Title
  doc.setFontSize(40);
  doc.setTextColor(139, 92, 246);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", pageWidth / 2, 50, { align: "center" });

  // Subtitle
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("OF ACHIEVEMENT", pageWidth / 2, 62, { align: "center" });

  // Decorative line
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.5);
  doc.line(pageWidth * 0.25, 70, pageWidth * 0.75, 70);

  // "This is to certify that"
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("This is to certify that", pageWidth / 2, 85, { align: "center" });

  // Recipient name
  doc.setFontSize(32);
  doc.setTextColor(59, 130, 246);
  doc.setFont("helvetica", "bold");
  doc.text(data.recipientName, pageWidth / 2, 100, { align: "center" });

  // Course/College info
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  
  let yPos = 115;
  if (data.courseName) {
    doc.text(`has successfully completed the course in`, pageWidth / 2, yPos, { align: "center" });
    yPos += 8;
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246);
    doc.setFont("helvetica", "bold");
    doc.text(data.courseName, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
  }
  
  if (data.collegeName) {
    doc.text(`from`, pageWidth / 2, yPos, { align: "center" });
    yPos += 8;
    doc.setFontSize(16);
    doc.setTextColor(139, 92, 246);
    doc.setFont("helvetica", "bold");
    doc.text(data.collegeName, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
  }

  // Organization
  doc.text(`Issued by: ${data.organizationName}`, pageWidth / 2, yPos + 5, { align: "center" });

  // Date and Certificate Number
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${data.issueDate}`, 40, pageHeight - 35);
  doc.text(`Certificate No: ${data.certificateNumber}`, pageWidth - 40, pageHeight - 35, { align: "right" });

  // Premium seal/badge with blockchain symbol
  doc.setDrawColor(139, 92, 246);
  doc.setFillColor(139, 92, 246);
  doc.circle(pageWidth - 50, pageHeight - 55, 18, "FD");
  
  doc.setLineWidth(2);
  doc.setDrawColor(255, 215, 0); // Gold border
  doc.circle(pageWidth - 50, pageHeight - 55, 18, "S");
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("DeCertify", pageWidth - 50, pageHeight - 58, { align: "center" });
  
  doc.setFontSize(7);
  doc.text("Blockchain", pageWidth - 50, pageHeight - 53, { align: "center" });
  doc.text("Verified", pageWidth - 50, pageHeight - 49, { align: "center" });
  
  // Blockchain icon representation (chain links)
  doc.setLineWidth(1.5);
  doc.setDrawColor(255, 215, 0);
  doc.circle(pageWidth - 55, pageHeight - 62, 3, "S");
  doc.circle(pageWidth - 45, pageHeight - 62, 3, "S");
  doc.line(pageWidth - 52, pageHeight - 62, pageWidth - 48, pageHeight - 62);

  return doc;
};

export const downloadCertificatePDF = (data: CertificateData) => {
  const doc = generateCertificatePDF(data);
  doc.save(`certificate-${data.certificateNumber}.pdf`);
};
