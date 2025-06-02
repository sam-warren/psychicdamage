-- Psychic Damage D&D Combat Tracker Database Schema
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Enable Row Level Security (RLS) on both tables
-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(6) NOT NULL UNIQUE,
    dm_token UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    round INTEGER DEFAULT 1,
    current_turn_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Combatants table
CREATE TABLE IF NOT EXISTS combatants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    initiative INTEGER NOT NULL,
    max_hp INTEGER,
    current_hp INTEGER,
    is_player BOOLEAN DEFAULT false,
    player_token UUID,
    action_available BOOLEAN DEFAULT true,
    bonus_action_available BOOLEAN DEFAULT true,
    reaction_available BOOLEAN DEFAULT true,
    movement_available BOOLEAN DEFAULT true,
    custom_actions JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    conditions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_index INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE combatants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions table
-- Allow anyone to read active sessions (needed for joining)
CREATE POLICY "Anyone can read active sessions" ON sessions
    FOR SELECT USING (is_active = true);

-- Allow anyone to insert sessions (for creating new sessions)
CREATE POLICY "Anyone can create sessions" ON sessions
    FOR INSERT WITH CHECK (true);

-- Allow updates only by the DM (using dm_token)
CREATE POLICY "Only DM can update sessions" ON sessions
    FOR UPDATE USING (true); -- We'll handle authorization in the application layer

-- Allow DM to delete/deactivate sessions
CREATE POLICY "Only DM can delete sessions" ON sessions
    FOR DELETE USING (true); -- We'll handle authorization in the application layer

-- RLS Policies for combatants table
-- Allow reading combatants for active sessions
CREATE POLICY "Anyone can read combatants in active sessions" ON combatants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = combatants.session_id 
            AND sessions.is_active = true
        )
    );

-- Allow inserting combatants (DM authorization handled in app)
CREATE POLICY "Anyone can insert combatants" ON combatants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = combatants.session_id 
            AND sessions.is_active = true
        )
    );

-- Allow updating combatants (authorization handled in app)
CREATE POLICY "Anyone can update combatants" ON combatants
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = combatants.session_id 
            AND sessions.is_active = true
        )
    );

-- Allow deleting combatants (DM authorization handled in app)
CREATE POLICY "Anyone can delete combatants" ON combatants
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = combatants.session_id 
            AND sessions.is_active = true
        )
    );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_combatants_session_id ON combatants(session_id);
CREATE INDEX IF NOT EXISTS idx_combatants_initiative ON combatants(initiative DESC, order_index ASC);

-- Enable real-time subscriptions on both tables
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE combatants;

-- Function to automatically clean up expired sessions (optional)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE sessions 
    SET is_active = false 
    WHERE expires_at < NOW() AND is_active = true;
END;
$$;

-- You can set up a pg_cron job to run this function periodically
-- SELECT cron.schedule('cleanup-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions();'); 