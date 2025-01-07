import SignInContextProvider from "@/components/SignInProvider";

export default function SignInLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <SignInContextProvider>
            <div className="flex min-h-96 h-screen justify-center place-items-center drop-shadow-lg text-center">
                <div className="relative px-40 justify-center flex flex-col h-2/3 gap-y-10 w-1/2 bg-slate-50 place-items-center rounded-xl overflow-hidden">
                    {children}
                </div>
            </div>
        </SignInContextProvider>
    );
  }