import { cn } from "@/lib/utils";
import { Package, FileText, Calendar, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {icon && (
        <div className="rounded-full bg-muted p-4 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

export function EmptyProducts({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      icon={<Package className="h-8 w-8 text-muted-foreground" />}
      title="Nenhum produto encontrado"
      description="Comece importando seus produtos por CSV, link ou cadastrando manualmente."
      action={action}
    />
  );
}

export function EmptyPosts({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title="Nenhum post ainda"
      description="Crie seu primeiro post para começar a vender no Instagram."
      action={action}
    />
  );
}

export function EmptyCalendar({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
      title="Calendário vazio"
      description="Agende posts para manter seu Instagram sempre ativo."
      action={action}
    />
  );
}

export function EmptyInbox() {
  return (
    <EmptyState
      icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
      title="Inbox zerada!"
      description="Você respondeu todas as mensagens. Parabéns!"
    />
  );
}
