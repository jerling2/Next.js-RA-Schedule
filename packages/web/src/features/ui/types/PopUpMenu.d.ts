interface PopUpMenuProps {
    currentTarget?: EventTarget & HTMLElement  | undefined;
    offsetX?: number;
    offsetY?: number;
    onRender: (render: boolean) => void;
    children: ReactNode,
}