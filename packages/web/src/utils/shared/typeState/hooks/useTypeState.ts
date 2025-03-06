import { useState } from 'react';

export const useTypeState = <T extends object>(initialState: T): [T, UpdateTypeState<T>] => {
    const [state, setState] = useState<T>(initialState);

    const updateState = <K extends keyof T>(
        key: K,
        value: UpdateTypeValue<T[K]>
    ) => {
        setState(prev => ({
            ...prev,
            [key]: value instanceof Function
                ? value(prev[key])
                : value
        }));
    }

    return [state, updateState];
}