import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLink = [
  {
    title: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebookF className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    title: "Twitter",
    href: "https://twitter.com",
    icon: <FaTwitter className="w-5 h-5" />,
  },
  {
    title: "YouTube",
    href: "https://youtube.com",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  {
    title: "LinkedIn",
    href: "https://linkedin.com",
    icon: <FaLinkedinIn className="w-5 h-5" />,
  },
  {
    title: "GitHub",
    href: "https://github.com",
    icon: <FaGithub className="w-5 h-5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
  <div className={cn("flex items-center gap-3.5", className)}>
    {socialLink?.map((item) => {
      const Icon = item.icon;

      return (
        <Tooltip key={item.title}>
          <TooltipTrigger
            render={
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect",
                  iconClassName
                )}
              >
               {item.icon}
              </Link>
            }
          />

          <TooltipContent
            className={cn(
              "bg-white text-darkColor font-semibold",
              tooltipClassName
            )}
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    })}
  </div>
</TooltipProvider>
  );
};

export default SocialMedia;
