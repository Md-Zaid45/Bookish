"use client";

import config from "@/lib/config";
import { Video } from "@imagekit/next";
import { buildVideoPoster } from "@/lib/video";

const BookVideo = ({ url }: { url: string }) => {
  if (!url?.trim()) return null;

  return (
    <div>
      <Video
        urlEndpoint={config.env.imagekit.urlEndpoint}
        src={url.trim()}
        controls
        preload="none"
        poster={buildVideoPoster(url)}
        className="aspect-video w-full rounded-xl bg-black object-contain"
      />
    </div>
  );
};

export default BookVideo;
