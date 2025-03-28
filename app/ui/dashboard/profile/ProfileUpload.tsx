"use client";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { uploadProfile } from "@/app/dashboard/profile/edit/action";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/app/utils/cropImage"; 
import { useRouter } from "next/navigation";

export default function ProfileUpload({
  profile,
  onClose,
}: {
  profile: any;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(profile.profileUrl);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cropLoading, setCropLoading] = useState(false);
  const userId = profile.id;
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImageUrl(previewUrl);
      setCroppedImage(null);
    }
  };

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!imageUrl || !croppedArea) return alert("Please select and crop an image!");
    setCropLoading(true);
    const croppedImg = await getCroppedImg(imageUrl, croppedArea, rotation);
    setCroppedImage(croppedImg);
    setCropLoading(false);
  };

  const handleUpload = async () => {
    if (!file || !croppedImage) return alert("Please select and crop an image!");
    setLoading(true);
    try {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const croppedFile = new File([blob], file.name, { type: "image/png" });

      const url = await uploadProfile(userId, croppedFile);
      setImageUrl(url); 
      alert("Profile picture updated!");
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to upload!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Pop-in and pop-out animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 2 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-[30vw] h-[80vh] p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-2 flex justify-center">
          Upload Profile Picture
        </h2>

        <div className="relative w-[20vw] h-[35vh] bg-gray-200 ml-10">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="m-3 pl-14 ">
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        <div className="flex text-sm gap-4 mt-2 pl-8">
          <div>
            <label htmlFor="">Zoom</label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="">Rotate</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleSaveCrop}
            disabled={croppedImage !== null}
            className={`px-2 py-2 rounded ${croppedImage ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 text-white"}`}
          >
            {cropLoading ? "Saving" : "Crop & Save"}
          </button>
          <button
            onClick={handleUpload}
            disabled={!croppedImage || loading}
            className={`px-4 py-2 rounded ${croppedImage ? "bg-blue-500 text-white" : "bg-gray-400 cursor-not-allowed"}`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
