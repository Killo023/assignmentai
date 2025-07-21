import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export interface ProcessedFile {
  content: string;
  type: string;
  originalName: string;
}

export async function processPDF(file: File): Promise<ProcessedFile> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    
    return {
      content: data.text,
      type: 'pdf',
      originalName: file.name,
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
}

export async function processDOCX(file: File): Promise<ProcessedFile> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return {
      content: result.value,
      type: 'docx',
      originalName: file.name,
    };
  } catch (error) {
    console.error('Error processing DOCX:', error);
    throw new Error('Failed to process Word document');
  }
}

export async function processXLSX(file: File): Promise<ProcessedFile> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    let content = '';
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_txt(sheet);
      content += `Sheet: ${sheetName}\n${sheetData}\n\n`;
    });
    
    return {
      content,
      type: 'xlsx',
      originalName: file.name,
    };
  } catch (error) {
    console.error('Error processing XLSX:', error);
    throw new Error('Failed to process Excel file');
  }
}

export async function processFile(file: File): Promise<ProcessedFile> {
  const fileExtension = file.name.toLowerCase().split('.').pop();
  
  switch (fileExtension) {
    case 'pdf':
      return processPDF(file);
    case 'docx':
      return processDOCX(file);
    case 'xlsx':
      return processXLSX(file);
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

export function validateFileType(file: File): boolean {
  const allowedTypes = ['pdf', 'docx', 'xlsx'];
  const fileExtension = file.name.toLowerCase().split('.').pop();
  return allowedTypes.includes(fileExtension || '');
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
} 