import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Package,
  Tag,
  BarChart3,
  Calendar,
  Image,
  Sparkles,
} from "lucide-react";
import { productService, postService } from "@/services/api";
import { Product, Post } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const [productData, postsData] = await Promise.all([
        productService.getProduct(id!),
        postService.getPosts(),
      ]);
      setProduct(productData);
      setPosts(postsData.filter(p => p.productIds.includes(id!)).slice(0, 5));
    } catch (error) {
      toast({
        title: "Produto não encontrado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Produto não encontrado</h2>
          <Button variant="outline" asChild>
            <Link to="/app/products">Voltar para produtos</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Link
          to="/app/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para produtos
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2"
          >
            <div className="aspect-square rounded-2xl bg-muted overflow-hidden">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg bg-muted overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={product.status === "active" ? "success" : "secondary"}>
                  {product.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
                <span className="text-sm text-muted-foreground">{product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Categoria</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Estoque</p>
                <p className="font-medium">{product.stock} unidades</p>
              </div>
              {product.margin && (
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Margem</p>
                  <p className="font-medium">{product.margin}%</p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Posts</p>
                <p className="font-medium">{product.postsCount}</p>
              </div>
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="gradient" className="flex-1" asChild>
                <Link to={`/app/posts/new?product=${product.id}`}>
                  <Sparkles className="h-4 w-4" />
                  Criar post com IA
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/app/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Posts history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold mb-4">Histórico de posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-8 border rounded-xl">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhum post criado ainda</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to={`/app/posts/new?product=${product.id}`}>
                  <Plus className="h-4 w-4" />
                  Criar primeiro post
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/app/posts/${post.id}`}
                  className="p-4 border rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
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
                      <p className="text-sm font-medium truncate">
                        {post.caption.slice(0, 40)}...
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={post.type as any} className="text-xs">
                          {post.type}
                        </Badge>
                        <Badge variant={post.status === "published" ? "success" : "secondary"} className="text-xs">
                          {post.status === "published" ? "Publicado" : post.status === "scheduled" ? "Agendado" : "Rascunho"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
