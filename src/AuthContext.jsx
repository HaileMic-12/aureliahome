import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "./firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth || !db) {
      setLoading(false);
      return undefined;
    }
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        setIsAdmin((await getDoc(doc(db, "admins", nextUser.uid))).exists());
      } catch {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    if (!auth || !db)
      throw new Error("Firebase Authentication is not configured.");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const adminRecord = await getDoc(doc(db, "admins", credential.user.uid));
    if (!adminRecord.exists()) {
      await signOut(auth);
      throw new Error(
        "This account is not authorized for the admin area. Create admins/<Authentication UID> in Firestore.",
      );
    }
    return credential;
  };
  const logout = () => (auth ? signOut(auth) : Promise.resolve());
  const resetPassword = (email) => {
    if (!auth) throw new Error("Firebase Authentication is not configured.");
    return sendPasswordResetEmail(auth, email);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        firebaseConfigured,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
