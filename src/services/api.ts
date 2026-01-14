// Mock API Layer - Simulated backend services
// Replace these with real API calls when connecting to backend

import { 
  mockProducts, 
  mockPosts, 
  mockUser, 
  mockStore, 
  mockPlans, 
  mockAutopilotRules, 
  mockInsights, 
  mockInboxThreads,
  generateCalendarEvents,
  type Product,
  type Post,
  type User,
  type Store,
  type Plan,
  type AutopilotRule,
  type InsightMetric,
  type InboxThread,
  type CalendarEvent,
  type UserRole,
} from '@/lib/mock-data';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (10% chance)
const maybeError = () => {
  if (Math.random() < 0.1) {
    throw new Error('Erro de conexão. Tente novamente.');
  }
};

// ============ Auth Service ============
export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(800);
    if (email && password) {
      return { user: mockUser, token: 'mock-jwt-token' };
    }
    throw new Error('Email ou senha inválidos');
  },

  async register(data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    await delay(1000);
    const newUser: User = {
      ...mockUser,
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
    };
    return { user: newUser, token: 'mock-jwt-token' };
  },

  async forgotPassword(email: string): Promise<void> {
    await delay(600);
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
  },

  async logout(): Promise<void> {
    await delay(300);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(400);
    return mockUser;
  },

  async updateRole(role: UserRole): Promise<User> {
    await delay(300);
    return { ...mockUser, role };
  },
};

// ============ Store Service ============
export const storeService = {
  async getStore(): Promise<Store> {
    await delay(400);
    return mockStore;
  },

  async updateStore(data: Partial<Store>): Promise<Store> {
    await delay(600);
    return { ...mockStore, ...data };
  },

  async connectInstagram(): Promise<{ connected: boolean; username: string }> {
    await delay(2000);
    return { connected: true, username: '@minhalojafashion' };
  },

  async disconnectInstagram(): Promise<void> {
    await delay(500);
  },
};

// ============ Product Service ============
export const productService = {
  async getProducts(filters?: { 
    category?: string; 
    status?: string; 
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    await delay(600);
    maybeError();
    
    let filtered = [...mockProducts];
    
    if (filters?.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters?.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.sku.toLowerCase().includes(search)
      );
    }
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    
    return {
      products: filtered.slice(start, start + limit),
      total: filtered.length,
    };
  },

  async getProduct(id: string): Promise<Product> {
    await delay(400);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Produto não encontrado');
    return product;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    await delay(800);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name || 'Novo Produto',
      description: data.description || '',
      price: data.price || 0,
      category: data.category || 'Outros',
      sku: data.sku || `SKU-${Date.now()}`,
      stock: data.stock || 0,
      status: 'active',
      images: data.images || [],
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postsCount: 0,
    };
    return newProduct;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await delay(600);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Produto não encontrado');
    return { ...product, ...data, updatedAt: new Date().toISOString() };
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(500);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Produto não encontrado');
  },

  async importCSV(file: File): Promise<{ imported: number; errors: string[] }> {
    await delay(2000);
    return { imported: 15, errors: [] };
  },

  async importFromUrl(url: string): Promise<{ imported: number; errors: string[] }> {
    await delay(3000);
    return { imported: 8, errors: ['1 produto sem imagem foi ignorado'] };
  },

  async attachMedia(productId: string, imageUrl: string): Promise<Product> {
    await delay(800);
    const product = mockProducts.find(p => p.id === productId);
    if (!product) throw new Error('Produto não encontrado');
    return { ...product, images: [...product.images, imageUrl] };
  },
};

// ============ Post Service ============
export const postService = {
  async getPosts(filters?: {
    status?: Post['status'];
    type?: Post['type'];
    objective?: Post['objective'];
  }): Promise<Post[]> {
    await delay(500);
    let filtered = [...mockPosts];
    
    if (filters?.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters?.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters?.objective) {
      filtered = filtered.filter(p => p.objective === filters.objective);
    }
    
    return filtered;
  },

  async getPost(id: string): Promise<Post> {
    await delay(400);
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post não encontrado');
    return post;
  },

  async generateContent(data: {
    productIds: string[];
    type: Post['type'];
    objective: Post['objective'];
  }): Promise<{ caption: string; cta: string; hashtags: string[]; slides?: Post['slides'] }> {
    await delay(1500);
    
    const captions = {
      sell: '🔥 Promoção imperdível!\n\nAproveite condições especiais por tempo limitado.\n\n💰 Preços que cabem no seu bolso\n📦 Frete grátis acima de R$ 200\n\n📲 Garanta o seu agora mesmo!',
      engage: '💬 Conta pra gente!\n\nQueremos saber sua opinião sobre nossos produtos.\n\nComente aqui embaixo o que você mais gosta na nossa loja! 👇',
      grow: '✨ Novidades chegando!\n\nSiga nossa página para não perder nenhum lançamento.\n\n🔔 Ative as notificações e seja o primeiro a saber!',
      'social-proof': '🌟 Mais um cliente satisfeito!\n\nObrigado pela confiança. Sua satisfação é nossa maior recompensa! ❤️',
      reactivate: '👋 Sentimos sua falta!\n\nFaz tempo que você não aparece por aqui. Temos novidades incríveis esperando por você!',
    };

    const ctas = {
      sell: 'Compre agora pelo WhatsApp!',
      engage: 'Comente sua opinião!',
      grow: 'Siga e ative o sininho!',
      'social-proof': 'Veja mais avaliações',
      reactivate: 'Volte a nos visitar!',
    };

    return {
      caption: captions[data.objective],
      cta: ctas[data.objective],
      hashtags: ['loja', 'promoção', 'vendas', 'moda', 'tendência'],
      slides: data.type === 'carousel' ? [
        { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', text: 'Slide 1' },
        { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', text: 'Slide 2' },
        { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', text: 'Slide 3' },
      ] : undefined,
    };
  },

  async createPost(data: Partial<Post>): Promise<Post> {
    await delay(800);
    const newPost: Post = {
      id: Date.now().toString(),
      productIds: data.productIds || [],
      type: data.type || 'feed',
      objective: data.objective || 'sell',
      status: 'draft',
      caption: data.caption || '',
      cta: data.cta || '',
      hashtags: data.hashtags || [],
      slides: data.slides,
      createdAt: new Date().toISOString(),
    };
    return newPost;
  },

  async updatePost(id: string, data: Partial<Post>): Promise<Post> {
    await delay(600);
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post não encontrado');
    return { ...post, ...data };
  },

  async schedulePost(id: string, scheduledAt: string): Promise<Post> {
    await delay(500);
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post não encontrado');
    return { ...post, status: 'scheduled', scheduledAt };
  },

  async deletePost(id: string): Promise<void> {
    await delay(500);
  },
};

// ============ Calendar Service ============
export const calendarService = {
  async getEvents(month?: number, year?: number): Promise<CalendarEvent[]> {
    await delay(600);
    return generateCalendarEvents();
  },

  async moveEvent(eventId: string, newDate: string, newTime: string): Promise<CalendarEvent> {
    await delay(400);
    const events = generateCalendarEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Evento não encontrado');
    return { ...event, date: newDate, time: newTime };
  },

  async generateWeek(): Promise<CalendarEvent[]> {
    await delay(2000);
    return generateCalendarEvents().slice(0, 7);
  },
};

// ============ Autopilot Service ============
export const autopilotService = {
  async getRules(): Promise<AutopilotRule> {
    await delay(400);
    return mockAutopilotRules;
  },

  async updateRules(rules: Partial<AutopilotRule>): Promise<AutopilotRule> {
    await delay(600);
    return { ...mockAutopilotRules, ...rules };
  },

  async toggle(enabled: boolean): Promise<AutopilotRule> {
    await delay(400);
    return { ...mockAutopilotRules, enabled };
  },

  async simulate(): Promise<Post[]> {
    await delay(1500);
    return mockPosts.slice(0, 10).map(p => ({
      ...p,
      status: 'scheduled' as const,
      scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  },

  async getLogs(): Promise<{ timestamp: string; action: string; status: 'success' | 'error' }[]> {
    await delay(500);
    return [
      { timestamp: new Date().toISOString(), action: 'Post "Vestido Floral" publicado', status: 'success' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Post "Tênis Running" agendado', status: 'success' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'Falha ao publicar - conta desconectada', status: 'error' },
    ];
  },
};

// ============ Insights Service ============
export const insightsService = {
  async getMetrics(): Promise<InsightMetric[]> {
    await delay(600);
    return mockInsights;
  },

  async getRecommendations(): Promise<string[]> {
    await delay(800);
    return [
      'Carrosséis tiveram 45% mais engajamento que posts únicos na sua categoria.',
      'O produto "Tênis Running Pro Max" tem alto potencial esta semana.',
      'Seus seguidores estão mais ativos às 19h. Agende posts nesse horário.',
      'Considere adicionar mais CTAs direcionando para WhatsApp.',
    ];
  },

  async getProductPerformance(): Promise<{ productId: string; name: string; reach: number; clicks: number; conversion: number }[]> {
    await delay(700);
    return mockProducts.slice(0, 10).map(p => ({
      productId: p.id,
      name: p.name,
      reach: Math.floor(Math.random() * 10000),
      clicks: Math.floor(Math.random() * 500),
      conversion: Math.random() * 10,
    }));
  },

  async getChartData(): Promise<{ date: string; reach: number; engagement: number; clicks: number }[]> {
    await delay(500);
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        reach: Math.floor(Math.random() * 5000) + 1000,
        engagement: Math.floor(Math.random() * 500) + 100,
        clicks: Math.floor(Math.random() * 100) + 20,
      });
    }
    return data;
  },
};

// ============ Inbox Service ============
export const inboxService = {
  async getThreads(filters?: { status?: InboxThread['status'] }): Promise<InboxThread[]> {
    await delay(500);
    let filtered = [...mockInboxThreads];
    if (filters?.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    return filtered;
  },

  async getThread(id: string): Promise<InboxThread> {
    await delay(400);
    const thread = mockInboxThreads.find(t => t.id === id);
    if (!thread) throw new Error('Conversa não encontrada');
    return thread;
  },

  async sendReply(threadId: string, message: string): Promise<InboxThread> {
    await delay(600);
    const thread = mockInboxThreads.find(t => t.id === threadId);
    if (!thread) throw new Error('Conversa não encontrada');
    return {
      ...thread,
      status: 'replied',
      messages: [
        ...thread.messages,
        { id: Date.now().toString(), content: message, isFromUser: false, timestamp: new Date().toISOString() },
      ],
    };
  },

  async getSuggestedReply(threadId: string): Promise<string> {
    await delay(800);
    return 'Olá! Obrigado pelo contato. Posso te ajudar com mais informações sobre esse produto!';
  },

  async markAsRead(threadId: string): Promise<void> {
    await delay(300);
  },
};

// ============ Billing Service ============
export const billingService = {
  async getPlans(): Promise<Plan[]> {
    await delay(400);
    return mockPlans;
  },

  async getCurrentPlan(): Promise<Plan> {
    await delay(300);
    return mockPlans.find(p => p.id === 'pro')!;
  },

  async upgradePlan(planId: string): Promise<{ success: boolean; message: string }> {
    await delay(1000);
    return { success: true, message: 'Plano atualizado com sucesso!' };
  },

  async getInvoices(): Promise<{ id: string; date: string; amount: number; status: string }[]> {
    await delay(500);
    return [
      { id: '1', date: '2024-01-01', amount: 197, status: 'paid' },
      { id: '2', date: '2023-12-01', amount: 197, status: 'paid' },
      { id: '3', date: '2023-11-01', amount: 197, status: 'paid' },
    ];
  },
};

// ============ Media Service ============
export const mediaService = {
  async getMedia(): Promise<{ id: string; url: string; productId?: string; createdAt: string }[]> {
    await delay(500);
    return mockProducts.flatMap(p => 
      p.images.map((url, i) => ({
        id: `${p.id}-${i}`,
        url,
        productId: p.id,
        createdAt: p.createdAt,
      }))
    );
  },

  async generateImage(data: { productId: string; style: 'lifestyle' | 'white-bg' | 'promo' }): Promise<string> {
    await delay(2500);
    return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400';
  },

  async uploadImage(file: File): Promise<string> {
    await delay(1500);
    return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400';
  },

  async deleteImage(id: string): Promise<void> {
    await delay(400);
  },
};
