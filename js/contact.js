'use strict';

/* ─────────────────────────────────────────────
   FarmFusion — contact.js
   Submits via Vercel serverless function (/api/contact).
───────────────────────────────────────────── */

function els() {
    return {
        form:       document.getElementById('contactForm'),
        status:     document.getElementById('formStatus'),
        spinner:    document.getElementById('formSpinner'),
        submit:     document.querySelector('#contactForm .submit-btn'),
        pop:        document.getElementById('successPop'),
        btnLabel:   document.querySelector('#contactForm .btn-label'),
        btnLoading: document.querySelector('#contactForm .btn-loading')
    };
}

function showStatus(msg, kind) {
    const { status } = els();
    if (!status) return;
    status.textContent = msg || '';
    status.className   = 'status-pill' + (kind ? ` ${kind}` : '');
    if (msg) requestAnimationFrame(() => status.classList.add('show'));
}

function setLoading(on) {
    const { spinner, submit, btnLabel, btnLoading } = els();
    if (spinner)    spinner.style.display    = on ? 'inline-block' : 'none';
    if (submit)     submit.disabled          = on;
    if (btnLabel)   btnLabel.style.display   = on ? 'none' : 'inline';
    if (btnLoading) btnLoading.style.display = on ? 'inline' : 'none';
}

function toastSuccess() {
    const { pop } = els();
    if (!pop) return;
    pop.classList.add('show');
    setTimeout(() => pop.classList.remove('show'), 3500);
}

async function submitContact(form) {
    const payload = Object.fromEntries(new FormData(form).entries());

    const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Submission failed');
    return json;
}

document.addEventListener('DOMContentLoaded', () => {
    const { form } = els();
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showStatus('', null);

        if (!form.checkValidity()) {
            form.reportValidity();
            showStatus('Please fill in all required fields correctly.', 'err');
            return;
        }

        try {
            setLoading(true);
            showStatus('Sending…', null);
            await submitContact(form);
            setLoading(false);
            showStatus('Message sent! We\'ll be in touch shortly.', 'ok');
            toastSuccess();
            form.reset();
        } catch (err) {
            console.error('[Contact]', err);
            setLoading(false);
            showStatus('Could not send. Please WhatsApp or call us directly.', 'err');
        }
    });
});
