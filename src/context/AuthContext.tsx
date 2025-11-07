import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithRedirect,
    signOut,
    User,
    setPersistence,
    browserLocalPersistence,
    getRedirectResult,
    signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const defaultContext: AuthContextType = {
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();

    console.log(user)

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    toast({
                        title: `Welcome ${result.user.displayName || "back"}!`,
                        description: "You have been signed in.",
                    });
                    console.log("Redirect login success:", result.user);
                    setUser(result.user);
                }
            })
            .catch((error) => console.error("Redirect result error:", error));
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                try {
                    console.log('check0', firebaseUser)
                    if (firebaseUser) {
                        console.log('check')
                        const userRef = doc(db, "users", firebaseUser.uid);
                        const snap = await getDoc(userRef);
                        console.log(snap)
                        if (!snap.exists()) {
                            await setDoc(userRef, {
                                name: firebaseUser.displayName,
                                email: firebaseUser.email,
                                photoURL: firebaseUser.photoURL,
                                provider:
                                    firebaseUser.providerData[0]?.providerId || "unknown",
                                createdAt: serverTimestamp(),
                                lastLoginAt: serverTimestamp(),
                                purchasedCourses: [],
                                role: "user",
                            });
                        } else {
                            await setDoc(
                                userRef,
                                { lastLoginAt: serverTimestamp() },
                                { merge: true }
                            );
                        }
                        toast({
                            title: `Welcome ${firebaseUser.displayName || "back"}!`,
                            description: "You have been signed in.",
                        });
                        setUser(firebaseUser);
                    } else {
                        setUser(null);
                    }
                } catch (err) {
                    console.error("Auth state error:", err);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("onAuthStateChanged error:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            // For local dev / browsers with strict privacy
            if (import.meta.env.DEV) {
                // await setPersistence(auth, browserLocalPersistence);
                // await signInWithRedirect(auth, provider);
                await signInWithPopup(auth, provider);
            } else {
                // Forproduction
                await signInWithPopup(auth, provider);
                // await setPersistence(auth, browserLocalPersistence);
                // await signInWithRedirect(auth, provider);
            }
        } catch (err) {
            console.error("Auth error:", err);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;

