import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileSpreadsheet,
  Link as LinkIcon,
  Package,
  Upload,
  Check,
  X,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Store,
} from "lucide-react";
import { productService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const integrations = [
  { id: "shopify", name: "Shopify", icon: ShoppingBag, status: "soon" },
  { id: "woocommerce", name: "WooCommerce", icon: Store, status: "soon" },
  { id: "nuvemshop", name: "Nuvemshop", icon: Store, status: "soon" },
  { id: "tray", name: "Tray", icon: Store, status: "soon" },
];

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState("csv");
  const { toast } = useToast();

  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<{ imported: number; errors: string[] } | null>(null);

  // Link state
  const [importUrl, setImportUrl] = useState("");
  const [urlImporting, setUrlImporting] = useState(false);
  const [urlResult, setUrlResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    setCsvUploading(true);
    try {
      const result = await productService.importCSV(csvFile);
      setCsvResult(result);
      toast({
        title: "Importação concluída!",
        description: `${result.imported} produtos importados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Verifique o formato do arquivo.",
        variant: "destructive",
      });
    } finally {
      setCsvUploading(false);
    }
  };

  const handleUrlImport = async () => {
    if (!importUrl) return;
    setUrlImporting(true);
    try {
      const result = await productService.importFromUrl(importUrl);
      setUrlResult(result);
      toast({
        title: "Importação concluída!",
        description: `${result.imported} produtos importados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível acessar o link.",
        variant: "destructive",
      });
    } finally {
      setUrlImporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Importar produtos</h1>
          <p className="text-muted-foreground">
            Adicione produtos em massa de diferentes fontes.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="csv" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Planilha CSV
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Store className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Package className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          {/* CSV Import */}
          <TabsContent value="csv" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-2 border-dashed rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium mb-1">
                    {csvFile ? csvFile.name : "Arraste seu arquivo ou clique para selecionar"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aceita CSV, XLS e XLSX (máx 5MB)
                  </p>
                </label>
              </div>

              {csvFile && !csvResult && (
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-medium mb-2">Arquivo selecionado</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{csvFile.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCsvFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {csvResult && (
                <div className="p-6 rounded-xl border bg-success/5 border-success/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <Check className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-success mb-1">
                        {csvResult.imported} produtos importados!
                      </h3>
                      {csvResult.errors.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {csvResult.errors.map((err, i) => (
                            <p key={i} className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {err}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" asChild>
                  <a href="#" download>
                    <FileSpreadsheet className="h-4 w-4" />
                    Baixar modelo CSV
                  </a>
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleCsvUpload}
                  disabled={!csvFile || csvUploading}
                >
                  {csvUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      Importar produtos
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={cn(
                      "p-6 rounded-xl border relative",
                      integration.status === "soon" && "opacity-60"
                    )}
                  >
                    {integration.status === "soon" && (
                      <span className="absolute top-3 right-3 text-xs bg-muted px-2 py-1 rounded-full">
                        Em breve
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <integration.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Importe automaticamente
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl border bg-muted/50">
                <div className="flex items-center gap-3 mb-4">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Importar por link</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>URL do seu catálogo ou loja</Label>
                    <Input
                      placeholder="https://minhaloja.com.br/produtos"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                    />
                  </div>
                  {urlResult && (
                    <div className="p-4 rounded-lg bg-success/10 text-success text-sm">
                      {urlResult.imported} produtos importados!
                    </div>
                  )}
                  <Button
                    variant="gradient"
                    onClick={handleUrlImport}
                    disabled={!importUrl || urlImporting}
                  >
                    {urlImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        Importar do link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Manual */}
          <TabsContent value="manual" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cadastro manual</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Adicione produtos um por um preenchendo todas as informações manualmente.
              </p>
              <Button variant="gradient" asChild>
                <Link to="/app/products/new">
                  <Package className="h-4 w-4" />
                  Cadastrar produto
                </Link>
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
