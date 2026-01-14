import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Sparkles,
  Clock,
  Image,
  Layers,
  Film,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  GripVertical
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockPosts } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

type ViewMode = "month" | "week";

const formatIcons = {
  carousel: Layers,
  feed: Image,
  stories: Clock,
  reels: Film,
};

const formatLabels = {
  carousel: "Carrossel",
  feed: "Feed",
  stories: "Stories",
  reels: "Reels",
};

const objectiveColors = {
  sell: "bg-primary/20 text-primary border-primary/30",
  engage: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  grow: "bg-green-500/20 text-green-600 border-green-500/30",
  "social-proof": "bg-purple-500/20 text-purple-600 border-purple-500/30",
  reactivate: "bg-amber-500/20 text-amber-600 border-amber-500/30",
};

interface CalendarPost {
  id: string;
  title: string;
  scheduledFor: Date;
  format: "carousel" | "feed" | "stories" | "reels";
  objective: "sell" | "engage" | "grow" | "social-proof" | "reactivate";
  status: "draft" | "scheduled" | "published";
  imageUrl?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedPost, setDraggedPost] = useState<CalendarPost | null>(null);
  const [posts, setPosts] = useState<CalendarPost[]>(() => {
    return mockPosts
      .filter(p => p.status === "scheduled" || p.status === "published")
      .map(p => ({
        id: p.id,
        title: p.caption.substring(0, 50) + "...",
        scheduledFor: new Date(p.scheduledAt || p.publishedAt || new Date()),
        format: p.type as "carousel" | "feed" | "stories" | "reels",
        objective: p.objective,
        status: p.status as "draft" | "scheduled" | "published",
        imageUrl: p.slides?.[0]?.imageUrl,
      }));
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const getDaysForMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getDaysForWeek = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const days = viewMode === "month" ? getDaysForMonth() : getDaysForWeek();

  const getPostsForDay = (date: Date) => {
    return posts.filter(post => isSameDay(post.scheduledFor, date));
  };

  const navigatePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleDragStart = (post: CalendarPost) => {
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (draggedPost) {
      setPosts(prev => prev.map(p => 
        p.id === draggedPost.id 
          ? { ...p, scheduledFor: targetDate }
          : p
      ));
      toast({
        title: "Post reagendado",
        description: `Movido para ${format(targetDate, "dd 'de' MMMM", { locale: ptBR })}`,
      });
      setDraggedPost(null);
    }
  };

  const handlePostClick = (post: CalendarPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleGenerateWeek = () => {
    toast({
      title: "Semana gerada!",
      description: "O piloto automático criou 7 posts para a próxima semana.",
    });
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">
            Visualize e organize seus posts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerateWeek}>
            <Sparkles className="h-4 w-4 mr-2" />
            Gerar semana
          </Button>
          <Button variant="gradient" onClick={() => navigate("/app/posts/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo post
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card rounded-xl border p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold capitalize">
            {format(currentDate, viewMode === "month" ? "MMMM yyyy" : "'Semana de' dd MMM", { locale: ptBR })}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-xl border overflow-hidden"
      >
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className={`grid grid-cols-7 ${viewMode === "month" ? "auto-rows-[120px]" : "auto-rows-[300px]"}`}>
          {days.map((day, index) => {
            const dayPosts = getPostsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={index}
                className={`border-r border-b last:border-r-0 p-2 transition-colors ${
                  !isCurrentMonth ? "bg-muted/30" : ""
                } ${isToday ? "bg-primary/5" : ""}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday 
                    ? "w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center" 
                    : !isCurrentMonth 
                      ? "text-muted-foreground" 
                      : ""
                }`}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
                  {dayPosts.slice(0, viewMode === "month" ? 2 : 10).map((post) => {
                    const FormatIcon = formatIcons[post.format];
                    return (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={() => handleDragStart(post)}
                        onClick={() => handlePostClick(post)}
                        className={`group flex items-center gap-1.5 p-1.5 rounded-md text-xs cursor-pointer border transition-all hover:shadow-sm ${objectiveColors[post.objective]} ${
                          draggedPost?.id === post.id ? "opacity-50" : ""
                        }`}
                      >
                        <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-50 cursor-grab" />
                        <FormatIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate flex-1">{post.title.substring(0, 20)}</span>
                        <span className="text-[10px] opacity-70">
                          {format(post.scheduledFor, "HH:mm")}
                        </span>
                      </div>
                    );
                  })}
                  {dayPosts.length > (viewMode === "month" ? 2 : 10) && (
                    <button 
                      className="text-xs text-muted-foreground hover:text-foreground w-full text-left pl-1"
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode("week");
                      }}
                    >
                      +{dayPosts.length - (viewMode === "month" ? 2 : 10)} mais
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
          <span className="text-muted-foreground">Vender</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
          <span className="text-muted-foreground">Engajar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span className="text-muted-foreground">Crescer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/30" />
          <span className="text-muted-foreground">Prova social</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
          <span className="text-muted-foreground">Reativar</span>
        </div>
      </div>

      {/* Post Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Post</DialogTitle>
            <DialogDescription>
              Agendado para {selectedPost && format(selectedPost.scheduledFor, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4">
              {selectedPost.imageUrl && (
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Badge variant={selectedPost.format}>
                  {formatLabels[selectedPost.format]}
                </Badge>
                <Badge variant="secondary">
                  {selectedPost.objective === "sell" && "Vender"}
                  {selectedPost.objective === "engage" && "Engajar"}
                  {selectedPost.objective === "grow" && "Crescer"}
                  {selectedPost.objective === "social-proof" && "Prova social"}
                  {selectedPost.objective === "reactivate" && "Reativar"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {selectedPost.title}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/app/posts/${selectedPost.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalhes
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={() => {
                    navigate(`/app/posts/${selectedPost.id}`);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
