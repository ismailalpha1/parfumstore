"use client";
import { cn } from '@/lib/utils';
import { Product } from '@/sanity.types';
import useStore from '@/store';
import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const AddToWishlistButton = ({
    product,
    className,
}:{
    product:Product;
    className?:string;
}) => {
    const {favoriteProduct, addToFavorite} = useStore();
    const [existingProduct, setExistingProduct] = useState<Product | null>(null);
    useEffect(()=>{
        const availableProduct = favoriteProduct?.find(
            (item) => item?._id === product?._id
        );
        setExistingProduct(availableProduct || null);
    }, [product, favoriteProduct]);
    const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
        
    };
  return (
    <div className={cn("absolute top-2 right-2 z-10", className)}>
        <div
        onClick={handleFavorite} className='p-2.5 rounded-full hover:bg-shop_dark_green 
        hover:text-white hoverEffect bg-shop_lighter_bg'>
            <Heart size={15}/>
        </div>
    </div>
  )
}

export default AddToWishlistButton