"use client"

import Stripe from "stripe";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "src/store/cart-store";

interface Props {
  product: Stripe.Product;
}

export const ProductDetail = ({ product }: Props) => {
  const {items, addItem,removeItem} = useCartStore()
  //after JSON serialization in product->[id]->page, default_price is not a 'Stripe.Price' type anymore — it's just a plain object.
  const price = product.default_price && typeof product.default_price === "object"
      ? (product.default_price as Stripe.Price)
      : null;
  const safeItems = Array.isArray(items) ? items : []; //zustand first loads [] state. sp operations crash

  const cartItem = safeItems.find((item)=>item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;


  const onAddItem = () =>{
    addItem({
      id:product.id,
      name:product.name,
      price :price?.unit_amount ?? 0,
      imageUrl: product.images ? product.images[0]: null,
      quantity:1
    })
  }

  return (
    <div className="conatiner mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
      {product.images && product.images[0] && (
        <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden">
          <Image
            alt={product.name}
            src={product.images[0]}
           fill
            style={{ objectFit: "cover" }}
            className="transition duration-300 hover:opacity-90"
          />
        </div>
      )}

      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        {product.description && <p className="text-gray-700 mb-4">{product.description}</p>}
        {price?.unit_amount && (
          <p className="text-gray-700 mb-4">
            ${(price.unit_amount / 100).toFixed(2)}
          </p>
        )}

        <div>
          <Button onClick={()=>removeItem(product.id)}>-</Button>
          <span className="p-2">{quantity}</span>
           <Button onClick={onAddItem}>+</Button>
        </div>
      </div>
    </div>
  );
};