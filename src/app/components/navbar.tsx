"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "src/store/cart-store";
import { Button } from "./ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

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
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="hover:text-blue-600">
          Cartly
        </Link>
        <div className=" md:flex space-x-6">
          <Link href="/">Home</Link>
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link href="/checkout" className="hover:text-blue-600">
            Checkout
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          {session ? (
            <>
              <span className="font-medium">
                {session.user?.email || "User"}
              </span>
              <button
                onClick={() => signOut()}
                className=" text-left p-2 hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button className=" text-left hover:text-blue-600">
                  Sign In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className=" text-left hover:text-blue-600">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link href="/" className="block hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/" className="block hover:text-blue-600">
                Products
              </Link>
            </li>
            <li>
              <Link href="/" className="block hover:text-blue-600">
                Checkout
              </Link>
            </li>
            <li></li>
          </ul>
        </nav>
      )}
    </nav>
  );
};

//'npm i heroicons/react' -> error because you're trying to install a package using SSH instead of HTTPS, and GitHub is rejecting it because your system has no SSH key configured.
//npm i heroicons/react → NPM thinks you're trying to install a GitHub repo: Git tries SSH → fails → permission denied.
