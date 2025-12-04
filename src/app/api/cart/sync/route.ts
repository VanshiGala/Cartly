//handling POST req for syncing cart with db
import { NextResponse } from "next/server"; //to return server response
import { prisma } from "../../../../lib/prisma"; //to talk with db
import { getServerSession } from "next-auth"; //read session data on server
import { authOptions } from "../../../api/auth/[...nextauth]/options"; //getServerSession() to know how to handle session

export async function POST(request: Request) {
  const session = await getServerSession(authOptions); //gets logged-in user session on server

  //console.log("SESSION IN SYNC ROUTE:", session);

  if (!session?.user?.id) {
    //console.log("NO SESSION OR NO ID → 401");
    return new Response("Unauthorized", { status: 401 });
  } //never sync cart for unauthorized users

  //fetch user from db
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
  });

 // console.log("FOUND USER:", user?.id, user?.email);

  if (!user) return new Response("User not found", { status: 404 });

  const { items } = await request.json(); //payload
 // console.log("RECEIVED ITEMS:", items);


  //check if the user has cart in db
  let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: user.id } });
    //console.log("CREATED NEW CART:", cart.id);
  }

for (const item of items) {
  //console.log("Processing item:", item.id, item.name, "qty:", item.quantity);

  try {
    let product = await prisma.product.findUnique({
      where: { stripeProductId: item.id },
    });

    if (!product) {
      // console.log("Product missing → creating with data:", {
      //   name: item.name,
      //   price: item.price,
      //   imageUrl: item.imageUrl?.slice(0, 50) + "...",
      //   stripeProductId: item.id,
      // });

      //create product in db
      product = await prisma.product.create({
        data: {
          name: item.name,
          price: item.price,         
          imageUrl: item.imageUrl,
          stripeProductId: item.id,
        },
      });

      //console.log("SUCCESS → Product created with internal id:", product.id);
    } else {
      //console.log("Product already exists → id:", product.id);
    }

    // CartItem upsert
    await prisma.cartItem.upsert({ //upsert -> update if exists otherwise create
      where: {
        //cartId_productId -> composite unique key -> guarantees 1 item pp; no duplicates; qty updated
        cartId_productId: { cartId: cart.id, productId: product.id },
      },
      update: { quantity: item.quantity },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: item.quantity,
      },
    });
    //console.log("CartItem upserted");

  } catch (error: any) {
    //console.error("FATAL ERROR IN SYNC LOOP:", error);
    //console.error("Error code:", error.code);
    //console.error("Error message:", error.message);
    throw error; // 500 in browser + full stack
  }
}

  //console.log("SYNC SUCCESSFUL FOR USER:", user.id);
  return NextResponse.json({ success: true });
}














//flow:
//Check authentication
//Find user in DB
//Get/create cart
//Loop through items
//Ensure product exists
//Upsert cart item
//Return success