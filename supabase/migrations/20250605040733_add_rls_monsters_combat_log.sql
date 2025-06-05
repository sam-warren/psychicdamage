-- Enable RLS on monsters table for homebrew content
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view SRD monsters, users can manage their homebrew
CREATE POLICY "Anyone can view SRD monsters" ON monsters
  FOR SELECT USING (is_homebrew = false OR created_by = auth.uid());

CREATE POLICY "Users can create homebrew monsters" ON monsters
  FOR INSERT WITH CHECK (created_by = auth.uid() AND is_homebrew = true);

CREATE POLICY "Users can update their homebrew monsters" ON monsters
  FOR UPDATE USING (created_by = auth.uid() AND is_homebrew = true);

CREATE POLICY "Users can delete their homebrew monsters" ON monsters
  FOR DELETE USING (created_by = auth.uid() AND is_homebrew = true);

-- Enable RLS on combat_log table
ALTER TABLE combat_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and manage logs for their own encounters
CREATE POLICY "Users can view their encounter logs" ON combat_log
  FOR ALL USING (encounter_id IN (
    SELECT id FROM encounters 
    WHERE campaign_id IN (
      SELECT id FROM campaigns WHERE user_id = auth.uid()
    )
  )); 