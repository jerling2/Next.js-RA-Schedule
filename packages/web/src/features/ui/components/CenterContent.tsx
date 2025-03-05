export function CenterContent({children, className=''}: {children: React.ReactNode, className?: string}) {
    return (
        <div className={`${className} flex h-screen justify-center items-center`}>
            {children}
        </div>
    );
};