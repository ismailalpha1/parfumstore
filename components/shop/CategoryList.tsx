import { Category } from "@/sanity.types";
import React from "react";
import { Title } from "../ui/text";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}
const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Product Categories</Title>
      <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
        {categories?.map((category) => (
          <div key={category._id} className="flex items-center space-x-2">
            <RadioGroupItem
              id={category?.slug?.current}
              value={category?.slug?.current as string}
              className="rounded-sm"
              onClick={() => {
                setSelectedCategory(category?.slug?.current as string);
              }}
            />
            <Label
              htmlFor={category?.slug?.current}
              className={`hover:cursor-pointer ${selectedCategory === category?.slug?.current ? "text-shop_dark_green font-semibold" : "font-normal"}`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {/* <RadioGroup
        value={selectedCategory || ""}
        className="mt-2 space-y-2"
        onValueChange={(value) => setSelectedCategory(value || null)}
      >
        {categories?.map((category) => {
          const value = category?.slug?.current as string;

          return (
            <label
              key={category._id}
              htmlFor={value}
              className="flex cursor-pointer items-center gap-2"
            >
              <RadioGroupItem
                id={value}
                value={value}
                className="rounded-sm"
              />

              <span
                className={
                  selectedCategory === value
                    ? "text-shop_dark_green font-semibold"
                    : "font-normal"
                }
              >
                {category?.title}
              </span>
            </label>
          );
        })}
      </RadioGroup> */}
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] text-shop_dark_green hoverEffect text-left"
        >
          Reset Selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;
