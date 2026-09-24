-- SQL Migration Script for Supabase SQL Editor
-- Copy and paste this directly into Supabase -> SQL Editor -> Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Brokers Table
CREATE TABLE IF NOT EXISTS public.brokers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_code TEXT UNIQUE,
  broker_type TEXT DEFAULT 'CORPORATE',
  company_name TEXT NOT NULL,
  rc_number TEXT,
  naicom_license_number TEXT,
  naicom_expiry_date DATE,
  nhia_accreditation_no TEXT,
  tax_id_number TEXT,
  vat_compliant BOOLEAN DEFAULT false,
  nin TEXT,
  bvn TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  phone TEXT,
  state TEXT,
  lga TEXT,
  address TEXT,
  status TEXT DEFAULT 'DRAFT',
  tier_level TEXT DEFAULT 'RETAIL_AGENT',
  risk_score INT DEFAULT 0,
  ndpa_consent BOOLEAN DEFAULT false,
  rejection_reason TEXT,
  quiz_passed BOOLEAN DEFAULT false,
  quiz_score INT,
  certified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  annual_base_rate NUMERIC NOT NULL,
  min_lives INT DEFAULT 1,
  hospital_tier TEXT DEFAULT 'TIER_2_STANDARD',
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Hospitals Table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  address TEXT NOT NULL,
  tier TEXT DEFAULT 'TIER_2_STANDARD',
  phone TEXT,
  email TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Quote Deals Table
CREATE TABLE IF NOT EXISTS public.quote_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  stage TEXT DEFAULT 'PROPOSAL_SENT',
  total_lives INT DEFAULT 0,
  breakout JSONB DEFAULT '[]'::jsonb,
  total_premium NUMERIC DEFAULT 0,
  discount_applied NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Commissions Table
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE,
  quote_deal_id UUID REFERENCES public.quote_deals(id) ON DELETE SET NULL,
  gross_premium NUMERIC NOT NULL,
  commission_rate NUMERIC DEFAULT 10.0,
  gross_commission NUMERIC NOT NULL,
  wht_rate NUMERIC DEFAULT 5.0,
  wht_amount NUMERIC NOT NULL,
  net_payout NUMERIC NOT NULL,
  status TEXT DEFAULT 'PENDING',
  payout_ref TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
