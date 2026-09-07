"use client";

import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Adress } from "@/sanity.types";
import Container from "@/components/Container";
import NoAccess from "@/components/NoAccess";
import EmptyCart from "@/components/EmptyCart";
import { ShoppingBag, Trash } from "lucide-react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddToWishlistButton from "@/components/AddToWishlistButton";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { Address } from "cluster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  const groupedItems = useStore((state) => state.getGroupedItems());

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [addresses, setAddresses] =useState<Adress[] | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<Adress | null>(null);
  
  const fetchAdresses = async() => {
    setLoading(true);
    try{
      const query = `*[_type == "adress"]|order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr:Adress)=> addr.default);
      if(defaultAddress){
        setSelectedAddress(defaultAddress);
      }else if(data.length > 0){
        setSelectedAddress(data[0]);
      }
    }catch(error) {
      console.log("Adresses fetching error:",error);
    }finally {
      setLoading(false);
    }
  }
  
  const handleResetCart = ()=> {
    const confirmed = window.confirm("Are you sure you want to reset your cart?");
    if(confirmed){
      resetCart();
      toast.success("Cart reset successfully");
    }
  };

  const handleCheckout = async() => {
    setLoading(true);
    try{
      const metadata:Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        adress: selectedAddress
      };
      // if(groupedItems && groupedItems?.length>0){
        const checkoutUrl = await createCheckoutSession(groupedItems, metadata)
        if(checkoutUrl){
          window.location.href = checkoutUrl
        }
      // }
    } catch(error){
      console.error("Error creating checkout session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {!groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex
                              items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-60 object-cover 
                              group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  variant:{" "}
                                  <span className="font-semibold">
                                    {product?.variant}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {product?.status}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AddToWishlistButton 
                                      product={product}
                                      className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash onClick={()=> {
                                         deleteCartProduct(product?._id);
                                        toast.success("Product deleted successfully")
                                      }
                                    }
                                      className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div>
                            <PriceFormatter 
                              amount={(product?.price as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product}/>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                    onClick={handleResetCart}
                    className="m-5 font-semibold"
                    variant="destructive"
                    >
                      Reset Cart
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getSubTotalPrice()}/>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()}/>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                          <span>Total</span>
                          <PriceFormatter 
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                            />
                        </div>
                        <Button 
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading ? "Proceed to Checkout":"Proceed to Checkout"}
                        </Button>
                      </div>
                    </div>
                    {addresses && (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              defaultValue={addresses?.find((addr)=> addr.default)
                                ?._id.toString()}
                            >
                              {addresses?.map((address)=>(
                                <div 
                                  key={address?._id}
                                  onClick={() => setSelectedAddress(address)}
                                  className={`flex items-center space-x-2 mb-4 cursor-pointer
                                    ${selectedAddress?._id === address?._id && "text-shop_dark_green"}`}
                                  >
                                  <RadioGroupItem 
                                  value={address?._id.toString()} />
                                  <Label
                                    htmlFor={`address-${address?._id}`}
                                    className="grid gap-1.5 flex-1"
                                    >
                                    <span className="font-semibold">{address?.name}</span>
                                    <span className="text-sm text-black/60">
                                      {address.adress}, {address.city},{" "}
                                      {address.zip}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <Button variant="outline" className="w-full mt-4">
                              Add New Adress
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                    <div className="bg-white p-4 rounded-lg border mx-4">
                      <h2>Order Summary</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getSubTotalPrice()}/>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()}/>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                          <span>Total</span>
                          <PriceFormatter 
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                            />
                        </div>
                        <Button 
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading ? "Proceed to Checkout":"Proceed to Checkout"}
                        </Button>
                      </div>
                    </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess details="" />
      )}
    </div>
  );
};

export default CartPage;
