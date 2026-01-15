"use client";

import { signIn , useSession} from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@store/cart-store";


export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {data : session, status} = useSession()
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User logged in → syncing cart...");
      useCartStore.getState().syncWithServer();
    }
  }, [status]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("SignIn Error");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Call NextAuth credentials signIn
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        //callbackUrl: `${window.location.origin}/home`, // Use window.location.origin
      });

      console.log("signIn response:", res);

      if (res?.ok) {
        // setErrorMessage("Invalid email or password");
        // setLoading(false);
        // return;
        window.location.href = "/";
      } else {
        setErrorMessage("Invalid email or password");
      }
      // Safe redirect to home after successful login
      //window.location.href = "/home";
    } catch (err) {
      console.error("Sign in error:", err);
      setErrorMessage("Something went wrong, please try again.");
      setLoading(false);
    }
  }
useEffect(() => {
  if (session) {
    // Force immediate sync when user logs in
    useCartStore.getState().syncWithServer();
  }
}, [session]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-6">Sign in to continue shopping</p>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-600"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Don’t have an account?
            <Link
              href="/sign-up"
              className="text-black hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
