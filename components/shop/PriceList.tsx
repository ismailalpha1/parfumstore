import { RadioGroup } from "@base-ui/react";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";
import { Title } from "../ui/text";

const priceArray = [
  {title: "Under $50", value: "under-50" },
  {title: "$50 to $100", value: "50-100" },
  {title: "$100 to $200", value: "100-200" },
  {title: "$200 & Above", value: "200-above" },
];

interface Props {
  selectedPrice: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className='w-full bg-white p-5'>
      <Title className='text-base font-black'>Prices</Title>
      <RadioGroup className="mt-2 space-y-1">
        {priceArray.map((price, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedPrice(price.value)}
            className='flex items-center space-x-2 hover:cursor-pointer'
          >
            <RadioGroupItem 
              id={price.value}
              value={price.value}
              className="rounded-sm"
            >
              <Label
                htmlFor={price.value}
                className={`${selectedPrice === price.value ? "text-shop_dark_green font-semibold" : "font-normal"}`}
              >
                {price.title}
              </Label>
            </RadioGroupItem>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] text-shop_dark_green hoverEffect text-left"
        >
          Reset Selection
        </button>
      )}
    </div>
  )
}

export default PriceList