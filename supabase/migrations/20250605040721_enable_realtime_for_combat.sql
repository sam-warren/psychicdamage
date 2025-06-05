-- Enable realtime subscriptions for combat tracking
ALTER PUBLICATION supabase_realtime ADD TABLE encounters;
ALTER PUBLICATION supabase_realtime ADD TABLE encounter_participants; 