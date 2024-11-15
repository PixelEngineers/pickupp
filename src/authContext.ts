import { createContext } from "react";
import { User } from "./models";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";

export const AuthContext = createContext<{
    user: User | null;
    setUser: (user: User | null) => void;
    db: Firestore;
    auth: Auth
} | null>(null);