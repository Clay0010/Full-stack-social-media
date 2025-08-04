import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { motion, AnimatePresence } from "motion/react";
const CreatePost = () => {
  const [text, setText] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const backendURL = import.meta.env.VITE_IMAGES_UPLOAD_URL;

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });

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

      console.log("uploaded urls res: ", res.data);

      // res.data is an array of uploaded files info
      const uploadedUrls = res.data.map((file) => `${backendURL}${file.path}`);
      console.log("uploadedurls", uploadedUrls);

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
      imageUrls: imageUrls,
    };

    mutation.mutate(postData);
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }} // start slightly above & transparent
        animate={{ opacity: 1, y: 0 }} // slide down & fade in
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[90%] mx-auto my-6 p-4 bg-base-200 shadow-lg rounded-lg mt-20"
      >
        <form onSubmit={handleSubmit}>
          <textarea
            className="textarea textarea-bordered w-full mb-3 h-30"
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
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePost;
