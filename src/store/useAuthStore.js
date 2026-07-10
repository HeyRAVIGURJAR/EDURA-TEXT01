import { create } from 'zustand';

// Simulated user database (in production, this would be MongoDB/Supabase)
const MOCK_USERS_DB_KEY = 'edura_users_db';
const AUTH_TOKEN_KEY = 'edura_auth_token';

const getInitialUsers = () => {
  const stored = localStorage.getItem(MOCK_USERS_DB_KEY);
  if (stored) return JSON.parse(stored);
  // Seed with admin + sample users
  const defaultUsers = [
    {
      id: 'admin-001',
      username: '@EDURA_ADMIN',
      email: 'admin@edura.in',
      password: '@adminedura',
      role: 'admin',
      blocked: false,
      ip: '192.168.1.1',
      screenTime: '48h 22m',
      lastActive: new Date().toISOString(),
      lectureHistory: ['Ray Optics 06', 'Thermodynamics 03', 'Organic Chem 11'],
    },
    {
      id: 'user-001',
      username: 'priya_sharma',
      email: 'priya@test.com',
      password: 'test123',
      role: 'student',
      blocked: false,
      ip: '103.45.67.89',
      screenTime: '12h 45m',
      lastActive: '2026-06-29T10:30:00Z',
      lectureHistory: ['Calculus 01', 'Physics 04'],
    },
    {
      id: 'user-002',
      username: 'rahul_verma',
      email: 'rahul@test.com',
      password: 'test123',
      role: 'student',
      blocked: false,
      ip: '182.73.21.45',
      screenTime: '8h 15m',
      lastActive: '2026-06-28T14:20:00Z',
      lectureHistory: ['Chemistry 07', 'Biology 02', 'Physics 06'],
    },
    {
      id: 'user-003',
      username: 'ananya_gupta',
      email: 'ananya@test.com',
      password: 'test123',
      role: 'student',
      blocked: false,
      ip: '49.37.88.102',
      screenTime: '22h 10m',
      lastActive: '2026-06-30T08:15:00Z',
      lectureHistory: ['History 01', 'Geography 03', 'Polity 05', 'Economics 02'],
    },
    {
      id: 'user-004',
      username: 'amit_kumar',
      email: 'amit@test.com',
      password: 'test123',
      role: 'student',
      blocked: true,
      ip: '115.96.34.78',
      screenTime: '3h 05m',
      lastActive: '2026-06-25T16:45:00Z',
      lectureHistory: ['Maths 01'],
    },
    {
      id: 'user-005',
      username: 'sneha_patel',
      email: 'sneha@test.com',
      password: 'test123',
      role: 'student',
      blocked: false,
      ip: '223.176.45.12',
      screenTime: '15h 30m',
      lastActive: '2026-06-30T07:00:00Z',
      lectureHistory: ['Organic Chem 01', 'Organic Chem 02', 'Inorganic 04'],
    },
  ];
  localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const persistUsers = (users) => {
  localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};

export const useAuthStore = create((set, get) => {
  const users = getInitialUsers();
  const defaultStudent = users.find(u => u.role === 'student' && !u.blocked) || users[1];
  const initialUser = {
    ...defaultStudent,
    xp: defaultStudent.xp || 560,
    coins: defaultStudent.coins || 120,
    streak: defaultStudent.streak || 7,
    streakFrozen: defaultStudent.streakFrozen || false
  };

  return {
    user: initialUser,
    isAuthenticated: true,
    isAdmin: false,
    users,
    loginError: null,
  
  // Global Audio State
  globalAudioUrl: null,
  isPlaying: false,

  // User Gamification Actions
  addXP: (amount) => set((state) => {
    if (!state.user) return state;
    const currentXP = state.user.xp || 0;
    const currentCoins = state.user.coins || 0;
    const updatedUser = { ...state.user, xp: currentXP + amount, coins: currentCoins + Math.floor(amount / 10) };
    
    // update in users array
    const newUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    persistUsers(newUsers);

    return { user: updatedUser, users: newUsers };
  }),

  freezeStreak: () => {
    const state = get();
    if (!state.user) return false;
    const currentCoins = state.user.coins || 0;
    if (currentCoins >= 50) {
      const updatedUser = { ...state.user, coins: currentCoins - 50, streakFrozen: true };
      const newUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
      persistUsers(newUsers);
      set({ user: updatedUser, users: newUsers });
      return true;
    }
    return false;
  },

  setGlobalAudio: (url) => set({ globalAudioUrl: url, isPlaying: true }),
  toggleAudio: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Initialize from stored token on app load
  hydrate: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const parsed = JSON.parse(atob(token));
        const users = get().users;
        const user = users.find((u) => u.id === parsed.id);
        if (user && !user.blocked) {
          // Initialize defaults if missing
          const safeUser = {
            ...user,
            xp: user.xp || 0,
            coins: user.coins || 0,
            streak: user.streak || 7,
            streakFrozen: user.streakFrozen || false
          };
          set({
            user: safeUser,
            isAuthenticated: true,
            isAdmin: safeUser.role === 'admin',
            loginError: null,
          });
        } else if (user && user.blocked) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          set({ user: null, isAuthenticated: false, isAdmin: false, loginError: 'blocked' });
        }
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  },

  login: (username, password) => {
    const users = get().users;
    const user = users.find(
      (u) => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      set({ loginError: 'Invalid username or password' });
      return false;
    }

    if (user.blocked) {
      set({ loginError: 'blocked' });
      return false;
    }

    // Create a mock JWT-like token
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, ts: Date.now() }));
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    set({
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
      loginError: null,
    });
    return true;
  },

  signup: (username, email, password) => {
    const users = get().users;
    if (users.find((u) => u.email === email || u.username === username)) {
      set({ loginError: 'User already exists' });
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      role: 'student',
      blocked: false,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      screenTime: '0h 0m',
      lastActive: new Date().toISOString(),
      lectureHistory: [],
    };

    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);

    const token = btoa(JSON.stringify({ id: newUser.id, role: newUser.role, ts: Date.now() }));
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    set({
      users: updatedUsers,
      user: newUser,
      isAuthenticated: true,
      isAdmin: false,
      loginError: null,
    });
    return true;
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ user: null, isAuthenticated: false, isAdmin: false, loginError: null });
  },

  clearError: () => set({ loginError: null }),

  // Admin actions
  toggleUserBlock: (userId) => {
    const users = get().users.map((u) =>
      u.id === userId ? { ...u, blocked: !u.blocked } : u
    );
    persistUsers(users);
    set({ users });
  },

  getAllUsers: () => get().users.filter((u) => u.role !== 'admin'),
  };
});
