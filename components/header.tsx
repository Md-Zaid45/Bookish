"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Header = () => {
  const pathname = usePathname();
  return (
    <header className="flex justify-between gap-5 mt-10">
      <Image src="/icons/logo.svg" width={35} height={35} alt="logo"></Image>
      <Link
        href="/"
        className={cn(
          `cursor-pointer text-base capitalize `,
          pathname == "/" ? "text-light-200" : "",
        )}
      >
        Bookish
      </Link>

      <ul className="mx-auto flex flex-row gap-8 justify-between text-white">
        <li>
          <Link
            href="/"
            className={cn(
              `cursor-pointer text-base capitalize `,
              pathname == "/" ? "text-light-200" : "",
            )}
          >
            Library
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className={cn(
              `cursor-pointer text-base capitalize `,
              pathname == "/library" ? "text-light-200" : "text-light-100",
            )}
          >
            Search
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className={cn(
              `cursor-pointer text-base capitalize `,
              pathname == "/profile" ? "text-light-200" : "text-light-100",
            )}
          >
            Profile
          </Link>
        </li>
      </ul>
    </header>
  );
};
export default Header;
