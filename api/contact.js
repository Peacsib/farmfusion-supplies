'use strict';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

function json(res, status, payload) {
    res.status(status).setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
}

function isAllowedOrigin(origin, allowedOrigins) {
    if (!origin) return true;
    if (!allowedOrigins || allowedOrigins.length === 0) return true;
    return allowedOrigins.includes(origin);
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return json(res, 405, { success: false, message: 'Method not allowed' });
    }

    const accessKey = process.env.WEB3FORMS_KEY;
    const brandName = process.env.BRAND_NAME || 'FarmFusion Supplies';
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    // Only enforce ALLOWED_ORIGINS in production if explicitly set
    // Allow all origins if ALLOWED_ORIGINS is not configured
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldCheckOrigins = isProduction && allowedOrigins.length > 0;

    if (!accessKey) {
        return json(res, 500, { success: false, message: 'Server configuration missing WEB3FORMS_KEY' });
    }

    const origin = req.headers.origin || '';
    if (shouldCheckOrigins && !isAllowedOrigin(origin, allowedOrigins)) {
        return json(res, 403, { success: false, message: 'Origin not allowed' });
    }

    const { name, email, phone, interest, message, botcheck } = req.body || {};

    if (botcheck) {
        return json(res, 200, { success: true, message: 'OK' });
    }

    if (!name || !email || !phone || !interest || !message) {
        return json(res, 400, { success: false, message: 'Missing required fields' });
    }

    const form = new URLSearchParams();
    form.append('access_key', accessKey);
    form.append('name', String(name));
    form.append('email', String(email));
    form.append('phone', String(phone));
    form.append('interest', String(interest));
    form.append('message', String(message));
    form.append('botcheck', '');
    form.append('subject', `${brandName} enquiry: ${interest}`);
    form.append('from_name', brandName);
    form.append('redirect', 'false');
    form.append('replyto', String(email));

    try {
        const upstream = await fetch(WEB3FORMS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form
        });
        const data = await upstream.json();

        if (!upstream.ok || !data.success) {
            return json(res, 502, { success: false, message: data.message || 'Form provider error' });
        }

        return json(res, 200, { success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('[api/contact] submission error', error);
        return json(res, 500, { success: false, message: 'Server failed to send message' });
    }
};
