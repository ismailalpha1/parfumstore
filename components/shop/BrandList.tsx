import React from 'react'
import { Title } from '../ui/text';
import { RadioGroup } from '@base-ui/react';
import { BRANDS_QUERY_RESULT } from '@/sanity.types';
import { RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Props {
  brands: BRANDS_QUERY_RESULT;
  selectedBrand: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className='w-full bg-white p-5'>
            <Title className='text-base font-black'>Brands</Title>
            <RadioGroup value={selectedBrand || ""} className="mt-2 space-y-1">
                {brands?.map((brand) => (
                    <div 
                    onClick={()=>{
                        setSelectedBrand(brand?.slug?.current as string);
                    }}
                    key={brand._id} className='flex items-center space-x-2 hover:cursor-pointer'>
                        <RadioGroupItem 
                            id={brand?.slug?.current}
                            value={brand?.slug?.current as string}
                            className="rounded-sm"
                        >
                        <Label 
                            htmlFor={brand?.slug?.current}
                            className={`${selectedBrand === brand?.slug?.current ? "text-shop_dark_green font-semibold" : "font-normal"}`}>
                            {brand?.title}
                        </Label>
                    </RadioGroupItem>
                    </div>
                ))}
                {selectedBrand && (
                    <button 
                        onClick={() => setSelectedBrand(null)}
                        className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] text-shop_dark_green hoverEffect text-left"
                    >
                        Reset Selection
                    </button>
                )}
            </RadioGroup>
        </div>
  )
}

export default BrandList