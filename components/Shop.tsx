"use client";

import { BRANDS_QUERY_RESULT, Category, Product } from "@/sanity.types";
import Container from "./Container";
import { Title } from "./ui/text";
import CategoryList from "./shop/CategoryList";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";


interface Props{
    categories: Category[];
    brands: BRANDS_QUERY_RESULT;
}
const Shop = ({ categories, brands }: Props) => {
    const searchParams = useSearchParams();
    const brandParams = searchParams.get("brand");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brandParams || null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  return (
    <div className="border-t">
        <Container className="mt-5">
            <div className="sticky top-0 z-10 mb-5">
                <div className="flex items-center justify-between">
                    <Title className="text-lg uppercase tracking-wide">
                        Get the products as you needs
                    </Title>
                    <button className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-shop_orange hoverEffect">Reset Filters</button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
                <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 scrollbar-hide md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
                    <CategoryList
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                    <BrandList
                        brands={brands}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                    />
                    <PriceList
                        setSelectedPrice={setSelectedPrice}
                        selectedPrice={selectedPrice}
                    />
                </div>
                <div>Products</div>
            </div>
        </Container>
    </div>
  )
}

export default Shop