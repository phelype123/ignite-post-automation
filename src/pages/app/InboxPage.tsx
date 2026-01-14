import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyInbox } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Sparkles, Clock, AlertCircle, Check, Loader2 } from "lucide-react";
import { inboxService } from "@/services/api";
import { InboxThread } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const [threads, setThreads] = useState<InboxThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<InboxThread | null>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadThreads(); }, []);

  const loadThreads = async () => {
    try {
      const data = await inboxService.getThreads();
      setThreads(data);
      if (data.length > 0) setSelectedThread(data[0]);
    } catch (error) {
      toast({ title: "Erro ao carregar inbox", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedThread || !reply.trim()) return;
    setIsSending(true);
    try {
      const updated = await inboxService.sendReply(selectedThread.id, reply);
      setThreads(threads.map(t => t.id === updated.id ? updated : t));
      setSelectedThread(updated);
      setReply("");
      toast({ title: "Resposta enviada!" });
    } catch (error) {
      toast({ title: "Erro ao enviar", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const useSuggestedReply = () => {
    const lastMessage = selectedThread?.messages[selectedThread.messages.length - 1];
    if (lastMessage?.suggestedReply) {
      setReply(lastMessage.suggestedReply);
    }
  };

  const unreadCount = threads.filter(t => t.status === 'unread').length;
  const urgentCount = threads.filter(t => t.status === 'urgent').length;

  return (
    <AppLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">Gerencie comentários e mensagens diretas</p>
        </div>

        {threads.length === 0 ? (
          <EmptyInbox />
        ) : (
          <div className="flex-1 flex border rounded-xl overflow-hidden min-h-0">
            {/* Thread list */}
            <div className="w-80 border-r flex flex-col">
              <div className="p-3 border-b flex gap-2">
                <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>{unreadCount} não lidas</Badge>
                {urgentCount > 0 && <Badge variant="warning">{urgentCount} urgentes</Badge>}
              </div>
              <div className="flex-1 overflow-y-auto">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={cn(
                      "w-full p-3 text-left border-b hover:bg-muted/50 transition-colors",
                      selectedThread?.id === thread.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={thread.userAvatar} />
                        <AvatarFallback>{thread.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{thread.userName}</span>
                          {thread.status === 'unread' && <div className="w-2 h-2 rounded-full bg-primary" />}
                          {thread.status === 'urgent' && <AlertCircle className="h-4 w-4 text-warning" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {thread.messages[thread.messages.length - 1]?.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat */}
            {selectedThread && (
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedThread.userAvatar} />
                      <AvatarFallback>{selectedThread.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedThread.userName}</p>
                      <p className="text-xs text-muted-foreground">{selectedThread.type === 'dm' ? 'Mensagem direta' : 'Comentário'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedThread.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedThread.messages.map((msg) => (
                    <div key={msg.id} className={cn("flex", !msg.isFromUser && "justify-end")}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.isFromUser ? "bg-muted" : "bg-primary text-primary-foreground"
                      )}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn("text-xs mt-1", msg.isFromUser ? "text-muted-foreground" : "text-primary-foreground/70")}>
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                <div className="p-4 border-t space-y-3">
                  {selectedThread.messages[selectedThread.messages.length - 1]?.suggestedReply && (
                    <Button variant="outline" size="sm" onClick={useSuggestedReply} className="w-full">
                      <Sparkles className="h-4 w-4" />
                      Usar sugestão da IA
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Digite sua resposta..."
                      rows={2}
                      className="resize-none"
                    />
                    <Button variant="gradient" onClick={handleSendReply} disabled={isSending || !reply.trim()}>
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
