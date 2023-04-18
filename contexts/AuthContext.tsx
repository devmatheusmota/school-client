import { api } from "@/services/api";
import { decode } from "jsonwebtoken";
import { parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import Router from "next/router";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user?: User;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  token?: string;
};

interface SignInData {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { ["nextauth.token"]: token } = parseCookies();
    if (token) {
      setUser(decode(token) as User);
      setToken(token);
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    api
      .post("/auth/login", { email, password })
      .then((response) => {
        const { token } = response.data.auth;
        setUser(decode(token) as User);
        setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 });
        Router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function signOut() {
    setUser(null);
    setCookie(undefined, "nextauth.token", null, { maxAge: 60 * 60 * 1 });
    Router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}
