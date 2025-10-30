-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  college_name TEXT,
  course_name TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  certificate_number TEXT NOT NULL UNIQUE,
  pin_code TEXT NOT NULL,
  blockchain_hash TEXT,
  blockchain_tx TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations (public read, anyone can create)
CREATE POLICY "Organizations are viewable by everyone" 
ON public.organizations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create an organization" 
ON public.organizations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Organizations can update their own data" 
ON public.organizations 
FOR UPDATE 
USING (true);

-- Create policies for certificates (public read, organizations can create)
CREATE POLICY "Certificates are viewable by everyone" 
ON public.certificates 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update certificates" 
ON public.certificates 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_certificates_org_id ON public.certificates(organization_id);
CREATE INDEX idx_certificates_cert_number ON public.certificates(certificate_number);
CREATE INDEX idx_organizations_verification_code ON public.organizations(verification_code);