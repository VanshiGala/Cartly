"use client";

import { useCartStore } from "src/store/cart-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckoutAction } from "./checkout-action";
import { useSession } from "next-auth/react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import NextImage from "next/image";

export default function Checkout() {
  const { items, removeItem, addItem, clearCart } = useCartStore();
  const { data: session } = useSession();
  //console.log("CHECKOUT ITEMS:", items);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  //   const safeItems = Array.isArray(items) ? items : [];
  // const total = safeItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  if (total == 0 || items.length == 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800">
            Your cart is empty
          </h1>
          <Button className="mt-6" size="lg" asChild>
            <a href="/products">Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }
  const handleProceed = (e: React.FormEvent<HTMLFormElement>) => {
    if (!session) {
      e.preventDefault(); // prevent form submission
      window.location.href = "/sign-in"; // redirect to sign-in , built-in browser property
      return;
    }
    // user is signed in → form submits normally to CheckoutAction
  };
  return (
     <div className="min-h-screen `bg-gradient-to-br` py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 `bg-gradient-to-r` from-black to-purple-600 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className=" text-black rounded-t-xl">
                <CardTitle className="text-2xl">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 pb-8 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div className="relative w-28 h-28 `flex-shrink-0` rounded-2xl overflow-hidden shadow-md bg-white">
                      {item.imageUrl ? (
                        <NextImage
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">
                        ${(item.price / 100).toFixed(2)} each
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 rounded-full"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-bold text-lg">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => addItem(item)}
                            className="w-10 h-10 rounded-full"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-black">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="`bg-gradient-to-r` from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-2xl">Order Total</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="text-5xl font-bold text-gray-900">
                  ${(total / 100).toFixed(2)}
                </div>

                <form action={CheckoutAction} onSubmit={handleProceed}>
                  <input
                    type="hidden"
                    name="items"
                    value={JSON.stringify(items)}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-16 text-xl font-bold bg-black hover:bg-gray-800 text-white shadow-xl"
                  >
                    Proceed to Payment
                  </Button>
                </form>

                {!session && (
                  <p className="text-center text-sm text-gray-600 mt-4 bg-gray-50 py-3 rounded-lg">
                    You’ll be redirected to sign in
                  </p>
                )}

                <div className="pt-6 border-t space-y-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-black pt-4 border-t">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

//In Next.js Server Actions, the action attribute of a <form> lets your form directly call a server function when the user clicks Submit.
