-- Initial Database Schema
-- Converted from db_init.sql to proper migration

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Characters
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_hp INTEGER NOT NULL DEFAULT 1,
  current_hp INTEGER NOT NULL DEFAULT 1,
  ac INTEGER NOT NULL DEFAULT 10,
  initiative_bonus INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  ability_scores JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SRD Monsters (pre-populated)
CREATE TABLE monsters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT,
  type TEXT,
  subtype TEXT,
  alignment TEXT,
  armor_class INTEGER,
  hit_points INTEGER,
  hit_dice TEXT,
  speed JSONB,
  ability_scores JSONB,
  skills JSONB,
  damage_resistances TEXT[],
  damage_immunities TEXT[],
  condition_immunities TEXT[],
  senses TEXT,
  languages TEXT,
  challenge_rating DECIMAL,
  xp INTEGER,
  actions JSONB,
  legendary_actions JSONB,
  special_abilities JSONB,
  source TEXT DEFAULT 'SRD 5.1',
  is_homebrew BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encounters
CREATE TABLE encounters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  environment TEXT,
  difficulty TEXT,
  xp_budget INTEGER,
  loot_notes TEXT,
  current_round INTEGER DEFAULT 0,
  current_turn INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  share_token UUID DEFAULT gen_random_uuid(),
  player_visibility JSONB DEFAULT '{"show_monster_hp": false, "show_monster_names": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encounter Participants (monsters and players)
CREATE TABLE encounter_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  encounter_id UUID REFERENCES encounters(id) ON DELETE CASCADE,
  participant_type TEXT CHECK (participant_type IN ('player', 'monster')),
  player_id UUID REFERENCES players(id),
  monster_id UUID REFERENCES monsters(id),
  name TEXT NOT NULL,
  max_hp INTEGER NOT NULL,
  current_hp INTEGER NOT NULL,
  armor_class INTEGER,
  initiative INTEGER,
  initiative_bonus INTEGER DEFAULT 0,
  conditions JSONB DEFAULT '[]',
  notes TEXT,
  turn_order INTEGER,
  is_defeated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Combat Log
CREATE TABLE combat_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  encounter_id UUID REFERENCES encounters(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES encounter_participants(id),
  action_type TEXT NOT NULL,
  action_data JSONB NOT NULL,
  round_number INTEGER,
  turn_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes and Journal Entries
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general',
  session_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NPCs
CREATE TABLE npcs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  personality TEXT,
  location TEXT,
  relationship TEXT,
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_players_campaign_id ON players(campaign_id);
CREATE INDEX idx_encounters_campaign_id ON encounters(campaign_id);
CREATE INDEX idx_encounter_participants_encounter_id ON encounter_participants(encounter_id);
CREATE INDEX idx_monsters_name ON monsters USING gin(to_tsvector('english', name));
CREATE INDEX idx_monsters_cr ON monsters(challenge_rating);
CREATE INDEX idx_combat_log_encounter_id ON combat_log(encounter_id);

-- Row Level Security (monsters and combat_log RLS handled in separate migration)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounter_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE npcs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their campaign players" ON players
  FOR ALL USING (campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their campaign encounters" ON encounters
  FOR ALL USING (campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their encounter participants" ON encounter_participants
  FOR ALL USING (encounter_id IN (
    SELECT id FROM encounters WHERE campaign_id IN (
      SELECT id FROM campaigns WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can view their campaign notes" ON notes
  FOR ALL USING (campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their campaign npcs" ON npcs
  FOR ALL USING (campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  ));

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle profile updates from auth metadata
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Update profile when auth user metadata changes
  UPDATE public.profiles
  SET
    email = new.email,
    display_name = COALESCE(new.raw_user_meta_data->>'display_name', display_name),
    updated_at = NOW()
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update profile when user auth data changes
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update(); 