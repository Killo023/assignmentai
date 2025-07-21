'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { validateFileType, validateFileSize, processFile } from '@/lib/browser-file-processing';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploaderProps {
  onFileProcessed: (processedFile: any) => void;
  loading?: boolean;
}

export default function FileUploader({ onFileProcessed, loading = false }: FileUploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processUploadedFile = async (file: File) => {
    setError(null);
    setProcessingFile(true);

    try {
      const processedFile = await processFile(file);
      onFileProcessed(processedFile);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process file. Please try again.');
    } finally {
      setProcessingFile(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!validateFileType(file)) {
      setError('Please upload a PDF, DOCX, or XLSX file.');
      return;
    }

    // Validate file size (10MB limit)
    if (!validateFileSize(file, 10)) {
      setError('File size must be less than 10MB.');
      return;
    }

    setUploadedFile(file);
    await processUploadedFile(file);
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    disabled: loading || processingFile,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!uploadedFile ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
                } ${loading || processingFile ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isDragActive ? 'Drop your file here' : 'Upload Assignment File'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        PDF
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        DOCX
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        XLSX
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    disabled={loading || processingFile}
                    className="mt-2"
                  >
                    Select File
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!processingFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {processingFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700"
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Processing file content...</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 