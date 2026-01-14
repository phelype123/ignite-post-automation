import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, className }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className={cn(
      "rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-4">
          {isPositive && <TrendingUp className="h-4 w-4 text-success" />}
          {isNegative && <TrendingDown className="h-4 w-4 text-destructive" />}
          {!isPositive && !isNegative && <Minus className="h-4 w-4 text-muted-foreground" />}
          <span className={cn(
            "text-sm font-medium",
            isPositive && "text-success",
            isNegative && "text-destructive",
            !isPositive && !isNegative && "text-muted-foreground"
          )}>
            {isPositive && '+'}{change}%
          </span>
          {changeLabel && (
            <span className="text-sm text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
