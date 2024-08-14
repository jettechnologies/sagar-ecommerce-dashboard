import React, { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000 }) => {
    useEffect(() => {
        if (message) {
            let msg = message.substring(0,1).toLocaleUpperCase();
            msg = `${msg}${message.substring(1,)}`
            toast[type](msg, {
                duration
            });
        }
    }, [message, type, duration]);

    return (
        <Toaster 
            // expand={true}
            position="top-right" 
            richColors  
            toastOptions={{
                unstyled: true,
                classNames: {
                    default: 'px-8 py-4 flex gap-3 rounded-md bg-gray-800 text-white first-letter:uppercase  text-sm'
                }
            }}
        />
    );
}

export default Toast;