"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitProvider,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { Button } from "./ui/button";
import config from "@/lib/config";
import { useRef, useState } from "react";

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
  type: "video" | "image";
  accept: "string";
  placeholder: string;
  folder: "string";
  variant: "dark" | "light";
  onFileUplload: (filepath: string) => void;
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileUplload,
}: ImageUploadProps) => {
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };
  const abortController = new AbortController();
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
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
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      onFileUplload?.(uploadResponse.url!);
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
          <button className="form-input bg-zinc-600 flex items-center justify-center">
            <input type="file" ref={fileInputRef} />
          </button>
          <Button type="button" onClick={handleUpload}>
            Upload file
          </Button>
          <br />
          Upload progress: <progress value={progress} max={100}></progress>
        </>
      </ImageKitProvider>
    </div>
  );
};

export default ImageUpload;
