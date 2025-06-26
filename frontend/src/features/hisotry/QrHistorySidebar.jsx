import React from 'react';
import { useQrHistory } from '../../context/QrHistoryContext.jsx';
import { QrHistoryItem } from './QrHistoryItem.jsx';
import './QrHistory.css';

export const QrHistorySidebar = ({ onSelectQrCode }) => {
    const { history, isHistoryLoading, deleteQrCodeItem } = useQrHistory();

    return (
        <aside className="qr-history-sidebar">
            <h2>History</h2>
            <div className="history-list">
                {isHistoryLoading ? (
                    <p>Loading history...</p>
                ) : history.length > 0 ? (
                    history.map(item => (
                        <QrHistoryItem
                            key={item.id}
                            item={item}
                            onSelect={onSelectQrCode}
                            onDelete={deleteQrCodeItem}
                        />
                    ))
                ) : (
                    <p className="no-history-message">Your saved QR codes will appear here.</p>
                )}
            </div>
        </aside>
    );
};