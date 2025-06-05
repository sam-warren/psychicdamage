"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sword, Users, BookOpen, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check current session
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-4">
          <Button variant="ghost" disabled>
            Loading...
          </Button>
        </div>
      );
    }

    if (user) {
      return (
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/auth/sign-up">Get Started</Link>
        </Button>
      </div>
    );
  };

  const renderHeroButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" disabled className="text-lg px-8">
            Loading...
          </Button>
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
          >
            <Link href="/dashboard">Roll for Initiative</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-4">
        <Button
          asChild
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
        >
          <Link href="/auth/sign-up">Start Free Trial</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="text-lg px-8">
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    );
  };

  const renderCTASection = () => {
    if (user) {
      return (
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Welcome Back, Dungeon Master!
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Continue managing your campaigns and running amazing D&D sessions.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Enhance Your D&D Sessions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Dungeon Masters who are already using Psychic
            Damage to run better games.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
          >
            <Link href="/auth/sign-up">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono">PSYCHIC_DAMAGE</span>
          </div>
          {renderAuthButtons()}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            Campaign Management
            <br />
            <span className="text-purple-600">for D&D 5e</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your D&D sessions with powerful tools for managing
            campaigns, tracking combat, and organizing player characters. Built
            for Dungeon Masters who want to focus on storytelling.
          </p>
          {renderHeroButtons()}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need to Run Great Sessions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  Organize your campaigns, track player characters, and manage
                  session notes all in one place.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Sword className="h-12 w-12 text-muted-foreground  mb-4" />
                <CardTitle>Combat Tracker</CardTitle>
                <CardDescription>
                  Real-time initiative tracking with live player views. Handle
                  complex combat encounters with ease.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>Player Management</CardTitle>
                <CardDescription>
                  Track player stats, manage HP, and keep notes on each
                  character in your campaign.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>AI-Powered Tools</CardTitle>
                <CardDescription>
                  Generate NPCs, create scene descriptions, and get combat
                  narration suggestions with AI assistance.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>SRD Compliant</CardTitle>
                <CardDescription>
                  Built with official D&D 5e SRD content, ensuring legal
                  compliance and accurate rules reference.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>Real-time Sync</CardTitle>
                <CardDescription>
                  Share live combat status with players on any device. Updates
                  in real-time across all connected devices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {renderCTASection()}

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sword className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-bold">Psychic Damage</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Built for D&D 5e. Uses content from the Systems Reference Document
            5.1 under the Open Gaming License.
          </p>
        </div>
      </footer>
    </div>
  );
}
