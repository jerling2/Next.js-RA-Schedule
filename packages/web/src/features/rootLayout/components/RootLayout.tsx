"use client";
import { AuthProvider } from "@/auth";
import { geistSans, geistMono } from "@/fonts";


export function RootLayout({children}: {children: React.ReactNode}) {
    
    return (
        <AuthProvider>
            <html>
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-1 text-text`}>
                    {children}
                <a href="https://forms.gle/vEiR3tad9AdDjc3t7" className="fixed underline flex justify-center items-center bottom-0 left-0 w-full h-[30px] bg-background-2 text-white z-20">Click here to submit anonymous feedback!</a>
                </body>
            </html>
        </AuthProvider>
    );
}