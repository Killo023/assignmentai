import { NextRequest, NextResponse } from 'next/server';

// Demo storage
const demoAssignments: Record<string, any[]> = {};

export async function POST(request: NextRequest) {
  try {
    const { assignmentId, format, userId } = await request.json();

    if (!assignmentId || !format || !userId) {
      return NextResponse.json(
        { error: 'Assignment ID, format, and user ID are required' },
        { status: 400 }
      );
    }

    // Find the assignment in demo storage
    const userAssignments = demoAssignments[userId] || [];
    const assignment = userAssignments.find(a => a.id === assignmentId);

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const content = assignment.processedContent || assignment.originalContent;
    const fileName = assignment.fileName.replace(/\.[^/.]+$/, ''); // Remove original extension

    let mimeType: string;
    let downloadFileName: string;

    switch (format.toLowerCase()) {
      case 'txt':
        mimeType = 'text/plain';
        downloadFileName = `${fileName}.txt`;
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        downloadFileName = `${fileName}.pdf`;
        // In production, you'd generate actual PDF here
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        downloadFileName = `${fileName}.docx`;
        // In production, you'd generate actual DOCX here
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        downloadFileName = `${fileName}.xlsx`;
        // In production, you'd generate actual XLSX here
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported format. Use txt, pdf, docx, or xlsx.' },
          { status: 400 }
        );
    }

    // For demo purposes, return the text content for all formats
    // In production, you'd generate the actual file format
    const response = new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${downloadFileName}"`,
        'Content-Length': content.length.toString(),
      },
    });

    return response;
  } catch (error) {
    console.error('Error generating download:', error);
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    );
  }
} 