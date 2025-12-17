// Configuración de Supabase
const SUPABASE_URL = 'https://gjudfgpudbqdhclbmjjo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdWRmZ3B1ZGJxZGhjbGJtampvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI4MjgsImV4cCI6MjA2ODI4ODgyOH0.WKeSz0csl-L_Qb5fixfrYe2f57xSvyecWGpdT0kKJzA';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- INPUT SANITIZATION ---
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
}

function sanitizeEmail(email) {
    return sanitizeInput(email).toLowerCase();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// --- BACKGROUND NEURAL CANVAS (Optimizado) ---
function initNeuralNetwork() {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width, height, nodes = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createNodes();
        }

        function createNodes() {
            nodes = [];
            // Detectar móvil para reducir carga
            const isMobile = window.innerWidth < 768;
            const divider = isMobile ? 25000 : 15000;
            const nodeCount = Math.floor(width * height / divider);

            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() > 0.9 ? 3 : 2 // Variación leve
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(164, 143, 255, 0.5)';

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - node.x;
                    const dy = nodes[j].y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    // Conexiones más cortas en móvil para limpiar visualmente
                    const connectDist = window.innerWidth < 768 ? 90 : 120;

                    if (dist < connectDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(164, 143, 255, ${0.15 * (1 - dist / connectDist)})`;
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    } catch (e) {
        console.warn('Canvas init failed', e);
    }
}

// --- AUTH & UI LOGIC ---
document.addEventListener('DOMContentLoaded', function () {
    // Only check session on pages that aren't reset-password (to avoid redirect loops if logic differs)
    if (!window.location.pathname.includes('reset-password.html')) {
        checkExistingSession();
    }
    initializeEventListeners();
    setTimeout(initNeuralNetwork, 100);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('email')) {
        const email = urlParams.get('email');
        const loginEmailInfo = document.getElementById('loginEmail');
        if (loginEmailInfo) loginEmailInfo.value = email;
        const regEmailInfo = document.getElementById('registerEmail');
        if (regEmailInfo) regEmailInfo.value = email;
    }
});

async function checkExistingSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = '/dashboard.html';
    }
}

function initializeEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);

    const confirmPass = document.getElementById('confirmPassword');
    if (confirmPass) confirmPass.addEventListener('input', validatePasswordMatch);

    // Reset Password Page
    const resetForm = document.getElementById('resetForm');
    if (resetForm) resetForm.addEventListener('submit', handleResetPassword);

    // Password Strength
    const regPass = document.getElementById('registerPassword');
    if (regPass) regPass.addEventListener('input', checkPasswordStrength);
}

function showTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (tabName !== 'forgot') {
        const btn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        if (btn) btn.classList.add('active');
    }
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    const formMap = { 'login': 'loginForm', 'register': 'registerForm', 'forgot': 'forgotForm' };
    const formId = formMap[tabName];

    // Animación suave de entrada
    const form = document.getElementById(formId);
    if (form) {
        form.style.opacity = '0';
        form.classList.add('active');
        setTimeout(() => form.style.opacity = '1', 50);
    }
}

function showForgotPassword() { showTab('forgot'); }

// --- PASSWORD TOGGLE ---
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('ph-eye', 'ph-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('ph-eye-slash', 'ph-eye');
    }
}

// --- AUTH HANDLERS ---
async function handleLogin(e) {
    e.preventDefault();
    const email = sanitizeEmail(document.getElementById('loginEmail').value);
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');

    if (!validateEmail(email)) {
        showNotification('Por favor ingresa un correo válido', 'error');
        triggerShake('loginForm');
        return;
    }

    setButtonLoading(btn, 'Iniciando...');
    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showNotification('¡Bienvenido de vuelta!', 'success');
        setTimeout(() => window.location.href = '/dashboard.html', 800);
    } catch (error) {
        let msg = error.message;
        if (msg.includes('Invalid login')) msg = 'Correo o contraseña incorrectos.';
        if (msg.includes('Invalid login')) msg = 'Correo o contraseña incorrectos.';
        showNotification(msg, 'error');
        triggerShake('loginForm');
    } finally {
        resetButton(btn, 'Entrar a mi cuenta');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = sanitizeInput(document.getElementById('registerName').value);
    const email = sanitizeEmail(document.getElementById('registerEmail').value);
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const btn = document.getElementById('registerBtn');

    if (!validateEmail(email)) {
        showNotification('Por favor ingresa un correo válido', 'error');
        triggerShake('registerForm');
        return;
    }

    if (password !== confirmPassword) return showNotification('Las contraseñas no coinciden', 'error');
    if (password.length < 6) return showNotification('La contraseña debe tener 6+ caracteres', 'error');

    setButtonLoading(btn, 'Creando cuenta...');
    try {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;
        showNotification('¡Cuenta creada! Revisa tu correo.', 'success');
        setTimeout(() => {
            showTab('login');
            document.getElementById('loginEmail').value = email;
        }, 2500);
    } catch (error) {
        let msg = error.message;
        if (msg.includes('already registered')) msg = 'Este correo ya está registrado.';
        if (msg.includes('already registered')) msg = 'Este correo ya está registrado.';
        showNotification(msg, 'error');
        triggerShake('registerForm');
    } finally {
        resetButton(btn, 'Crear Cuenta Gratis');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const btn = document.getElementById('forgotBtn');
    setButtonLoading(btn, 'Enviando...');
    try {
        // Ajusta la URL de redirección si es necesario
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password.html' });
        if (error) throw error;
        showNotification('Enlace enviado. Revisa tu bandeja de entrada.', 'success');
        setTimeout(() => showTab('login'), 3000);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    } finally {
        resetButton(btn, 'Enviar Enlace');
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPass').value;
    const btn = document.getElementById('btnReset');
    setButtonLoading(btn, 'Guardando...');

    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        showNotification('¡Contraseña actualizada! Redirigiendo...', 'success');
        setTimeout(() => window.location.href = '/dashboard.html', 1500);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
        resetButton(btn, 'Intentar de nuevo');
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const field = document.getElementById('confirmPassword');

    if (confirm.length > 0) {
        field.style.borderColor = (password === confirm) ? 'var(--success)' : 'var(--error)';
    } else {
        field.style.borderColor = 'var(--border)';
    }
}

// --- UI HELPERS ---
function setButtonLoading(btn, text) {
    if (!btn) return;
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML; // Save original
    btn.innerHTML = `<div class="spinner"></div> ${text}`;
}

function resetButton(btn, text) {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = text || btn.dataset.originalText;
}

function showNotification(message, type = 'success') {
    let notif = document.getElementById('notification');
    // If notification element doesn't exist (e.g. simple reset page), create it or fallback to alert
    if (!notif) {
        alert(message);
        return;
    }

    const icon = document.getElementById('notifIcon');
    document.getElementById('notificationContent').textContent = message;

    notif.className = `notification ${type} show`;
    icon.innerHTML = type === 'success' ? '<i class="ph-fill ph-check-circle" style="color:var(--success)"></i>' : '<i class="ph-fill ph-warning-circle" style="color:var(--error)"></i>';

    setTimeout(() => notif.classList.remove('show'), 4000);
}

function openTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) modal.style.display = 'flex';
}
function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function (event) {
    const terms = document.getElementById('termsModal');
    if (terms && event.target == terms) closeTermsModal();
}

function triggerShake(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
}

function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const bar = document.getElementById('strengthBar');
    if (!bar) return;

    let strength = 0;
    if (password.length > 5) strength += 20;
    if (password.length > 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    bar.style.width = strength + '%';

    if (strength <= 20) bar.style.backgroundColor = '#ff5470'; // Error
    else if (strength <= 60) bar.style.backgroundColor = '#facc15'; // Warning
    else bar.style.backgroundColor = '#10b981'; // Success
}