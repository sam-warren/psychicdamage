/**
 * Real-time hook using Supabase Realtime
 * 
 * This hook subscribes to database changes (PostgreSQL) and automatically
 * synchronizes session and combatant data across all connected clients.
 * No custom WebSocket infrastructure needed - Supabase handles connection
 * management, reconnection, and broadcasting database changes.
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, Combatant, SessionEvent } from '@/lib/types';

interface UseRealtimeReturn {
  isConnected: boolean;
  subscribe: (sessionId: string) => void;
  unsubscribe: () => void;
  onSessionUpdate: (callback: (session: Session) => void) => void;
  onCombatantUpdate: (callback: (combatants: Combatant[]) => void) => void;
  onEventReceived: (callback: (event: SessionEvent) => void) => void;
}

export function useRealtime(): UseRealtimeReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Event callbacks
  const [sessionUpdateCallback, setSessionUpdateCallback] = useState<((session: Session) => void) | null>(null);
  const [combatantUpdateCallback, setCombatantUpdateCallback] = useState<((combatants: Combatant[]) => void) | null>(null);

  const subscribe = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsConnected(true);
    
    // Subscribe to session changes
    const sessionChannel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'sessions',
          filter: `id=eq.${sessionId}`
        }, 
        (payload) => {
          if (sessionUpdateCallback && payload.new) {
            sessionUpdateCallback(payload.new as Session);
          }
        }
      )
      .subscribe();

    // Subscribe to combatant changes
    const combatantChannel = supabase
      .channel(`combatants:${sessionId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'combatants',
          filter: `session_id=eq.${sessionId}`
        },
        async () => {
          // Reload all combatants when any change occurs
          if (combatantUpdateCallback) {
            const { data } = await supabase
              .from('combatants')
              .select('*')
              .eq('session_id', sessionId)
              .order('initiative', { ascending: false })
              .order('order_index', { ascending: true });
            
            if (data) {
              combatantUpdateCallback(data);
            }
          }
        }
      )
      .subscribe();

    // Store channels for cleanup
    return () => {
      sessionChannel.unsubscribe();
      combatantChannel.unsubscribe();
    };
  }, [sessionUpdateCallback, combatantUpdateCallback]);

  const unsubscribe = useCallback(() => {
    if (currentSessionId) {
      supabase.removeAllChannels();
      setCurrentSessionId(null);
      setIsConnected(false);
    }
  }, [currentSessionId]);

  const onSessionUpdate = useCallback((callback: (session: Session) => void) => {
    setSessionUpdateCallback(() => callback);
  }, []);

  const onCombatantUpdate = useCallback((callback: (combatants: Combatant[]) => void) => {
    setCombatantUpdateCallback(() => callback);
  }, []);

  const onEventReceived = useCallback((callback: (event: SessionEvent) => void) => {
    // Placeholder for Phase 2 implementation
    console.log('Event callback registered:', callback);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return {
    isConnected,
    subscribe,
    unsubscribe,
    onSessionUpdate,
    onCombatantUpdate,
    onEventReceived,
  };
}
