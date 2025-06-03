"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Link 
        href="/"
        className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
      >
        <ArrowLeft className="w-4 h-4" /> 
        Back to Home
      </Link>
      {children}
    </div>
  );
}
