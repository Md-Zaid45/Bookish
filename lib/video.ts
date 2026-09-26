import config from "@/lib/config";
import { buildSrc } from "@imagekit/next";

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
