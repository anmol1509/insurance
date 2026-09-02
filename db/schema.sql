-- Policy records this platform keeps itself.
--
-- None of the insurer partner APIs (NSIA, Tangerine, Fortis) expose an
-- update or delete endpoint, so editing or removing a row here only ever
-- changes our own record — it never touches the insurer's system. Rows can
-- come from checkout (source='checkout'), a manual entry by an admin
-- (source='manual'), or a live insurer lookup an admin chose to save
-- (source='lookup').

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  product_type TEXT NOT NULL,
  insurer TEXT NOT NULL,
  premium NUMERIC(14, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'manual',
  cover_start DATE,
  cover_end DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS policies_product_type_idx ON policies (product_type);
CREATE INDEX IF NOT EXISTS policies_status_idx ON policies (status);
CREATE INDEX IF NOT EXISTS policies_policy_number_idx ON policies (policy_number);

-- Staff/agents this platform owns — the "Assign to" list on Leads and
-- Claims used to be a hardcoded array of sample names with no persistence.
-- This is a real table so assignment can point at an actual member of staff.

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'sales',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agents_active_idx ON agents (active);

-- Leads/Quotes and the Claims queue this platform owns. Both used to be a
-- hardcoded in-memory array on their admin page — every status change,
-- assignment, and note lived only in that browser tab's React state and
-- was gone on refresh. These are real tables now; `code` is the
-- human-readable id shown in the UI (LD-3021, CLM-2025-0921), assigned
-- automatically from a sequence so it's still unique under concurrent
-- inserts.

CREATE SEQUENCE IF NOT EXISTS leads_code_seq START 3022;

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT ('LD-' || nextval('leads_code_seq')::text),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  product_type TEXT NOT NULL,
  summary TEXT,
  estimated_premium NUMERIC(14, 2) NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  notes JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

CREATE SEQUENCE IF NOT EXISTS claims_code_seq START 922;

CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT ('CLM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('claims_code_seq')::text, 4, '0')),
  claimant_name TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'submitted',
  assigned_to TEXT,
  description TEXT,
  timeline JSONB NOT NULL DEFAULT '[]',
  documents JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS claims_status_idx ON claims (status);
CREATE INDEX IF NOT EXISTS claims_claim_date_idx ON claims (claim_date DESC);
