import { useEffect, useState } from 'react';

export const useLocalStorage = (key : string , initialValue: boolean) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value: (arg0: any) => any) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};

export const useDarkMode = () => {
    const [enabled, setEnabled] = useLocalStorage('dark-theme', false);
    const isEnabled = typeof enabled === 'undefined' && enabled;

    useEffect(() => {
        const className = 'dark';
        const bodyClass = window.document.body.classList;

        isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
    }, [enabled, isEnabled]);

    return [enabled, setEnabled];
};

export default useDarkMode;