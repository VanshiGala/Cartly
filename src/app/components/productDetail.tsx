"use client";

import Image from "next/image";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCartStore } from "src/store/cart-store";
import { ShoppingCart, Truck, Shield, CheckCircle2, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface Props {
  product: any; // after JSON.parse(JSON.stringify()), it's plain object
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem, syncWithServer } = useCartStore();
  const [added, setAdded] = useState(false);

  // Safely extract price after serialization
  const priceObj = product.default_price && typeof product.default_price === "object"
    ? product.default_price
    : null;

  const price = priceObj ? (priceObj.unit_amount / 100).toFixed(2) : "0.00";
  const imageUrl = product.images?.[0] || "/placeholder.svg";

  // Find current quantity in cart
  const cartItem = items.find((item: any) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: priceObj?.unit_amount || 0,
      imageUrl,
      //quantity: 1,
    });
    syncWithServer();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      removeItem(product.id);
      syncWithServer();
    }
  };

  return (
    <div className="min-h-screen `bg-gradient-to-b`r from-gray-50 to-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
       
          <div className="relative group">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className=" transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => ( //stars
                    <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg> //drew star using co-ordinates
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(324 reviews)</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-black">
              ${price}
            </div>

            {product.description && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>
            )}

           
            <Card className="p-6 bg-gray-50 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleRemove}
                    disabled={quantity === 0}
                    className="w-14 h-14 rounded-full"
                  >
                    –
                  </Button>
                  <span className="text-3xl font-bold w-20 text-center">
                    {quantity}
                  </span>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAdd}
                    className="w-14 h-14 rounded-full hover:bg-black hover:text-white transition"
                  >
                    +
                  </Button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAdd}
                  className={`px-10 h-14 text-lg font-semibold transition-all ${
                    added
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="mr-3" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-3" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </Card>

          
            <div className="grid grid-cols-3 gap-6 pt-8 border-t">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Shield, text: "Secure Payment" },
                { icon: CheckCircle2, text: "30-Day Returns" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center text-center">
                  <item.icon className="w-10 h-10 text-purple-600 mb-3" />
                  <span className="font-medium text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};