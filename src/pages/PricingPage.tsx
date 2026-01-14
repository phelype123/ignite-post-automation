import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Check, 
  X, 
  Zap, 
  Star, 
  Building2, 
  Rocket,
  ChevronDown,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Para quem está começando",
    icon: Zap,
    monthlyPrice: 97,
    yearlyPrice: 970,
    popular: false,
    features: [
      { name: "1 conta Instagram", included: true },
      { name: "50 produtos", included: true },
      { name: "30 posts/mês", included: true },
      { name: "Geração de legendas IA", included: true },
      { name: "Calendário visual", included: true },
      { name: "Agendamento básico", included: true },
      { name: "Piloto automático", included: false },
      { name: "Geração de imagens IA", included: false },
      { name: "Inbox inteligente", included: false },
      { name: "Relatórios avançados", included: false },
      { name: "Múltiplos usuários", included: false },
      { name: "API access", included: false },
    ],
    cta: "Começar grátis",
    ctaVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para lojas em crescimento",
    icon: Star,
    monthlyPrice: 197,
    yearlyPrice: 1970,
    popular: true,
    features: [
      { name: "1 conta Instagram", included: true },
      { name: "200 produtos", included: true },
      { name: "100 posts/mês", included: true },
      { name: "Geração de legendas IA", included: true },
      { name: "Calendário visual", included: true },
      { name: "Agendamento avançado", included: true },
      { name: "Piloto automático", included: true },
      { name: "Geração de imagens IA", included: true, limit: "50/mês" },
      { name: "Inbox inteligente", included: true },
      { name: "Relatórios avançados", included: false },
      { name: "Múltiplos usuários", included: false },
      { name: "API access", included: false },
    ],
    cta: "Começar agora",
    ctaVariant: "gradient" as const,
  },
  {
    id: "growth",
    name: "Growth",
    description: "Para operações sérias",
    icon: Rocket,
    monthlyPrice: 397,
    yearlyPrice: 3970,
    popular: false,
    features: [
      { name: "3 contas Instagram", included: true },
      { name: "Produtos ilimitados", included: true },
      { name: "Posts ilimitados", included: true },
      { name: "Geração de legendas IA", included: true },
      { name: "Calendário visual", included: true },
      { name: "Agendamento avançado", included: true },
      { name: "Piloto automático", included: true },
      { name: "Geração de imagens IA", included: true, limit: "200/mês" },
      { name: "Inbox inteligente", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Múltiplos usuários", included: true, limit: "5 usuários" },
      { name: "API access", included: false },
    ],
    cta: "Falar com vendas",
    ctaVariant: "outline" as const,
  },
  {
    id: "agency",
    name: "Agency",
    description: "Para agências e grandes operações",
    icon: Building2,
    monthlyPrice: 997,
    yearlyPrice: 9970,
    popular: false,
    features: [
      { name: "10 contas Instagram", included: true },
      { name: "Produtos ilimitados", included: true },
      { name: "Posts ilimitados", included: true },
      { name: "Geração de legendas IA", included: true },
      { name: "Calendário visual", included: true },
      { name: "Agendamento avançado", included: true },
      { name: "Piloto automático", included: true },
      { name: "Geração de imagens IA", included: true, limit: "Ilimitado" },
      { name: "Inbox inteligente", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Múltiplos usuários", included: true, limit: "Ilimitado" },
      { name: "API access", included: true },
    ],
    cta: "Falar com vendas",
    ctaVariant: "outline" as const,
  },
];

const faqs = [
  {
    question: "Posso testar antes de pagar?",
    answer: "Sim! Oferecemos 7 dias grátis em todos os planos. Você pode cancelar a qualquer momento durante o período de teste sem ser cobrado.",
  },
  {
    question: "Como funciona a conexão com o Instagram?",
    answer: "Usamos a API oficial do Instagram/Meta. Você conecta sua conta de forma segura e nós nunca temos acesso à sua senha. A conexão leva menos de 2 minutos.",
  },
  {
    question: "Posso fazer upgrade ou downgrade do plano?",
    answer: "Sim, você pode mudar de plano a qualquer momento. Se fizer upgrade, a diferença é cobrada proporcionalmente. Se fizer downgrade, o crédito fica para os próximos meses.",
  },
  {
    question: "Os posts são publicados automaticamente?",
    answer: "Sim! Com o piloto automático ativado, os posts são publicados nos horários que você definiu, sem precisar de nenhuma ação manual.",
  },
  {
    question: "A IA gera as imagens dos produtos?",
    answer: "Sim! Nossa IA pode criar imagens profissionais para seus produtos em diferentes estilos: lifestyle, fundo branco, banners promocionais e mais.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, não há fidelidade. Você pode cancelar quando quiser e continua tendo acesso até o fim do período pago.",
  },
  {
    question: "Vocês oferecem suporte?",
    answer: "Sim! Todos os planos incluem suporte por chat e email. Planos Growth e Agency têm suporte prioritário com tempo de resposta garantido.",
  },
  {
    question: "Posso importar meus produtos de outras plataformas?",
    answer: "Sim! Suportamos importação via CSV e integrações diretas com Shopify, WooCommerce, Nuvemshop e outras plataformas populares.",
  },
];

const comparisonFeatures = [
  { name: "Contas Instagram", starter: "1", pro: "1", growth: "3", agency: "10" },
  { name: "Produtos", starter: "50", pro: "200", growth: "Ilimitado", agency: "Ilimitado" },
  { name: "Posts por mês", starter: "30", pro: "100", growth: "Ilimitado", agency: "Ilimitado" },
  { name: "Legendas com IA", starter: true, pro: true, growth: true, agency: true },
  { name: "Calendário visual", starter: true, pro: true, growth: true, agency: true },
  { name: "Piloto automático", starter: false, pro: true, growth: true, agency: true },
  { name: "Imagens com IA", starter: false, pro: "50/mês", growth: "200/mês", agency: "Ilimitado" },
  { name: "Inbox inteligente", starter: false, pro: true, growth: true, agency: true },
  { name: "Relatórios avançados", starter: false, pro: false, growth: true, agency: true },
  { name: "Usuários", starter: "1", pro: "1", growth: "5", agency: "Ilimitado" },
  { name: "API access", starter: false, pro: false, growth: false, agency: true },
  { name: "Suporte prioritário", starter: false, pro: false, growth: true, agency: true },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PostaJá</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/register">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="secondary" className="mb-4">
              7 dias grátis em todos os planos
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Escolha o plano ideal para sua loja
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comece grátis e escale conforme seu negócio cresce. 
              Sem surpresas, sem taxas escondidas.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={!isYearly ? "font-medium" : "text-muted-foreground"}>
                Mensal
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={isYearly ? "font-medium" : "text-muted-foreground"}>
                Anual
              </span>
              {isYearly && (
                <Badge variant="default" className="bg-success text-success-foreground">
                  2 meses grátis
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const monthlyEquivalent = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl border bg-card p-6 ${
                    plan.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="bg-primary">
                        Mais popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${plan.popular ? "bg-primary/10" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${plan.popular ? "text-primary" : ""}`} />
                      </div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{formatPrice(monthlyEquivalent)}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(price)} cobrado anualmente
                      </p>
                    )}
                  </div>

                  <Button 
                    variant={plan.ctaVariant} 
                    className="w-full mb-6"
                    onClick={() => navigate("/register")}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>
                          {feature.name}
                          {feature.limit && (
                            <span className="text-muted-foreground"> ({feature.limit})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare os planos</h2>
            <p className="text-muted-foreground">
              Veja em detalhes o que cada plano oferece
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-xl border">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Recurso</th>
                  <th className="p-4 text-center font-medium">Starter</th>
                  <th className="p-4 text-center font-medium bg-primary/5">Pro</th>
                  <th className="p-4 text-center font-medium">Growth</th>
                  <th className="p-4 text-center font-medium">Agency</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.name} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="p-4 font-medium">{feature.name}</td>
                    {["starter", "pro", "growth", "agency"].map((plan) => {
                      const value = feature[plan as keyof typeof feature];
                      return (
                        <td key={plan} className={`p-4 text-center ${plan === "pro" ? "bg-primary/5" : ""}`}>
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="h-5 w-5 text-success mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span>{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas frequentes</h2>
            <p className="text-muted-foreground">
              Tire suas dúvidas sobre nossos planos
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg border px-4"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Pronto para vender mais no Instagram?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Comece grátis hoje e veja seus resultados em poucos dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/register")}
            >
              Começar 7 dias grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar com especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">PostaJá</span>
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
