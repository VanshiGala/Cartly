import { NextResponse } from "next/server"; //helper to send res in API or middleware
import { v2 as cloudinary } from "cloudinary"; //v2 API. The SDK handle authentication and media uploads

//configure cloudinary
//'!' -> This is non-null assertion. It tells Typescript that these env var definitely exists.
//without '!' uploads will fail because SDK won't know which A/c to target
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

//POST HTTP method handler. Runs automatically when client sends req
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File; //ts syntax
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    //ArrayBuffer -> a low level representation of bytes in memory
    //Necessary because you can't directly upload file obj to cloudinary.
    //Must send binary or base64 data
    const arrayBuffer = await file.arrayBuffer();
    //convets ArrayBuffer to Node Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to base64 string
    //essential for creating data URI
    const base64String = buffer.toString("base64");

    // Create Data URI
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload directly from memory (no temp file)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "Products",
    });

    return NextResponse.json({ url: result.secure_url }); //sends res back to frontend containing public Cloudinary URL
    //secure_url -> HTTP link stored in db or send to Stripe
    } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


//there are too many problems with using multer here
//








