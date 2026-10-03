import Link from "next/link";
import { Title } from "./ui/text";
import { getAllBrands } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

const extraData = [
    {
        title: "Fast Delivery",
        description: "Fast shipping to All cities",
        icon:<Truck size={45}/>,
    },
    {
        title: "Fast Return",
        description:"Fast shipping",
        icon:<GitCompareArrows size={45}/>,
    },
    {
        title: "Customer Support",
        description: "Friendly 24/7 customer support",
        icon: <Headset size={45}/>
    },
    {
        title: "Money Back guarentee",
        description: "Quality checked by our team",
        icon: <ShieldCheck size={45}/>
    },
    
]

type Brand = {
    _id?: string;
    title?: string;
    image?: any;
    slug?: {
        current?: string;
    };
};

const ShopByBrands = async() => {
    const brands: Brand[] = ((await getAllBrands()) as Brand[] | null | undefined) ?? [];
  return (
    <div className="mb-10 lg:pb-20 bg-shop_light_bg p-5 lg:p-7 rounded-md">
        <div className="flex items-center gap-5 justify-between mb-10">
            <Title>Shop By Brands</Title>
            <Link 
                href={"/shop"}
                className="text-sm font-semibold tracking-wide hover:text-shop_btn_dark_green hoverEffect"
            >
                View all
            </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {brands.map((brand: Brand) => (
                <Link
                key={brand?._id}
                href={{pathname : "/shop", query:{brand:brand?.slug?.current}}}
                className="bg-white w-full min-w-0 h-24 flex items-center justify-center rounded-md
                overflow-hidden hover:shadow-lg shadow-shop_dark_green/20 hoverEffect">
                    {brand?.image ? (
                        <Image src={urlFor(brand.image).url()}
                            alt={brand.title || "Brand"}
                            width={250}
                            height={250}
                            className="w-32 h-20 object-contain"/>
                    ) : (
                        <span className="px-2 text-center text-sm font-semibold text-shop_dark_green">
                            {brand?.title || "Brand"}
                        </span>
                    )}
                </Link>
            ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        gap-4 mt-16 p-2 shadow-sm hover:shadow-shop_light_green/20 py-5">
            {extraData?.map((item, index)=>(
                <div 
                key={index}
                className="flex items-center gap-3 group text-lightColor hover:text_light_green"
                >
                    <span className="inline-flex scale-100 group-hover:scale-90 hoverEffect">
                        {item?.icon}
                    </span>
                    <div className="text-sm">
                        <p className="text-darkColor/80 font-bold capitalize">
                            {item?.title}
                        </p>
                        <p className="text-lightColor">{item?.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ShopByBrands