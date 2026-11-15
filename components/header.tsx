"use client";
import { cn } from "@/lib/utils";
import { logOut } from "@/lib/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import { LogOut, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { label: "Library", href: "/" },
  { label: "Profile", href: "/my-profile" },
];

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/search?query=${encodeURIComponent(term)}`);
    closeSearch();
  };

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
        <div
          className={cn(
            "flex h-10 items-center overflow-hidden rounded-full bg-dark-300/60 ring-1 ring-inset transition-all duration-300 ease-out",
            searchOpen
              ? "w-52 gap-2 px-3 ring-primary/40 xs:w-72"
              : "w-10 px-0 ring-transparent",
          )}
        >
          <button
            type="button"
            aria-label="Open search"
            title="Search"
            onClick={() => setSearchOpen(true)}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full text-light-100 transition-all duration-300 hover:bg-dark-600/60 hover:text-primary",
              searchOpen && "w-0 opacity-0",
            )}
          >
            <Search className="size-[18px]" />
          </button>

          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 transition-opacity duration-200",
              searchOpen
                ? "opacity-100 delay-150"
                : "pointer-events-none opacity-0",
            )}
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search books..."
              aria-label="Search books"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-light-100/70 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className="grid size-6 shrink-0 place-items-center rounded-full text-light-100 transition-colors hover:bg-dark-600/60 hover:text-primary"
            >
              <X className="size-4" />
            </button>
          </form>
        </div>

        <form action={logOut}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Log out"
            title={
              session?.user?.name
                ? `Log out (${session.user.name})`
                : "Log out"
            }
            className="size-10 rounded-full bg-dark-300/60 text-light-100 ring-1 ring-inset ring-transparent transition-all hover:bg-dark-600/60 hover:text-primary"
          >
            <LogOut className="size-[18px]" />
          </Button>
        </form>
      </div>
    </header>
  );
};
export default Header;
