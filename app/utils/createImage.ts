export function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("createImage can only be used in the browser"));
        return;
      }
  
      const image = document.createElement("img");
      image.src = url;
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });
  }
  