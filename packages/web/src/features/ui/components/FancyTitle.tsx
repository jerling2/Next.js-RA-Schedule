"use client"

export function FancyTitle({title,}: {title: string}) {
    return (
        <div className='text-5xl mt-7 font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>
            {title}
        </div>
    );
}