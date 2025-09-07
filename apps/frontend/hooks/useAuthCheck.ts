import { useEffect, useState, useCallback } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { getApiBaseUrl } from "../lib/api";
import { useRouter } from "next/navigation"; 

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuthCheck() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const signOutAndReset = useCallback(async () => {
    localStorage.removeItem("token");
    setUser(null);
    setStatus("unauthenticated");
    try {
      await firebaseSignOut(getAuth());
    } catch {}
    router.push("/sign-in"); 
  }, []);

  const checkAuth = useCallback(async () => {
    setStatus("loading");
    const auth = getAuth();
    let token: string | null = null;

    // Try to get token from localStorage first
    token = localStorage.getItem("token");
    if (!token && auth.currentUser) {
      token = await auth.currentUser.getIdToken();
      if (token) localStorage.setItem("token", token);
    }

    if (!token) {
      await signOutAndReset();
      return;
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (
        res.status === 401 ||
        res.status === 403 ||
        (res.status === 404 && data?.message === "Cannot GET /auth/me" && data?.error === "Not Found")
      ) {
        await signOutAndReset();
      } else if (res.ok) {
        setStatus("authenticated");
        setUser(data);
      } else {
        await signOutAndReset();
      }
    } catch (e) {
      await signOutAndReset();
    }
  }, [signOutAndReset]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Google SSO sign-in
  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    localStorage.setItem("token", token);
    await checkAuth();
  };

  // Manual sign out (for UI button)
  const signOut = async () => {
    await signOutAndReset();
  };

  return { status, user, signInWithGoogle, signOut };
} 