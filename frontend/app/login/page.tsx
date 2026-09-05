"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Demo: just navigate to dashboard
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  const handleDemo = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[40%] h-[40%] bg-secondary/15 rounded-full blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/">
          <LogoText />
        </Link>
        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
            ← Back to home
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="glass-panel rounded-2xl border border-border p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Verify before you trust.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground/80"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border",
                    "text-foreground placeholder:text-muted-foreground text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "transition-all duration-200"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground/80"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border",
                      "text-foreground placeholder:text-muted-foreground text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                      "transition-all duration-200"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6 gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Demo button */}
            <Button
              onClick={handleDemo}
              variant="outline"
              className="w-full h-11 border-primary/30 text-primary hover:bg-primary/10 font-semibold"
            >
              Continue with Demo
            </Button>

            {/* Footer links */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Trust note */}
          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            Private by design · AI-assisted analysis · Explainable results
          </p>
        </div>
      </main>
    </div>
  );
}
