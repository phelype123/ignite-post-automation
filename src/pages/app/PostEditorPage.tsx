import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Image,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Star,
  RefreshCw,
  Loader2,
  Calendar,
  Clock,
  Hash,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { postService, productService } from "@/services/api";
import { mockProducts, Post } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const objectives = [
  { id: "sell", label: "Vender", icon: ShoppingCart, desc: "Foco em conversão" },
  { id: "engage", label: "Engajar", icon: MessageSquare, desc: "Gerar interação" },
  { id: "grow", label: "Crescer", icon: TrendingUp, desc: "Atrair seguidores" },
  { id: "social-proof", label: "Prova social", icon: Star, desc: "Mostrar resultados" },
  { id: "reactivate", label: "Reativar", icon: RefreshCw, desc: "Reconquistar clientes" },
];

const formats = [
  { id: "carousel", label: "Carrossel", desc: "Até 10 slides" },
  { id: "feed", label: "Imagem única", desc: "Post tradicional" },
  { id: "stories", label: "Stories", desc: "Desaparece em 24h" },
  { id: "reels", label: "Reels", desc: "Vídeo curto (em breve)" },
];

export default function PostEditorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Steps
  const [step, setStep] = useState(1);

  // Form state
  const [objective, setObjective] = useState<Post['objective']>("sell");
  const [format, setFormat] = useState<Post['type']>("carousel");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [cta, setCta] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [slides, setSlides] = useState<{ imageUrl: string; text?: string }[]>([]);
  const [whatsapp, setWhatsapp] = useState("11999998888");
  const [coupon, setCoupon] = useState("");

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("18:00");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId) {
      setSelectedProducts([productId]);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Selecione um produto",
        description: "Escolha pelo menos um produto para gerar o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await postService.generateContent({
        productIds: selectedProducts,
        type: format,
        objective,
      });
      setCaption(result.caption);
      setCta(result.cta);
      setHashtags(result.hashtags);
      if (result.slides) {
        setSlides(result.slides);
      } else {
        const product = mockProducts.find(p => p.id === selectedProducts[0]);
        if (product?.images[0]) {
          setSlides([{ imageUrl: product.images[0] }]);
        }
      }
      setStep(4);
      toast({ title: "Conteúdo gerado!" });
    } catch (error) {
      toast({ title: "Erro ao gerar", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await postService.createPost({
        productIds: selectedProducts,
        type: format,
        objective,
        caption,
        cta,
        hashtags,
        slides,
      });
      toast({ title: "Rascunho salvo!" });
      navigate("/app/posts");
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast({ title: "Selecione data e hora", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const post = await postService.createPost({
        productIds: selectedProducts,
        type: format,
        objective,
        caption,
        cta,
        hashtags,
        slides,
      });
      await postService.schedulePost(post.id, `${scheduleDate}T${scheduleTime}:00`);
      toast({ title: "Post agendado!" });
      navigate("/app/calendar");
    } catch (error) {
      toast({ title: "Erro ao agendar", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectedProductsData = mockProducts.filter(p => selectedProducts.includes(p.id));

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-2 rounded-full",
                      step > s ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Objective */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">Qual é o objetivo?</h1>
              <p className="text-muted-foreground">
                Escolha o objetivo principal deste post.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {objectives.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setObjective(obj.id as Post['objective'])}
                  className={cn(
                    "p-6 rounded-xl border text-left transition-all",
                    objective === obj.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  )}
                >
                  <obj.icon className={cn(
                    "h-8 w-8 mb-4",
                    objective === obj.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h3 className="font-semibold mb-1">{obj.label}</h3>
                  <p className="text-sm text-muted-foreground">{obj.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="gradient" onClick={() => setStep(2)}>
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Format */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">Qual formato?</h1>
              <p className="text-muted-foreground">
                Escolha o formato do seu post.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {formats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id as Post['type'])}
                  disabled={fmt.id === "reels"}
                  className={cn(
                    "p-6 rounded-xl border text-left transition-all",
                    format === fmt.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50",
                    fmt.id === "reels" && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <h3 className="font-semibold mb-1">{fmt.label}</h3>
                  <p className="text-sm text-muted-foreground">{fmt.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button variant="gradient" onClick={() => setStep(3)}>
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Products */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">Selecione o produto</h1>
              <p className="text-muted-foreground">
                Escolha o(s) produto(s) para este post.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {mockProducts.slice(0, 12).map((product) => (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                    selectedProducts.includes(product.id)
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  )}
                >
                  <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                  {selectedProducts.includes(product.id) && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                variant="gradient"
                onClick={handleGenerate}
                disabled={selectedProducts.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar conteúdo
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Edit & Preview */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">Revise e ajuste</h1>
              <p className="text-muted-foreground">
                Edite o conteúdo gerado antes de agendar.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold">Preview</h3>
                <div className="border rounded-xl overflow-hidden bg-background">
                  {/* Instagram header mock */}
                  <div className="flex items-center gap-3 p-3 border-b">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500" />
                    <span className="font-semibold text-sm">minhaloja</span>
                  </div>

                  {/* Image carousel */}
                  <div className="relative aspect-square bg-muted">
                    {slides[currentSlide]?.imageUrl ? (
                      <img
                        src={slides[currentSlide].imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {slides.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                          disabled={currentSlide === 0}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                          disabled={currentSlide === slides.length - 1}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                          {slides.map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                i === currentSlide ? "bg-white" : "bg-white/50"
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Caption preview */}
                  <div className="p-3">
                    <p className="text-sm whitespace-pre-wrap line-clamp-4">
                      <span className="font-semibold">minhaloja </span>
                      {caption}
                    </p>
                    {hashtags.length > 0 && (
                      <p className="text-sm text-primary mt-1">
                        {hashtags.map(h => `#${h}`).join(' ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-4">
                <h3 className="font-semibold">Editar conteúdo</h3>

                <div className="space-y-2">
                  <Label>Legenda</Label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={6}
                    placeholder="Escreva sua legenda..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>CTA (Call-to-Action)</Label>
                  <Input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="Ex: Compre agora pelo WhatsApp!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hashtags</Label>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setHashtags(hashtags.filter((_, j) => j !== i))}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cupom (opcional)</Label>
                    <Input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="PROMO10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                  Salvar rascunho
                </Button>
                <Button variant="gradient" onClick={() => setScheduleDialogOpen(true)}>
                  <Calendar className="h-4 w-4" />
                  Agendar
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Schedule Dialog */}
        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar publicação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Select value={scheduleTime} onValueChange={setScheduleTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="gradient"
                className="w-full"
                onClick={handleSchedule}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirmar agendamento
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
