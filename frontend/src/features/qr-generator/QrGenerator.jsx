import {useState, useRef} from 'react';
import {QRCodeSVG} from 'qrcode.react'
import {jsPDF} from "jspdf";
import {useDebounce} from '../../hooks/useDebounce.js';
import './QrGenerator.css';

export function QrGenerator() {
    const [inputValue, setInputValue] = useState('');
    const debouncedText = useDebounce(inputValue, 500);

    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

    const qrCodeRef = useRef(null);

    const handleDownloadSVG = () => {
        if (!qrCodeRef.current) return;

        const svgElement = qrCodeRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const handleDownloadPDF = () => {
        if (!qrCodeRef.current) return;

        const svgElement = qrCodeRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            const pngData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [size, size]
            });

            pdf.addImage(pngData, 'PNG', 0, 0, size, size);
            pdf.save('qrcode.pdf');
        };

        const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        img.src = URL.createObjectURL(blob);
    };


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
                            <button
                                key={s}
                                className={size === s ? 'active' : ''}
                                onClick={() => setSize(s)}
                            >
                                {s}px
                            </button>
                        ))}
                    </div>
                </div>
                <div className="option-item">
                    <label htmlFor="fgColorPicker">QR Code Color:</label>
                    <input
                        id="fgColorPicker"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="color-picker"
                    />
                </div>
                <div className="option-item">
                    <label htmlFor="bgColorPicker">Back Color:</label>
                    <input
                        id="bgColorPicker"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="color-picker"
                    />
                </div>
            </div>

            {debouncedText && (
                <div className="qr-code-display" ref={qrCodeRef}>
                    <QRCodeSVG
                        value={debouncedText}
                        size={size}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={"L"}
                    />
                </div>
            )}

            {debouncedText && (
                <div className="download-buttons">
                    <button onClick={handleDownloadSVG}>Download SVG</button>
                    <button onClick={handleDownloadPDF}>Download PDF</button>
                </div>
            )}
        </div>
    );
}
