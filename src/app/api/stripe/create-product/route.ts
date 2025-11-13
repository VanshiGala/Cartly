import Stripe from "stripe"; 
import { NextResponse } from "next/server";

//create new stripe instance 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    //extract the data fields from req
    const { name, description, image, price } = body;

    // Create Product in Stripe
    //calls Stripe's product API
    const product = await stripe.products.create({
      name,
      description,
      images: [image],
    });
    console.log("Created product : ", product.id)
    
    // Create Price in Stripe
    const priceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100, // convert dollars to cents
      currency: "usd",
    });

    return NextResponse.json({
      message: "Product created successfully!",
      productId: product.id,
      priceId: priceObj.id,
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





