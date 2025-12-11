const DEVICE_ID_KEY = 'arga-sso-device-id';

/**
 * Get or create a persistent device ID.
 * This ID is stored in localStorage and persists across sessions.
 */
export function getDeviceId(): string {
    const storedId = localStorage.getItem(DEVICE_ID_KEY);

    if (storedId) {
        return storedId;
    }

    const newDeviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
    return newDeviceId;
}

/**
 * Get device information from browser.
 */
export function getDeviceInfo(): Record<string, unknown> {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;

    // Parse browser and OS from user agent
    let browser = 'Unknown';
    let os = 'Unknown';

    // Browser detection
    if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
    } else if (userAgent.includes('Edg')) {
        browser = 'Edge';
    } else if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
        browser = 'Safari';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        browser = 'Opera';
    }

    // OS detection
    if (userAgent.includes('Windows')) {
        os = 'Windows';
    } else if (userAgent.includes('Mac')) {
        os = 'macOS';
    } else if (userAgent.includes('Linux')) {
        os = 'Linux';
    } else if (userAgent.includes('Android')) {
        os = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        os = 'iOS';
    }

    return {
        device_id: getDeviceId(),
        browser,
        os,
        platform,
        language,
        user_agent: userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}
