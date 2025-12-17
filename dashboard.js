// ==========================================
// CONFIGURACIÓN CENTRAL
// ==========================================
const CONFIG = {
    supabaseUrl: 'https://gjudfgpudbqdhclbmjjo.supabase.co',
    // SECURITY NOTE: This is an Anon key. Ensure RLS policies are set in Supabase.
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdWRmZ3B1ZGJxZGhjbGJtampvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI4MjgsImV4cCI6MjA2ODI4ODgyOH0.WKeSz0csl-L_Qb5fixfrYe2f57xSvyecWGpdT0kKJzA',
    plans: { 'trial': 'Gratuito', 'copihue': 'Plan Copihue', 'araucaria': 'Plan Araucaria', 'condor': 'Plan Cóndor' }
};

const { createClient } = window.supabase;
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

const State = {
    currentUser: null,
    // State management
    classes: [],
    filters: { subject: '', grade: '', search: '' },
    chartInstance: null,
    profile: null,
    viewMode: 'list', // 'list' or 'folders'
    pagination: {
        currentPage: 1,
        itemsPerPage: 10
    }
};

const ACHIEVEMENTS = {
    first_class: { icon: '🎓', title: 'Primera Clase', desc: 'Generaste tu primera clase' },
    streak_7: { icon: '🔥', title: 'Una Semana', desc: '7 días seguidos generando' },
    total_10: { icon: '🌟', title: '10 Clases', desc: 'Has generado 10 clases' },
    total_50: { icon: '💯', title: '50 Clases', desc: 'Has generado 50 clases' },
    total_100: { icon: '👑', title: 'Centenario', desc: '¡100 clases generadas!' }
};

// ==========================================
// UI & UTILIDADES
// ==========================================
const UI = {
    showToast(msg, type = 'success') {
        const container = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'warning-circle' : 'info';
        t.innerHTML = `<i class="ph-fill ph-${icon}"></i><div>${msg}</div>`;
        container.appendChild(t);

        requestAnimationFrame(() => {
            setTimeout(() => {
                t.style.opacity = '0';
                t.style.transform = 'translateX(100%)';
                setTimeout(() => t.remove(), 300);
            }, 4000);
        });
    },

    toggleSidebar() {
        const sb = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sb.classList.toggle('active');
        overlay.classList.toggle('active');
    },

    setLoading(btnId, isLoading, originalText = '') {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner"></div> Procesando...';
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText || btn.dataset.originalText;
        }
    },

    renderGreeting() {
        const h = new Date().getHours();
        const gr = h < 12 ? "Buenos Días" : h < 19 ? "Buenas Tardes" : "Buenas Noches";
        const name = State.profile?.full_name?.split(' ')[0] || "Docente";
        const titleEl = document.getElementById('greetingTitle');
        if (titleEl) titleEl.innerHTML = `${gr}, <span style="color:var(--primary)">${name}</span> 👋`;

        // Dynamic Banner Logic
        const card = document.querySelector('.welcome-card');
        if (card) {
            // Remove previous classes
            card.classList.remove('morning', 'afternoon', 'night');

            // Add new class based on time
            if (h < 12) card.classList.add('morning');
            else if (h < 19) card.classList.add('afternoon');
            else card.classList.add('night');
        }

        // Random Quote
        const QUOTES = [
            "La educación es el arma más poderosa que puedes usar para cambiar el mundo. — Nelson Mandela",
            "La enseñanza es más que impartir conocimiento, es inspirar el cambio. — William Arthur Ward",
            "Lo que se les dé a los niños, los niños darán a la sociedad. — Karl A. Menninger",
            "Enseñar es aprender dos veces. — Joseph Joubert",
            "La mente no es un recipiente para llenar, sino un fuego para encender. — Plutarco"
        ];
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

        // Find or create quote element
        let quoteEl = document.getElementById('dailyQuote');
        if (!quoteEl && titleEl) {
            quoteEl = document.createElement('p');
            quoteEl.id = 'dailyQuote';
            quoteEl.className = 'quote-text';
            titleEl.parentNode.insertBefore(quoteEl, titleEl.nextSibling);
        }
        if (quoteEl) quoteEl.textContent = randomQuote;
    },

    updateRing(credits, max) {
        const ring = document.getElementById('creditsRing');
        const countEl = document.getElementById('creditsCount');
        if (!ring || !countEl) return;

        countEl.textContent = credits;
        const percentage = max > 0 ? (credits / max) : 0;
        const offset = 201 - (Math.min(percentage, 1) * 201);

        ring.style.strokeDashoffset = offset;
        ring.style.stroke = percentage < 0.2 ? '#ef4444' : percentage < 0.5 ? '#f59e0b' : '#10b981';

        // Trigger Animation
        ring.style.transition = 'none';
        ring.style.strokeDashoffset = 201; // Start empty
        setTimeout(() => {
            ring.style.transition = 'stroke-dashoffset 1.5s ease-out';
            ring.style.strokeDashoffset = offset; // Animate to value
        }, 100);
    },

    async updateProfile() {
        const name = document.getElementById('profileNameInput').value;
        if (!name) return;
        try {
            await supabase.from('user_profiles').upsert({ user_id: State.currentUser.id, full_name: name });
            UI.showToast('Perfil actualizado');
            State.profile.full_name = name;
            UI.renderGreeting();
            document.getElementById('headerName').textContent = name;
            document.getElementById('headerAvatar').textContent = name.charAt(0).toUpperCase();
        } catch (e) {
            UI.showToast('Error al actualizar perfil', 'error');
        }
    },

    async updatePassword() {
        const pass = document.getElementById('newPassword').value;
        if (pass.length < 6) { UI.showToast('Mínimo 6 caracteres', 'error'); return; }
        const { error } = await supabase.auth.updateUser({ password: pass });
        if (error) UI.showToast(error.message, 'error');
        else { UI.showToast('Contraseña actualizada'); document.getElementById('newPassword').value = ''; }
    },

    closeUpsellModal() {
        document.getElementById('upsellModal').classList.remove('show');
        localStorage.setItem('upsell_dismissed', Date.now());
    },

    checkUpsellTrigger(credits) {
        if (credits <= 3 && credits >= 0) {
            const lastDismissed = localStorage.getItem('upsell_dismissed');
            const hoursSinceDismissed = lastDismissed ?
                (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60) : 999;
            if (hoursSinceDismissed > 24) {
                const creditEl = document.getElementById('modalCreditsLeft');
                if (creditEl) creditEl.textContent = credits;
                document.getElementById('upsellModal').classList.add('show');
            }
        }
    },

    closeAchievementModal() { document.getElementById('achievementModal').classList.remove('show'); },

    toggleMobileSearch() {
        const search = document.getElementById('headerSearch');
        search.classList.toggle('active');
        if (search.classList.contains('active')) {
            search.querySelector('input').focus();
        }
    },



    toggleView(mode) {
        State.viewMode = mode;
        const listBtn = document.getElementById('viewListBtn');
        const folderBtn = document.getElementById('viewFolderBtn');
        const grid = document.getElementById('folderGrid');
        const table = document.querySelector('#history .table-container');

        if (mode === 'folders') {
            listBtn.classList.remove('active');
            folderBtn.classList.add('active');
            grid.style.display = 'grid';
            table.style.display = 'none';
            this.renderFolders();
        } else {
            listBtn.classList.add('active');
            folderBtn.classList.remove('active');
            grid.style.display = 'none';
            table.style.display = 'block';
        }
    },

    openFolder(subject) {
        this.toggleView('list');
        const select = document.querySelector('select[onchange*="subject"]');
        if (select) {
            select.value = subject;
            Data.setFilter('subject', subject);
        }
    },

    renderFolders() {
        const grid = document.getElementById('folderGrid');
        if (!grid) return;

        const groups = Data.getGroupedClasses();
        const subjects = Object.keys(groups);

        if (subjects.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 2rem;">No hay clases para agrupar.</div>`;
            return;
        }

        const subjectColors = {
            'Lenguaje': 'linear-gradient(135deg, #FF6B6B, #EE5253)',
            'Matemáticas': 'linear-gradient(135deg, #54A0FF, #2E86DE)',
            'Historia': 'linear-gradient(135deg, #Feca57, #ff9f43)',
            'Ciencias': 'linear-gradient(135deg, #1dd1a1, #10ac84)',
            'Inglés': 'linear-gradient(135deg, #5f27cd, #341f97)',
            'Tecnología': 'linear-gradient(135deg, #48dbfb, #0abde3)',
            'Artes': 'linear-gradient(135deg, #ff9ff3, #f368e0)'
        };
        const defaultColor = 'linear-gradient(135deg, #a48fff, #6e56cf)';

        grid.innerHTML = subjects.map(sub => {
            const count = groups[sub].length;
            const bg = subjectColors[sub] || defaultColor;
            return `
                <div class="folder-card" onclick="UI.openFolder('${sub}')">
                    <div class="folder-icon" style="background: ${bg}">
                        <i class="ph-fill ph-folder-open"></i>
                    </div>
                    <div class="folder-info">
                        <h3>${sub}</h3>
                        <p>${count} ${count === 1 ? 'clase' : 'clases'}</p>
                    </div>
                    <div style="position:absolute; right:1.5rem; top:1.5rem; color:var(--muted);">
                        <i class="ph-bold ph-caret-right"></i>
                    </div>
                </div>
            `;
        }).join('');
    },

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        // Persist preference
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Update Chart if exists (Colors need valid contrast)
        // Simple reload for demo, or advanced update logic could be added
        if (State.chartInstance) {
            State.chartInstance.data.datasets[0].backgroundColor = isLight ? '#6e56cf' : '#a48fff';
            State.chartInstance.update();
        }
    },

    initTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        }
    },

    showAchievement(key) {
        const achievement = ACHIEVEMENTS[key];
        if (!achievement) return;
        const shown = JSON.parse(localStorage.getItem('achievements_shown') || '[]');
        if (shown.includes(key)) return;

        document.getElementById('achievementIcon').textContent = achievement.icon;
        document.getElementById('achievementTitle').textContent = achievement.title;
        document.getElementById('achievementDesc').textContent = achievement.desc;
        document.getElementById('achievementModal').classList.add('show');

        shown.push(key);
        localStorage.setItem('achievements_shown', JSON.stringify(shown));
    },

    openPreview(classData) {
        document.getElementById('previewTitle').textContent = classData.objetivo_clase || 'Detalle de Clase';

        // Content fallback
        const content = classData.contenido_texto || "⚠️ Vista previa no disponible. El contenido de texto no se guardó o es una clase antigua.";

        document.getElementById('previewBody').textContent = content;

        const btnSlides = document.getElementById('btnOpenSlides');
        if (classData.google_slides_id) {
            btnSlides.href = `https://docs.google.com/presentation/d/${classData.google_slides_id}/edit`;
            btnSlides.style.display = 'inline-flex';
        } else {
            btnSlides.style.display = 'none';
        }

        // Copy logic (Smart Copy)
        document.getElementById('btnCopyPreview').onclick = () => {
            const type = "text/html";
            const blob = new Blob([document.getElementById('previewBody').innerHTML], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard.write(data).then(() => {
                UI.showToast('¡Copiado con formato! Listo para Word/Docs');
            });
        };

        document.getElementById('previewModal').classList.add('show');
    }
};

// ==========================================
// LÓGICA DE DATOS
// ==========================================
const Data = {
    async init() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && !window.location.href.includes('preview')) return window.location.href = 'https://educmark.cl/login.html';

            State.currentUser = session ? session.user : { id: 'demo-user', email: 'demo@educmark.cl' };

            // Optimización: Carga paralela de datos críticos
            // Usamos Promise.allSettled para que un fallo en uno no bloquee todo el dashboard
            await Promise.allSettled([
                this.loadProfile(),
                this.loadSubscription(),
                this.loadClasses()
            ]);

            // Eliminar skeletons solo cuando todo ha terminado o fallado
            document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));

            UI.renderGreeting();
            this.renderSparkline();
            this.renderSocialProof();
            this.checkAchievements();
        } catch (err) {
            console.error("Init Error:", err);
            // Asegurar que los skeletons se quiten incluso si hay error crítico
            document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));
        }
    },

    async loadProfile() {
        try {
            const { data } = await supabase.from('user_profiles').select('*').eq('user_id', State.currentUser.id).maybeSingle();
            State.profile = data || { full_name: State.currentUser.email.split('@')[0] };

            const els = {
                headerName: document.getElementById('headerName'),
                headerAvatar: document.getElementById('headerAvatar'),
                genName: document.getElementById('genName'),
                genEmail: document.getElementById('genEmail'),
                profileName: document.getElementById('profileNameInput'),
                profileEmail: document.getElementById('profileEmailInput')
            };

            if (els.headerName) els.headerName.textContent = State.profile.full_name;
            if (els.headerAvatar) els.headerAvatar.textContent = State.profile.full_name.charAt(0).toUpperCase();
            if (els.genName) els.genName.value = State.profile.full_name;
            if (els.genEmail) els.genEmail.value = State.currentUser.email;
            if (els.profileName) els.profileName.value = State.profile.full_name;
            if (els.profileEmail) els.profileEmail.value = State.currentUser.email;

        } catch (e) { console.error("Error perfil", e); }
    },

    async loadSubscription() {
        try {
            const { data } = await supabase.from('user_subscriptions').select('*').eq('user_id', State.currentUser.id).maybeSingle();
            const planKey = data?.plan_type || 'trial';
            const credits = data?.remaining_credits ?? 3;
            const max = data?.credits_limit || 5;

            const planText = CONFIG.plans[planKey] || 'Gratuito';
            document.getElementById('subCardPlan').textContent = planText;
            document.getElementById('headerPlan').textContent = planText;
            UI.updateRing(credits, max);

            this.renderPlanComparison(planKey);
            UI.checkUpsellTrigger(credits);
        } catch (e) { console.error("Error suscripción", e); }
    },

    async loadClasses() {
        try {
            const { data, error } = await supabase.from('generated_classes')
                .select('*')
                .eq('user_id', State.currentUser.id)
                .order('created_at', { ascending: false });

            State.classes = (error || !data) ? [] : data;
            this.renderTables();
            this.updateStats();
            this.startPolling(); // Start polling for pending slides
        } catch (e) {
            console.warn("No se pudieron cargar clases", e);
            State.classes = [];
        }
    },

    startPolling() {
        // Clear existing interval if any
        if (State.pollingInterval) clearInterval(State.pollingInterval);

        const checkSlides = async () => {
            const pending = State.classes.filter(c => !c.google_slides_id);
            if (pending.length === 0) {
                if (State.pollingInterval) {
                    clearInterval(State.pollingInterval);
                    State.pollingInterval = null;
                }
                return;
            }

            try {
                const ids = pending.map(c => c.id);
                // Only select rows that HAVE a google_slides_id now
                const { data } = await supabase
                    .from('generated_classes')
                    .select('id, google_slides_id')
                    .in('id', ids)
                    .not('google_slides_id', 'is', null);

                if (data && data.length > 0) {
                    let updated = false;
                    data.forEach(remoteItem => {
                        const localItem = State.classes.find(c => c.id === remoteItem.id);
                        if (localItem && !localItem.google_slides_id) {
                            localItem.google_slides_id = remoteItem.google_slides_id;
                            updated = true;
                        }
                    });

                    if (updated) {
                        this.renderTables();
                        UI.showToast('¡Tu presentación está lista! 🎨', 'success');
                    }
                }
            } catch (err) {
                console.warn('Polling error:', err);
            }
        };

        // Check every 5 seconds
        State.pollingInterval = setInterval(checkSlides, 5000);
    },


    renderTables() {
        const search = State.filters.search.toLowerCase();
        let filtered = State.classes.filter(c => {
            const matchSub = !State.filters.subject || c.asignatura === State.filters.subject;
            const matchGrade = !State.filters.grade || c.curso === State.filters.grade;
            const matchSearch = !search ||
                (c.objetivo_clase || '').toLowerCase().includes(search) ||
                (c.asignatura || '').toLowerCase().includes(search);
            return matchSub && matchGrade && matchSearch;
        });

        const createRow = (c) => `
            <tr>
                <td data-label="Clase">
                    <div class="text-clamp-2" style="font-weight:600;color:var(--foreground);">${c.objetivo_clase || 'Sin título'}</div>
                    <div class="text-clamp-2" style="font-size:0.75rem;color:var(--muted);">${c.oa || ''}</div>
                </td>
                <td data-label="Asignatura"><span class="badge badge-purple">${c.asignatura}</span></td>
                <td data-label="Curso"><span class="badge badge-success">${c.curso}</span></td>
                <td data-label="Fecha">${new Date(c.created_at).toLocaleDateString()}</td>
                <td data-label="Acciones">
                    <div class="action-buttons" style="display:flex; gap:0.5rem; justify-content: flex-end; align-items: center;">
                        <!-- Feedback Buttons -->
                        <div style="display: flex; gap: 2px; margin-right: 8px; padding-right: 8px; border-right: 1px solid var(--border);">
                            <button class="btn-icon-sm ${c.feedback === 'up' ? 'active' : ''}" onclick="Data.feedback('${c.id}', 'up')" title="Me gusta">
                                <i class="ph-${c.feedback === 'up' ? 'fill' : 'bold'} ph-thumbs-up"></i>
                            </button>
                            <button class="btn-icon-sm ${c.feedback === 'down' ? 'active' : ''}" onclick="Data.feedback('${c.id}', 'down')" title="No me gusta">
                                <i class="ph-${c.feedback === 'down' ? 'fill' : 'bold'} ph-thumbs-down"></i>
                            </button>
                        </div>
                        ${c.google_slides_id ?
                `<a href="https://docs.google.com/presentation/d/${c.google_slides_id}/edit" 
                           target="_blank" 
                           class="btn-icon"
                           style="color: #F4B400; background: #fff8e1; border: 1px solid #ffe082; padding: 6px; border-radius: 6px; display: inline-flex; justify-content: center; align-items: center;"
                           title="Editar Presentación en Drive">
                            <i class="ph-fill ph-pencil-simple"></i>
                        </a>` :
                `<span class="btn-icon" style="opacity:0.5; padding: 6px; border-radius: 6px; border: 1px solid transparent; display: inline-flex; justify-content: center; align-items: center;"><i class="ph ph-hourglass"></i></span>`}

                        <button class="btn-icon" 
                                onclick="Data.copyPlan('${c.id}')" 
                                style="color: #6e56cf; background: #f3f0ff; border: 1px solid #dcd7fe; padding: 6px; border-radius: 6px;"
                                title="Copiar Planificación al Portapapeles">
                            <i class="ph-bold ph-copy"></i>
                        </button>

                        <button class="btn-icon" 
                                onclick="Data.delete('${c.id}')" 
                                style="color: #e54d2e; background: #fff0f0; border: 1px solid #ffcdcd; padding: 6px; border-radius: 6px;"
                                title="Eliminar Clase">
                            <i class="ph-bold ph-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;

        // Pagination variables (assuming they are managed elsewhere or need to be added)
        const page = State.pagination.currentPage; // Assuming State.pagination exists
        const itemsPerPage = State.pagination.itemsPerPage; // Assuming State.pagination exists
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const filterText = State.filters.search || State.filters.subject || State.filters.grade;

        const recentTableBody = document.getElementById('recentTableBody');
        const historyTableBody = document.getElementById('historyTableBody');

        // EMPTY STATE CHECK
        if (filtered.length === 0) {
            const emptyStateHtml = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 4rem 2rem;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--muted);">
                            <div style="background: rgba(110, 86, 207, 0.1); padding: 1.5rem; border-radius: 50%; margin-bottom: 0.5rem;">
                                <i class="ph-duotone ph-student" style="font-size: 2.5rem; color: var(--primary);"></i>
                            </div>
                            <h3 style="color: var(--foreground); font-size: 1.25rem; font-weight: 600;">No hay clases encontradas</h3>
                            <p style="font-size: 0.95rem; max-width: 300px; margin: 0 auto;">
                                ${filterText ? 'Intenta buscar con otros términos.' : 'Aún no has generado tu primera clase con IA.'}
                            </p>
                            ${!filterText ? `
                            <button onclick="UI.openWizard()" class="btn-primary" style="margin-top: 1rem;">
                                <i class="ph-bold ph-magic-wand"></i> Crear mi primera clase
                            </button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
            if (recentTableBody) recentTableBody.innerHTML = emptyStateHtml;
            if (historyTableBody) historyTableBody.innerHTML = emptyStateHtml;
            this.renderPagination(0, 1); // Assuming renderPagination exists
            return;
        }

        const visibleClasses = filtered.slice(start, end);
        const html = visibleClasses.map(createRow).join('');

        if (recentTableBody) recentTableBody.innerHTML = html;
        if (historyTableBody) historyTableBody.innerHTML = html;

        this.renderPagination(filtered.length, page); // Assuming renderPagination exists

        // Snappier load animation
        const tables = document.querySelectorAll('table');
        tables.forEach(t => {
            t.style.opacity = '0';
            t.style.transform = 'translateY(5px)';
            requestAnimationFrame(() => {
                t.style.transition = 'all 0.3s ease';
                t.style.opacity = '1';
                t.style.transform = 'translateY(0)';
            });
        });
    },

    renderPagination(totalItems, currentPage) {
        const { itemsPerPage } = State.pagination;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        // Update State
        State.pagination.currentPage = currentPage;

        // Update UI Text
        const infoEl = document.getElementById('pageInfo');
        if (infoEl) infoEl.textContent = `Página ${currentPage} de ${totalPages}`;

        // Update Buttons
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.disabled = currentPage <= 1;
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    State.pagination.currentPage--;
                    this.renderTables();
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages;
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    State.pagination.currentPage++;
                    this.renderTables();
                }
            };
        }
    },

    updateStats() {
        const count = State.classes.length;

        // CountUp Animation for Total
        const totalEl = document.getElementById('statTotal');
        if (totalEl) {
            let start = 0;
            const end = count;
            const duration = 1000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);

                const value = Math.floor(start + (end - start) * ease);
                totalEl.textContent = value;

                if (progress < 1) requestAnimationFrame(animate);
                else totalEl.textContent = end;
            };
            requestAnimationFrame(animate);
        }

        const savedMins = count * 45;
        const blocks = (savedMins / 45);
        const blocksText = blocks === 1 ? 'bloque recuperado' : 'bloques recuperados';

        document.getElementById('statTimeSaved').textContent = `${Math.floor(savedMins / 60)}h ${savedMins % 60}m`;
        document.getElementById('statBlocksSaved').innerHTML = `<i class="ph-fill ph-lightning"></i> ≈ ${blocks} ${blocksText}`;

        const streakEl = document.getElementById('streakDays');
        if (streakEl) streakEl.textContent = this.calculateStreak();
    },

    getGroupedClasses() {
        const groups = {};
        State.classes.forEach(c => {
            const subject = c.asignatura || 'Sin Asignatura';
            if (!groups[subject]) groups[subject] = [];
            groups[subject].push(c);
        });
        return groups;
    },

    setFilter(type, val) {
        State.filters[type] = val;
        this.renderTables();
    },

    clearFilters() {
        State.filters = { subject: '', grade: '', search: '' };
        document.querySelectorAll('select.form-control').forEach(s => s.value = '');
        const searchInput = document.querySelector('.header-search input');
        if (searchInput) searchInput.value = '';
        this.renderTables();
    },

    duplicate(id) {
        const item = State.classes.find(c => c.id === id);
        if (!item) return;
        ['genSubject', 'genGrade', 'genOA', 'genObjClass', 'genNEE', 'genDuration'].forEach(field => {
            const key = field.replace('gen', '').toLowerCase();
            let dbKey = key;
            if (key === 'objclass') dbKey = 'objetivo_clase';
            else if (key === 'subject') dbKey = 'asignatura';
            else if (key === 'grade') dbKey = 'curso';
            else if (key === 'duration') dbKey = 'duracion';

            const val = item[dbKey];
            const el = document.getElementById(field);
            if (el) el.value = val || '';
        });
        Nav.to('generator');
        UI.showToast('Datos cargados en el generador');
    },

    async delete(id) {
        if (!confirm('¿Eliminar esta clase permanentemente?')) return;
        const { error } = await supabase.from('generated_classes').delete().eq('id', id);
        if (error) UI.showToast('Error al eliminar', 'error');
        else {
            State.classes = State.classes.filter(c => c.id !== id);
            this.renderTables();
            this.updateStats();
            UI.showToast('Clase eliminada');
        }
    },

    renderPlanComparison(planKey) {
        const gridContainer = document.getElementById('subscriptionComparisonGrid');
        if (!gridContainer) return;
        let leftCard = {}, rightCard = {}, isMaxLevel = false;

        if (planKey === 'trial') {
            leftCard = { icon: '👤', title: 'Tu Situación Actual', items: [{ icon: '⚠️', color: '#f59e0b', text: 'Gastas ±54 min por clase' }, { icon: '⚠️', color: '#f59e0b', text: 'Buscas recursos en múltiples sitios' }, { icon: '⚠️', color: '#f59e0b', text: 'Sin personalización NEE' }] };
            rightCard = { badge: 'DESBLOQUEA TU TIEMPO', name: 'Plan Copihue', icon: '🌸', color: '#10b981', items: ['20 Clases Completas al mes', '20 PPTs (Google Slides)', 'Soporte VIP'], savings: 'Recuperas 1 día al mes', cta: 'Quiero recuperar mi tiempo' };
        } else if (planKey === 'copihue') {
            leftCard = { icon: '🌸', title: 'Tu Potencia Actual', items: [{ icon: '✅', color: 'var(--success)', text: 'Generador activo' }, { icon: 'ℹ️', color: 'var(--muted)', text: 'Límite: 20 clases/mes' }] };
            rightCard = { badge: 'RECOMENDADO', name: 'Plan Araucaria', icon: '🌲', color: '#a48fff', items: ['35 Clases al mes (+75%)', 'Imágenes IA Premium', 'Soporte Prioritario VIP'], savings: '⚡ Ahorras ±31 horas/mes', cta: 'Mejorar a Araucaria' };
        } else if (planKey === 'araucaria') {
            leftCard = { icon: '🌲', title: 'Tu Potencia Actual', items: [{ icon: '✅', color: 'var(--success)', text: 'Soporte VIP Activo' }, { icon: 'ℹ️', color: 'var(--muted)', text: 'Límite: 35 clases/mes' }] };
            rightCard = { badge: 'MÁXIMO PODER', name: 'Plan Cóndor', icon: '🦅', color: '#f59e0b', items: ['50 Clases (El máximo)', '450 Imágenes IA', 'Acceso anticipado'], savings: '👑 Potencia Ilimitada', cta: 'Obtener Plan Cóndor' };
        } else {
            isMaxLevel = true;
        }

        if (isMaxLevel) {
            gridContainer.style.display = 'block';
            gridContainer.innerHTML = `<div class="sub-card-max animation-fade-up"><div style="font-size: 5rem; margin-bottom: 1rem;">🦅</div><h2 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--foreground);">¡Estás en la cima!</h2><p style="color: var(--muted); font-size: 1.1rem;">Eres <strong>Plan Cóndor</strong>.</p></div>`;
        } else {
            gridContainer.innerHTML = `
                <div class="sub-card-left">
                    <div class="sub-card-header">
                        <div class="sub-icon-box">${leftCard.icon}</div>
                        <h3 style="font-size: 1.1rem; color: var(--foreground);">${leftCard.title}</h3>
                    </div>
                    <div class="sub-card-body">
                        ${leftCard.items.map(item => `<div class="sub-item"><i class="ph-fill ph-warning" style="color: ${item.color}; font-size: 1.1rem; margin-top: 2px;"></i><span style="font-size: 0.95rem; color: var(--muted); line-height: 1.4;">${item.text}</span></div>`).join('')}
                    </div>
                </div>
                <div class="sub-card-right" style="border: 2px solid ${rightCard.color};">
                    <div class="sub-badge" style="background: ${rightCard.color};"><i class="ph-bold ph-lock-key-open"></i> ${rightCard.badge}</div>
                    <div class="sub-card-header">
                        <div style="display: flex; align-items: center; gap: 0.8rem;"><i class="ph-fill ph-check-circle" style="color: ${rightCard.color}; font-size: 1.5rem;"></i><h3 style="font-size: 1.2rem; font-weight: 700; color:var(--foreground);">${rightCard.name}</h3></div>
                        <div style="font-size: 1.8rem;">${rightCard.icon}</div>
                    </div>
                    <div class="sub-card-body">
                        ${rightCard.items.map(item => `<div class="sub-item" style="color:var(--foreground);"><div class="check-circle" style="background: ${rightCard.color};"><i class="ph-bold ph-check" style="font-size: 0.7rem; color: #000;"></i></div><span style="font-size: 0.95rem;">${item}</span></div>`).join('')}
                    </div>
                    <div style="margin-top: auto;">
                        <div class="sub-savings"><span style="font-size: 1.5rem;">🦥</span><span style="font-weight: 600; font-size: 0.95rem; color:var(--foreground);">${rightCard.savings}</span></div>
                        <button onclick="window.location.href='https://educmark.cl#planes'" class="btn" style="width: 100%; background: ${rightCard.color}; color: #000; font-weight: 700; border-radius: 8px; padding: 12px;">${rightCard.cta} <i class="ph-bold ph-arrow-right"></i></button>
                    </div>
                </div>`;
        }
    },

    calculateStreak() {
        if (!State.classes.length) return 0;
        const uniqueDates = [...new Set(State.classes.map(c => c.created_at.split('T')[0]))];

        let streak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActivity = new Date(uniqueDates[0]);
        lastActivity.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - lastActivity);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) return 0;

        let currentDate = new Date(uniqueDates[0]);
        streak = 1;

        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i]);
            const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
            if (Math.round(dayDiff) === 1) {
                streak++;
                currentDate = prevDate;
            } else {
                break;
            }
        }
        return streak;
    },

    renderSparkline() {
        const ctx = document.getElementById('sparklineChart');
        if (!ctx || !window.Chart) return;

        if (State.chartInstance) {
            State.chartInstance.destroy();
        }

        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date(); date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const classesByDay = last7Days.map(date =>
            State.classes.filter(cls => cls.created_at.startsWith(date)).length
        );

        State.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last7Days, // Use actual dates or simple 'M', 'T', 'W' etc if preferred. Here preserving logic.
                datasets: [{
                    data: classesByDay,
                    backgroundColor: '#a48fff',
                    hoverBackgroundColor: '#bca9ff',
                    borderRadius: 4,
                    barThickness: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
                scales: {
                    x: { display: false },
                    y: { display: false, beginAtZero: true }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            }
        });
    },

    renderSocialProof() {
        const feed = document.getElementById('socialProofFeed');
        if (!feed) return;
        const names = ['María P.', 'Juan T.', 'Carla F.', 'Roberto M.', 'Ana S.', 'Diego L.'];
        const subjects = ['Lenguaje', 'Historia', 'Matemáticas', 'Ciencias', 'Inglés'];
        const activities = [...Array(5)].map(() => {
            const name = names[Math.floor(Math.random() * names.length)];
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const time = Math.floor(Math.random() * 30) + 1;
            return `<div style="font-size: 0.8rem; color: var(--muted); display: flex; align-items: center; gap: 0.5rem;"><i class="ph-fill ph-check-circle" style="color: var(--success); font-size: 1rem;"></i><span>${name} generó ${subject} hace ${time}m</span></div>`;
        });
        feed.innerHTML = activities.join('');
    },

    checkAchievements() {
        const total = State.classes.length;
        const streak = this.calculateStreak();
        if (total >= 1) UI.showAchievement('first_class');
        if (total >= 10) UI.showAchievement('total_10');
        if (total >= 50) UI.showAchievement('total_50');
        if (total >= 100) UI.showAchievement('total_100');
        if (streak >= 7) UI.showAchievement('streak_7');
    },

    preview(id) {
        const item = State.classes.find(c => c.id === id);
        if (item) UI.openPreview(item);
    },

    async feedback(id, type) {
        // 1. Optimistic Update
        const item = State.classes.find(c => c.id === id);
        if (!item) return;

        const previousFeedback = item.feedback;
        // Toggle logic: if clicking same type, remove feedback
        const newFeedback = previousFeedback === type ? null : type;

        item.feedback = newFeedback;
        this.renderTables(); // Re-render to show active state immediately

        // 2. Persist to Supabase
        try {
            const { error } = await supabase
                .from('generated_classes')
                .update({ feedback: newFeedback })
                .eq('id', id);

            if (error) throw error;

            // 3. Feedback Toast
            if (newFeedback) {
                const msg = newFeedback === 'up' ? '¡Gracias! Nos alegra que te guste.' : 'Gracias, lo tendremos en cuenta.';
                UI.showToast(msg, 'success');
            }
        } catch (err) {
            console.error('Feedback Error:', err);
            // Revert on error
            item.feedback = previousFeedback;
            this.renderTables();
            // Revert on error
            item.feedback = previousFeedback;
            this.renderTables();
            console.error(err);
            UI.showToast('No se pudo guardar el feedback. Revisa tu conexión.', 'error');
        }
    },

    async copyPlan(id) {
        const item = State.classes.find(c => c.id === id);

        // 1. OBTENCIÓN DEL CONTENIDO (V4: Discriminación de Fuente)
        // Intentamos usar siempre el Markdown original (contenido_texto) porque es más limpio para generar HTML nuevo.
        // Si no existe, usamos el HTML guardado (planificacion_html) pero debemos limpiarlo.

        let htmlContentForClipboard = '';
        let sourceIsMarkdown = !!item.contenido_texto;
        let sourceContent = item.contenido_texto || item.planificacion_html;

        if (!item || !sourceContent) {
            UI.showToast('No hay contenido para copiar.', 'error');
            return;
        }

        // 2. PROCESAMIENTO SEGÚN TIPO
        if (sourceIsMarkdown) {
            // ---> ES MARKDOWN: Usamos nuestro Parser Lineal V3 (Seguro)
            htmlContentForClipboard = this.parseMarkdownToHtml(sourceContent);
        } else {
            // ---> ES HTML LEGADO: Probablemente tiene tags <html><body> que cuelgan a Docs.
            // Extraemos solo lo que hay dentro del body.
            if (sourceContent.includes('<body')) {
                const match = sourceContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                htmlContentForClipboard = match ? match[1] : sourceContent;
            } else {
                htmlContentForClipboard = sourceContent; // Ya era un fragmento
            }
        }

        // 3. ARMADO DEL FRAGMENTO FINAL (Wrapper Div)
        const finalHtml = `
            <div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">
                <h1 style="color: #6e56cf; font-size: 18pt; margin-bottom: 5px;">${item.objetivo_clase || 'Planificación'}</h1>
                <p style="background: #f0f0f0; padding: 10px; border-left: 4px solid #6e56cf;">
                    <strong>Curso:</strong> ${item.curso} <br>
                    <strong>Asignatura:</strong> ${item.asignatura} <br>
                    <strong>OA:</strong> ${item.oa}
                </p>
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                
                ${htmlContentForClipboard}
                
                <br><br>
                <small style="color: #999;">Generado por EducMark</small>
            </div>
        `;

        const plainText = `${item.objetivo_clase}\n\n${item.contenido_texto || 'Planificación en formato HTML adjunta.'}`;

        try {
            const clipboardItem = new ClipboardItem({
                "text/html": new Blob([finalHtml], { type: "text/html" }),
                "text/plain": new Blob([plainText], { type: "text/plain" })
            });
            await navigator.clipboard.write([clipboardItem]);
            UI.showToast('¡Copiado! Pega en Docs (Ctrl+V)', 'success');
        } catch (err) {
            console.error('Error V4 Copy:', err);
            // Fallback: Si el HTML falla, al menos copiamos el texto plano
            try {
                const blobText = new Blob([plainText], { type: 'text/plain' });
                const itemOnlyText = new ClipboardItem({ "text/plain": blobText });
                await navigator.clipboard.write([itemOnlyText]);
                UI.showToast('Copiado como texto simple (Compatibilidad)', 'info');
            } catch (e2) {
                // Último recurso
                navigator.clipboard.writeText(plainText);
            }
        }
    },

    // Parser Lineal V3 extraído para limpieza
    parseMarkdownToHtml(markdown) {
        const lines = markdown.split('\n');
        let htmlBuffer = '';
        let isInsideTable = false;

        const tableStyle = 'width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid #000;';
        const tdStyle = 'border: 1px solid #555; padding: 8px; text-align: left; vertical-align: top;';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (line.startsWith('|') && line.endsWith('|')) {
                if (!isInsideTable) {
                    htmlBuffer += `<table style="${tableStyle}"><tbody>`;
                    isInsideTable = true;
                }
                const contentInner = line.substring(1, line.length - 1);
                const cells = contentInner.split('|');
                htmlBuffer += '<tr>';
                cells.forEach(cell => {
                    htmlBuffer += `<td style="${tdStyle}">${this.formatInline(cell.trim())}</td>`;
                });
                htmlBuffer += '</tr>';
            } else {
                if (isInsideTable) {
                    htmlBuffer += '</tbody></table>';
                    isInsideTable = false;
                }
                if (line === '') continue;

                if (line.startsWith('# ') || (line === line.toUpperCase() && line.length > 5 && !line.includes(':'))) {
                    const titleText = line.replace(/^#\s+/, '');
                    htmlBuffer += `<h3 style="color: #6e56cf; margin-top: 20px; border-bottom: 1px solid #ccc;">${this.formatInline(titleText)}</h3>`;
                } else {
                    htmlBuffer += `<p style="margin-bottom: 8px; line-height: 1.5;">${this.formatInline(line)}</p>`;
                }
            }
        }
        if (isInsideTable) htmlBuffer += '</tbody></table>';
        return htmlBuffer;
    },

    // Función auxiliar para formatear negritas dentro de las líneas
    formatInline(text) {
        if (!text) return '';
        // Convierte **texto** en <b>texto</b>
        return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }
};

// ==========================================
// EVENTOS Y NAVEGACIÓN
// ==========================================
const Nav = {
    to(id) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(id);

        if (targetSection) {
            targetSection.style.opacity = '0';
            targetSection.classList.add('active');
            // Micro-animation for fluidity
            setTimeout(() => {
                targetSection.style.transition = 'opacity 0.2s ease';
                targetSection.style.opacity = '1';
            }, 50);
        }

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-target="${id}"]`);
        if (activeNav) activeNav.classList.add('active');

        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('active');
            document.querySelector('.sidebar-overlay').classList.remove('active');
        }
    }
};

// ==========================================
// WIZARD LOGIC
// ==========================================
const Wizard = {
    currentStep: 1,
    next(step) {
        // Simple validation
        if (step === 1) {
            if (!document.getElementById('genName').value || !document.getElementById('genSubject').value || !document.getElementById('genGrade').value || !document.getElementById('genOA').value) {
                UI.showToast('Por favor completa todos los campos', 'error');
                return;
            }
        }
        if (step === 2) {
            if (!document.getElementById('genObjClass').value) {
                UI.showToast('Define el objetivo de la clase', 'error');
                return;
            }
            this.updateSummary();
        }

        this.showStep(step + 1);
    },
    prev(step) {
        this.showStep(step - 1);
    },
    showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');

        // Update Indicators
        document.querySelectorAll('.step-indicator').forEach((ind, idx) => {
            if (idx + 1 <= step) ind.classList.add('active');
            else ind.classList.remove('active');
        });

        this.currentStep = step;
    },
    updateSummary() {
        const s = document.getElementById('genSubject').value;
        const g = document.getElementById('genGrade').value;
        const oa = document.getElementById('genOA').value;
        const obj = document.getElementById('genObjClass').value;
        document.getElementById('summaryContent').innerHTML = `
            <strong>Asignatura:</strong> ${s} (${g})<br>
            <strong>OA:</strong> ${oa}<br>
            <strong>Objetivo:</strong> ${obj}<br>
            <div style="margin-top:10px; font-size:0.85rem; color:var(--primary);">Listo para generar...</div>
        `;
    }
};

const Auth = {
    async logout() {
        if (confirm("¿Salir?")) {
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        }
    }
};

// ==========================================
// MANEJO DE FORMULARIO
// ==========================================
const form = document.getElementById('classForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        UI.setLoading('btnGenerate', true);

        const payload = {
            nombre_profesor: document.getElementById('genName').value,
            email: document.getElementById('genEmail').value,
            asignatura: document.getElementById('genSubject').value,
            curso: document.getElementById('genGrade').value,
            oa: document.getElementById('genOA').value,
            objetivo_clase: document.getElementById('genObjClass').value,
            nee: document.getElementById('genNEE').value,
            duracion: document.getElementById('genDuration').value,
            user_id: State.currentUser.id,
            fecha_solicitud: new Date().toISOString()
        };

        try {
            // Llamada a Edge Function
            const { data, error } = await supabase.functions.invoke('generate-class', {
                body: payload
            });

            if (error) throw error;

            UI.showToast('¡Clase generándose! Te llegará al correo.');
            document.getElementById('classForm').reset();
            Nav.to('history');

            // Actualización Optimista
            State.classes.unshift({ ...payload, id: 'temp-' + Date.now(), created_at: new Date().toISOString() });
            Data.renderTables();
            Data.updateStats();

        } catch (err) {
            console.error(err);

            let msg = "Hubo un problema al solicitar la clase.";

            if (err.message && err.message.includes("400")) {
                msg = "Error de validación o usuario no autorizado.";
            } else if (err.message && err.message.includes("500")) {
                msg = "El servidor de IA está saturado, intenta en unos segundos.";
            }

            UI.showToast(msg, 'error');
        } finally {
            UI.setLoading('btnGenerate', false, '🪄 Generar Magia');
        }
    });
}

// Arrancar
window.addEventListener('DOMContentLoaded', () => {
    UI.initTheme();
    Data.init();
});