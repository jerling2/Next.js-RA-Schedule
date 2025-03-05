"use client";
import { useRouter } from 'next/navigation';


export function RoutingButton({route, label='', className=''}: {route: string, label?: string, className?: string}) {
    const router = useRouter();

    return <button className={className} onClick={()=>{router.push(route)}} aria-label="test">
        {label}
    </button>
}