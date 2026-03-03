'use client';

import { useState, useEffect } from 'react';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth || !db) return;

    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setIsAdmin(docSnap.data().isAdmin === true);
          } else {
            setDoc(userRef, {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Anonymous User',
              photoURL: firebaseUser.photoURL || '',
              isAdmin: false,
              createdAt: new Date().toISOString(),
            });
            setIsAdmin(false);
          }
          setLoading(false);
        }, (error) => {
          setLoading(false);
        });

      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, [auth, db]);

  const signIn = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-blocked') {
        toast({
          title: "Sign-in Interrupted",
          description: "The authentication window was closed.",
        });
        return; 
      }
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/');
      toast({ title: "Welcome Back", description: "Access granted to the armory." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) return;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      router.push('/');
      toast({ title: "Account Initialized", description: "Welcome to the collective, " + name });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-out Failed",
        description: error.message,
      });
    }
  };

  const grantAdminStatus = async () => {
    if (!user || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { isAdmin: true });
      toast({
        title: "Admin Privileges Granted",
        description: "Welcome to Mission Control, Commander.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Unauthorized elevation attempt.",
      });
    }
  };

  return { user, loading, isAdmin, signIn, loginWithEmail, signupWithEmail, signOut, grantAdminStatus };
}
