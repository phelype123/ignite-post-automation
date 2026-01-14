import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Zap,
  Play,
  Pause,
  Settings,
  Calendar,
  RefreshCw,
  Clock,
  Target,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { autopilotService } from "@/services/api";
import { AutopilotRule, Post } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const weekDays = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

export default function AutopilotPage() {
  const [rules, setRules] = useState<AutopilotRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [simulatedPosts, setSimulatedPosts] = useState<Post[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const data = await autopilotService.getRules();
      setRules(data);
    } catch (error) {
      toast({ title: "Erro ao carregar", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutopilot = async () => {
    if (!rules) return;
    setIsSaving(true);
    try {
      const updated = await autopilotService.toggle(!rules.enabled);
      setRules(updated);
      toast({ title: updated.enabled ? "Piloto automático ativado!" : "Piloto automático desativado" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const posts = await autopilotService.simulate();
      setSimulatedPosts(posts);
    } catch (error) {
      toast({ title: "Erro na simulação", variant: "destructive" });
    } finally {
      setIsSimulating(false);
    }
  };

  if (isLoading || !rules) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Piloto Automático</h1>
            <p className="text-muted-foreground">
              Deixe a IA criar e agendar posts automaticamente
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full",
              rules.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            )}>
              {rules.enabled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span className="font-medium">{rules.enabled ? "Ativo" : "Inativo"}</span>
            </div>
            <Button
              variant={rules.enabled ? "outline" : "gradient"}
              onClick={toggleAutopilot}
              disabled={isSaving}
            >
              {rules.enabled ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard title="Posts esta semana" value={12} icon={Calendar} />
          <StatCard title="Próximo post" value="Hoje 18h" icon={Clock} />
          <StatCard title="Taxa de sucesso" value="98%" icon={Target} change={2.5} changeLabel="vs. mês passado" />
        </div>

        {/* Configuration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
          {/* Schedule */}
          <div className="p-6 rounded-xl border space-y-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Dias e horários
            </h3>
            <div>
              <Label className="mb-3 block">Dias da semana</Label>
              <div className="flex gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day.id}
                    className={cn(
                      "w-10 h-10 rounded-lg font-medium text-sm transition-all",
                      rules.schedule.days.includes(day.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-3 block">Horários</Label>
              <div className="flex flex-wrap gap-2">
                {rules.schedule.times.map((time) => (
                  <Badge key={time} variant="secondary" className="px-3 py-1">{time}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="p-6 rounded-xl border space-y-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Distribuição de objetivos
            </h3>
            <div className="space-y-4">
              {Object.entries(rules.objectives).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key === 'socialProof' ? 'Prova social' : key === 'sell' ? 'Vender' : key === 'engage' ? 'Engajar' : 'Crescer'}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Regras
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Evitar repetição (dias)</Label>
                <Badge variant="secondary">{rules.avoidRepetitionDays} dias</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Max. promoções/semana</Label>
                <Badge variant="secondary">{rules.maxPromotionalPerWeek}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label>Rotação de produtos</Label>
                <Badge variant="secondary">{rules.productRotation === 'balanced' ? 'Balanceado' : rules.productRotation}</Badge>
              </div>
            </div>
          </div>

          {/* Simulation */}
          <div className="p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Simulador
            </h3>
            <p className="text-sm text-muted-foreground">Veja os próximos posts planejados pelo piloto automático.</p>
            <Button variant="outline" onClick={handleSimulate} disabled={isSimulating} className="w-full">
              {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ver próximos 10 posts"}
            </Button>
            {simulatedPosts.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {simulatedPosts.slice(0, 5).map((post, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    <span className="flex-1 truncate">{post.caption.slice(0, 30)}...</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(post.scheduledAt!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
