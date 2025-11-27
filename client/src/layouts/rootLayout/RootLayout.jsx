import { Link, Outlet } from "react-router-dom";
import "./RootLayout.css";
import {
  ClerkProvider,
  SignedIn,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import apiClient from "../../lib/api";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

// İç component - useAuth hook'unu kullanabilmek için
const AuthSetup = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    // API client'a token alma fonksiyonunu ver
    apiClient.setAuth(getToken);
  }, [getToken]);

  return null;
};

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthSetup />
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            <Link to="/" className="logo">
              <img src="/logo.png" alt="logo" />
              <span>BYZAI </span>
            </Link>
            <div className="user">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet /> {/* buraya child route render edilir */}
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
