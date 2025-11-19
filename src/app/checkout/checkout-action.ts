"use server";

import { CartItem } from "@store/cart-store"
import { redirect } from "next/navigation";
import { stripe } from "src/lib/stripe";

export const CheckoutAction = async(formData:FormData): Promise<void> =>{
    //form sends items as hidden field
    const itemsJson = formData.get("items") as string
    //convert it back to an array of objects
    const items = JSON.parse(itemsJson)
    //stripe needs items in this shape
    const line_items = items.map((item:CartItem)=>({ //line_items -> a field defined by Stripe's API
        price_data:{
            currency:"cad",
            product_data:{name:item.name},
            unit_amount:item.price
        },
        quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], //accept only card
        line_items, //user selected items
        mode:"payment",
        success_url:`${process.env.NEXT_PUBLIC_BASE_URL}/success`, //return home page || create thankyou page
        cancel_url:`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    });

    redirect(session.url!)
}






//When you initiate a payment with Stripe Checkout, you don’t send card details yourself.
//Instead, you ask Stripe to prepare a Checkout Session.
//A session is like a temporary order stored on Stripe.