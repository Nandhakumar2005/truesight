"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ScanSearch,
  FileText,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/shared/logo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze", href: "/analyze", icon: ScanSearch },
  { label: "Reports", href: "/report/demo-001", icon: FileText },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <LogoText />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/analyze">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ScanSearch className="w-4 h-4 mr-2" />
                Analyze Media
              </Button>
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm">Demo User</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", profileOpen && "rotate-180")} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-border mb-1">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium text-foreground truncate">demo@truesight.ai</p>
                  </div>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card absolute w-full shadow-lg animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border">
              <Link href="/analyze" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Analyze Media
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
