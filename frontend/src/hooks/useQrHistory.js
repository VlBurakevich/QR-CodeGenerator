import {useState, useCallback, useEffect} from 'react';
import * as api from '../api/apiClient.js';

export const useQrHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getHistory();
            setHistory(response.data || []);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Could not load history.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const saveQrCodeItem = useCallback(async (qrData) => {
        setIsSaving(true);
        try {
            await api.saveQrCode(qrData);
            await fetchHistory();
            return {success: true};
        } catch (err) {
            console.error("Failed to save QR code:", err);
            return {success: false, message: err.response?.data?.message || 'Error saving qr code.'};
        } finally {
            setIsSaving(false);
        }
    }, [fetchHistory]);

    const deleteQrCodeItem = useCallback(async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            try {
                await api.deleteQrCode(id);
                setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
            } catch (err) {
                console.error("Failed to delete QR Code:", err);
                alert("Error deleting QR Code. Please try again.");
                await fetchHistory();
            }
        }
    }, [fetchHistory]);

    return {history, isLoading, error, saveQrCodeItem, deleteQrCodeItem, isSaving};
}