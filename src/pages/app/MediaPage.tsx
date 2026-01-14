import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Download,
  Loader2,
  Wand2,
} from "lucide-react";
import { mediaService, productService } from "@/services/api";
import { mockProducts } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  productId?: string;
  createdAt: string;
}

const imageStyles = [
  { id: "lifestyle", name: "Lifestyle", desc: "Produto em contexto de uso" },
  { id: "white-bg", name: "Fundo branco", desc: "Produto com fundo limpo" },
  { id: "promo", name: "Promocional", desc: "Banner com preço e CTA" },
];

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await mediaService.getMedia();
      setMedia(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar mídia",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedProduct || !selectedStyle) return;
    setIsGenerating(true);
    try {
      const url = await mediaService.generateImage({
        productId: selectedProduct,
        style: selectedStyle as any,
      });
      toast({
        title: "Imagem gerada!",
        description: "A nova imagem foi adicionada à biblioteca.",
      });
      setGenerateDialogOpen(false);
      loadMedia();
    } catch (error) {
      toast({
        title: "Erro ao gerar imagem",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mediaService.deleteImage(id);
      setMedia(media.filter(m => m.id !== id));
      toast({ title: "Imagem excluída" });
    } catch (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const filteredMedia = media.filter(m => {
    if (!search) return true;
    const product = mockProducts.find(p => p.id === m.productId);
    return product?.name.toLowerCase().includes(search.toLowerCase());
  });

  const toggleSelect = (id: string) => {
    setSelectedMedia(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Biblioteca de mídia</h1>
            <p className="text-muted-foreground">
              {media.length} imagens
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient">
                  <Sparkles className="h-4 w-4" />
                  Gerar com IA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gerar imagem com IA</DialogTitle>
                  <DialogDescription>
                    Escolha um produto e o estilo da imagem.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Produto</label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.slice(0, 10).map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estilo</label>
                    <div className="grid gap-2">
                      {imageStyles.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                            selectedStyle === style.id
                              ? "border-primary bg-primary/5 ring-2 ring-primary"
                              : "hover:border-primary/50"
                          )}
                        >
                          <Wand2 className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{style.name}</p>
                            <p className="text-xs text-muted-foreground">{style.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={handleGenerateImage}
                    disabled={!selectedProduct || !selectedStyle || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Gerar imagem
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected actions */}
        {selectedMedia.length > 0 && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
            <span className="text-sm font-medium">
              {selectedMedia.length} selecionada(s)
            </span>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              Baixar
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMedia([])}
            >
              Limpar seleção
            </Button>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} className="aspect-square" />
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Faça upload ou gere imagens com IA.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredMedia.map((item) => {
              const product = mockProducts.find(p => p.id === item.productId);
              const isSelected = selectedMedia.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all",
                    isSelected && "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => toggleSelect(item.id)}
                >
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {product && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-white truncate">{product.name}</p>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
