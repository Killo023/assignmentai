// Browser-compatible file processing
export interface ProcessedFile {
  fileName: string;
  content: string;
  type: string;
  size: number;
}

export async function processPDF(file: File): Promise<ProcessedFile> {
  // For demo purposes, we'll extract basic text content
  // In production, you'd use a browser-compatible PDF library like PDF.js
  const arrayBuffer = await file.arrayBuffer();
  
  // Simple text extraction simulation
  const content = `[PDF Content from ${file.name}]
  
This is a demo extraction of text content from your PDF file. 
In a production environment, this would contain the actual text extracted from your PDF using PDF.js or similar browser-compatible library.

The file "${file.name}" has been successfully processed and would contain:
- All text content from the PDF
- Formatted structure preservation
- Proper character encoding
- Tables and formatted text

Your assignment content would appear here for AI processing.`;

  return {
    fileName: file.name,
    content,
    type: 'pdf',
    size: file.size,
  };
}

export async function processDOCX(file: File): Promise<ProcessedFile> {
  // For demo purposes, we'll simulate DOCX processing
  // In production, you'd use a browser-compatible library like mammoth.js configured for browsers
  const content = `[DOCX Content from ${file.name}]
  
This is a demo extraction of text content from your DOCX file.
In a production environment, this would contain the actual text extracted from your document.

The file "${file.name}" has been successfully processed and would contain:
- All document text with formatting preserved
- Headers, paragraphs, and lists
- Table contents
- Footnotes and references

Your assignment content would appear here for AI processing.`;

  return {
    fileName: file.name,
    content,
    type: 'docx',
    size: file.size,
  };
}

export async function processXLSX(file: File): Promise<ProcessedFile> {
  // For demo purposes, we'll simulate XLSX processing
  const content = `[XLSX Content from ${file.name}]
  
This is a demo extraction of data from your Excel file.
In a production environment, this would contain the actual data extracted from your spreadsheet.

The file "${file.name}" has been successfully processed and would contain:
- All sheet data in structured format
- Cell values and formulas
- Chart descriptions
- Data tables and calculations

Your assignment data would appear here for AI processing.`;

  return {
    fileName: file.name,
    content,
    type: 'xlsx',
    size: file.size,
  };
}

export async function processTXT(file: File): Promise<ProcessedFile> {
  // Text files can be processed directly in the browser
  const content = await file.text();
  
  return {
    fileName: file.name,
    content,
    type: 'txt',
    size: file.size,
  };
}

export async function processFile(file: File): Promise<ProcessedFile> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  switch (fileExtension) {
    case 'pdf':
      return processPDF(file);
    case 'docx':
    case 'doc':
      return processDOCX(file);
    case 'xlsx':
    case 'xls':
      return processXLSX(file);
    case 'txt':
      return processTXT(file);
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/plain',
  ];
  
  const allowedExtensions = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'txt'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function getFileTypeIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'docx':
    case 'doc':
      return '📝';
    case 'xlsx':
    case 'xls':
      return '📊';
    case 'txt':
      return '📋';
    default:
      return '📁';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 