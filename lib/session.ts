import { supabase } from './supabase';
import { Session, Combatant } from './types';

/**
 * Generate a unique 6-character session code
 */
export function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique token for DM or player authentication
 */
export function generateToken(): string {
  return crypto.randomUUID();
}

/**
 * Create a new session
 */
export async function createSession(): Promise<{ session: Session; dmToken: string }> {
  const code = generateSessionCode();
  const dmToken = generateToken();
  
  // Session expires in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      code,
      dm_token: dmToken,
      expires_at: expiresAt.toISOString(),
      round: 1,
      current_turn_index: 0,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return {
    session: data,
    dmToken,
  };
}

/**
 * Join an existing session
 */
export async function joinSession(code: string): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Session not found or expired');
    }
    throw new Error(`Failed to join session: ${error.message}`);
  }

  // Check if session has expired
  const now = new Date();
  const expiresAt = new Date(data.expires_at);
  
  if (now > expiresAt) {
    // Mark session as inactive
    await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', data.id);
    
    throw new Error('Session has expired');
  }

  return data;
}

/**
 * Verify DM token for a session
 */
export async function verifyDMToken(sessionId: string, token: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('sessions')
    .select('dm_token')
    .eq('id', sessionId)
    .single();

  if (error) return false;
  return data.dm_token === token;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}

/**
 * Update session (round, turn, etc.)
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<Pick<Session, 'round' | 'current_turn_index' | 'is_active'>>
): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update session: ${error.message}`);
  }

  return data;
}

/**
 * End a session (DM only)
 */
export async function endSession(sessionId: string, dmToken: string): Promise<void> {
  // Verify DM token first
  const isValidDM = await verifyDMToken(sessionId, dmToken);
  if (!isValidDM) {
    throw new Error('Unauthorized: Invalid DM token');
  }

  const { error } = await supabase
    .from('sessions')
    .update({ is_active: false })
    .eq('id', sessionId);

  if (error) {
    throw new Error(`Failed to end session: ${error.message}`);
  }
}

/**
 * Get all combatants for a session, sorted by initiative
 */
export async function getCombatants(sessionId: string): Promise<Combatant[]> {
  const { data, error } = await supabase
    .from('combatants')
    .select('*')
    .eq('session_id', sessionId)
    .order('initiative', { ascending: false })
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(`Failed to get combatants: ${error.message}`);
  }

  return data || [];
}

/**
 * Add a combatant to a session
 */
export async function addCombatant(
  sessionId: string,
  combatantData: {
    name: string;
    initiative: number;
    maxHp?: number;
    currentHp?: number;
    isPlayer?: boolean;
    playerToken?: string;
  },
  dmToken: string
): Promise<Combatant> {
  // Verify DM token
  const isValidDM = await verifyDMToken(sessionId, dmToken);
  if (!isValidDM) {
    throw new Error('Unauthorized: Invalid DM token');
  }

  // Get the next order index
  const { data: existingCombatants } = await supabase
    .from('combatants')
    .select('order_index')
    .eq('session_id', sessionId)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrderIndex = existingCombatants?.[0]?.order_index + 1 || 0;

  const { data, error } = await supabase
    .from('combatants')
    .insert({
      session_id: sessionId,
      name: combatantData.name,
      initiative: combatantData.initiative,
      max_hp: combatantData.maxHp || null,
      current_hp: combatantData.currentHp || combatantData.maxHp || null,
      is_player: combatantData.isPlayer || false,
      player_token: combatantData.playerToken || null,
      action_available: true,
      bonus_action_available: true,
      reaction_available: true,
      movement_available: true,
      custom_actions: [],
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add combatant: ${error.message}`);
  }

  return data;
}

/**
 * Remove a combatant from a session
 */
export async function removeCombatant(
  combatantId: string,
  dmToken: string
): Promise<void> {
  // First get the combatant to verify session access
  const { data: combatant, error: fetchError } = await supabase
    .from('combatants')
    .select('session_id')
    .eq('id', combatantId)
    .single();

  if (fetchError) {
    throw new Error('Combatant not found');
  }

  // Verify DM token
  const isValidDM = await verifyDMToken(combatant.session_id, dmToken);
  if (!isValidDM) {
    throw new Error('Unauthorized: Invalid DM token');
  }

  const { error } = await supabase
    .from('combatants')
    .delete()
    .eq('id', combatantId);

  if (error) {
    throw new Error(`Failed to remove combatant: ${error.message}`);
  }
}

/**
 * Update combatant action status
 */
export async function updateCombatantActions(
  combatantId: string,
  actions: {
    action_available?: boolean;
    bonus_action_available?: boolean;
    reaction_available?: boolean;
    movement_available?: boolean;
  },
  token: string // Can be DM token or player token
): Promise<Combatant> {
  // Get combatant to check permissions
  const { data: combatant, error: fetchError } = await supabase
    .from('combatants')
    .select('*')
    .eq('id', combatantId)
    .single();

  if (fetchError) {
    throw new Error('Combatant not found');
  }

  // Check if user has permission (DM or player who owns this combatant)
  const isValidDM = await verifyDMToken(combatant.session_id, token);
  const isValidPlayer = combatant.player_token === token;

  if (!isValidDM && !isValidPlayer) {
    throw new Error('Unauthorized: Invalid token');
  }

  const { data, error } = await supabase
    .from('combatants')
    .update(actions)
    .eq('id', combatantId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update combatant actions: ${error.message}`);
  }

  return data;
}

/**
 * Reset actions for turn/round changes
 */
export async function resetCombatantActions(
  sessionId: string,
  resetType: 'turn' | 'round',
  dmToken: string
): Promise<void> {
  // Verify DM token
  const isValidDM = await verifyDMToken(sessionId, dmToken);
  if (!isValidDM) {
    throw new Error('Unauthorized: Invalid DM token');
  }

  if (resetType === 'turn') {
    // Reset action, bonus action, and movement for new turn
    await supabase
      .from('combatants')
      .update({
        action_available: true,
        bonus_action_available: true,
        movement_available: true,
      })
      .eq('session_id', sessionId);
  } else if (resetType === 'round') {
    // Reset all actions including reactions for new round
    await supabase
      .from('combatants')
      .update({
        action_available: true,
        bonus_action_available: true,
        reaction_available: true,
        movement_available: true,
      })
      .eq('session_id', sessionId);
  }
} 