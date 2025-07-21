'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatFileSize, getFileType } from '@/lib/utils';
import { Download, MessageSquare, FileText, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Assignment {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  processedContent: string;
  chatHistory?: any[];
}

interface AssignmentHistoryProps {
  userId: string;
  onChatClick: (assignment: Assignment) => void;
}

export default function AssignmentHistory({ userId, onChatClick }: AssignmentHistoryProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, [userId]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/assignments?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (assignment: Assignment, format: string) => {
    setDownloadingId(assignment.id);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignment.id,
          format,
          userId,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${assignment.fileName.replace(/\.[^/.]+$/, '')}_completed.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Error downloading assignment:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading assignments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Assignment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-500">Upload your first assignment to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{assignment.fileName}</h4>
                        <p className="text-sm text-gray-500">
                          {getFileType(assignment.fileName)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(new Date(assignment.createdAt))}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {assignment.processedContent.substring(0, 150)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChatClick(assignment)}
                      className="gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </Button>

                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(assignment, 'txt')}
                        disabled={downloadingId === assignment.id}
                        className="gap-1"
                      >
                        {downloadingId === assignment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Download format options */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 mr-2">Download as:</span>
                  {['txt', 'pdf', 'docx'].map((format) => (
                    <Button
                      key={format}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(assignment, format)}
                      disabled={downloadingId === assignment.id}
                      className="text-xs h-6 px-2"
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 