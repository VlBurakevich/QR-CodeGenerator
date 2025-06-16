import {useState} from 'react';
import {useDebounce} from '../../hooks/useDebounce.js';
import {useQrCodeApi} from "../../hooks/useQrCodeApi.js";
import {downloadSVG, downloadPDF} from '../../utils/downloader.js';
import {handleShareLink} from '../../utils/share.js';
import './QrGenerator.css';

export function QrGenerator() {
    const [inputValue, setInputValue] = useState('');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

    const debouncedText = useDebounce(inputValue, 750);

    const {qrCodeSvg, isLoading, error} = useQrCodeApi({
        value: debouncedText,
        size,
        fgColor,
        bgColor
    });


    return (
        <div className="qr-generator-wrapper">
            <h1>QR Code Generator</h1>

            <div className="input-group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter text or URL"
                />
            </div>

            <div className="options-grid">
                <div className="option-item">
                    <label>Size:</label>
                    <div className="size-selector">
                        {[128, 256, 512].map(s => (
                            <button key={s} className={size === s ? 'active' : ''} onClick={() => setSize(s)}>
                                {s}px
                            </button>
                        ))}
                    </div>
                </div>
                <div className="option-item">
                    <label htmlFor="fgColorPicker">QR Code Color:</label>
                    <input id="fgColorPicker" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                           className="color-picker"/>
                </div>
                <div className="option-item">
                    <label htmlFor="bgColorPicker">Back Color:</label>
                    <input id="bgColorPicker" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                           className="color-picker"/>
                </div>
            </div>

            <div className="qr-code-display">
                {isLoading && <p>Loading...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
                {!isLoading && !error && qrCodeSvg && (
                    <div
                        style={{width: size, height: size}}
                        dangerouslySetInnerHTML={{__html: qrCodeSvg}}
                    />
                )}
                {!isLoading && !error && !qrCodeSvg && !debouncedText && (
                    <p>Enter text to generate a QR code.</p>
                )}
            </div>

            {!isLoading && qrCodeSvg && (
                <div className="download-buttons">
                    <button onClick={() => downloadSVG(qrCodeSvg)} disabled={!qrCodeSvg}>Download SVG</button>
                    <button onClick={() => downloadPDF(qrCodeSvg, size)} disabled={!qrCodeSvg}>Download PDF</button>
                    <button onClick={() => handleShareLink()} disabled={!qrCodeSvg}>Share Link</button>
                </div>
            )}
        </div>
    );
}
