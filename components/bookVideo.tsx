"use client";

import config from "@/lib/config";
import { Video } from "@imagekit/next";
import { buildVideoPoster, VIDEO_PREVIEW_CLASSES } from "@/lib/video";

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
        className={VIDEO_PREVIEW_CLASSES}
      />
    </div>
  );
};

export default BookVideo;
