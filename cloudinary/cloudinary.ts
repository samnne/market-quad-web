"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});



export async function deleteImages(images: string[]) {
  for (let image of images) {
    
    const publicID = image.split("/");
   
    const uploadFolder = publicID.find((p) => p === "listings");
  
    const png = publicID.find((p) => p.includes("png"));

    const file = png?.substring(0, png.indexOf("."));
   

    const combined = `${uploadFolder}/${png}`;
 
    await cloudinary.uploader
      .destroy(combined, { invalidate: true, resource_type: "image" })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}

export async function getCloudinarySignature() {
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "listings" },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    timestamp,
    signature,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  };
}
