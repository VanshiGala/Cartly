"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {ShoppingCart, Menu, X, User} from 'lucide-react'
import { useCartStore } from "src/store/cart-store";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { items } = useCartStore();
  const { data: session } = useSession();
  //const cartCount =items.reduce((acc,item)=>acc + item.quantity, 0) ; //loop through an array and reduce it to single number
  const cartCount = Array.isArray(items)
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      } //side nav appear when screen size is less than 768
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold `bg-gradient-to-r` from-black to-purple-600 bg-clip-text text-transparent">
            Cartly
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          <Link href="/" className="text-gray-700 hover:text-black font-medium transition">
            Home
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-black font-medium transition">
            Products
          </Link>
          <Link href="/checkout" className="text-gray-700 hover:text-black font-medium transition">
            Checkout
          </Link>
        </div>

       
        <div className="flex items-center space-x-6">
         
          <Link href="/checkout" className="relative group">
            <div className="p-3 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          
          {session ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {session.user?.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.email?.split("@")[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-black hover:bg-gray-800 text-white font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

   
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-6 space-y-5">
            <Link href="/" className="block text-lg font-medium hover:text-purple-600">
              Home
            </Link>
            <Link href="/products" className="block text-lg font-medium hover:text-purple-600">
              Products
            </Link>
            <Link href="/checkout" className="block text-lg font-medium hover:text-purple-600">
              Checkout
            </Link>

            <div className="pt-4 border-t">
              {session ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{session.user?.email}</span>
                  </div>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/sign-in" className="block">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="block">
                    <Button className="w-full bg-black hover:bg-gray-800">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
//'npm i heroicons/react' -> error because you're trying to install a package using SSH instead of HTTPS, and GitHub is rejecting it because your system has no SSH key configured.
//npm i heroicons/react → NPM thinks you're trying to install a GitHub repo: Git tries SSH → fails → permission denied.
