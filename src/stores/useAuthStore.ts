import { create } from 'zustand';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'owner' | 'renter' | 'admin';
}

interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}));

// Initialize auth listener
onAuthStateChanged(auth, async (user) => {
  useAuthStore.getState().setUser(user);
  
  if (user) {
    // Listen to profile changes
    const profileRef = doc(db, 'users', user.uid);
    onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        useAuthStore.getState().setProfile(docSnap.data() as UserProfile);
      } else {
        useAuthStore.getState().setProfile(null);
      }
      useAuthStore.getState().setLoading(false);
      useAuthStore.getState().setInitialized(true);
    });
  } else {
    useAuthStore.getState().setProfile(null);
    useAuthStore.getState().setLoading(false);
    useAuthStore.getState().setInitialized(true);
  }
});
