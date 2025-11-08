import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithRedirect,
    signOut,
    getRedirectResult,
    setPersistence,
    browserLocalPersistence,
    User as FirebaseUser,
    signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    provider: string;
    role: "user" | "admin";
    purchasedCourses: string[];
    createdAt?: any;
    lastLoginAt?: any;
}

interface AuthContextType {
    user: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔹 1️⃣ Handle redirect result once per page load
    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log("Redirect login success:", result.user);
                    setUser(result.user);
                }
            } catch (err) {
                console.error("getRedirectResult error:", err);
            }
        };
        handleRedirect();
    }, []);

    // 🔹 2️⃣ Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userRef = doc(db, "users", firebaseUser.uid);
                const snap = await getDoc(userRef);

                if (!snap.exists()) {
                    await setDoc(userRef, {
                        name: firebaseUser.displayName,
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL,
                        provider: firebaseUser.providerData[0]?.providerId || "unknown",
                        role: "user",
                        purchasedCourses: [],
                        createdAt: serverTimestamp(),
                        lastLoginAt: serverTimestamp(),
                    });
                } else {
                    // Update last login time
                    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
                }

                const profileSnap = await getDoc(userRef);
                setUserProfile({
                    id: profileSnap.id,
                    ...(profileSnap.data() as Omit<UserProfile, "id">),
                });
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // 🔹 3️⃣ Login with Google (with persistence)
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            if (import.meta.env.DEV) {
                // await setPersistence(auth, browserLocalPersistence);
                // await signInWithRedirect(auth, provider);
                await signInWithPopup(auth, provider);
            } else {
                // Forproduction
                await setPersistence(auth, browserLocalPersistence);
                await signInWithRedirect(auth, provider);
                // await setPersistence(auth, browserLocalPersistence);
                // await signInWithRedirect(auth, provider);
            }


        } catch (err) {
            console.error("Login error:", err);
        }
    };

    // 🔹 4️⃣ Logout and reset state
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserProfile(null);
            console.log("User signed out successfully.");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
