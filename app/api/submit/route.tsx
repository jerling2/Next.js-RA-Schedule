"use server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log(data);
    return new Response(
        JSON.stringify(
            {
                message: 'Data received sucessfully!'
            }
        ), 
        {
            status: 200, 
        }
    );    
}   