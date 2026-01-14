import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/loading";
import { 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  ShoppingCart,
  Plus,
  ArrowRight,
  Instagram,
  Zap,
  Package,
  Sparkles,
} from "lucide-react";
import { insightsService, postService, productService, storeService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { store } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, posts, products] = await Promise.all([
        insightsService.getMetrics(),
        postService.getPosts({ status: 'scheduled' }),
        productService.getProducts({ limit: 1 }),
      ]);
      setMetrics(metricsData);
      setUpcomingPosts(posts.slice(0, 3));
      setProductCount(products.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Package, label: "Importar produtos", href: "/app/import", color: "bg-blue-500/10 text-blue-600" },
    { icon: Plus, label: "Criar post", href: "/app/posts/new", color: "bg-purple-500/10 text-purple-600" },
    { icon: Instagram, label: store?.instagramConnected ? "Instagram conectado" : "Conectar Instagram", href: "/app/settings", color: store?.instagramConnected ? "bg-success/10 text-success" : "bg-pink-500/10 text-pink-600" },
    { icon: Zap, label: "Piloto automático", href: "/app/autopilot", color: "bg-orange-500/10 text-orange-600" },
  ];

  const statIcons = [Calendar, TrendingUp, MessageSquare, ShoppingCart];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Olá, {store?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground">
              Aqui está o resumo do seu Instagram esta semana.
            </p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/app/posts/new">
              <Sparkles className="h-4 w-4" />
              Criar post com IA
            </Link>
          </Button>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {metrics.map((metric, i) => (
              <StatCard
                key={i}
                title={metric.label}
                value={metric.value}
                change={metric.change}
                changeLabel={metric.period}
                icon={statIcons[i]}
              />
            ))}
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">Ações rápidas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.href}
                className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.color)}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Próximos posts</h2>
              <Link to="/app/calendar" className="text-sm text-primary hover:underline">
                Ver calendário
              </Link>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">Nenhum post agendado</p>
                <Button variant="outline" asChild>
                  <Link to="/app/posts/new">Criar primeiro post</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                      {post.slides?.[0]?.imageUrl && (
                        <img 
                          src={post.slides[0].imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.caption.slice(0, 50)}...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={post.type as any} className="text-xs">
                          {post.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.scheduledAt).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick stats / tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border p-6"
          >
            <h2 className="text-lg font-semibold mb-6">Dicas da IA</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Carrosséis convertem mais!</p>
                    <p className="text-xs text-muted-foreground">
                      Posts em carrossel tiveram 45% mais engajamento no seu segmento esta semana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Melhor horário: 19h</p>
                    <p className="text-xs text-muted-foreground">
                      Seus seguidores estão mais ativos às 19h. Considere agendar posts nesse horário.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Produto em destaque</p>
                    <p className="text-xs text-muted-foreground">
                      "Tênis Running Pro Max" tem alto potencial de vendas esta semana.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
