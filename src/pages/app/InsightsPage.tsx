import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageSquare, Bookmark, Share2, MousePointer, Users, TrendingUp, Sparkles, BarChart3 } from "lucide-react";
import { insightsService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InsightsPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [metricsData, recsData, chartDataResult, perfData] = await Promise.all([
        insightsService.getMetrics(),
        insightsService.getRecommendations(),
        insightsService.getChartData(),
        insightsService.getProductPerformance(),
      ]);
      setMetrics(metricsData);
      setRecommendations(recsData);
      setChartData(chartDataResult);
      setProductPerformance(perfData);
    } catch (error) {
      toast({ title: "Erro ao carregar insights", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const icons = [Eye, Heart, MousePointer, Users];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Insights</h1>
          <p className="text-muted-foreground">Métricas e recomendações para melhorar seus resultados</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <StatCard key={i} title={metric.label} value={metric.value} change={metric.change} changeLabel={metric.period} icon={icons[i]} />
          ))}
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Desempenho (30 dias)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => new Date(v).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="reach" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="engagement" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-xl border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recomendações da IA
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top products */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Top Produtos</h3>
            <div className="space-y-3">
              {productPerformance.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">{i + 1}</span>
                    <span className="text-sm font-medium truncate max-w-[150px]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{p.reach.toLocaleString()} alcance</span>
                    <Badge variant="success">{p.conversion.toFixed(1)}% conv.</Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
