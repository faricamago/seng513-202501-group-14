import React, { useState, useRef } from "react";

interface PostFormProps {
  onCancel: () => void;
  onPost: (data: { title: string; content: string; images: File[] }) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onCancel, onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPost({ title, content, images });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-2">
        <label className="block text-gray-700 font-semibold mb-1">Title*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none"
        />
      </div>
      <div className="p-2">
        <label className="block text-gray-700 font-semibold mb-1">Content*</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content..."
          className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none h-40"
        />
      </div>
      <div className="p-2">
        <label className="block text-gray-700 font-semibold mb-1">Images</label>
        {/* Custom button to trigger file selection */}
        <button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="px-4 py-2 bg-[var(--uoc-yellow)] text-black rounded hover:cursor-pointer"
        >
          Choose Files
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="mt-2">
          {images.length === 0 ? (
            <span>No files chosen</span>
          ) : (
            <div className="space-y-2">
              {images.map((file, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:cursor-pointer"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center space-x-4 p-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-[var(--dark-color)] bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer w-1/4"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] hover:cursor-pointer w-1/4"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default PostForm;
