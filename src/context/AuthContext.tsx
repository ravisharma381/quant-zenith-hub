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
import { doc, getDoc, setDoc, serverTimestamp, query, getDocs, collection, where, documentId } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    provider: string;
    role: "user" | "admin" | "superAdmin";
    createdAt?: any;
    lastLoginAt?: any;
    isPremium: boolean;
    purchasedAt?: string;
    expiresAt?: string;
    planType: string;
    planPrice: number;
}

interface AuthContextType {
    user: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    setRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
    setRerender: () => true,
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [rerender, setRerender] = useState(true);

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
        if (rerender) {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    const userRef = doc(db, "users", firebaseUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            name: firebaseUser.displayName,
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                            provider: firebaseUser.providerData[0]?.providerId || "unknown",
                            role: "user",
                            createdAt: serverTimestamp(),
                            lastLoginAt: serverTimestamp(),
                            isPremium: false,
                        });
                    } else {
                        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
                    }

                    const profileSnap = await getDoc(userRef);
                    const data = profileSnap.data() as Omit<UserProfile, "id">;
                    setUser(firebaseUser);
                    setUserProfile({
                        id: profileSnap.id,
                        ...data,
                    });
                } else {
                    setUser(null);
                    setUserProfile(null);
                }
                setLoading(false);
                setRerender(false);
            });

            return unsubscribe;
        }
    }, [rerender]);


    // 🔹 3️⃣ Login with Google (with persistence)
    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            if (import.meta.env.DEV) {
                // await setPersistence(auth, browserLocalPersistence);
                // await signInWithRedirect(auth, provider);
                await signInWithPopup(auth, provider);
            } else {
                // Forproduction
                // await setPersistence(auth, browserLocalPersistence);
                // await signInWithRedirect(auth, provider);
                await signInWithPopup(auth, provider);
            }
            setRerender(true);


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
        <AuthContext.Provider value={{ user, userProfile, loading, loginWithGoogle, logout, setRerender }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
