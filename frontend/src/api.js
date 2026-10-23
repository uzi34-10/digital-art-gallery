// Production API client with seamless fallback to curated gallery data

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Curated initial artworks with high-resolution digital art images
export const FALLBACK_ARTWORKS = [
  {
    _id: 'art-001',
    title: 'Neon Odyssey: Celestial Echoes',
    description: 'A futuristic digital painting exploring the intersection of synthetic consciousness and deep cosmic void.',
    price: 3.45,
    category: { _id: 'cat-001', categoryName: 'Cyberpunk & Sci-Fi' },
    artistId: { _id: 'art-ast-001', artistName: 'Aria Thorne', specialization: 'Neural Generative Art' },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    likes: 142,
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    _id: 'art-002',
    title: 'Chromatic Reverie #09',
    description: 'Multi-layered fluid dynamics frozen in high-dimensional spectral color space.',
    price: 1.85,
    category: { _id: 'cat-002', categoryName: 'Abstract Expressionism' },
    artistId: { _id: 'art-ast-002', artistName: 'Kaelen Vance', specialization: 'Algorithmic Color Theory' },
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    likes: 98,
    createdAt: '2026-10-20T14:30:00Z',
  },
  {
    _id: 'art-003',
    title: 'Silicon Solitude',
    description: 'An architectural meditation on quiet brutalist monoliths standing inside a dying star system.',
    price: 4.20,
    category: { _id: 'cat-003', categoryName: '3D Surrealism' },
    artistId: { _id: 'art-ast-003', artistName: 'Elena Rostova', specialization: 'Procedural Architecture' },
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    likes: 215,
    createdAt: '2026-10-21T09:15:00Z',
  },
  {
    _id: 'art-004',
    title: 'Ethereal Biosphere',
    description: 'Digital botanical study simulating bioluminescent organisms native to Kepler-452b.',
    price: 2.10,
    category: { _id: 'cat-004', categoryName: 'Generative Nature' },
    artistId: { _id: 'art-ast-001', artistName: 'Aria Thorne', specialization: 'Neural Generative Art' },
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    likes: 184,
    createdAt: '2026-10-22T16:00:00Z',
  },
  {
    _id: 'art-005',
    title: 'Obsidian Pulse',
    description: 'Minimalist kinetic sculpture rendered in zero-gravity dark glass and reflective liquid mercury.',
    price: 5.75,
    category: { _id: 'cat-003', categoryName: '3D Surrealism' },
    artistId: { _id: 'art-ast-004', artistName: 'Zane Malik', specialization: 'Hyper-Minimalist Sculpture' },
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    likes: 310,
    createdAt: '2026-10-22T18:45:00Z',
  },
  {
    _id: 'art-006',
    title: 'Solaris Genesis',
    description: 'A study of solar flares and plasma turbulence reimagined through classical oil texture algorithms.',
    price: 2.90,
    category: { _id: 'cat-002', categoryName: 'Abstract Expressionism' },
    artistId: { _id: 'art-ast-002', artistName: 'Kaelen Vance', specialization: 'Algorithmic Color Theory' },
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    likes: 126,
    createdAt: '2026-10-23T08:00:00Z',
  },
];

export const FALLBACK_CATEGORIES = [
  { _id: 'cat-001', categoryName: 'Cyberpunk & Sci-Fi', description: 'Futuristic dystopian and utopian concepts.' },
  { _id: 'cat-002', categoryName: 'Abstract Expressionism', description: 'Non-representational emotional visual forms.' },
  { _id: 'cat-003', categoryName: '3D Surrealism', description: 'Hyper-realistic dreamscapes rendered in 3D.' },
  { _id: 'cat-004', categoryName: 'Generative Nature', description: 'Algorithmic representations of organic structures.' },
  { _id: 'cat-005', categoryName: 'Digital Photography', description: 'Manipulated light and high-speed shutter captures.' },
];

export const FALLBACK_EXHIBITIONS = [
  {
    _id: 'ex-001',
    exhibitionName: 'Synthetic Horizons 2026',
    startDate: '2026-10-15T00:00:00Z',
    endDate: '2026-11-30T00:00:00Z',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    artworkIds: [FALLBACK_ARTWORKS[0], FALLBACK_ARTWORKS[2], FALLBACK_ARTWORKS[4]],
  },
  {
    _id: 'ex-002',
    exhibitionName: 'The Fluid State',
    startDate: '2026-11-01T00:00:00Z',
    endDate: '2026-12-15T00:00:00Z',
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    artworkIds: [FALLBACK_ARTWORKS[1], FALLBACK_ARTWORKS[3], FALLBACK_ARTWORKS[5]],
  },
];

export const FALLBACK_ARTISTS = [
  {
    _id: 'art-ast-001',
    artistName: 'Aria Thorne',
    specialization: 'Neural Generative Art',
    bio: 'Pioneer of hybrid neural networks and synthetic biology visualizations based in Tokyo and Berlin.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    artworkCount: 8,
  },
  {
    _id: 'art-ast-002',
    artistName: 'Kaelen Vance',
    specialization: 'Algorithmic Color Theory',
    bio: 'Exploring psychoacoustic color palettes and fluid turbulence models. Featured at Venice Biennale 2025.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    artworkCount: 6,
  },
  {
    _id: 'art-ast-003',
    artistName: 'Elena Rostova',
    specialization: 'Procedural Architecture',
    bio: 'Architect and 3D visualist investigating planetary colony megastructures and brutalist forms.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    artworkCount: 11,
  },
  {
    _id: 'art-ast-004',
    artistName: 'Zane Malik',
    specialization: 'Hyper-Minimalist Sculpture',
    bio: 'Crafting mathematical precision sculptures focusing on zero-gravity light refraction and obsidian materials.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    artworkCount: 4,
  },
];

// Helper for making authenticated requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('gallery_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[API] Endpoint ${endpoint} unreachable or errored:`, err.message);
    throw err;
  }
};

export const api = {
  health: {
    check: async () => {
      try {
        const res = await fetch(`${API_BASE.replace('/api', '')}/health`);
        return await res.json();
      } catch {
        return { status: 'offline', database: { status: 'disconnected' } };
      }
    },
  },
  auth: {
    login: async (email, password) => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data?.data?.token) {
        localStorage.setItem('gallery_token', data.data.token);
        localStorage.setItem('gallery_user', JSON.stringify(data.data.user));
      }
      return data;
    },
    register: async (userData) => {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (data?.data?.token) {
        localStorage.setItem('gallery_token', data.data.token);
        localStorage.setItem('gallery_user', JSON.stringify(data.data.user));
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem('gallery_token');
      localStorage.removeItem('gallery_user');
    },
    getCurrentUser: () => {
      try {
        const u = localStorage.getItem('gallery_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    },
  },
  artworks: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/artworks${query ? `?${query}` : ''}`);
      return res.data?.artworks || [];
    },
    create: async (artworkData) => {
      return await request('/artworks', {
        method: 'POST',
        body: JSON.stringify(artworkData),
      });
    },
    delete: async (id) => {
      return await request(`/artworks/${id}`, { method: 'DELETE' });
    },
  },
  categories: {
    getAll: async () => {
      const res = await request('/categories');
      return res.data?.categories || [];
    },
    create: async (catData) => {
      return await request('/categories', {
        method: 'POST',
        body: JSON.stringify(catData),
      });
    },
  },
  artists: {
    getAll: async () => {
      const res = await request('/artists');
      return res.data?.artists || [];
    },
    create: async (artistData) => {
      return await request('/artists', {
        method: 'POST',
        body: JSON.stringify(artistData),
      });
    },
  },
  exhibitions: {
    getAll: async () => {
      const res = await request('/exhibitions');
      return res.data?.exhibitions || [];
    },
    create: async (exData) => {
      return await request('/exhibitions', {
        method: 'POST',
        body: JSON.stringify(exData),
      });
    },
  },
};
