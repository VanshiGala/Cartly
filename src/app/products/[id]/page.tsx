
import { stripe } from "../../../lib/stripe";
import { ProductDetail } from "../../../app/components/productDetail";

interface ParamsType {
  id: string;
}

export default async function ProductPage({ params }: { params: ParamsType | Promise<ParamsType> }) {
  // unwrap params if it's a Promise
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  if (!productId) throw new Error("Product ID is missing");

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });
  //console.log("PRODUCT:", product.default_price);

  return <ProductDetail product={JSON.parse(JSON.stringify(product))} />;
}//You are passing the Stripe Product object directly into a Client Component.
//Stripe's API returns class instances with methods → NOT serializable → Next.js refuses it.




