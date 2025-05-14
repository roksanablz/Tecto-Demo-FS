import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'policy-data', 'yc_ai_policies_2025_sorted.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading policy data:', error);
    return NextResponse.json({ error: 'Failed to read policy data' }, { status: 500 });
  }
} 