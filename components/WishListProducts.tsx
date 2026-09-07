"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
const WishListProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState();
    const {favoriteProduct, removeFromFavorite, resetFavorite}= useStore();
    const loadMore = () => {
        setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
    };
  return (
    <Container>
        {favoriteProduct?.length > 0 ? 
        <>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="border-b">
                        <tr className="bg-black/5">
                            <th className="p-2 text-left">Image</th>
                            <th className="p-2 text-left hidden md:table-cell">Category</th>
                            <th className="p-2 text-left hidden md:table-cell">Type</th>
                            <th className="p-2 text-left hidden md:table-cell">Status</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-center md:text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favoriteProduct
                        ?.slice(0,visibleProducts)
                        ?.map((product: Product) => (
                            <tr key={product?._id} className="border-b">
                                <td className="px-2 py-4 flex items-center gap-2">
                                    <X 
                                    onClick={()=>{
                                        removeFromFavorite(product?._id)
                                        toast.success("Product removed from wishlist")
                                    }}
                                    size={18} 
                                    className="hover:text-red-600 hover:cursor-pointer hoverEffect"/>
                                    {product?.images && <Link href={`/product/${product?.slug?.current}`}>
                                        <Image 
                                            src={urlFor(product?.images[0]).url()}
                                            alt={"product image"}
                                            width={80}
                                            height={80}
                                            className="rounded-md group-hover:scale-105 hoverEffect 
                                            h-20 w-20 object-contain"
                                        />
                                    </Link>
                                    }
                                    <p className="line-clamp-1">{product?.name}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>    
        </>
        : (
            <div className="flex">
                <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full">
                    <Heart
                        className="h-12 w-12 text-muted-foreground"
                        strokeWidth={1.5}
                    />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Your wishlist is empty
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Items added to your wishlist will appear here
                    </p>
                </div>
                <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        )    
    }
    </Container>
  )
}

export default WishListProducts