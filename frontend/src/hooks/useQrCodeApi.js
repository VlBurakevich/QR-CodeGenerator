import {useState, useEffect} from 'react';
import {generateQrCode} from '../api/apiClient.js';
import axios from 'axios';

export function useQrCodeApi({value, size, fgColor, bgColor}) {
    const [qrCodeSvg, setQrCodeSvg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!value) {
            setQrCodeSvg(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();

        const fetchQrCode = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await generateQrCode(
                    {value, size, fgColor, bgColor},
                    {signal: controller.signal}
                );
                setQrCodeSvg(response.data.qrCodeSvg);
            } catch (err) {
                if (axios.isCancel(error)) {
                    console.error('Request canceled:', err.message);
                    return;
                }

                console.error('Failed to generate qr code:', err);
                const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
                setError(`Failed to generate qr code. (${errorMessage})`);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchQrCode();

        return () => {
            controller.abort();
        };
    }, [value, size, fgColor, bgColor]);

    return {qrCodeSvg, isLoading, error};
}