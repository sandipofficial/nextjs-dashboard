import { createImage } from "./createImage";

const getCroppedImg = async (imageSrc: string, crop: any, rotation = 0) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const scaleX = image.width / image.naturalWidth;
  const scaleY = image.height / image.naturalHeight;

  // Crop width & height
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // Set canvas size to match crop size
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  ctx.drawImage(
    image,
    crop.x * scaleX, crop.y * scaleY, // Source x, y
    crop.width * scaleX, crop.height * scaleY, // Source width, height
    0, 0, // Destination x, y
    cropWidth, cropHeight // Destination width, height
  );

  ctx.restore();

  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
    }, "image/png");
  });
};

export default getCroppedImg;
