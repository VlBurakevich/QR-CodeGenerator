
import { useState, useEffect } from 'react';
import { QrGenerator } from './features/qr-generator/QrGenerator.jsx';
import { QrHistorySidebar } from './features/hisotry/QrHistorySidebar.jsx';
import { initializeSession } from './auth/sessionManager.js';
import { QrHistoryProvider } from './context/QrHistoryContext.jsx';
import './styles/App.css';
import './features/hisotry/QrHistory.css';

function App() {
    const [isInitialized, setIsInitialized] = useState(false);

    const [activeQrData, setActiveQrData] = useState({
        value: 'https://react.dev',
        size: 256,
        fgColor: '#000000',
        bgColor: '#ffffff',
    });

    useEffect(() => {
        const init = async () => {
            await initializeSession();
            setIsInitialized(true);
        };
        init();
    }, []);

    const handleLoadQrFromHistory = (qrItem) => {
        setActiveQrData({
            value: qrItem.value,
            size: qrItem.size,
            fgColor: qrItem.fgColor,
            bgColor: qrItem.bgColor,
        });
    };

    if (!isInitialized) {
        return <div className="app-loader">Initializing...</div>;
    }

    return (
        <QrHistoryProvider>
            <div className="app-container">
                <main className="app-main-layout">
                    <QrHistorySidebar onSelectQrCode={handleLoadQrFromHistory} />
                    <div className="main-content">
                        <QrGenerator
                            activeQrData={activeQrData}
                            onDataChange={setActiveQrData}
                        />
                    </div>
                </main>
            </div>
        </QrHistoryProvider>
    );
}

export default App;