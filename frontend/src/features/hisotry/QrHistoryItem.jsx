import React from 'react';
import { useQrCodeApi } from '../../hooks/useQrCodeApi';
import './QrHistory.css';

export const QrHistoryItem = ({ item, onSelect, onDelete }) => {

    const { qrCodeSvg } = useQrCodeApi({
        value: item.value,
        size: 64,
        fgColor: item.fgColor,
        bgColor: item.bgColor
    });

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(item.id);
    };

    return (
        <div className="history-item" onClick={() => onSelect(item)} title={`Click to load: ${item.title}`}>
            <div className="history-item-qr">
                {qrCodeSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                ) : (
                    <div className="qr-placeholder" />
                )}
            </div>
            <p className="history-item-title">{item.title}</p>
            <button className="delete-btn" title="Delete" onClick={handleDelete}>
                ×
            </button>
        </div>
    );
};