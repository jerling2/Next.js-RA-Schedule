"use client";


export function InteractableLabel(props: InteractiveLabelProps) {
    return (
        <div
            onMouseEnter={() => props.handleHover(true)}
            onMouseLeave={() => props.handleHover(false)} 
            className={`select-none ${props.rowOrCol} ${props.tags} ${props.activeStyle}`}
            onClick={props.handleClick}
            onContextMenu={props.handleClick}>
            {props.label}
        </div>
    );
}