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
            <RadioGroup
                value={selectedBrand || ""}
                className="mt-2 space-y-2"
                onValueChange={(value) => setSelectedBrand(value || null)}
            >
                {brands?.map((brand) => {
                const value = brand?.slug?.current as string;

                return (
                    <label
                    key={brand._id}
                    htmlFor={value}
                    className="flex cursor-pointer items-center gap-2"
                    >
                    <RadioGroupItem id={value} value={value} className="rounded-sm" />

                    <span
                        className={
                        selectedBrand === value
                            ? "text-shop_dark_green font-semibold"
                            : "font-normal"
                        }
                    >
                        {brand.title}
                    </span>
                    </label>
                );
                })}
            </RadioGroup>
                {selectedBrand && (
                    <button 
                        onClick={() => setSelectedBrand(null)}
                        className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] text-shop_dark_green hoverEffect text-left"
                    >
                        Reset Selection
                    </button>
                )}
        </div>
  )
}

export default BrandList