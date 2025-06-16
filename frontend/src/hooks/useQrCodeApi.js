import {useState, useEffect} from 'react';

export function useQrCodeApi({ value, size, fgColor, bgColor }) {
    const [qrCodeSvg, setQrCodeSvg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!value) {
            setQrCodeSvg(null);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const {signal} = controller;

        (async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8080/api/qrCode/generate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({value, size, fgColor, bgColor}),
                    signal,
                });

                if (!response.ok) {
                    setError('Failed to generate QR code (server error).');
                    console.error('Server responded with status:', response.status);
                    return;
                }

                const data = await response.json();
                setQrCodeSvg(data.qrCodeSvg);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Failed to generate QR code (network issue).');
                    console.error(err);
                }
            } finally {
                setIsLoading(false);
            }
        })();


        return () => {
            controller.abort();
        };
    }, [value, size, fgColor, bgColor]);

    return { qrCodeSvg, isLoading, error };
}