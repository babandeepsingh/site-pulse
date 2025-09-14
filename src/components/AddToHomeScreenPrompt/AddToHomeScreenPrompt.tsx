'use client';

import React, { useEffect, useState } from 'react';
// Basic styles
const styles: { prompt: React.CSSProperties } = {
    prompt: {
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 16,
        backgroundColor: '#fff8dc',
        border: '1px solid #ccc',
        borderRadius: 8,
        textAlign: 'center' as const,
        zIndex: 1000,
    },
};
const AddToHomeScreenPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deviceType, setDeviceType] = useState<'iphone' | 'ipad' | 'other'>('other');

    useEffect(() => {
        const device = getDeviceType();
        setDeviceType(device);

        const dismissed = localStorage.getItem('a2hsPromptDismissed');

        if (
            !dismissed &&
            (device === 'iphone' || device === 'ipad') &&
            !isInStandaloneMode()
        ) {
            setShowPrompt(true);
        }
    }, []);

    const getInstructions = () => {
        if (deviceType === 'iphone') {
            return 'Tap the Share button (🔗) then "Add to Home Screen".';
        } else if (deviceType === 'ipad') {
            return 'Tap the Share icon in Safari, then choose "Add to Home Screen".';
        }
        return '';
    };

    if (!showPrompt) return null;

    return (
        <div style={styles.prompt}>
            <p>Install this app on your {deviceType}: {getInstructions()}</p>
            <button onClick={() => {
                setShowPrompt(false);
                localStorage.setItem('a2hsPromptDismissed', 'true');
            }}>Close</button>
        </div>
    );
};

// Helper functions
function getDeviceType(): 'iphone' | 'ipad' | 'other' {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone/.test(ua)) return 'iphone';
    if (/ipad/.test(ua) || (navigator.maxTouchPoints > 1 && /macintosh/.test(ua))) {
        return 'ipad';
    }
    return 'other';
}

function isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
}



export default AddToHomeScreenPrompt;
