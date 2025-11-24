"use client"
import Stripe from "stripe";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  product: Stripe.Product;
}

export const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;
  const description = product.description;
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-2">
        {product.images && product.images[0] && (
          <div className="relative h-80 w-full">
            <Image
              alt={product.name}
              src={product.images[0]}
              layout="fill"
              objectFit="cover"
              className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
            />
          </div>
        )}
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-gray-800">{product.name}</CardTitle>
         </CardHeader>
          <CardContent className="p-4 flex-`grow` flex flex-col justify-between">
            {product.description && <p className="text-gray-700 mb-4">{product.description}</p>}
            {price?.unit_amount && (
              <p className="text-lg font-semibold text-gray-900">
                ${(price.unit_amount / 100).toFixed(2)}
              </p>
            )}
             <Button className="mt-4 bg-black text-white">View Details</Button>
          </CardContent>
      </Card>
    </Link>
  );
};
