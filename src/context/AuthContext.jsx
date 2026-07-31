import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    displayName: 'CyberHacker_01',
    email: 'hacker@hackarena.io',
    xp: 250,
    level: 1,
    completedLabs: ['sql-injection'],
    badges: ['SQL Master', 'Cyber Novice'],
    avatar: '👾'
  });
  const [loading, setLoading] = useState(true);

  const calculateLevel = (xp) => Math.floor(xp / 500) + 1;
  useEffect(() => {
    const saved = localStorage.getItem('hackarena_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
      } catch (e) {
        console.error('Failed to parse local profile:', e);
      }
    }

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user && db) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserProfile(data);
              localStorage.setItem('hackarena_user_profile', JSON.stringify(data));
              
            } else {
              const newProf = {
                displayName: user.email.split('@')[0],
                email: user.email,
                xp: 0,
                level: 1,
                completedLabs: [],
                badges: ['Cyber Novice'],
                avatar: '👾',
                createdAt: new Date().toISOString()
              };
              await setDoc(userRef, newProf);
              setUserProfile(newProf);
              localStorage.setItem('hackarena_user_profile', JSON.stringify(newProf));
              
            }
          } catch (err) {
            console.warn('Firestore fetch failed, using local state:', err.message);
          }
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, displayName) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: displayName,
      email,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  localStorage.setItem('hackarena_token', data.data.token);
  localStorage.setItem(
    'hackarena_user_profile',
    JSON.stringify(data.data.user)
  );

  setCurrentUser(data.data.user);
  setUserProfile(data.data.user);

  return data;
};

 const login = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  localStorage.setItem('hackarena_token', data.data.token);
  localStorage.setItem(
    'hackarena_user_profile',
    JSON.stringify(data.data.user)
  );

  setCurrentUser(data.data.user);
  setUserProfile(data.data.user);

  return data;
};

  const logout = async () => {
    if (auth && currentUser) {
      try { await signOut(auth); } catch (e) {}
    }
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    if (auth) {
      return await sendPasswordResetEmail(auth, email);
    }
    return Promise.resolve();
  };

  const addXPAndLabProgress = async (labId, xpEarned, badgeUnlocked) => {
    const updatedLabs = userProfile.completedLabs.includes(labId)
      ? userProfile.completedLabs
      : [...userProfile.completedLabs, labId];

    const updatedBadges = [...userProfile.badges];
    if (badgeUnlocked && !updatedBadges.includes(badgeUnlocked)) {
      updatedBadges.push(badgeUnlocked);
    }

    const newXP = userProfile.xp + (userProfile.completedLabs.includes(labId) ? 0 : xpEarned);
    const newLevel = calculateLevel(newXP);

    const newProfile = {
      ...userProfile,
      xp: newXP,
      level: newLevel,
      completedLabs: updatedLabs,
      badges: updatedBadges
    };

    setUserProfile(newProfile);
    localStorage.setItem('hackarena_user_profile', JSON.stringify(newProfile));
  };

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    addXPAndLabProgress,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
