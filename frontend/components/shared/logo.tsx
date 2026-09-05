import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary", className)}
      {...props}
    >
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
        className="stroke-primary fill-primary/10"
      />
      <path
        d="M12 7.5L16 10v4l-4 2.5L8 14v-4l4-2.5z"
        className="stroke-secondary fill-secondary/20"
      />
      <circle cx="12" cy="12" r="1" className="fill-primary stroke-none" />
    </svg>
  );
}

export function LogoText({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo className="h-6 w-6" />
      <span className="font-semibold tracking-tight text-lg">TrueSight</span>
    </div>
  );
}
