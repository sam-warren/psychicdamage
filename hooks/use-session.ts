import { useState, useCallback } from 'react';
import { Session, Combatant, SessionState, UserRole } from '@/lib/types';
import { 
  createSession, 
  joinSession, 
  endSession, 
  getCombatants,
  addCombatant,
  removeCombatant,
  verifyDMTokenByCode
} from '@/lib/session';

interface UseSessionReturn {
  sessionState: SessionState;
  createNewSession: () => Promise<{ session: Session; dmToken: string }>;
  joinExistingSession: (code: string) => Promise<Session>;
  loadSessionData: (code: string) => Promise<Session>;
  verifyDMTokenForSession: (sessionCode: string) => Promise<boolean>;
  endCurrentSession: () => Promise<void>;
  addCombatantToSession: (combatantData: {
    name: string;
    initiative: number;
    maxHp?: number;
    currentHp?: number;
    isPlayer?: boolean;
    playerToken?: string;
  }) => Promise<Combatant>;
  removeCombatantFromSession: (combatantId: string) => Promise<void>;
  loadCombatants: () => Promise<void>;
  setSession: (session: Session | null) => void;
  setDMToken: (token: string | null) => void;
  setPlayerToken: (token: string | null) => void;
  setUserRole: (role: UserRole | null) => void;
  dmToken: string | null;
  playerToken: string | null;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useSession(): UseSessionReturn {
  const [sessionState, setSessionState] = useState<SessionState>({
    session: null,
    combatants: [],
    currentMember: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  // Initialize tokens from localStorage (simplified - only one token type at a time)
  const [dmToken, setDMTokenState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dm_token');
    }
    return null;
  });
  
  const [playerToken, setPlayerTokenState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('player_token');
    }
    return null;
  });

  // Role is determined by which token exists (simplified)
  const [userRole, setUserRoleState] = useState<UserRole | null>(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('dm_token')) {
        return 'dm';
      } else if (localStorage.getItem('player_token')) {
        return 'player';
      }
    }
    return null;
  });

  const setError = useCallback((error: string | null) => {
    setSessionState(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const setLoading = useCallback((isLoading: boolean) => {
    setSessionState(prev => ({ ...prev, isLoading }));
  }, []);

  const setSession = useCallback((session: Session | null) => {
    setSessionState(prev => ({ ...prev, session }));
  }, []);

  // Simplified token setters - clear the other token when setting one
  const setDMToken = useCallback((token: string | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('setDMToken called with:', token);
    }
    
    setDMTokenState(token);
    if (token) {
      // Clear player token and set as DM
      localStorage.setItem('dm_token', token);
      localStorage.removeItem('player_token');
      setPlayerTokenState(null);
      setUserRoleState('dm');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('DM token set, player token cleared, role set to dm');
      }
    } else {
      localStorage.removeItem('dm_token');
      setUserRoleState(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('DM token cleared, role set to null');
      }
    }
  }, []);

  const setPlayerToken = useCallback((token: string | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('setPlayerToken called with:', token);
    }
    
    setPlayerTokenState(token);
    if (token) {
      // Clear DM token and set as player
      localStorage.setItem('player_token', token);
      localStorage.removeItem('dm_token');
      setDMTokenState(null);
      setUserRoleState('player');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Player token set, DM token cleared, role set to player');
      }
    } else {
      localStorage.removeItem('player_token');
      setUserRoleState(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Player token cleared, role set to null');
      }
    }
  }, []);

  const setUserRole = useCallback((role: UserRole | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('setUserRole called with:', role);
    }
    setUserRoleState(role);
  }, []);

  // Clear all tokens and role
  const clearAllTokens = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('clearAllTokens called - clearing all tokens and role');
    }
    
    localStorage.removeItem('dm_token');
    localStorage.removeItem('player_token');
    setDMTokenState(null);
    setPlayerTokenState(null);
    setUserRoleState(null);
  }, []);

  const createNewSession = useCallback(async (): Promise<{ session: Session; dmToken: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Clear all existing tokens first to ensure clean state
      clearAllTokens();
      
      const result = await createSession();
      setSession(result.session);
      
      // Creating a session makes you the DM - set DM token explicitly
      setDMToken(result.dmToken);
      
      // Debug log to verify token setting
      if (process.env.NODE_ENV === 'development') {
        console.log('Session created - setting DM token:', result.dmToken);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSession, setDMToken, clearAllTokens]);

  const loadSessionData = useCallback(async (code: string): Promise<Session> => {
    setLoading(true);
    setError(null);

    try {
      const session = await joinSession(code);
      setSession(session);
      
      // Don't change tokens - just load the session data
      if (process.env.NODE_ENV === 'development') {
        console.log('Session data loaded without changing tokens');
      }
      
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSession]);

  const joinExistingSession = useCallback(async (code: string): Promise<Session> => {
    setLoading(true);
    setError(null);

    try {
      // Clear all existing tokens first to ensure clean state
      clearAllTokens();
      
      const session = await joinSession(code);
      setSession(session);
      
      // Joining a session makes you a player - generate new player token
      const newPlayerToken = crypto.randomUUID();
      setPlayerToken(newPlayerToken);
      
      // Debug log to verify token setting
      if (process.env.NODE_ENV === 'development') {
        console.log('Session joined - setting player token:', newPlayerToken);
      }
      
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSession, setPlayerToken, clearAllTokens]);

  const endCurrentSession = useCallback(async (): Promise<void> => {
    if (!sessionState.session || !dmToken) {
      throw new Error('No active session or invalid permissions');
    }

    setLoading(true);
    setError(null);

    try {
      await endSession(sessionState.session.id, dmToken);
      setSession(null);
      clearAllTokens();
      setSessionState(prev => ({ ...prev, combatants: [] }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionState.session, dmToken, setLoading, setError, setSession, clearAllTokens]);

  const loadCombatants = useCallback(async (): Promise<void> => {
    if (!sessionState.session) return;

    setLoading(true);
    setError(null);

    try {
      const combatants = await getCombatants(sessionState.session.id);
      setSessionState(prev => ({ ...prev, combatants }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load combatants';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionState.session, setLoading, setError]);

  const addCombatantToSession = useCallback(async (combatantData: {
    name: string;
    initiative: number;
    maxHp?: number;
    currentHp?: number;
    isPlayer?: boolean;
    playerToken?: string;
  }): Promise<Combatant> => {
    if (!sessionState.session || !dmToken) {
      throw new Error('No active session or invalid permissions');
    }

    setLoading(true);
    setError(null);

    try {
      const combatant = await addCombatant(sessionState.session.id, combatantData, dmToken);
      setSessionState(prev => ({
        ...prev,
        combatants: [...prev.combatants, combatant].sort((a, b) => {
          if (b.initiative !== a.initiative) {
            return b.initiative - a.initiative;
          }
          return a.order_index - b.order_index;
        })
      }));
      return combatant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add combatant';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionState.session, dmToken, setLoading, setError]);

  const removeCombatantFromSession = useCallback(async (combatantId: string): Promise<void> => {
    if (!dmToken) {
      throw new Error('Invalid permissions');
    }

    setLoading(true);
    setError(null);

    try {
      await removeCombatant(combatantId, dmToken);
      setSessionState(prev => ({
        ...prev,
        combatants: prev.combatants.filter(c => c.id !== combatantId)
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove combatant';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dmToken, setLoading, setError]);

  const verifyDMTokenForSession = useCallback(async (sessionCode: string): Promise<boolean> => {
    if (!dmToken) return false;
    
    try {
      return await verifyDMTokenByCode(sessionCode, dmToken);
    } catch {
      return false;
    }
  }, [dmToken]);

  return {
    sessionState,
    createNewSession,
    joinExistingSession,
    loadSessionData,
    verifyDMTokenForSession,
    endCurrentSession,
    addCombatantToSession,
    removeCombatantFromSession,
    loadCombatants,
    setSession,
    setDMToken,
    setPlayerToken,
    setUserRole,
    dmToken,
    playerToken,
    userRole,
    isLoading: sessionState.isLoading,
    error: sessionState.error,
    clearError,
  };
}
