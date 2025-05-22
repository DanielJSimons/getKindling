import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { layoutId: string } }
) {
  try {
    const layoutId = params.layoutId;
    
    // Define the path to the layout example HTML file
    const filePath = path.join(process.cwd(), 'public', 'examples', 'layouts', `${layoutId}.html`);
    
    try {
      // Read the example file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Return the HTML content
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } catch (fileError) {
      // If the example file doesn't exist, return a placeholder HTML
      console.error(`Example file not found for layout ${layoutId}:`, fileError);
      
      const placeholderHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${layoutId} Layout - Kindling Example</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
            }
            
            .container {
              max-width: 600px;
              padding: 40px;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            
            h1 {
              color: #f59e0b;
              margin-bottom: 20px;
            }
            
            .placeholder {
              margin: 30px 0;
              padding: 20px;
              background-color: #f3f4f6;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${layoutId.replace(/-/g, ' ')} Layout</h1>
            <p>This is a placeholder for the ${layoutId.replace(/-/g, ' ')} layout example.</p>
            <p>Example HTML file not found in public/examples/layouts/${layoutId}.html</p>
            
            <div class="placeholder">
              <p>Example will be added soon!</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      return new NextResponse(placeholderHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
  } catch (error) {
    console.error('Error serving layout example:', error);
    return NextResponse.json({
      error: 'Failed to serve layout example',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 