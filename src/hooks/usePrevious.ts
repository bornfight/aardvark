import { useEffect, useRef } from "react";

export const usePrevious = (value: string | number | undefined | unknown) => {
    const ref = useRef<string | number | undefined | unknown>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};
