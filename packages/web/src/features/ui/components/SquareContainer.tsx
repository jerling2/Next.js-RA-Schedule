"use client";

export function SquareContainer({children, className=''}: {children: React.ReactNode, className?: string}) {
    return (
        <div className={`${className} flex flex-col min-w-[400px] w-1/3 aspect-square justify-between bg-background-2 shadow-color items-center rounded-2xl`}>
            {children}
        </div>
    );  
};
