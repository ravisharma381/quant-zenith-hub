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
    GithubAuthProvider,
    AuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, query, getDocs, collection, where, documentId } from "firebase/firestore";
import { auth, db, functions } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { httpsCallable } from "firebase/functions";

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
    usePaypal?: boolean;
}

interface AuthContextType {
    user: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithGitHub: () => Promise<void>;
    logout: () => Promise<void>;
    setRerender: React.Dispatch<React.SetStateAction<boolean>>;
    region: string;
    regionLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    loginWithGoogle: async () => { },
    loginWithGitHub: async () => { },
    logout: async () => { },
    setRerender: () => true,
    region: "IN",
    regionLoading: true
});

const ContextAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [rerender, setRerender] = useState(true);
    const [region, setRegion] = useState("US");
    const [regionLoading, setRegionLoading] = useState(true);


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
                    const providerProfile = firebaseUser.providerData.find(
                        p => p.providerId === "github.com"
                    );

                    const derivedName =
                        firebaseUser.displayName ||
                        providerProfile?.displayName ||
                        (firebaseUser.email ? firebaseUser.email.split("@")[0] : null) ||
                        "Anonymous";

                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            name: derivedName,
                            email:
                                firebaseUser.email ||
                                firebaseUser.providerData.find(p => p.email)?.email ||
                                null,
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

    // your firebase init

    useEffect(() => {
        const fetchRegion = async () => {
            try {

                const cachedRegion = localStorage.getItem("user_region");

                if (cachedRegion) {
                    setRegion(cachedRegion);
                    setLoading(false);
                    return;
                }

                const fn = httpsCallable(functions, "getUserRegion");
                const res = await fn();

                const detectedRegion: any = res.data?.data?.region;

                if (detectedRegion) {
                    localStorage.setItem("user_region", detectedRegion);
                    setRegion(detectedRegion);
                }
            } catch (err) {
                console.error("Region detection failed:", err);
            } finally {
                setRegionLoading(false);
            }
        };

        fetchRegion();
    }, []);

    const signInWithProvider = async (provider: AuthProvider) => {
        try {
            setLoading(true);

            // Popup works reliably for Google + GitHub
            const val = await signInWithPopup(auth, provider);
            console.log(val);

            toast({
                title: "Login successful ✅",
                description: "You have successfully logged in. Redirecting...",
                variant: "default",
            })

            setRerender(true);
        } catch (err) {
            console.error("OAuth login error:", err);
            setLoading(false);
        }
    };


    // 🔹 3️⃣ Login with Google (with persistence)
    // const loginWithGoogle = async () => {
    //     try {
    //         setLoading(true);
    //         const provider = new GoogleAuthProvider();
    //         if (import.meta.env.DEV) {
    //             // await setPersistence(auth, browserLocalPersistence);
    //             // await signInWithRedirect(auth, provider);
    //             await signInWithPopup(auth, provider);
    //         } else {
    //             // Forproduction
    //             // await setPersistence(auth, browserLocalPersistence);
    //             // await signInWithRedirect(auth, provider);
    //             await signInWithPopup(auth, provider);
    //         }
    //         setRerender(true);


    //     } catch (err) {
    //         console.error("Login error:", err);
    //     }
    // };
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithProvider(provider);
    };

    const loginWithGitHub = async () => {
        const provider = new GithubAuthProvider();

        provider.addScope("read:user");
        provider.addScope("user:email");

        await signInWithProvider(provider);
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
        <AuthContext.Provider value={{ user, userProfile, loading, loginWithGoogle, logout, setRerender, loginWithGitHub, region, regionLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default ContextAuthProvider;

export const useAuth = () => useContext(AuthContext);
