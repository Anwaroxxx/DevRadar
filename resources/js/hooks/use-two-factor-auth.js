import { useState } from 'react';

export const OTP_MAX_LENGTH = 6;

const fetchJson = async (url) => {
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
    }

    return response.json();
};

export const useTwoFactorAuth = () => {
    const [qrCodeSvg, setQrCodeSvg] = useState(null);
    const [manualSetupKey, setManualSetupKey] = useState(null);
    const [recoveryCodesList, setRecoveryCodesList] = useState([]);
    const [errors, setErrors] = useState([]);

    const hasSetupData = qrCodeSvg !== null && manualSetupKey !== null;

    const fetchQrCode = async () => {
        try {
            const { svg } = await fetchJson('/user/two-factor-qr-code');
            setQrCodeSvg(svg);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch QR code']);
            setQrCodeSvg(null);
        }
    };

    const fetchSetupKey = async () => {
        try {
            const { secretKey: key } = await fetchJson('/user/two-factor-secret-key');
            setManualSetupKey(key);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch a setup key']);
            setManualSetupKey(null);
        }
    };

    const clearErrors = () => {
        setErrors([]);
    };

    const clearSetupData = () => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        clearErrors();
    };

    const fetchRecoveryCodes = async () => {
        try {
            clearErrors();
            const codes = await fetchJson('/user/two-factor-recovery-codes');
            setRecoveryCodesList(codes);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch recovery codes']);
            setRecoveryCodesList([]);
        }
    };

    const fetchSetupData = async () => {
        try {
            clearErrors();
            await Promise.all([fetchQrCode(), fetchSetupKey()]);
        } catch {
            setQrCodeSvg(null);
            setManualSetupKey(null);
        }
    };

    return {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        hasSetupData,
        errors,
        clearErrors,
        clearSetupData,
        fetchQrCode,
        fetchSetupKey,
        fetchSetupData,
        fetchRecoveryCodes,
    };
};
