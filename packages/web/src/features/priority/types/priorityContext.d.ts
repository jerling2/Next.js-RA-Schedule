type PrioritiesGlobal = {[key: string]: PrioritiesObject};
type PrioritiesObject = {[index: number]: Priorities};
type Priorities = number[];

type UpdateGlobalPriorities = <K extends keyof PrioritiesGlobal>(
    key: K,
    value: PrioritiesObject | ((prev: PrioritiesGlobal[K]) => PrioritiesObject)
) => void;

type PriorityContextType = {
    globalPriorities: PrioritiesGlobal;
    updateGlobalPriorities: UpdateGlobalPriorities;
} | undefined;

type UpdatePriorities = <I extends number>(
    key: keyof PrioritiesGlobal,
    blockIdx: I, 
    value: Priorities | ((prev: PrioritiesObject[I]) => Priorities),
) => void;

type UsePriorityContext = () => [
    globalPriorities: PrioritiesGlobal,
    updatePriorities: UpdatePriorities
];


