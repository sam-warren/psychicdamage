'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import { toast } from 'sonner';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionCode = params.code as string;
  const { 
    sessionState, 
    joinExistingSession, 
    isLoading, 
    error, 
    userRole,
    dmToken,
    playerToken 
  } = useSession();
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionCode && !sessionState.session) {
      joinExistingSession(sessionCode).catch(() => {
        // Error handling is done in the hook
        router.push('/');
      });
    }
  }, [sessionCode, sessionState.session, joinExistingSession, router]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      toast.success('Session code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy session code');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-400">Session Error</CardTitle>
            <CardDescription className="text-slate-300">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackToHome} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionState.session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={handleBackToHome} 
            variant="ghost" 
            className="text-slate-300 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Combat Session</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {sessionCode}
              </Badge>
              <Button
                onClick={handleCopyCode}
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={userRole === 'dm' ? 'default' : 'secondary'}>
              {userRole === 'dm' ? 'Dungeon Master' : 'Player'}
            </Badge>
          </div>
        </div>

        {/* Session Info */}
        <div className="grid gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Session Code</p>
                  <p className="text-white font-mono text-lg">{sessionCode}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Round</p>
                  <p className="text-white text-lg">{sessionState.session.round}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge variant={sessionState.session.is_active ? 'default' : 'destructive'}>
                    {sessionState.session.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-white">{userRole === 'dm' ? 'Dungeon Master' : 'Player'}</p>
                </div>
              </div>

              {userRole === 'dm' && (
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Share this code with your players:</p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-slate-700 px-3 py-2 rounded text-white font-mono flex-1">
                      {sessionCode}
                    </code>
                    <Button onClick={handleCopyCode} size="sm">
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Combat Tracker Placeholder */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Combat Tracker</CardTitle>
            <CardDescription className="text-slate-300">
              Phase 1 Complete - Combat tracker interface coming in Phase 3!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Ready for Combat</h3>
              <p className="text-slate-400 mb-4">
                Your session is active and ready. The combat tracker will be implemented in the next phase.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>✅ Session management complete</p>
                <p>⏳ Initiative tracker coming next</p>
                <p>⏳ Action economy tracking coming next</p>
                <p>⏳ Real-time updates coming next</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-yellow-400">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-slate-400 overflow-auto">
                {JSON.stringify({
                  sessionId: sessionState.session.id,
                  userRole,
                  dmToken: dmToken ? 'Present' : 'Missing',
                  playerToken: playerToken ? 'Present' : 'Missing',
                  combatants: sessionState.combatants.length
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 