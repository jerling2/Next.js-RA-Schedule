type UpdateFunction<T> = (prev: T) => void;
type UpdateTypeValue<T> = T | UpdateFunction<T>;


type UpdateTypeState<T> = <K extends keyof T>(
    key: K, 
    value: UpdateTypeValue<T[K]>
) => void;

