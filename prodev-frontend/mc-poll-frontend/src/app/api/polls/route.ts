// app/api/polls/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use the format=json parameter to ensure we get JSON
    const response = await fetch('https://mphoalx.pythonanywhere.com/api/polls/?format=json', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      // Return a simple error without trying to parse the response
      return NextResponse.json(
        { error: `Backend API returned ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Network error connecting to polls API' },
      { status: 500 }
    );
  }
}