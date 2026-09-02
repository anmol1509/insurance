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
