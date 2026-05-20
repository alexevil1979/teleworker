import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-sky-500/30 bg-sky-500/20 text-sky-300",
        success: "border-emerald-500/30 bg-emerald-500/20 text-emerald-300",
        warning: "border-amber-500/30 bg-amber-500/20 text-amber-300",
        destructive: "border-red-500/30 bg-red-500/20 text-red-300",
        secondary: "border-white/20 bg-white/10 text-white/70",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
