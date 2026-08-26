import { cn } from "@/lib/utils";
import BookCoverSvg from "./BookCoverSvg (1)";
import { Image, ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";

type BookCoverVarient = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVarient, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVarient;
  coverColor: string;
  coverImage: string;
}

const Bookcover = ({
  variant = "regular",
  className,
  coverColor = "012B48",
  coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      <BookCoverSvg coverColor={coverColor} />
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
          <Image
            src={coverImage}
            alt="Book-cover"
            fill
            className="rounded-sm object-fill"
            loading="lazy"
           
          />
        </ImageKitProvider>
      </div>
    </div>
  );
};

export default Bookcover;
