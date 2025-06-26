import {useState, useEffect, useRef} from "react";

export const useClickOutside = (initialIsVariable) => {
    const [isVisible, setIsVisible] = useState(initialIsVariable);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return {ref, isVisible, setIsVisible};
}