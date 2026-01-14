import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/ui/loading";
import { EmptyPosts } from "@/components/ui/empty-state";
import {
  Plus,
  FileText,
  Calendar,
  Check,
  Clock,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Image,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { postService } from "@/services/api";
import { Post, mockProducts } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const typeLabels: Record<Post['type'], string> = {
  feed: 'Feed',
  carousel: 'Carrossel',
  stories: 'Stories',
  reels: 'Reels',
};

const objectiveLabels: Record<Post['objective'], string> = {
  sell: 'Vender',
  engage: 'Engajar',
  grow: 'Crescer',
  'social-proof': 'Prova social',
  reactivate: 'Reativar',
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await postService.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      toast({ title: "Post excluído" });
    } catch (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === "all") return true;
    return post.status === activeTab;
  });

  const counts = {
    all: posts.length,
    draft: posts.filter(p => p.status === "draft").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    published: posts.filter(p => p.status === "published").length,
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Conteúdos</h1>
            <p className="text-muted-foreground">
              Gerencie seus posts do Instagram
            </p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/app/posts/new">
              <Plus className="h-4 w-4" />
              Criar post
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              Todos
              <Badge variant="secondary" className="ml-1">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-2">
              <FileText className="h-4 w-4" />
              Rascunhos
              <Badge variant="secondary" className="ml-1">{counts.draft}</Badge>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <Clock className="h-4 w-4" />
              Agendados
              <Badge variant="secondary" className="ml-1">{counts.scheduled}</Badge>
            </TabsTrigger>
            <TabsTrigger value="published" className="gap-2">
              <Check className="h-4 w-4" />
              Publicados
              <Badge variant="secondary" className="ml-1">{counts.published}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyPosts
                action={
                  <Button variant="gradient" asChild>
                    <Link to="/app/posts/new">Criar primeiro post</Link>
                  </Button>
                }
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredPosts.map((post) => {
                  const product = mockProducts.find(p => p.id === post.productIds[0]);

                  return (
                    <div
                      key={post.id}
                      className="group border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Preview image */}
                      <div className="relative aspect-square bg-muted">
                        {post.slides?.[0]?.imageUrl || product?.images[0] ? (
                          <img
                            src={post.slides?.[0]?.imageUrl || product?.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <Badge variant={post.type as any}>
                            {typeLabels[post.type]}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/app/posts/${post.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/app/posts/${post.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {post.type === "carousel" && post.slides && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {post.slides.slice(0, 5).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  i === 0 ? "bg-white" : "bg-white/50"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="text-sm line-clamp-2 mb-3">
                          {post.caption.slice(0, 80)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "success"
                                  : post.status === "scheduled"
                                  ? "feed"
                                  : "secondary"
                              }
                            >
                              {post.status === "published"
                                ? "Publicado"
                                : post.status === "scheduled"
                                ? "Agendado"
                                : "Rascunho"}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {post.scheduledAt
                              ? formatDate(post.scheduledAt)
                              : post.publishedAt
                              ? formatDate(post.publishedAt)
                              : "Sem data"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
