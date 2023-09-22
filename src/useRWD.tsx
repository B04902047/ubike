

import { useState, useEffect } from 'react';

type Device = "PC" | "mobile";

function useRWD(): Device {
    function getDevice(): Device {
        if (window.innerWidth > 576) return "PC";
        else return "mobile";
    }
    function handleRWD(): void {
        setDevice(getDevice());
    }
    const [device, setDevice] = useState<Device>(getDevice());

    useEffect(() => {
        window.addEventListener('resize', handleRWD);
        return(() => {
            window.removeEventListener('resize', handleRWD);
        });
    },[]);

    return device;
}

export { useRWD };
export type { Device };