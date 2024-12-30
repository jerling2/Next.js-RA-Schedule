"use server";
import { NextRequest } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const now = new Date();
        const timestamp = now.toISOString().split('.')[0]; // ISO string w.out milliseconds.
        const filename = data['uoid'] + '-ISO' + timestamp.replace(/:/g, '-') + '.json';
        const filePath = path.join(process.cwd(), 'data', filename);
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        return new Response(
            JSON.stringify({
                message: 'File written sucessfully',
            }),
            {
                status: 200,
            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({
                message: 'Failed to write file to the server.',
                error: err,
            }),
            {
                status: 500,
            }
        )
    }        
}   