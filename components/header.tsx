"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Session } from "next-auth";

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
          <li>
            <Link
              href="/my-profile"
              aria-label="My profile"
              className="flex items-center"
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
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
