type PriorityMap = (priority: number) => number;

type BoxPriorityLocation = [key: keyof PrioritiesGlobal, blockIdx: keyof PrioritiesObject, index: number];

interface PriorityBoxState {
    boxPriorityLocation: BoxPriorityLocation
    config: {
        min: number;
        max: number;
        empty: number;
    };
    activeStyleTemplate: {
        shadowFormat: string;
        opacityFunction: PriorityMap;
        intensityFunction: PriorityMap;
    };
    __priority?: number;
    __shadow?: string;
    __focus?: string;
    __isHover?: boolean;
}

interface PriorityBoxProps {
    initialState: PriorityBoxState;
}

type PriorityBoxArray = React.ReactElement<PriorityBoxProps>[];

type UpdateBoxPriority = (newPriority: number) => void;

type CreateInitialBoxState = (boxPriorityLocation: BoxPriorityLocation, primaryOrSecondary: 'primary' | 'secondary') => PriorityBoxState;
