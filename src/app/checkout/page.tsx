"use client";

import { useCartStore } from "src/store/cart-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckoutAction } from "./checkout-action";
import {useSession} from "next-auth/react"


export default function Checkout() {
  const { items, removeItem, addItem, clearCart } = useCartStore();
  const {data:session} = useSession()
  //console.log("CHECKOUT ITEMS:", items);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

//   const safeItems = Array.isArray(items) ? items : [];
// const total = safeItems.reduce(
//   (acc, item) => acc + item.price * item.quantity,
//   0
// );

  if (total == 0 || items.length == 0) {
    return (
      <div>
        <h1 className="text-black">Your Cart is empty</h1>
      </div>
    );
  }
  const handleProceed = (e: React.FormEvent<HTMLFormElement>) => {
    if (!session) {
      e.preventDefault();// prevent form submission
      window.location.href="/sign-in" // redirect to sign-in , built-in browser property
      return;
    }
    // user is signed in → form submits normally to CheckoutAction
  };
  return (
    <div>
      <h1>Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order-Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {items.map((item, key) => (
              <li key={key} className="flex flex-col gap-2 border-b pb-2">
                <div className="flex justify-center">
                  <span className="font-medium">{item.name} </span>
                  <span className="font-semibold">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => removeItem(item.id)}>
                    -
                  </Button>
                  <span className="text-lg font-semibold p-2">
                    {item.quantity}
                  </span>
                  <Button onClick={() => addItem(item)}>+</Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t pt-2 text-lg font-semibold">
            Total : ${(total / 100).toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <form className="max-w-md mx-auto" action={CheckoutAction} onSubmit={handleProceed}> 
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <Button type="submit" variant="default" className="w-full mt-2">
          Proceed to Pay
        </Button>
      </form>
    </div>
  );
}




//In Next.js Server Actions, the action attribute of a <form> lets your form directly call a server function when the user clicks Submit.