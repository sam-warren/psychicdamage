-- Helper functions for seeding (these get cleaned up at the end)

CREATE OR REPLACE FUNCTION parse_challenge_rating_seed(challenge_text TEXT)
RETURNS TABLE(cr DECIMAL, xp_value INTEGER) AS $$
DECLARE
    cr_part TEXT;
    xp_part TEXT;
    xp_clean TEXT;
BEGIN
    -- Split by space and parentheses: "10 (5,900 XP)"
    cr_part := split_part(challenge_text, ' ', 1);
    xp_part := split_part(challenge_text, '(', 2);
    xp_part := split_part(xp_part, ')', 1);
    xp_clean := replace(replace(xp_part, ' XP', ''), ',', '');
    
    -- Handle fractional challenge ratings
    IF cr_part = '1/8' THEN cr := 0.125;
    ELSIF cr_part = '1/4' THEN cr := 0.25;
    ELSIF cr_part = '1/2' THEN cr := 0.5;
    ELSE cr := cr_part::DECIMAL;
    END IF;
    
    xp_value := CASE 
        WHEN xp_clean = '' THEN 0 
        ELSE xp_clean::INTEGER 
    END;
    
    RETURN QUERY SELECT cr, xp_value;
END;
$$ LANGUAGE plpgsql; 