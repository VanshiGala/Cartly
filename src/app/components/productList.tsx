"use client";

import Stripe from "stripe";
import { ProductCard } from "./product-card";
import { useState } from "react";
interface Props{
    products: Stripe.Product[];
}

export const ProductList = ({products}: Props) =>{
    const [search, setSearch] = useState<string>("")
    const filteredProduct = products.filter((product)=>{
        const word = search.toLowerCase()
        const namedMatch = product.name.toLowerCase().includes(word)
        const descriptionMatch = product.description ? product.description.toLowerCase().includes(word) : false;

        return namedMatch || descriptionMatch;
    })
    return(
        <div>
            <div className="mb-2 flex justify-center">
                <input type="text" 
                onChange={(e)=>setSearch(e.target.value)}
                value={search}
                placeholder="Search products" 
                className="w-full max-w-md rounded-md border-2 border-gray-300 px-4 py-2 focus:outline-none"
                />
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProduct.map((product, key)=>{
                    return(
                        <li key={key}>
                            <ProductCard product={product}/>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}