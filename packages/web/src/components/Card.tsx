"use client";
import { ReactNode, Children } from 'react';

interface CardProps {
    readonly children: ReactNode;
}

export default function Card({ children }: CardProps) {
    return (
        <div className='card relative flex flex-col overflow-hidden min-w-[500px]'>
            {Children.map(children, (child, index) => (
                <>
                {index !== 0 && <hr key={index} />}
                <div className='row [&>*]:px-5'>
                    {child}
                </div>
                </>
            ))}
        </div>
    )
}