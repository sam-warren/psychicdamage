-- Update monsters table schema
-- Remove fields that don't align with JSON data structure
-- Add missing fields from JSON data

-- Remove legendary_actions field (legendary actions are embedded in regular actions)
ALTER TABLE monsters DROP COLUMN IF EXISTS legendary_actions;

-- Remove subtype field (not consistently present in JSON data)
ALTER TABLE monsters DROP COLUMN IF EXISTS subtype;

-- Remove languages field (not consistently present in JSON data for most monsters)
ALTER TABLE monsters DROP COLUMN IF EXISTS languages;

-- Add damage_vulnerabilities field (present in JSON for some monsters)
ALTER TABLE monsters ADD COLUMN damage_vulnerabilities TEXT[];

-- Add saving_throws field (present in JSON data)
ALTER TABLE monsters ADD COLUMN saving_throws JSONB;

-- Update comments for clarity
COMMENT ON COLUMN monsters.damage_vulnerabilities IS 'Array of damage types the monster is vulnerable to';
COMMENT ON COLUMN monsters.saving_throws IS 'JSON object containing saving throw bonuses (e.g., {"con": "+6", "int": "+8"})'; 