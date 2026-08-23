"use client";
import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  return (
    <div className="admin-sidebar justify-between">
      <div>
      <div className="logo">
        <Image
          src="/icons/admin/logo.svg"
          alt="logo"
          width={37}
          height={37}
        ></Image>
        <h1>Bookish</h1>
      </div>
      <div className=" flex flex-col gap-5 ">
        {adminSideBarLinks.map((link) => {
          const isSelected =
            (link.route != "/admin" &&
              pathname.includes(link.route) &&
              link.route.length > 0) ||
            link.route == pathname;

          return (
            <Link href={link.route} key={link.route} className="ml-0 pl-0">
              <div
                className={cn(
                  "link ",
                  isSelected && "bg-primary-admin shadow-sm",
                )}
              >
                <div className="relative  size-5">
                  {" "}
                  <Image
                    src={link.img}
                    alt="img"
                    fill
                    className={
                      isSelected ? `brightness-0 invert ` : "object-contain"
                    }
                  ></Image>
                  <p
                    className={cn(
                      isSelected
                        ? "text-white ml-7  w-50"
                        : "text-dark ml-7  w-50",
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div></div>
      <div className="user">
              <Avatar className=''>
        <AvatarFallback>{session?.user?.name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-md:hidden">
        <p className="font-semibold text-dark-200">{session?.user?.name}</p>
        <p className="text-xs text-light-500 ">{session?.user?.email}</p>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
