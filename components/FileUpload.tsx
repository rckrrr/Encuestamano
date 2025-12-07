import React, { useCallback } from 'react';
import { Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get raw base64 (e.g., "data:image/png;base64,")
      const base64Data = result.split(',')[1];
      onFileSelect(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <label 
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-3xl cursor-pointer 
          transition-all duration-300 ease-in-out
          ${isLoading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-70' 
            : 'border-brand-300 bg-white hover:bg-brand-50 hover:border-brand-500 shadow-sm hover:shadow-md'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isLoading ? (
            <>
              <Loader2 className="w-12 h-12 mb-4 text-brand-500 animate-spin" />
              <p className="mb-2 text-lg text-gray-500 font-medium">Analyzing handwriting...</p>
              <p className="text-sm text-gray-400">Powered by Gemini 2.5 Flash</p>
            </>
          ) : (
            <>
              <div className="flex -space-x-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-4 border-white">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
              <p className="mb-2 text-xl font-semibold text-gray-700">
                Upload handwritten note
              </p>
              <p className="mb-4 text-sm text-gray-500 max-w-xs">
                Drag and drop or click to upload an image or PDF containing questions, quotes, or trivia.
              </p>
              <div className="px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-medium shadow-lg shadow-brand-200">
                Select File
              </div>
            </>
          )}
        </div>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};