import {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [text, setText] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [error, setError] = useState('');

    const handleGenerateQrCode = async () => {
        setQrCode('');
        setError('');

        if (!text) {
            setError('Please enter text or URL.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/generate', {
                text: text,
            });

            setQrCode(response.data.qrCodeDataUrl);

        } catch (err) {
            setError('Failed to generate QR Code. Please try again.')
            console.error(err);
        }
    };


    return (
        <div className="App">
            <h1>QR Code Generator</h1>
            <div className="from">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text or URL"
                />
                <button onClick={handleGenerateQrCode}>Generate QR Code</button>
            </div>
            {/* Условный рендеринг, показываем только если есть ошибка */}
            {error && <p className="error">{error}</p>}

            {/* Уловный рендеринг, показываем только если QR-код был сгенерирован*/}
            {qrCode && (
                <div className="qr-code-container">
                    <h2>Your QR Code:</h2>
                    <img src={qrCode} alt='Generated QR Code'/>
                </div>
            )}
        </div>
    );
}

export default App;
