'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Dice6, Users, Zap } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import { toast } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const { createNewSession, joinExistingSession, isLoading, error } = useSession();
  const [joinCode, setJoinCode] = useState('');

  const handleCreateSession = async () => {
    try {
      const { session } = await createNewSession();
      toast.success('Session created successfully!');
      router.push(`/session/${session.code}`);
    } catch {
      toast.error(error || 'Failed to create session');
    }
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      const session = await joinExistingSession(joinCode.trim());
      toast.success('Joined session successfully!');
      router.push(`/session/${session.code}`);
    } catch {
      toast.error(error || 'Failed to join session');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Dice6 className="h-12 w-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Psychic Damage</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A lightning-fast D&D 5e combat tracker focused on action economy and initiative management.
            Perfect for keeping your battles organized without replacing your dice.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="text-center">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Setup</h3>
            <p className="text-slate-400">Add combatants in seconds, no complex forms or databases</p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Collaboration</h3>
            <p className="text-slate-400">Players track their own actions, reducing DM workload</p>
          </div>
          <div className="text-center">
            <Dice6 className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Dice-Friendly</h3>
            <p className="text-slate-400">Encourages physical dice rolls while organizing the chaos</p>
          </div>
        </div>

        {/* Main action cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Session Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Dice6 className="h-5 w-5 mr-2 text-purple-400" />
                Start New Session
              </CardTitle>
              <CardDescription className="text-slate-300">
                Create a new combat session as the Dungeon Master
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  As DM, you&apos;ll get a unique session code to share with your players.
                  No accounts required!
                </p>
              </div>
              <Button 
                onClick={handleCreateSession}
                disabled={isLoading}
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Dice6 className="h-4 w-4 mr-2" />
                    Create Session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Join Session Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Join Session
              </CardTitle>
              <CardDescription className="text-slate-300">
                Join an existing session with a session code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="joinCode" className="text-white">Session Code</Label>
                  <Input
                    id="joinCode"
                    type="text"
                    placeholder="Enter 6-character code (e.g. ABC123)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading || !joinCode.trim()}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Join Session
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold">1</div>
              <h3 className="text-lg font-semibold text-white">Create or Join</h3>
              <p className="text-slate-400">DM creates a session, players join with the code</p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold">2</div>
              <h3 className="text-lg font-semibold text-white">Add Combatants</h3>
              <p className="text-slate-400">Quickly add players and monsters with initiative</p>
            </div>
            <div className="space-y-3">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold">3</div>
              <h3 className="text-lg font-semibold text-white">Track Actions</h3>
              <p className="text-slate-400">Players mark their own actions, DM advances turns</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            No accounts required • Sessions expire after 24 hours • Built for D&D 5e (2024)
          </p>
        </div>
      </div>
    </div>
  );
}
