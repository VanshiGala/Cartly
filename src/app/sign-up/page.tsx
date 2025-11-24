"use client";

import { useState } from "react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";

export default function SignUp() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post("/api/register", formData);
      setSuccessMsg(res.data.message);
       window.location.href = "/home";
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="********"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Error message */}
          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}

          {/* Success message */}
          {successMsg && (
            <p className="text-green-600 text-sm text-center">{successMsg}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition disabled:bg-gray-600"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Redirect to Sign-in */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-black font-medium underline hover:opacity-80"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
