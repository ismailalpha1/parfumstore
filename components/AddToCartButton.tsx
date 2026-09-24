"use client";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import Link from "next/link";

interface Props {
  product: any;
  className?: string;
}
const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(
        `${product?.name?.substring(0, 12)}... added successfully!`,
      );
    } else {
      toast.error("Can not add more than available stock");
    }
  };
  return (
    <div className="w-full min-h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full space-y-2">
          <div className="flex items-center justify-between">
            <span  className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons product={product}/>
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span>Subtotal</span>
            <PriceFormatter amount={product?.price ? product?.price * itemCount : 0}/>
          </div>
          <Button
            asChild
            className="w-full border-shop_dark_green bg-shop_dark_green text-white hover:border-shop_dark_green hover:bg-white hover:text-shop_dark_green hoverEffect"
          >
            <Link href="/cart">Go to Shopping Cart</Link>
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full  bg-shop_dark_green/80 text-shop_light_bg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className,
          )}
        >
          <ShoppingBag />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
