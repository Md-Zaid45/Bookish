"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Session } from "next-auth";
import { Search } from "lucide-react";

const NAV_ITEMS = [{ label: "Library", href: "/" }];

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const name = session?.user?.name?.trim() ?? "";
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/5 pb-5">
      <Link href="/" className="group flex shrink-0 items-center gap-2">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="Bookish logo"
          className="size-7 xs:size-8"
        />
        <span className="font-bebas-neue text-xl capitalize text-light-100 transition-colors group-hover:text-light-200 xs:text-2xl">
          Bookish
        </span>
      </Link>

      <nav className="flex flex-1 justify-center">
        <ul className="flex items-center gap-5 text-base xs:gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "relative capitalize transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                  pathname === item.href
                    ? "text-light-200 after:w-full"
                    : "text-light-100 hover:text-light-200",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-1.5 xs:gap-2.5">
        <button
          type="button"
          aria-label="Open search"
          title="Search"
          className="grid size-10 shrink-0 place-items-center rounded-full text-light-100 transition-all duration-300 hover:bg-dark-600/60 hover:text-primary"
        >
          <Search className="size-[18px]" />
        </button>

        <Link
          href="/my-profile"
          aria-label="My profile"
          title="My profile"
          className="flex items-center rounded-full p-0.5 transition-shadow hover:ring-1 hover:ring-primary/60"
        >
          <Avatar
            className={cn(
              "transition-shadow",
              pathname === "/my-profile" && "ring-2 ring-primary",
            )}
          >
            <AvatarFallback className="bg-dark-600 font-semibold text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
};
export default Header;
