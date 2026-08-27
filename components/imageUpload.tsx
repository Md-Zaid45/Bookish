"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitProvider,
  Image,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  Video,
  buildSrc,
} from "@imagekit/next";
import { Button } from "./ui/button";
import config from "@/lib/config";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "./ui/toast";

const {
  env: {
    imagekit: { publicKey = "", urlEndpoint = "" },
  },
} = config;

const authenticator = async () => {
  try {
    const res = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Imagekit authentication failed ${errorText}`);
    }
    const data = await res.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Failed to authenticate ${error.message}`);
  }
};
interface ImageUploadProps {
  type: string;
  accept: string;
  variant: "dark" | "light";
  onFileUplload: (value: string) => void;
}

const ImageUpload = ({
  type,
  accept,
  variant,
  onFileUplload,
}: ImageUploadProps) => {
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-800 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };
  const abortController = new AbortController();
  const [Uploaded, setUploaded] = useState<string | null>(null);
  const [filePicked, setFilePicked] = useState<string | null>(null);
  const handleUpload = async () => {
    // Access the file input element using the ref
    setUploaded(null);
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.add({ description: "Please select a file to upload" });
      return;
    }
    const file = fileInput.files[0];
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token } = authParams;

    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        useUniqueFileName: true,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      onFileUplload?.(uploadResponse.url!);
      setUploaded(uploadResponse.url ?? null);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };
  return (
    <div className="rounded-xs flex flex-col gap-2">
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        <>
          <button
            className={cn(
              styles.button,
              "flex flex-col justify-center items-center book-form_input",
            )}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            {accept == "image/*" ? <ImageIcon /> : <VideoIcon />}
            {filePicked && <p className="upload-filename">{filePicked}</p>}

            <input
              type={type}
              ref={fileInputRef}
              hidden
              accept={accept}
              className={cn(
                styles.placeholder,
                "item-center book-form_input flex justify-between",
              )}
              onChange={(e) => {
                setFilePicked(e.target?.files?.[0]?.name ?? null);
                console.log('file name',e.target?.files?.[0]?.name)
              }}
            />
          </button>
          <Button hidden={!filePicked} onClick={handleUpload}>
            Upload {accept == "image/*" ? "Image" : "Video"}
          </Button>
          {100 > progress && progress > 0 && (
            <div className="flex items-center justify-center font-semibold text-sm">
              Upload Progress:
              <progress className="mx-3" value={progress} max={100}></progress>
              {Math.round(progress)} %{" "}
            </div>
          )}
          {Uploaded && (
            <>
              {accept == "image/*" ? (
                <Image src={Uploaded} width={200} height={200} alt="Uploaded preview" />
              ) : (
                <Video
                  src={Uploaded}
                  controls
                  preload="none"
                  poster={buildSrc({
                    urlEndpoint,
                    src: Uploaded,
                    transformation: [
                      {
                        format: "jpg",
                        startOffset: "2",
                      },
                    ],
                  })}
                />
              )}
            </>
          )}
          <br />
        </>
      </ImageKitProvider>
    </div>
  );
};

export default ImageUpload;
