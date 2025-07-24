import React, { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const backendURL = "http://localhost:5000";

  const fileInputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async (postData) => {
      return axiosInstance.post("/posts", postData);
    },
    onError: (err) => {
      console.error("error creating post", err);
      toast.error("Failed to create post");
    },
    onSuccess: () => {
      toast.success("Post Created Successfully.");
      setText("");
      setImageUrls([]);

      if (fileInputRef.current) fileInputRef.current.value = null;
    },
  });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // res.data is an array of uploaded files info
      const uploadedUrls = res.data.map((file) => backendURL + file.path);
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      content: text,
      imageUrls: imageUrls, // Already full URLs
    };

    mutation.mutate(postData);
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-[90%] mx-auto my-6 p-4 bg-base-200 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Share a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea textarea-bordered w-full mb-3"
          placeholder="What's on your mind?"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          ref={fileInputRef}
          multiple
          name="images"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-3"
          onChange={handleFileChange}
        />

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url} // full URL already, no need to prepend backendURL here
                  alt={`uploaded-${idx}`}
                  className="rounded-lg h-24 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
