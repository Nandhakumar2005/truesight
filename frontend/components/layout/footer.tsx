import Link from "next/link";
import { LogoText } from "@/components/shared/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <LogoText />
            </Link>
            <p className="text-muted-foreground max-w-md">
              AI-assisted media verification for a world where seeing isn&apos;t always believing.
              Don&apos;t trust everything you see. Verify it with TrueSight.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="text-muted-foreground hover:text-primary transition-colors">
                  Analyze Media
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal & Trust</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#security" className="text-muted-foreground hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} TrueSight. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground/60 text-center md:text-right max-w-lg">
            <span className="text-warning/70 mr-2">⚠</span>
            AI-assisted assessments are not definitive proof of authenticity. Always exercise critical judgment.
          </div>
        </div>
      </div>
    </footer>
  );
}
