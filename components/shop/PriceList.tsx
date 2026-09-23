import { RadioGroup } from "@base-ui/react";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";
import { Title } from "../ui/text";

const priceArray = [
  {title: "Under 50DH", value: "under-50" },
  {title: "50DH to 100DH", value: "50-100" },
  {title: "100DH to 200DH", value: "100-200" },
  {title: "200DH & Above", value: "200-above" },
];

interface Props {
  selectedPrice: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className='w-full bg-white p-5'>
      <Title className='text-base font-black'>Prices</Title>
      <RadioGroup className="mt-2 space-y-1"
        value={selectedPrice ?? ""}
        onValueChange={(value) => setSelectedPrice(value)}
      >
        {priceArray.map((price) => (
          <label
            key={price.value}
            htmlFor={price.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RadioGroupItem
              id={price.value}
              value={price.value}
              className="rounded-sm"
            />
            <span
              className={
                selectedPrice === price.value
                  ? "text-shop_dark_green font-semibold"
                  : "font-normal"
              }
            >
              {price.title}
            </span>
          </label>
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