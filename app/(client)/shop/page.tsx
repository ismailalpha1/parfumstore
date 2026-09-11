import { getAllBrands, getCategories } from "@/sanity/queries";
import Shop from "@/components/Shop";

const ShopPage = async () => {
    const categories = (await getCategories()) as any;
    const brands = (await getAllBrands()) as any;
  return (
    <div className="bg-white">
      <Shop categories={categories} brands={brands} />
    </div>
  )
}

export default ShopPage