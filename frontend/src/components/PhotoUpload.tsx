import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../stores/authStore';

interface PhotoUploadProps {
    caseId: number;
    onUploadComplete?: (photo: any) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ caseId, onUploadComplete }) => {
    const { accessToken } = useAuth();
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG).');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:8000/cases/${caseId}/photos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            if (onUploadComplete) {
                onUploadComplete(data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging
                        ? 'border-[#C5A065] bg-[rgba(197,160,101,0.1)]'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(197,160,101,0.4)] hover:bg-[rgba(255,255,255,0.02)]'
                    }
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                {uploading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C5A065] mb-4"></div>
                        <p className="text-gray-300">Securely uploading document...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4 text-[#C5A065]">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-white font-medium mb-1">Upload Evidence</h3>
                        <p className="text-gray-500 text-sm mb-4 max-w-xs">
                            Drag & drop images of your lease, notices, or property damage here.
                        </p>
                        <button className="text-xs uppercase tracking-wider font-semibold text-[#C5A065] border border-[#C5A065] px-4 py-2 rounded hover:bg-[#C5A065] hover:text-black transition-colors">
                            Select File
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded text-red-300 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
        </div>
    );
};
