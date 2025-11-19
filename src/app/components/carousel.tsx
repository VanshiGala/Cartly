"use client"
import Stripe from "stripe"
import { Card, CardContent, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import Image from "next/image"

//prop interface -> Full autocomplete, errors at compile, type safety
//use interface so that components know exactly what type of props it recieves
interface props{
    products:Stripe.Product[]
}

export const Carousel=({products}:props)=>{
    const [current, setCurrent] = useState<number>(0);
    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrent((prev)=>(prev+1)%products.length);
        },3000);

        return ()=>clearInterval(interval)
    },[products.length]);

    const currentProduct = products[current]
    const price = currentProduct.default_price as Stripe.Price;

    return(
        <div>
            <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300">
                {currentProduct.images && currentProduct.images[0] && (
                    <div className="relative h-80 w-full">
                        <Image 
                        alt={currentProduct.name} 
                        src={currentProduct.images[0]} 
                        layout="fill" 
                        objectFit="cover"
                        className="transition-opacity duration-500 ease-in-out"
                        />
                    </div>
                )}
                <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                    <CardTitle className="text-3xl font-bold text-white mb-2">
                        {currentProduct.name}
                    </CardTitle>
                    {price && price.unit_amount && (
                    <p className="text-xl text-black">
                        ${(price.unit_amount / 100).toFixed(2)}
                    </p>)}
                </CardContent>
            </Card>
        </div>
    )
}


























//overflow-hidden -> hides anything that goes beyond card
//shadow-md -> medium shadow
//inset-0 -> short for top,right,bottom,left