import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-slate-700/50 bg-[#1f2937] text-slate-950 dark:text-slate-50 shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };