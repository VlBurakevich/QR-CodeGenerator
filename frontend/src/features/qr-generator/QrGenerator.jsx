import {useState} from 'react';
import {useDebounce} from '../../hooks/useDebounce.js';
import {useQrCodeApi} from "../../hooks/useQrCodeApi.js";
import {useClickOutside} from '../../hooks/useClickOutside.js';
import {useQrHistory} from '../../context/QrHistoryContext.jsx';
import {downloadSVG, downloadPDF, downloadPNG} from '../../utils/download.js';
import {handleShareLink} from '../../utils/share.js';
import './QrGenerator.css';

export function QrGenerator({ activeQrData, onDataChange }) {
    const [title, setTitle] = useState('');
    const [saveStatus, setSaveStatus] = useState({message: '', type: ''});

    const debouncedText = useDebounce(activeQrData.value, 750);
    const {ref: dropdownRef, isVisible: isMenuOpen, setIsVisible: setMenuOpen} = useClickOutside(false);

    const {qrCodeSvg, isLoading, error} = useQrCodeApi({
        value: debouncedText,
        size: activeQrData.size,
        fgColor: activeQrData.fgColor,
        bgColor: activeQrData.bgColor
    });

    const {saveQrCodeItem, isSaving} = useQrHistory();

    const onShareClick = async () => {
        const result = await handleShareLink(debouncedText);

        if (result.success && result.method === 'copy') {
            setSaveStatus({ message: result.message, type: 'success' });
            setTimeout(() => setSaveStatus({ message: '', type: '' }), 3000);
        } else if (!result.success && result.message !== 'Share cancelled.') {
            setSaveStatus({ message: result.message, type: 'error' });
            setTimeout(() => setSaveStatus({ message: '', type: '' }), 3000);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setSaveStatus({message: 'Please enter a title to save.', type: 'error'});
            setTimeout(() => setSaveStatus({message: '', type: ''}), 3000);
            return;
        }

        const qrData = {
            title,
            value: debouncedText,
            size: activeQrData.size,
            fgColor: activeQrData.fgColor,
            bgColor: activeQrData.bgColor
        };

        const result = await saveQrCodeItem(qrData);

        if (result.success) {
            setSaveStatus({message: 'QR Code saved successfully!', type: 'success'});
            setTitle('');
        } else {
            setSaveStatus({message: result.message, type: 'error'});
        }

        setTimeout(() => setSaveStatus({message: '', type: ''}), 3000);
    };


    const handleChange = (field, value) => {
        onDataChange({ ...activeQrData, [field]: value });
    };

    return (
        <div className="qr-generator-wrapper">
            <h1>QR Code Generator</h1>

            <div className="input-group">
                <input
                    type="text"
                    value={activeQrData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    placeholder="Enter text or URL"
                />
            </div>

            <div className="options-grid">
                <div className="option-item">
                    <label>Size:</label>
                    <div className="size-selector">
                        {[128, 256, 512].map(s => (
                            <button key={s}
                                    className={activeQrData.size === s ? 'active' : ''}
                                    onClick={() => handleChange('size', s)}>
                                {s}px
                            </button>
                        ))}
                    </div>
                </div>
                <div className="option-item">
                    <label htmlFor="fgColorPicker">QR Code Color:</label>
                    <input id="fgColorPicker" type="color" value={activeQrData.fgColor}
                           onChange={(e) => handleChange('fgColor', e.target.value)}
                           className="color-picker"/>
                </div>
                <div className="option-item">
                    <label htmlFor="bgColorPicker">Back Color:</label>
                    <input id="bgColorPicker" type="color" value={activeQrData.bgColor}
                           onChange={(e) => handleChange('bgColor', e.target.value)}
                           className="color-picker"/>
                </div>
            </div>

            <div className="qr-code-display">
                {isLoading && <p>Generating QR Code...</p>}
                {error && <p style={{color: '#ff6b6b'}}>{error}</p>}
                {!isLoading && !error && qrCodeSvg && (
                    <div
                        aria-label="Generated QR Code"
                        style={{width: activeQrData.size, height: activeQrData.size}}
                        dangerouslySetInnerHTML={{__html: qrCodeSvg}}
                    />
                )}
                {!isLoading && !error && !qrCodeSvg && !debouncedText && (
                    <p>Enter text to generate a QR code.</p>
                )}
            </div>

            {!isLoading && qrCodeSvg && (
                <>
                    <div className="save-section">
                        <input
                            type="text"
                            className="save-title-input"
                            placeholder="Enter a title to save..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                        />
                        {saveStatus.message && (
                            <p className={`save-status ${saveStatus.type}`}>
                                {saveStatus.message}
                            </p>
                        )}
                    </div>
                    <div className="actions-buttons">
                        <div className="dropdown-container" ref={dropdownRef}>
                            <button onClick={() => setMenuOpen(!isMenuOpen)} disabled={!qrCodeSvg}>Download ▾</button>

                            {isMenuOpen && (
                                <div className="dropdown-menu">
                                    <a onClick={() => {
                                        downloadSVG(qrCodeSvg);
                                        setMenuOpen(false);
                                    }}>as SVG</a>
                                    <a onClick={() => {
                                        downloadPNG(qrCodeSvg, activeQrData.size);
                                        setMenuOpen(false);
                                    }}>as PNG</a>
                                    <a onClick={() => {
                                        downloadPDF(qrCodeSvg, activeQrData.size);
                                        setMenuOpen(false);
                                    }}>as PDF</a>
                                </div>
                            )}
                        </div>
                        <button onClick={onShareClick} disabled={!qrCodeSvg}>Share Link</button>

                        <button onClick={handleSave} disabled={!qrCodeSvg || !title.trim() || isSaving}>
                            {isSaving ? 'Saving...' : 'Save to History'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}