"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadToIPFS = async (file) => {
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/upload/ipfs", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      setProgress(100);
      if (!res.ok) throw new Error("IPFS upload failed");
      const data = await res.json();
      toast.success("Uploaded to IPFS!");
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/upload/image", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      toast.success("Image uploaded!");
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadToIPFS, uploadImage, uploading, progress };
}
