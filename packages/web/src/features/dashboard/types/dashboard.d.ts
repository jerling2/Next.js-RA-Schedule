interface AvatarProps {
    ref?: Ref<HTMLDivElement>;
    focused?: boolean;
    onTarget?: (event: EventTarget & HTMLElement | undefined) => void;
}