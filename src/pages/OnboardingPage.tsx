import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  Store, 
  Instagram, 
  Package, 
  Calendar, 
  Rocket,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Link as LinkIcon,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const steps = [
  { id: 1, title: "Sua loja", icon: Store },
  { id: 2, title: "Instagram", icon: Instagram },
  { id: 3, title: "Produtos", icon: Package },
  { id: 4, title: "Calendário", icon: Calendar },
  { id: 5, title: "Ativar", icon: Rocket },
];

const segments = [
  "Moda Feminina",
  "Moda Masculina",
  "Calçados",
  "Acessórios",
  "Cosméticos",
  "Eletrônicos",
  "Casa & Decoração",
  "Alimentos",
  "Pet Shop",
  "Infantil",
  "Esportes",
  "Outro",
];

const weekDays = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

const postTimes = ["09:00", "12:00", "15:00", "18:00", "21:00"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: Store data
  const [storeName, setStoreName] = useState("");
  const [segment, setSegment] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Step 2: Instagram
  const [instagramStatus, setInstagramStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");

  // Step 3: Import method
  const [importMethod, setImportMethod] = useState<"csv" | "link" | "manual" | null>(null);

  // Step 4: Calendar
  const [selectedDays, setSelectedDays] = useState<string[]>(["seg", "qua", "sex"]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["12:00", "18:00"]);

  // Step 5: Autopilot
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnectInstagram = async () => {
    setInstagramStatus("connecting");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setInstagramStatus("connected");
    toast({
      title: "Instagram conectado!",
      description: "@minhaloja foi conectado com sucesso.",
    });
  };

  const handleFinish = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem("postaja-token", "mock-token");
    toast({
      title: "Tudo pronto! 🎉",
      description: "Sua loja está configurada. Vamos vender!",
    });
    navigate("/app");
  };

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return storeName && segment && city && whatsapp;
      case 2:
        return true; // Instagram is optional
      case 3:
        return true; // Can skip import
      case 4:
        return selectedDays.length > 0 && selectedTimes.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left sidebar with steps */}
      <div className="hidden lg:flex w-80 bg-muted/30 border-r flex-col p-6">
        <div className="flex items-center gap-2 mb-12">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">PostaJá</span>
        </div>

        <nav className="space-y-2">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "text-muted-foreground",
                  !isActive && !isCompleted && "text-muted-foreground/60"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  isActive && "bg-primary-foreground/20",
                  isCompleted && "bg-success/20",
                  !isActive && !isCompleted && "bg-muted"
                )}>
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className="font-medium">{step.title}</span>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto">
          <p className="text-sm text-muted-foreground">
            Passo {currentStep} de {steps.length}
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Step 1: Store Data */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold mb-2">Vamos começar!</h1>
                  <p className="text-muted-foreground">
                    Conte um pouco sobre sua loja para personalizarmos sua experiência.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nome da loja</Label>
                    <Input
                      id="storeName"
                      placeholder="Ex: Moda Fashion Store"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="segment">Segmento</Label>
                    <Select value={segment} onValueChange={setSegment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((seg) => (
                          <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="Ex: São Paulo, SP"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp da loja</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Instagram */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold mb-2">Conectar Instagram</h1>
                  <p className="text-muted-foreground">
                    Conecte sua conta comercial do Instagram para publicar automaticamente.
                  </p>
                </div>

                <div className="p-8 border rounded-xl text-center">
                  {instagramStatus === "disconnected" && (
                    <>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                        <Instagram className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Instagram não conectado</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Conecte para publicar seus posts automaticamente.
                      </p>
                      <Button variant="gradient" onClick={handleConnectInstagram}>
                        <Instagram className="h-4 w-4" />
                        Conectar Instagram
                      </Button>
                    </>
                  )}

                  {instagramStatus === "connecting" && (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Conectando...</h3>
                      <p className="text-sm text-muted-foreground">
                        Aguarde enquanto conectamos sua conta.
                      </p>
                    </>
                  )}

                  {instagramStatus === "connected" && (
                    <>
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="font-semibold mb-2">Instagram conectado!</h3>
                      <p className="text-sm text-muted-foreground">
                        @minhaloja está pronto para receber seus posts.
                      </p>
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Você pode pular esta etapa e conectar depois nas configurações.
                </p>
              </motion.div>
            )}

            {/* Step 3: Import Products */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold mb-2">Importar produtos</h1>
                  <p className="text-muted-foreground">
                    Como você gostaria de adicionar seus produtos?
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { id: "csv", icon: FileSpreadsheet, title: "Planilha CSV", desc: "Importe de um arquivo Excel ou CSV" },
                    { id: "link", icon: LinkIcon, title: "Link da loja", desc: "Importar do seu site ou marketplace" },
                    { id: "manual", icon: Package, title: "Cadastrar manual", desc: "Adicione produtos um por um" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setImportMethod(method.id as any)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                        importMethod === method.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "hover:border-primary/50"
                      )}
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <method.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{method.title}</p>
                        <p className="text-sm text-muted-foreground">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Você pode importar mais produtos depois em Produtos → Importar.
                </p>
              </motion.div>
            )}

            {/* Step 4: Calendar */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold mb-2">Calendário de posts</h1>
                  <p className="text-muted-foreground">
                    Defina os dias e horários em que você quer publicar.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Dias da semana</Label>
                    <div className="flex gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => toggleDay(day.id)}
                          className={cn(
                            "w-12 h-12 rounded-lg font-medium transition-all",
                            selectedDays.includes(day.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                      {postTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => toggleTime(time)}
                          className={cn(
                            "px-4 py-2 rounded-lg font-medium transition-all",
                            selectedTimes.includes(time)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{selectedDays.length * selectedTimes.length}</strong> posts por semana
                      {" "}({selectedDays.length} dias × {selectedTimes.length} horários)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Activate */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                    <Rocket className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Tudo pronto!</h1>
                  <p className="text-muted-foreground">
                    Revise suas configurações e ative o piloto automático.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loja</span>
                    <span className="font-medium">{storeName || "Minha Loja"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Segmento</span>
                    <span className="font-medium">{segment || "Moda"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instagram</span>
                    <span className="font-medium">
                      {instagramStatus === "connected" ? "@minhaloja ✓" : "Não conectado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posts/semana</span>
                    <span className="font-medium">{selectedDays.length * selectedTimes.length}</span>
                  </div>
                </div>

                <div 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                    autopilotEnabled ? "border-primary bg-primary/5" : ""
                  )}
                  onClick={() => setAutopilotEnabled(!autopilotEnabled)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      autopilotEnabled ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Zap className={cn("h-5 w-5", autopilotEnabled ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="font-medium">Piloto automático</p>
                      <p className="text-sm text-muted-foreground">Criar e agendar posts automaticamente</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-12 h-7 rounded-full transition-colors relative",
                    autopilotEnabled ? "bg-primary" : "bg-muted"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all",
                      autopilotEnabled ? "left-6" : "left-1"
                    )} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>

            {currentStep < 5 ? (
              <Button 
                variant="gradient" 
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="gradient" 
                onClick={handleFinish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ativando...
                  </>
                ) : (
                  <>
                    Ativar e começar
                    <Rocket className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
