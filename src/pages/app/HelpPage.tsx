import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Mail,
  ChevronRight,
  Play,
  FileText,
  Zap,
  Calendar,
  Image,
  Settings,
  Users,
  CreditCard,
  Instagram,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const categories = [
  {
    id: "getting-started",
    name: "Primeiros passos",
    icon: Zap,
    color: "text-primary",
    articles: [
      { title: "Como criar sua conta", duration: "2 min" },
      { title: "Conectando sua conta do Instagram", duration: "3 min" },
      { title: "Importando seus produtos", duration: "5 min" },
      { title: "Criando seu primeiro post", duration: "4 min" },
      { title: "Entendendo o dashboard", duration: "3 min" },
    ],
  },
  {
    id: "products",
    name: "Produtos",
    icon: FileText,
    color: "text-blue-500",
    articles: [
      { title: "Adicionando produtos manualmente", duration: "3 min" },
      { title: "Importação via CSV", duration: "4 min" },
      { title: "Integrações com e-commerce", duration: "5 min" },
      { title: "Gerenciando categorias e tags", duration: "3 min" },
      { title: "Atualizando preços em massa", duration: "2 min" },
    ],
  },
  {
    id: "content",
    name: "Criação de conteúdo",
    icon: Image,
    color: "text-green-500",
    articles: [
      { title: "Tipos de post e quando usar", duration: "5 min" },
      { title: "Gerando legendas com IA", duration: "3 min" },
      { title: "Criando carrosséis efetivos", duration: "6 min" },
      { title: "Usando a biblioteca de mídia", duration: "4 min" },
      { title: "Gerando imagens com IA", duration: "4 min" },
    ],
  },
  {
    id: "calendar",
    name: "Calendário e agendamento",
    icon: Calendar,
    color: "text-purple-500",
    articles: [
      { title: "Usando o calendário visual", duration: "3 min" },
      { title: "Agendando posts", duration: "2 min" },
      { title: "Reagendando com drag-and-drop", duration: "2 min" },
      { title: "Melhores horários para postar", duration: "4 min" },
      { title: "Gerando uma semana automaticamente", duration: "3 min" },
    ],
  },
  {
    id: "autopilot",
    name: "Piloto automático",
    icon: Sparkles,
    color: "text-amber-500",
    articles: [
      { title: "O que é o piloto automático", duration: "4 min" },
      { title: "Configurando regras de publicação", duration: "5 min" },
      { title: "Definindo objetivos e frequência", duration: "4 min" },
      { title: "Rodízio de produtos", duration: "3 min" },
      { title: "Monitorando a execução", duration: "3 min" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    articles: [
      { title: "Requisitos para conectar", duration: "2 min" },
      { title: "Conta pessoal vs profissional", duration: "3 min" },
      { title: "Reconectando sua conta", duration: "2 min" },
      { title: "Limitações da API do Instagram", duration: "4 min" },
      { title: "Resolvendo problemas de conexão", duration: "5 min" },
    ],
  },
  {
    id: "team",
    name: "Time e permissões",
    icon: Users,
    color: "text-cyan-500",
    articles: [
      { title: "Convidando membros", duration: "2 min" },
      { title: "Níveis de permissão", duration: "3 min" },
      { title: "Gerenciando acessos", duration: "3 min" },
      { title: "Removendo membros", duration: "2 min" },
    ],
  },
  {
    id: "billing",
    name: "Pagamento e planos",
    icon: CreditCard,
    color: "text-emerald-500",
    articles: [
      { title: "Planos disponíveis", duration: "3 min" },
      { title: "Fazendo upgrade", duration: "2 min" },
      { title: "Atualizando forma de pagamento", duration: "2 min" },
      { title: "Cancelando assinatura", duration: "2 min" },
      { title: "Notas fiscais", duration: "2 min" },
    ],
  },
];

const videoTutorials = [
  {
    title: "Tour completo pelo PostaJá",
    duration: "8:32",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
  },
  {
    title: "Criando posts que vendem",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
  },
  {
    title: "Configurando o piloto automático",
    duration: "6:18",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
  },
  {
    title: "Importando produtos do Shopify",
    duration: "4:52",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",
  },
];

const faqs = [
  {
    question: "Por que meus posts não estão sendo publicados?",
    answer: "Verifique se sua conta do Instagram está conectada corretamente em Configurações > Instagram. Também certifique-se de que sua conta é profissional (Business ou Creator) e que você autorizou todas as permissões necessárias.",
  },
  {
    question: "Como funciona a geração de imagens com IA?",
    answer: "Nossa IA cria imagens profissionais baseadas nas fotos dos seus produtos. Você escolhe o estilo (lifestyle, fundo branco, banner promocional) e a IA gera variações. As imagens geradas ficam salvas na biblioteca de mídia.",
  },
  {
    question: "Posso agendar posts para Stories e Reels?",
    answer: "Sim! O PostaJá suporta agendamento para Feed, Carrossel, Stories e Reels. Para Reels, você precisa ter o vídeo pronto - ainda não geramos vídeos automaticamente.",
  },
  {
    question: "O que acontece se eu ultrapassar o limite de posts?",
    answer: "Quando você atinge o limite do seu plano, os posts ficam como rascunho até o próximo ciclo ou até você fazer upgrade. Você receberá um aviso quando estiver próximo do limite.",
  },
  {
    question: "Como o piloto automático escolhe os produtos?",
    answer: "O algoritmo considera: desempenho histórico do produto, tempo desde o último post, estoque disponível, categoria e as regras que você configurou (priorizar campeões, girar estoque, destacar novos).",
  },
  {
    question: "Posso usar o PostaJá em mais de uma loja?",
    answer: "Sim! Os planos Growth e Agency permitem múltiplas contas Instagram. Cada conta pode ter seus próprios produtos e configurações de piloto automático.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Mensagem enviada!",
      description: "Nosso time responderá em até 24 horas.",
    });

    setSupportForm({ subject: "", category: "", message: "" });
    setIsSubmitting(false);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.articles.some(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Como podemos ajudar?</h1>
        <p className="text-muted-foreground mb-6">
          Encontre tutoriais, guias e respostas para suas dúvidas
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar na central de ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Documentação</p>
              <p className="text-sm text-muted-foreground">Guias completos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Video className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Vídeos</p>
              <p className="text-sm text-muted-foreground">Tutoriais práticos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <MessageCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Chat</p>
              <p className="text-sm text-muted-foreground">Suporte ao vivo</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Mail className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">Fale conosco</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categorias</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted`}>
                        <Icon className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.articles.length} artigos
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Category Articles */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {categories.find(c => c.id === selectedCategory)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {categories
                    .find(c => c.id === selectedCategory)
                    ?.articles.map((article, index) => (
                      <li 
                        key={index}
                        className="py-3 flex items-center justify-between hover:bg-muted/50 -mx-4 px-4 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{article.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-sm">{article.duration}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Video Tutorials */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Vídeos populares</h2>
          <Button variant="ghost" size="sm">
            Ver todos
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {videoTutorials.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden cursor-pointer group">
                <div className="relative aspect-video">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-5 w-5 text-foreground ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Perguntas frequentes</h2>
        <Card>
          <CardContent className="p-0">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Contact Support */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Falar com suporte</h2>
        <Card>
          <CardHeader>
            <CardTitle>Envie sua mensagem</CardTitle>
            <CardDescription>
              Nossa equipe responde em até 24 horas úteis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    placeholder="Resumo do problema"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    value={supportForm.category}
                    onValueChange={(value) => setSupportForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Problema técnico</SelectItem>
                      <SelectItem value="billing">Pagamento</SelectItem>
                      <SelectItem value="account">Conta</SelectItem>
                      <SelectItem value="feature">Sugestão</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva sua dúvida ou problema em detalhes..."
                  rows={5}
                  value={supportForm.message}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="gradient" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                  <Mail className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
