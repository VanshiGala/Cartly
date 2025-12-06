import { stripe } from "../../lib/stripe";
import { ProductList } from "../components/productList"; 

export default async function Products(){
      const products = await stripe.products.list({
          expand: ["data.default_price"],
      });
    return(
        <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-300 text-black py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">All Products</h1>
        </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16">
        <ProductList products={products.data} />
      </div>
    </div>
    )
}