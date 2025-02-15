import EmailContextProvider from "@/components/EmailProvider";

export default function SignInLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      // min-w-[400px] w-1/4 aspect-square
        <EmailContextProvider>
            <div className="flex flex-row h-screen justify-center items-center">
                <div className="flex flex-col min-w-[400px] w-1/3 aspect-square overflow-hidden bg-background-2 rounded-lg items-center justify-between shadow-color">
                    {children}
                </div>
            </div>
        </EmailContextProvider>
    );
  }