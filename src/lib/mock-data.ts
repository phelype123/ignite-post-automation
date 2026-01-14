// Mock Data - Realistic fake data for PostaJá SaaS

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  sku: string;
  stock: number;
  status: 'active' | 'inactive' | 'archived';
  images: string[];
  tags: string[];
  margin?: number;
  createdAt: string;
  updatedAt: string;
  postsCount: number;
}

export interface Post {
  id: string;
  productIds: string[];
  type: 'feed' | 'carousel' | 'stories' | 'reels';
  objective: 'sell' | 'engage' | 'grow' | 'social-proof' | 'reactivate';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  caption: string;
  cta: string;
  hashtags: string[];
  slides?: { imageUrl: string; text?: string }[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  metrics?: {
    reach: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    clicks: number;
  };
}

export interface CalendarEvent {
  id: string;
  postId: string;
  date: string;
  time: string;
  type: Post['type'];
  objective: Post['objective'];
  status: Post['status'];
  productName: string;
  thumbnail: string;
}

export interface AutopilotRule {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    days: string[];
    times: string[];
  };
  objectives: {
    sell: number;
    engage: number;
    grow: number;
    socialProof: number;
  };
  productRotation: 'champions' | 'rotate-stock' | 'new-first' | 'balanced';
  avoidRepetitionDays: number;
  maxPromotionalPerWeek: number;
}

export interface InsightMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
}

export interface InboxThread {
  id: string;
  type: 'comment' | 'dm';
  userName: string;
  userAvatar: string;
  postId?: string;
  messages: {
    id: string;
    content: string;
    isFromUser: boolean;
    timestamp: string;
    suggestedReply?: string;
  }[];
  status: 'unread' | 'read' | 'replied' | 'urgent';
  tags: string[];
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  limits: {
    products: number;
    posts: number;
    users: number;
    autopilot: boolean;
    aiGeneration: number;
  };
  popular?: boolean;
}

// Categories
export const categories = [
  'Roupas',
  'Calçados',
  'Acessórios',
  'Eletrônicos',
  'Casa & Decoração',
  'Beleza',
  'Esportes',
  'Alimentos',
];

// Generate mock products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Primavera',
    description: 'Vestido midi com estampa floral delicada, perfeito para ocasiões especiais.',
    price: 189.90,
    originalPrice: 249.90,
    category: 'Roupas',
    subcategory: 'Vestidos',
    sku: 'VF-001',
    stock: 45,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    tags: ['primavera', 'floral', 'midi', 'promoção'],
    margin: 42,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    postsCount: 8,
  },
  {
    id: '2',
    name: 'Tênis Running Pro Max',
    description: 'Tênis de corrida com tecnologia de amortecimento avançada.',
    price: 459.90,
    category: 'Calçados',
    subcategory: 'Esportivos',
    sku: 'TR-002',
    stock: 23,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    tags: ['corrida', 'esporte', 'conforto'],
    margin: 35,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    postsCount: 12,
  },
  {
    id: '3',
    name: 'Bolsa Couro Premium',
    description: 'Bolsa de couro legítimo com acabamento artesanal.',
    price: 599.90,
    originalPrice: 799.90,
    category: 'Acessórios',
    subcategory: 'Bolsas',
    sku: 'BC-003',
    stock: 12,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    tags: ['couro', 'premium', 'artesanal', 'promoção'],
    margin: 55,
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    postsCount: 15,
  },
  {
    id: '4',
    name: 'Fone Bluetooth Elite',
    description: 'Fone de ouvido bluetooth com cancelamento de ruído ativo.',
    price: 349.90,
    category: 'Eletrônicos',
    subcategory: 'Áudio',
    sku: 'FB-004',
    stock: 67,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    tags: ['bluetooth', 'wireless', 'premium'],
    margin: 40,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-21T09:30:00Z',
    postsCount: 20,
  },
  {
    id: '5',
    name: 'Luminária Design Nórdico',
    description: 'Luminária de mesa com design escandinavo minimalista.',
    price: 279.90,
    category: 'Casa & Decoração',
    subcategory: 'Iluminação',
    sku: 'LN-005',
    stock: 34,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'],
    tags: ['decoração', 'nórdico', 'minimalista'],
    margin: 48,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
    postsCount: 6,
  },
  {
    id: '6',
    name: 'Kit Skincare Completo',
    description: 'Kit com 5 produtos para rotina completa de cuidados com a pele.',
    price: 399.90,
    originalPrice: 499.90,
    category: 'Beleza',
    subcategory: 'Skincare',
    sku: 'SK-006',
    stock: 28,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    tags: ['skincare', 'kit', 'rotina', 'promoção'],
    margin: 52,
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-23T08:45:00Z',
    postsCount: 18,
  },
  {
    id: '7',
    name: 'Jaqueta Jeans Oversized',
    description: 'Jaqueta jeans com corte moderno e lavagem vintage.',
    price: 259.90,
    category: 'Roupas',
    subcategory: 'Casacos',
    sku: 'JJ-007',
    stock: 19,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
    tags: ['jeans', 'oversized', 'vintage'],
    margin: 45,
    createdAt: '2024-01-16T10:30:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
    postsCount: 9,
  },
  {
    id: '8',
    name: 'Relógio Smart Fitness',
    description: 'Smartwatch com monitor cardíaco e GPS integrado.',
    price: 699.90,
    category: 'Eletrônicos',
    subcategory: 'Wearables',
    sku: 'RS-008',
    stock: 41,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    tags: ['smart', 'fitness', 'gps', 'saúde'],
    margin: 38,
    createdAt: '2024-01-07T12:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    postsCount: 22,
  },
  {
    id: '9',
    name: 'Sandália Rasteira Trançada',
    description: 'Sandália artesanal com tiras trançadas em couro.',
    price: 159.90,
    category: 'Calçados',
    subcategory: 'Sandálias',
    sku: 'SR-009',
    stock: 56,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'],
    tags: ['verão', 'artesanal', 'couro'],
    margin: 50,
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
    postsCount: 5,
  },
  {
    id: '10',
    name: 'Vaso Cerâmica Artesanal',
    description: 'Vaso decorativo feito à mão com acabamento rústico.',
    price: 189.90,
    category: 'Casa & Decoração',
    subcategory: 'Vasos',
    sku: 'VC-010',
    stock: 22,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'],
    tags: ['artesanal', 'cerâmica', 'rústico'],
    margin: 60,
    createdAt: '2024-01-11T15:00:00Z',
    updatedAt: '2024-01-19T10:30:00Z',
    postsCount: 4,
  },
];

// Generate more products
for (let i = 11; i <= 30; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  mockProducts.push({
    id: String(i),
    name: `Produto ${i} - ${category}`,
    description: `Descrição detalhada do produto ${i} da categoria ${category}.`,
    price: Math.floor(Math.random() * 500) + 50,
    category,
    sku: `PRD-${String(i).padStart(3, '0')}`,
    stock: Math.floor(Math.random() * 100),
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=400`],
    tags: ['tag1', 'tag2'],
    margin: Math.floor(Math.random() * 30) + 30,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    postsCount: Math.floor(Math.random() * 20),
  });
}

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    productIds: ['1'],
    type: 'carousel',
    objective: 'sell',
    status: 'published',
    caption: '🌸 Chegou a estação mais linda do ano e com ela o nosso Vestido Floral Primavera!\n\nPerfeito para ocasiões especiais, com estampa delicada e caimento impecável.\n\n✨ De R$ 249,90 por apenas R$ 189,90\n\n📲 Garanta o seu pelo link na bio ou chame no WhatsApp!',
    cta: 'Compre agora pelo WhatsApp!',
    hashtags: ['modafeminina', 'vestido', 'primavera', 'promoção', 'lookdodia'],
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', text: 'Vestido Floral' },
      { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', text: 'Detalhes' },
      { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', text: 'Cores' },
    ],
    publishedAt: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-19T10:00:00Z',
    metrics: {
      reach: 12500,
      likes: 847,
      comments: 62,
      saves: 234,
      shares: 45,
      clicks: 189,
    },
  },
  {
    id: '2',
    productIds: ['4'],
    type: 'feed',
    objective: 'engage',
    status: 'scheduled',
    caption: '🎧 Música na veia, foco total!\n\nNosso Fone Bluetooth Elite tem cancelamento de ruído ativo para você se concentrar no que importa.\n\n💰 R$ 349,90\n\nQuem aí também não vive sem música? Conta pra gente! 🎵',
    cta: 'Saiba mais',
    hashtags: ['fone', 'bluetooth', 'música', 'focototal', 'tecnologia'],
    scheduledAt: '2024-01-25T18:00:00Z',
    createdAt: '2024-01-22T09:00:00Z',
  },
  {
    id: '3',
    productIds: ['3'],
    type: 'stories',
    objective: 'sell',
    status: 'draft',
    caption: 'Bolsa que é puro luxo 👜✨\n\nCouro legítimo + acabamento artesanal = perfeição!\n\nArraste pra cima e garanta a sua com 25% OFF!',
    cta: 'Arraste pra cima',
    hashtags: ['bolsa', 'couro', 'luxo'],
    createdAt: '2024-01-23T11:00:00Z',
  },
];

// Generate more posts
const objectives: Post['objective'][] = ['sell', 'engage', 'grow', 'social-proof', 'reactivate'];
const types: Post['type'][] = ['feed', 'carousel', 'stories', 'reels'];
const statuses: Post['status'][] = ['draft', 'scheduled', 'published'];

for (let i = 4; i <= 40; i++) {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const productId = String(Math.floor(Math.random() * 10) + 1);
  
  mockPosts.push({
    id: String(i),
    productIds: [productId],
    type: types[Math.floor(Math.random() * types.length)],
    objective: objectives[Math.floor(Math.random() * objectives.length)],
    status,
    caption: `Post ${i} - Descrição automática do post para o produto.`,
    cta: 'Compre agora!',
    hashtags: ['loja', 'promoção', 'vendas'],
    scheduledAt: status === 'scheduled' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    publishedAt: status === 'published' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: status === 'published' ? {
      reach: Math.floor(Math.random() * 20000),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      saves: Math.floor(Math.random() * 300),
      shares: Math.floor(Math.random() * 50),
      clicks: Math.floor(Math.random() * 200),
    } : undefined,
  });
}

// Mock calendar events
export const generateCalendarEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 10);
    const product = mockProducts[Math.floor(Math.random() * 10)];
    
    events.push({
      id: `event-${i}`,
      postId: String(i + 1),
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 8}:00`,
      type: types[Math.floor(Math.random() * types.length)],
      objective: objectives[Math.floor(Math.random() * objectives.length)],
      status: date < now ? 'published' : 'scheduled',
      productName: product.name,
      thumbnail: product.images[0],
    });
  }
  
  return events;
};

// Mock autopilot rules
export const mockAutopilotRules: AutopilotRule = {
  id: 'main',
  name: 'Configuração Principal',
  enabled: true,
  schedule: {
    days: ['seg', 'ter', 'qua', 'qui', 'sex'],
    times: ['10:00', '14:00', '19:00'],
  },
  objectives: {
    sell: 50,
    engage: 30,
    grow: 15,
    socialProof: 5,
  },
  productRotation: 'balanced',
  avoidRepetitionDays: 14,
  maxPromotionalPerWeek: 10,
};

// Mock insight metrics
export const mockInsights: InsightMetric[] = [
  { label: 'Alcance Total', value: 45230, change: 12.5, changeType: 'increase', period: 'vs. semana passada' },
  { label: 'Engajamento', value: 3847, change: 8.2, changeType: 'increase', period: 'vs. semana passada' },
  { label: 'Cliques WhatsApp', value: 234, change: -3.1, changeType: 'decrease', period: 'vs. semana passada' },
  { label: 'Novos Seguidores', value: 156, change: 22.0, changeType: 'increase', period: 'vs. semana passada' },
];

// Mock inbox threads
export const mockInboxThreads: InboxThread[] = [
  {
    id: '1',
    type: 'dm',
    userName: 'Maria Silva',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    messages: [
      {
        id: 'm1',
        content: 'Oi! Vocês tem esse vestido no tamanho M?',
        isFromUser: true,
        timestamp: '2024-01-23T10:30:00Z',
        suggestedReply: 'Olá Maria! Sim, temos o vestido no tamanho M. Posso reservar para você?',
      },
    ],
    status: 'unread',
    tags: ['tamanho', 'vestido'],
    createdAt: '2024-01-23T10:30:00Z',
  },
  {
    id: '2',
    type: 'comment',
    userName: 'João Santos',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    postId: '1',
    messages: [
      {
        id: 'm2',
        content: 'Qual o valor do frete para SP?',
        isFromUser: true,
        timestamp: '2024-01-23T09:15:00Z',
        suggestedReply: 'Olá João! O frete para SP capital é grátis acima de R$ 200. Posso te ajudar com mais alguma coisa?',
      },
    ],
    status: 'urgent',
    tags: ['frete', 'preço'],
    createdAt: '2024-01-23T09:15:00Z',
  },
  {
    id: '3',
    type: 'dm',
    userName: 'Ana Costa',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    messages: [
      {
        id: 'm3',
        content: 'Amei a bolsa! Aceita parcelamento?',
        isFromUser: true,
        timestamp: '2024-01-22T16:45:00Z',
      },
      {
        id: 'm4',
        content: 'Sim, parcelamos em até 12x sem juros!',
        isFromUser: false,
        timestamp: '2024-01-22T17:00:00Z',
      },
      {
        id: 'm5',
        content: 'Perfeito! Vou comprar então 😍',
        isFromUser: true,
        timestamp: '2024-01-22T17:05:00Z',
      },
    ],
    status: 'replied',
    tags: ['pagamento', 'bolsa'],
    createdAt: '2024-01-22T16:45:00Z',
  },
];

// Mock plans
export const mockPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 97,
    period: 'monthly',
    features: [
      'Até 50 produtos',
      '30 posts por mês',
      '1 usuário',
      'Geração de legendas com IA',
      'Agendamento básico',
      'Suporte por email',
    ],
    limits: {
      products: 50,
      posts: 30,
      users: 1,
      autopilot: false,
      aiGeneration: 30,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 197,
    period: 'monthly',
    features: [
      'Até 200 produtos',
      '100 posts por mês',
      '3 usuários',
      'Piloto automático',
      'Geração de imagens com IA',
      'Insights avançados',
      'Inbox unificado',
      'Suporte prioritário',
    ],
    limits: {
      products: 200,
      posts: 100,
      users: 3,
      autopilot: true,
      aiGeneration: 100,
    },
    popular: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 397,
    period: 'monthly',
    features: [
      'Até 500 produtos',
      'Posts ilimitados',
      '10 usuários',
      'Múltiplas contas Instagram',
      'API de integração',
      'White-label (seu logo)',
      'Gerente de sucesso dedicado',
    ],
    limits: {
      products: 500,
      posts: -1,
      users: 10,
      autopilot: true,
      aiGeneration: -1,
    },
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 997,
    period: 'monthly',
    features: [
      'Produtos ilimitados',
      'Posts ilimitados',
      'Usuários ilimitados',
      'Contas ilimitadas',
      'API completa',
      'Suporte 24/7',
      'Treinamento da equipe',
      'SLA garantido',
    ],
    limits: {
      products: -1,
      posts: -1,
      users: -1,
      autopilot: true,
      aiGeneration: -1,
    },
  },
];

// User roles
export type UserRole = 'admin' | 'manager' | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  segment: string;
  city: string;
  whatsapp: string;
  instagramConnected: boolean;
  instagramUsername?: string;
  plan: string;
  onboardingCompleted: boolean;
}

export const mockUser: User = {
  id: '1',
  name: 'Ana Martins',
  email: 'ana@minhaloja.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  role: 'admin',
  storeId: '1',
};

export const mockStore: Store = {
  id: '1',
  name: 'Minha Loja Fashion',
  segment: 'Moda Feminina',
  city: 'São Paulo, SP',
  whatsapp: '11999998888',
  instagramConnected: true,
  instagramUsername: '@minhalojafashion',
  plan: 'pro',
  onboardingCompleted: true,
};
