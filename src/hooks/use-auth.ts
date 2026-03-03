
'use client';

import { useState, useEffect } from 'react';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const { toast } = useToast();
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
    } catch (error: any) {
      // Explicitly handle the popup closed error to prevent runtime crash
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-blocked') {
        toast({
          title: "Sign-in Interrupted",
          description: "The authentication window was closed. Try again when you're ready.",
        });
        return; 
      }
      
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred during sign-in.",
      });
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
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
        description: "Unauthorized attempt to elevate privileges detected.",
      });
    }
  };

  return { user, loading, isAdmin, signIn, signOut, grantAdminStatus };
}
