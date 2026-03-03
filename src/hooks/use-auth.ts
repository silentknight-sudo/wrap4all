
'use client';

import { useState, useEffect } from 'react';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export function useAuth() {
  const auth = useFirebaseAuth();
  const db = useFirestore();
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
        
        // Listen for real-time updates to the user document (especially isAdmin flag)
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setIsAdmin(docSnap.data().isAdmin === true);
          } else {
            // Initial user creation
            setDoc(userRef, {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Anonymous User',
              photoURL: firebaseUser.photoURL || '',
              isAdmin: false, // Default to false
              createdAt: new Date().toISOString(),
            });
            setIsAdmin(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("User doc listener error:", error);
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
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const grantAdminStatus = async () => {
    if (!user || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { isAdmin: true });
    } catch (error) {
      console.error('Grant admin error:', error);
    }
  };

  return { user, loading, isAdmin, signIn, signOut, grantAdminStatus };
}
