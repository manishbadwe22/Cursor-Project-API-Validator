-- Create API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key TEXT NOT NULL,
  description TEXT,
  permissions TEXT[], -- Array of permission strings
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  usage INTEGER DEFAULT 0,
  monthly_usage_limit INTEGER,
  user_id UUID, -- Optional: for multi-user support
  created_at_iso TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);

-- Create index on user_id if you plan to support multiple users
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your auth requirements)
-- For now, we'll allow all operations. In production, you should restrict based on user_id
CREATE POLICY "Allow all operations for api_keys" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to automatically update last_used timestamp
CREATE OR REPLACE FUNCTION update_last_used()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE api_keys
  SET last_used = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
