import { useState, useCallback, useEffect } from 'react';
import { Session, Combatant, SessionState, UserRole } from '@/lib/types';
import { 
  createSession, 
  joinSession, 
  endSession, 
  getCombatants,
  addCombatant,
  removeCombatant
} from '@/lib/session';

interface UseSessionReturn {
  sessionState: SessionState;
  createNewSession: () => Promise<{ session: Session; dmToken: string }>;
  joinExistingSession: (code: string) => Promise<Session>;
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

  const [dmToken, setDMTokenState] = useState<string | null>(null);
  const [playerToken, setPlayerTokenState] = useState<string | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);

  // Initialize tokens and role from localStorage on mount
  useEffect(() => {
    const storedDMToken = localStorage.getItem('dm_token');
    const storedPlayerToken = localStorage.getItem('player_token');
    
    if (storedDMToken) {
      setDMTokenState(storedDMToken);
      setUserRoleState('dm');
    } else if (storedPlayerToken) {
      setPlayerTokenState(storedPlayerToken);
      setUserRoleState('player');
    }
  }, []);

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

  const setDMToken = useCallback((token: string | null) => {
    setDMTokenState(token);
    if (token) {
      localStorage.setItem('dm_token', token);
      setUserRoleState('dm');
    } else {
      localStorage.removeItem('dm_token');
      if (userRole === 'dm') {
        setUserRoleState(null);
      }
    }
  }, [userRole]);

  const setPlayerToken = useCallback((token: string | null) => {
    setPlayerTokenState(token);
    if (token) {
      localStorage.setItem('player_token', token);
      setUserRoleState('player');
    } else {
      localStorage.removeItem('player_token');
      if (userRole === 'player') {
        setUserRoleState(null);
      }
    }
  }, [userRole]);

  const setUserRole = useCallback((role: UserRole | null) => {
    setUserRoleState(role);
  }, []);

  const createNewSession = useCallback(async (): Promise<{ session: Session; dmToken: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createSession();
      setSession(result.session);
      setDMToken(result.dmToken);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSession, setDMToken]);

  const joinExistingSession = useCallback(async (code: string): Promise<Session> => {
    setLoading(true);
    setError(null);

    try {
      const session = await joinSession(code);
      setSession(session);
      
      // Only generate player token if user doesn't already have DM token
      // (handles case where DM navigates to their own session)
      if (!dmToken) {
        const playerToken = crypto.randomUUID();
        setPlayerToken(playerToken);
      }
      
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSession, setPlayerToken, dmToken]);

  const endCurrentSession = useCallback(async (): Promise<void> => {
    if (!sessionState.session || !dmToken) {
      throw new Error('No active session or invalid permissions');
    }

    setLoading(true);
    setError(null);

    try {
      await endSession(sessionState.session.id, dmToken);
      setSession(null);
      setDMToken(null);
      setUserRole(null);
      setSessionState(prev => ({ ...prev, combatants: [] }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionState.session, dmToken, setLoading, setError, setSession, setDMToken, setUserRole]);

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

  return {
    sessionState,
    createNewSession,
    joinExistingSession,
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
