import {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {getHistory, saveQrCode, deleteQrCode as deleteQrCodeApi} from '../api/apiClient.js';

const QrHistoryContext = createContext(null);

export const useQrHistory = () => {
    const context = useContext(QrHistoryContext);
    if (!context) {
        throw new Error('useQrHistory must be used within a QrHistoryProvider');
    }
    return context;
};

export const QrHistoryProvider = ({children}) => {
    const [history, setHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        try {
            const response = await getHistory();
            setHistory(response.data || []);
        } catch (error) {
            console.error("Failed to fetch QR history:", error);
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const saveQrCodeItem = async (qrData) => {
        setIsSaving(true);
        try {
            await saveQrCode(qrData);
            await fetchHistory();
            return {success: true};
        } catch (error) {
            console.error("Failed to save QR code:", error);
            const message = error.response?.data?.message || "Could not save QR code.";
            return {success: false, message};
        } finally {
            setIsSaving(false);
        }
    };

    const deleteQrCodeItem = async (id) => {
        try {
            setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
            await deleteQrCodeApi(id);
        } catch (error) {
            console.error("Failed to delete QR code:", error);
            alert('Failed to delete item. Please try again.');
            await fetchHistory();
        }
    };

    const value = {
        history,
        isHistoryLoading,
        isSaving,
        saveQrCodeItem,
        deleteQrCodeItem,
    };

    return (
        <QrHistoryContext.Provider value={value}>
            {children}
        </QrHistoryContext.Provider>
    );
};