import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowLeft, Mail, Check } from "lucide-react";
import { authService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email. Verifique o endereço.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">PostaJá</span>
        </Link>

        {isSubmitted ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Email enviado!</h1>
            <p className="text-muted-foreground mb-8">
              Enviamos um link de recuperação para <strong>{email}</strong>. 
              Verifique sua caixa de entrada.
            </p>
            <Link 
              to="/login" 
              className="text-primary hover:underline font-medium inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Esqueceu sua senha?</h1>
            <p className="text-muted-foreground mb-8">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                <Mail className="h-4 w-4" />
              </Button>
            </form>

            <Link 
              to="/login" 
              className="text-sm text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
