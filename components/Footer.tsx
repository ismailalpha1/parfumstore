import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getCategories } from "@/sanity/queries";
import { Category } from "@/sanity.types";

const Footer = async () => {
  const categories = (await getCategories()) as Category[];

  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              Yao is a modern cosmetics store dedicated to bringing beauty, confidence, and self-care into your everyday life. We offer a carefully selected range of cosmetics, skincare, haircare, fragrances, and beauty essentials designed to help you look and feel your best.
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>Quick Links</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinksData?.map((item)=>(
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-shop_light_green hoverEffect font-medium">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Categories</SubTitle>
            <ul className="space-y-3 mt-4">
              {categories
                .filter((category) => category.slug?.current)
                .map((category) => (
                <li key={category._id}>
                  <Link href={`/category/${category.slug?.current}`} className="hover:text-shop_light_green hoverEffect font-medium">{category.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <SubTitle>Newsletter</SubTitle>
            <SubText>Subscribe to our newsletter to receive updates</SubText>
            <form action="" className="space-y-3">
              <Input placeholder="Enter your Email" type="email" required/>
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
            <p>
              {new Date().getFullYear()}{" "}
              <a href="#" className="text-darkColor font-black tracking-wider uppercase hover:text-shop_dark_green hoverEffect group font-sans">
                ISMAIL JALALI {" "}
              </a>
              All rights reserved
            </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
