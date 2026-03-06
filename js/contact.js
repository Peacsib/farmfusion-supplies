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
    const formData = new FormData(form);
    
    // Add Web3Forms access key directly (client-side is safe for Web3Forms)
    formData.append('access_key', 'fb037b02-4641-4427-88d1-d23fcf6dac42');
    formData.append('subject', 'FarmFusion Supplies Enquiry');
    formData.append('from_name', 'FarmFusion Supplies');
    
    const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
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
            
            // More graceful error message with contact options
            const phone = '078 084 0505';
            const whatsapp = '263780840505';
            showStatus('', 'err');
            
            const { status } = els();
            if (status) {
                status.innerHTML = `
                    <div style="text-align: left;">
                        <strong>Unable to send message at the moment.</strong><br>
                        <span style="font-size: 0.9em; margin-top: 8px; display: block;">
                            Please contact us directly:<br>
                            📞 Call: <a href="tel:+263780840505" style="color: #4CAF50; text-decoration: underline;">${phone}</a><br>
                            💬 WhatsApp: <a href="https://wa.me/${whatsapp}" target="_blank" style="color: #25D366; text-decoration: underline;">Chat Now</a>
                        </span>
                    </div>
                `;
                status.className = 'status-pill err show';
            }
        }
    });
});
