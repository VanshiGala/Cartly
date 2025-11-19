import { Button } from "./components/ui/button";
import { stripe } from "../lib/stripe";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "./components/carousel";


export default async function Home() {
  const products = await stripe.products.list({
      expand: ["data.default_price"],
      limit: 5,
  });
  return (
<div>
  <section className="flex justify-center items-center py-16 bg-neutral-100">
    <div className="max-w-6xl w-full bg-white rounded-2xl shadow-sm py-12 px-8 grid grid-cols-1 sm:grid-cols-2 items-center justify-items-center gap-8">
      <div className="text-center sm:text-left space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Cartly!</h1>
        <p className="text-gray-600">
          Discover the latest products at the best prices.
        </p>
        <Link href="/products">
        <button className="mt-4 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition cursor-pointer">
          Browse All Products
        </button>
        </Link>
      </div>
      <div>
        <Image
          src={products.data[1].images[0]}
          alt="Banner img"
          width={350}
          height={350}
          className="rounded-lg object-contain"
        />
      </div>

    </div>
  </section>

  <section className="flex justify-center items-center py-6 bg-neutral-100">
    <div className="max-w-6xl w-full">
      <Carousel products={products.data}/>
    </div>
  </section>
</div>
  )}