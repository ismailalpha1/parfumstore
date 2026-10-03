"use client";

import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";
import { createOrder, OrderMetadata } from "@/actions/createOrder";
import { createAddress } from "@/actions/createAddress";

const CartPage = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    email: "",
    adress: "",
    city: "",
    zip: "",
    isDefault: false,
  });

  const [savingAddress, setSavingAddress] = useState(false);
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
    if (!user?.id) return;
    setLoading(true);
    try{
      const query = `*[
        _type == "adress" &&
        clerkUserId == $clerkUserId
      ] | order(publishedAt desc)`;

      const data = await client.fetch(query, {
        clerkUserId: user?.id,
      });
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

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchAdresses();
    }
  }, [isSignedIn, user?.id]);
  
  const handleResetCart = ()=> {
    const confirmed = window.confirm("Are you sure you want to reset your cart?");
    if(confirmed){
      resetCart();
      toast.success("Cart reset successfully");
    }
  };

  const handleAddAddress = async () => {
    if (!user?.id) {
      toast.error("Please sign in first.");
      return;
    }

    if (!addressForm.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!addressForm.adress.trim()) {
      toast.error("Please enter your address.");
      return;
    }

    if (!addressForm.city.trim()) {
      toast.error("Please enter your city.");
      return;
    }

    if (!addressForm.zip.trim()) {
      toast.error("Please enter your ZIP code.");
      return;
    }

    setSavingAddress(true);

    try {
      const result = await createAddress({
        name: addressForm.name,
        email: addressForm.email,
        adress: addressForm.adress,
        city: addressForm.city,
        zip: addressForm.zip,
        clerkUserId: user.id,
        isDefault: addressForm.isDefault,
      });

      if (!result.success) {
        throw new Error("Failed to create address.");
      }

      toast.success("Address added successfully!");

      /*
      * Close form
      */
      setShowAddressForm(false);

      /*
      * Reset form
      */
      setAddressForm({
        name: "",
        email: "",
        adress: "",
        city: "",
        zip: "",
        isDefault: false,
      });

      /*
      * Refresh addresses
      */
      await fetchAdresses();

      /*
      * Automatically select the new address
      */
      if (result.address) {
        setSelectedAddress(result.address as Adress);
      }
    } catch (error) {
      console.error("❌ Error adding address:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add address.",
      );
    } finally {
      setSavingAddress(false);
    }
  };
  // const handleCheckout = async() => {
  //   setLoading(true);
  //   try{
  //     const metadata:OrderMetadata = {
  //       orderNumber: crypto.randomUUID(),
  //       customerName: user?.fullName ?? "Unknown",
  //       customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
  //       clerkUserId: user?.id,
  //       adress: selectedAddress
  //     };
  //     // if(groupedItems && groupedItems?.length>0){
  //       const checkoutUrl = await createOrder(groupedItems, metadata)
  //       if(checkoutUrl){
  //         window.location.href = checkoutUrl
  //       }
  //     // }
  //   } catch(error){
  //     console.error("Error creating checkout session");
  //     if (error instanceof Error) {
  //       console.error("Message:", error.message);
  //       console.error("Stack:", error.stack);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!groupedItems || groupedItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("Please sign in before checking out");
      return;
    }

    setLoading(true);

    try {
      const orderNumber = crypto.randomUUID();

      const metadata: OrderMetadata = {
        orderNumber,

        customerName: user.fullName ?? "Unknown",

        customerEmail:
          user.emailAddresses[0]?.emailAddress ?? "",

        clerkUserId: user.id,

        address: {
          _id: selectedAddress._id,
          name: selectedAddress.name,
          adress: selectedAddress.adress,
          city: selectedAddress.city,
          zip: selectedAddress.zip,
        },
      };

      const result = await createOrder(
        groupedItems,
        metadata,
      );

      if (!result.success) {
        throw new Error("Could not create order");
      }

      toast.success("Order placed successfully!");

      resetCart();

      window.location.href =
        `/success?orderNumber=${result.orderNumber}`;
    } catch (error) {
      console.error("❌ Checkout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your order.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
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
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group h-32 md:h-40 w-32 md:w-40 shrink-0"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={250}
                                  height={250}
                                  loading="lazy"
                                  className="w-full h-full object-contain 
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
                              <div className="flex h-10 items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    {/* <TooltipTrigger asChild> */}
                                    <TooltipTrigger render={<AddToWishlistButton
                                      product={product}
                                      className="relative top-0 right-0 shrink-0"
                                      />} />
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    {/* <TooltipTrigger asChild> */}
                                    <TooltipTrigger render={<button
                                      type="button"
                                      aria-label="Remove product"
                                      className="shrink-0 text-gray-500 hover:text-red-600 hoverEffect"
                                      onClick={()=> {
                                         deleteCartProduct(product?._id);
                                        toast.success("Product deleted successfully")
                                      }
                                    } />}>
                                      <Trash className="w-5 h-5" />
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
                          {loading ? "Placing Order..." : "Place Order"}
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
                            <Button variant="outline" className="w-full mt-4" onClick={() => setShowAddressForm(true)}>
                              Add New Adress
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    {showAddressForm && (
                      <Card className="mt-5">
                        <CardHeader>
                          <CardTitle>Add New Address</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Name */}
                          <div className="space-y-2">
                            <Label htmlFor="address-name">
                              Full Name
                            </Label>

                            <input
                              id="address-name"
                              type="text"
                              value={addressForm.name}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  name: e.target.value,
                                })
                              }
                              placeholder="John Doe"
                              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="address-email">
                              Email
                            </Label>

                            <input
                              id="address-email"
                              type="text"
                              value={addressForm.email}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  email: e.target.value,
                                })
                              }
                              placeholder="John Doe"
                              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                            />
                          </div>

                          {/* Address */}
                          <div className="space-y-2">
                            <Label htmlFor="address">
                              Address
                            </Label>

                            <input
                              id="address"
                              type="text"
                              value={addressForm.adress}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  adress: e.target.value,
                                })
                              }
                              placeholder="123 Main Street"
                              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                            />
                          </div>

                          {/* City */}
                          <div className="space-y-2">
                            <Label htmlFor="city">
                              City
                            </Label>

                            <input
                              id="city"
                              type="text"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  city: e.target.value,
                                })
                              }
                              placeholder="Los Angeles"
                              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                            />
                          </div>

                          {/* ZIP */}
                          <div className="space-y-2">
                            <Label htmlFor="zip">
                              ZIP Code
                            </Label>

                            <input
                              id="zip"
                              type="text"
                              value={addressForm.zip}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  zip: e.target.value,
                                })
                              }
                              placeholder="90001"
                              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                            />
                          </div>

                          {/* Default */}
                          <div className="flex items-center gap-2">
                            <input
                              id="default-address"
                              type="checkbox"
                              checked={addressForm.isDefault}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  isDefault: e.target.checked,
                                })
                              }
                            />

                            <Label htmlFor="default-address">
                              Make this my default address
                            </Label>
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              disabled={savingAddress}
                              onClick={() => {
                                setShowAddressForm(false);

                                setAddressForm({
                                  name: "",
                                  email: "",
                                  adress: "",
                                  city: "",
                                  zip: "",
                                  isDefault: false,
                                });
                              }}
                            >
                              Cancel
                            </Button>

                            <Button
                              className="flex-1"
                              disabled={savingAddress}
                              onClick={handleAddAddress}
                            >
                              {savingAddress
                                ? "Saving..."
                                : "Save Address"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
                          {loading ? "Placing Order..." : "Place Order"}
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
