import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  initials: string
  joinedAt: string
  kycStatus: 'verified' | 'pending' | 'unverified'
}

interface AuthStore {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const MOCK_USERS: Record<string, AuthUser> = {
  'customer@demo.com': {
    id: 'usr_001',
    name: 'Emeka Okonkwo',
    email: 'customer@demo.com',
    phone: '08012345678',
    role: 'customer',
    initials: 'EO',
    joinedAt: '2024-03-15',
    kycStatus: 'verified',
  },
  'admin@demo.com': {
    id: 'usr_admin',
    name: 'Amaka Eze',
    email: 'admin@demo.com',
    phone: '08098765432',
    role: 'admin',
    initials: 'AE',
    joinedAt: '2023-01-01',
    kycStatus: 'verified',
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email, _password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 900))
        const user = MOCK_USERS[email.toLowerCase()]
        if (!user) {
          set({ isLoading: false })
          return { success: false, error: 'No account found with that email address.' }
        }
        set({ user, isLoading: false })
        return { success: true }
      },

      register: async (name, email, phone, _password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1000))
        if (MOCK_USERS[email.toLowerCase()]) {
          set({ isLoading: false })
          return { success: false, error: 'An account with this email already exists.' }
        }
        const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        const newUser: AuthUser = {
          id: `usr_${Date.now()}`,
          name,
          email,
          phone,
          role: 'customer',
          initials,
          joinedAt: new Date().toISOString().split('T')[0],
          kycStatus: 'pending',
        }
        set({ user: newUser, isLoading: false })
        return { success: true }
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'shopinsurance-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
    }
  )
)
