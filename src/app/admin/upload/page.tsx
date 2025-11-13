"use client"

import { useState } from "react"; //to manage dynamic UI values

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null); //accept null obj
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
      const [desc, setDesc] = useState("");
        const [price, setPrice] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //stop default form behavior
    if (!file) return alert("Please select a file!");

    setLoading(true);
    //prepares data to send as multipart/form-data
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload image to Cloudinary
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      //waits for cloudinary's res -> data.url = image URL
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cloudinary upload failed");

      const imageUrl = data.url;
      setImgUrl(imageUrl);
      alert("Upload successful! Now creating Stripe product...");

      // 2️. Create product in Stripe
      const stripeRes = await fetch("/api/stripe/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //backend creates product with name, desc, img, price
        body: JSON.stringify({
          name, 
          desc,
          image: imageUrl,
          price: price, // USD
        }),
      });

      //wait for stripe's response
      const stripeData = await stripeRes.json();
      if (!stripeRes.ok) throw new Error(stripeData.error || "Stripe product creation failed");
      alert(`Product created in Stripe! `)
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    //flex, flex-col -> stack items vertically
    //min-h-screen -> full height
    //gap-4 -> space betn items
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Admin Product Upload</h1>

       <form onSubmit={handleUpload} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) setFile(selectedFile);
          }}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Create Product"}
        </button>
      </form>

      {imgUrl && (
        <div className="mt-4 text-center">
          <p>Uploaded Successfully!</p>
          <img src={imgUrl} alt="Uploaded" className="w-60 h-60 object-cover rounded mt-2" />
          <p className="text-sm mt-1 break-all">{imgUrl}</p>
        </div>
      )}
    </div>
  );
}