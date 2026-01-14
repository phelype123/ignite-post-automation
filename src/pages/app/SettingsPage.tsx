import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Store, Instagram, Users, CreditCard, Bell, Palette, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, store, hasPermission } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: "Configurações salvas!" });
    setIsSaving(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="account"><User className="h-4 w-4 mr-2" />Conta</TabsTrigger>
            <TabsTrigger value="store"><Store className="h-4 w-4 mr-2" />Loja</TabsTrigger>
            <TabsTrigger value="instagram"><Instagram className="h-4 w-4 mr-2" />Instagram</TabsTrigger>
            {hasPermission('manage:team') && <TabsTrigger value="team"><Users className="h-4 w-4 mr-2" />Time</TabsTrigger>}
            {hasPermission('view:billing') && <TabsTrigger value="billing"><CreditCard className="h-4 w-4 mr-2" />Faturamento</TabsTrigger>}
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6 space-y-6">
            <div className="p-6 rounded-xl border space-y-4">
              <h3 className="font-semibold">Dados pessoais</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email} type="email" />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border space-y-4">
              <h3 className="font-semibold">Alterar senha</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Senha atual</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Nova senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
            <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Salvar alterações
            </Button>
          </TabsContent>

          <TabsContent value="store" className="mt-6 space-y-6">
            <div className="p-6 rounded-xl border space-y-4">
              <h3 className="font-semibold">Dados da loja</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome da loja</Label><Input defaultValue={store?.name} /></div>
                <div className="space-y-2"><Label>Segmento</Label><Input defaultValue={store?.segment} /></div>
                <div className="space-y-2"><Label>Cidade</Label><Input defaultValue={store?.city} /></div>
                <div className="space-y-2"><Label>WhatsApp</Label><Input defaultValue={store?.whatsapp} /></div>
              </div>
            </div>
            <Button variant="gradient" onClick={handleSave} disabled={isSaving}>Salvar alterações</Button>
          </TabsContent>

          <TabsContent value="instagram" className="mt-6 space-y-6">
            <div className="p-6 rounded-xl border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{store?.instagramUsername || "Não conectado"}</p>
                    <p className="text-sm text-muted-foreground">{store?.instagramConnected ? "Conta conectada" : "Clique para conectar"}</p>
                  </div>
                </div>
                <Badge variant={store?.instagramConnected ? "success" : "secondary"}>
                  {store?.instagramConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6 space-y-6">
            <div className="p-6 rounded-xl border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Membros do time</h3>
                <Button>Convidar membro</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: user?.name || "Você", email: user?.email, role: "Admin" },
                  { name: "Maria Silva", email: "maria@loja.com", role: "Gerente" },
                  { name: "João Santos", email: "joao@loja.com", role: "Operador" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 space-y-6">
            <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2">Plano atual</Badge>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">R$ 197/mês</p>
                </div>
                <Button variant="outline">Fazer upgrade</Button>
              </div>
            </div>
            <div className="p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Histórico de faturas</h3>
              <div className="space-y-2">
                {[{ date: "01/01/2024", amount: "R$ 197,00", status: "Pago" }, { date: "01/12/2023", amount: "R$ 197,00", status: "Pago" }].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">{inv.date}</span>
                    <span className="font-medium">{inv.amount}</span>
                    <Badge variant="success">{inv.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="p-6 rounded-xl border space-y-4">
              <h3 className="font-semibold">Notificações</h3>
              {[
                { label: "Post publicado", desc: "Receber notificação quando um post for publicado" },
                { label: "Novas mensagens", desc: "Alertas de novos comentários e DMs" },
                { label: "Relatório semanal", desc: "Resumo de performance por email" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
