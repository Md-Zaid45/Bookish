import config from "@/lib/config";
import { buildSrc } from "@imagekit/next";

export const VIDEO_PREVIEW_CLASSES =
  "aspect-video w-full max-w-md rounded-xl bg-black object-contain";

export const buildVideoPoster = (videoUrl: string) => {
  const path = videoUrl.trim().split("?")[0];
  const thumbnailPath = /\.(mp4|mov)$/i.test(path)
    ? `${path}/ik-thumbnail.jpg`
    : `${path}/ik-video.mp4/ik-thumbnail.jpg`;

  return buildSrc({
    urlEndpoint: config.env.imagekit.urlEndpoint!,
    src: thumbnailPath,
    transformation: [
      {
        startOffset: "2",
      },
    ],
  });
};
