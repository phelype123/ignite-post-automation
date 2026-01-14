import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Instagram,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  ChevronDown,
  Menu,
  X,
  Play,
  Users,
  Clock,
  Target,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Instagram,
    title: "Conecte seu Instagram",
    description: "Integração segura com a API oficial. Conecte sua conta em segundos.",
  },
  {
    icon: Sparkles,
    title: "IA cria seus posts",
    description: "Legendas persuasivas, CTAs que convertem e hashtags otimizadas automaticamente.",
  },
  {
    icon: Calendar,
    title: "Agende e relaxe",
    description: "Calendário visual para organizar seu conteúdo. A publicação é automática.",
  },
];

const benefits = [
  { icon: Clock, text: "Economize 10+ horas por semana" },
  { icon: TrendingUp, text: "Aumente seu alcance em até 3x" },
  { icon: Target, text: "Posts otimizados para vendas" },
  { icon: Shield, text: "100% seguro e oficial" },
];

const testimonials = [
  {
    name: "Carla Mendes",
    role: "Dona da Boutique CM",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    content: "Antes eu perdia o dia todo criando posts. Agora em 30 minutos eu organizo a semana inteira!",
    stars: 5,
  },
  {
    name: "Roberto Silva",
    role: "Gerente de E-commerce",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    content: "O piloto automático é incrível. Nossas vendas pelo Instagram triplicaram em 2 meses.",
    stars: 5,
  },
  {
    name: "Ana Paula",
    role: "Loja de Cosméticos",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    content: "As legendas geradas são perfeitas! Meus clientes adoram e sempre perguntam no WhatsApp.",
    stars: 5,
  },
];

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    description: "Perfeito para começar",
    features: ["50 produtos", "30 posts/mês", "1 usuário", "Suporte email"],
  },
  {
    name: "Pro",
    price: "R$ 197",
    description: "O mais popular",
    features: ["200 produtos", "100 posts/mês", "Piloto automático", "3 usuários", "Insights avançados"],
    popular: true,
  },
  {
    name: "Growth",
    price: "R$ 397",
    description: "Para escalar",
    features: ["500 produtos", "Posts ilimitados", "10 usuários", "API de integração", "Gerente dedicado"],
  },
];

const faqs = [
  {
    question: "Preciso ter muitos seguidores para usar?",
    answer: "Não! O PostaJá funciona para qualquer tamanho de perfil. Na verdade, ele ajuda você a crescer de forma consistente.",
  },
  {
    question: "É seguro conectar meu Instagram?",
    answer: "Sim! Usamos apenas a API oficial do Instagram/Meta. Não armazenamos sua senha.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Claro! Sem multas ou burocracia. Você pode cancelar diretamente no painel.",
  },
  {
    question: "E se eu precisar de ajuda?",
    answer: "Temos suporte por email, chat e WhatsApp. Planos maiores têm gerente de sucesso dedicado.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PostaJá</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Como funciona
            </a>
            <a href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Button variant="gradient" asChild>
              <Link to="/register">
                Começar grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t bg-background p-4 space-y-4"
          >
            <a href="#como-funciona" className="block text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Como funciona
            </a>
            <a href="#precos" className="block text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Preços
            </a>
            <Link to="/login" className="block text-sm font-medium">Entrar</Link>
            <Button variant="gradient" className="w-full" asChild>
              <Link to="/register">Começar grátis</Link>
            </Button>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container relative mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Inteligência artificial para seu Instagram
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Seu Instagram vende no{" "}
              <span className="gradient-text">piloto automático</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Importe seus produtos, deixe a IA criar posts irresistíveis e agende para a semana toda. 
              Venda mais enquanto foca no que importa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Começar grátis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#como-funciona">
                  <Play className="h-5 w-5" />
                  Ver como funciona
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <benefit.icon className="h-4 w-4 text-primary" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em 3 passos simples você coloca seu Instagram no piloto automático
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-8 border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quem usa, ama
            </h2>
            <p className="text-lg text-muted-foreground">
              Milhares de lojistas já transformaram seu Instagram em máquina de vendas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha seu plano
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece grátis por 7 dias. Cancele quando quiser.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "bg-card rounded-2xl p-8 border relative",
                  plan.popular && "border-primary shadow-glow"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais popular
                  </Badge>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? "gradient" : "outline"} 
                  className="w-full"
                  asChild
                >
                  <Link to="/register">Começar agora</Link>
                </Button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Precisa de mais? Conheça o plano{" "}
            <Link to="/pricing" className="text-primary hover:underline">Agency</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                >
                  {faq.question}
                  <ChevronDown className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    openFaq === i && "rotate-180"
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para vender mais no Instagram?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Junte-se a milhares de lojistas que já automatizaram suas vendas.
            </p>
            <Button size="xl" variant="secondary" asChild>
              <Link to="/register">
                Começar grátis agora
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">PostaJá</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Suporte</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PostaJá. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
