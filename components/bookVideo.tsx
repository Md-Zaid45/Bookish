import config from "@/lib/config";
import { Video } from "@imagekit/next";

const BookVideo = ({url}:{url:string}) => {
  return (
    <div>
      <Video
      urlEndpoint={config.env.imagekit.urlEndpoint}
        src={url}
        controls
        preload="none"
        // poster={buildSrc({
        //   src: Uploaded,
        //   transformation: [
        //     {
        //       format: "jpg",
        //       startOffset: "2",
        //     },
        //   ],
        // })}
      />{" "}
    </div>
  );
};

export default BookVideo;
