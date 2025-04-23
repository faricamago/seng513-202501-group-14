import React, { useState, useRef } from "react";

interface PostFormProps {
  onCancel: () => void;
  
  onPost: (data: { title: string; content: string; newImages: File[]; keptImages: string[] }) => void;
  isEdit?: boolean;
  initialTitle?: string;
  initialContent?: string;
  initialImages?: string[]; 
}

const PostForm: React.FC<PostFormProps> = ({
  onCancel,
  onPost,
  isEdit = false,
  initialTitle = "",
  initialContent = "",
  initialImages = []
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  
  const [existingImages, setExistingImages] = useState<string[]>([...initialImages]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImages(prev => [...prev, ...Array.from(e.target.files || [])]);
  };

 
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };


  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setErrorMessage("Title and content are required.");
      setShowErrorModal(true);
      return;
    }
    onPost({ title, content, newImages, keptImages: existingImages });
    
    //wait for 1 second before reloading the page to allow the post to be created
    setTimeout(() => {
        window.location.reload();
      }, 250);
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
      
      {isEdit && existingImages.length > 0 && (
        <div className="p-2">
          <p className="text-gray-700 font-semibold mb-1">Existing Images</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((imgUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imgUrl}  
                  alt={`Existing preview ${index}`}
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
     
      <div className="p-2">
        <label className="block text-gray-700 font-semibold mb-1">Images</label>
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
          {newImages.length === 0 ? (
            <span>No new files chosen</span>
          ) : (
            <div className="flex flex-wrap gap-3">
              {newImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New preview ${index}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
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
          {isEdit ? "Save" : "Post"}
        </button>
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Error
            </h2>
            <p className="text-gray-700 text-center mb-6">
              {errorMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default PostForm;
