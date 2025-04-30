import { NextRequest } from 'next/server';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function GET(request: NextRequest, context: { params: { path: Promise<string[]> } }) {
  try {
    // Wait for params.path to resolve
    const path = await context.params.path;
    
    // Ensure path is available
    if (!path) {
      return new Response('Invalid path', { status: 400 });
    }

    // Construct the file path from backend public/outputs directory
    const filePath = join(process.cwd(), 'backend', 'public', 'outputs', ...path);
    console.log('Attempting to serve file:', filePath);

    // Check if file exists and get its stats
    try {
      const stat = await fs.stat(filePath);
      
      // Get the range header from the request
      const range = request.headers.get('range');

      if (range) {
        // Handle range request (streaming)
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        const stream = createReadStream(filePath, { start, end });

        // Return partial content
        return new Response(stream as any, {
          status: 206,
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize.toString(),
            'Cache-Control': 'no-cache',
          },
        });
      }

      // Handle normal request
      const stream = createReadStream(filePath);
      
      return new Response(stream as any, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': stat.size.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      console.error('Error reading file:', error);
      return new Response('File not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving video:', error);
    return new Response('Server error', { status: 500 });
  }
}