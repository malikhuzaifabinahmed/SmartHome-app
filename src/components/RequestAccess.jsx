'use client'

import { useState } from 'react';
import { useLoading } from '@/Context/LoadingContext';
import { sendRequest } from '@/actions/Authenticate';
import MyButton from './ui/MyButton';
import { RotateCw } from 'lucide-react';

export default function RequestButton({ homeId, deviceId }) {
    const { isDisabled, setIsDisabled } = useLoading();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        setIsDisabled(true);
        try {
            await sendRequest({
                homeId,
                deviceId
            });
            // Uncomment if you need to revalidate the path
            // revalidatePath('/dashboard');
        } catch (error) {
            console.error('Error sending request:', error);
        } finally {
            setIsLoading(false);
            setIsDisabled(false);
        }
    };

    return (
        <MyButton
            onClick={handleClick}
            variant='icon'
            disabled={isDisabled || isLoading}
            className="flex items-center justify-center"
        >
            {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
            Request Access
        </MyButton>
    );
}
