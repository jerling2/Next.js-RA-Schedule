"use client";
import { useEffect, useState, MouseEvent } from 'react';

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

interface PriorityBoxProps {
    index: number;
    minPriority: number;
    maxPriority: number;
    value: number;
    onChange: (index: number, value: number) => void;
};

export default function PriorityBox ({ 
    index, minPriority, maxPriority, value, onChange 
}: PriorityBoxProps) {
    const handleClick = (e: MouseEvent) => {
        if (e.shiftKey && e.button === LEFT_CLICK && value != minPriority) {
            onChange(index, minPriority);
        } else if (e.shiftKey && e.button === RIGHT_CLICK && value != maxPriority) {
            onChange(index, maxPriority);
        } else if (e.button === LEFT_CLICK && value !== -1 && value > minPriority) {
            onChange(index, value - 1);
        } else if (e.button === RIGHT_CLICK && value !== -1 && value < maxPriority) {
            onChange(index, value + 1);
        } else if (e.button === LEFT_CLICK && value === -1) {
            onChange(index, maxPriority);
        } else if (e.button === RIGHT_CLICK && value === -1) {
            onChange(index, minPriority);
        }
    }

    return (
        <div 
            className="bg-[#D9D9D9] cursor-pointer"
            onMouseDown={ handleClick }>
            <span className="select-none">
                {value === -1 ? '\u200B' : value}
            </span>
        </div>
        );
}