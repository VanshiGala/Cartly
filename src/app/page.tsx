import { Button } from "./components/ui/button";
import { stripe } from "../lib/stripe";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "./components/carousel";
import { ShoppingBag, Sparkles, Truck, Shield } from "lucide-react";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"], //Fetch full price details instead of just IDs.
    limit: 5,
  });
  return (
    <div>
      <section className="relative overflow-hidden `bg-gradient-to-br` from-black via-gray-900 to-black text-white">
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-black">
              Welcome to Cartly!
            </h1>
            <p className="text-xl text-black max-w-2xl">
              Discover the latest products at the best prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-semibold text-lg px-8"
                >
                  Browse All Products
                </Button>
              </Link>
            </div>
            
          </div>
          <div className="flex-1">
            <div className="relative">
              <Image
                src={products.data[1].images[0]}
                alt="Banner img"
                width={350}
                height={350}
                className="rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
       
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: Shield, title: "Secure Payment", desc: "100% protected" },
            {
              icon: ShoppingBag,
              title: "Easy Returns",
              desc: "30-day guarantee",
            },
          ].map((feat) => (
            <div key={feat.title} className="text-center">
              <feat.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-lg">{feat.title}</h3>
              <p className="text-gray-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <Carousel products={products.data} />
        </div>
      </section>
    </div>
  );
}
