// ==================== إدارة التخزين المحلي والإعدادات والنسخ الاحتياطي (Storage Manager) ====================
        // ==================== نظام تتبع النوافذ والتنقل بالرجوع للخلف (Mobile Popstate & Modal Manager) ====================
        window.modalHistoryStack = window.modalHistoryStack || [];
        window._isProgrammaticBack = false;

        window.pushModalHistory = (modalId, closeFn) => {
            const stack = window.modalHistoryStack;
            const top = stack[stack.length - 1];
            if (top && top.modalId === modalId) return;

            stack.push({ modalId, close: closeFn });
            try {
                window.history.pushState({ isModal: true, modalId }, '');
            } catch (_) {}
        };

        window.popModalHistory = (modalId) => {
            if (window._isProgrammaticBack) return;
            const stack = window.modalHistoryStack;
            if (!stack || stack.length === 0) return;

            const idx = stack.findLastIndex
                ? stack.findLastIndex(m => m.modalId === modalId)
                : stack.map(m => m.modalId).lastIndexOf(modalId);

            if (idx !== -1) {
                stack.splice(idx, 1);
                window._isProgrammaticBack = true;
                try {
                    window.history.back();
                } catch (_) {}
                setTimeout(() => {
                    window._isProgrammaticBack = false;
                }, 120);
            }
        };

        // ==================== الإعدادات والذاكرة المحلية ====================
        var appSettings = {
            theme: localStorage.getItem('arb_theme') || 'light',
            currency: localStorage.getItem('arb_currency') || '$',
            defaultCapital: localStorage.getItem('arb_def_capital') || '1000',
            precision: parseInt(localStorage.getItem('arb_precision') || '2', 10)
        };

        var historyTab1 = JSON.parse(localStorage.getItem('arb_history_t1') || '[]');
        var historyTab2 = JSON.parse(localStorage.getItem('arb_history_t2') || '[]');
        var savedSlips = JSON.parse(localStorage.getItem('arb_saved_slips') || '[]');

        // تعقيم وتدقيق السجلات التاريخية لضمان وجود المعرفات والتواريخ
        historyTab1 = historyTab1.map((item, index) => {
            if (!item.id) item.id = Date.now() - (index * 1000);
            if (!item.time && item.date) item.time = item.date;
            if (!item.date && item.time) item.date = item.time;
            if (!item.capital && item.totalStake) item.capital = item.totalStake;
            if (!item.ratio1 && item.odds1) item.ratio1 = item.odds1;
            if (!item.ratio2 && item.odds2) item.ratio2 = item.odds2;
            return item;
        });
        historyTab2 = historyTab2.map((item, index) => {
            if (!item.id) item.id = Date.now() - (index * 1000);
            if (!item.time && item.date) item.time = item.date;
            if (!item.date && item.time) item.date = item.time;
            return item;
        });

        var currentTab2Mode = 'stake1';
        var currentSlipFilter = 'all';
        var currentHistoryFilter = 'all';
        var expandedSlipIds = new Set();
        var timerT1 = null;
        var timerT2 = null;

        const cur = () => appSettings.currency;

        // دالة التدقيق والتصحيح التلقائي للقسائم المحفوظة
        const sanitizeAndAuditSlips = () => {
            let modified = false;
            savedSlips = savedSlips.map(slip => {
                const s1 = parseFloat(slip.stake1) || 0;
                const o1 = parseFloat(slip.odds1) || 0;
                const s2 = parseFloat(slip.stake2) || 0;
                const o2 = parseFloat(slip.odds2) || 0;

                if (typeof slip.hedgePlayed === 'undefined') {
                    slip.hedgePlayed = (slip.status === 'hedged' || (s2 > 0 && (slip.totalStake > s1 + 0.001 || slip.type === 'تغطية ثنائية')));
                    modified = true;
                }

                if (slip.status === 'won' || slip.status === 'lost') {
                    const realPnl = parseFloat(slip.realizedProfit) || 0;
                    if (realPnl < -0.0001 && slip.status === 'won') {
                        slip.status = 'lost';
                        modified = true;
                    } else if (realPnl > 0.0001 && slip.status === 'lost') {
                        slip.status = 'won';
                        modified = true;
                    }
                    const paid = parseFloat(slip.totalStake) || s1;
                    if (paid > 0) {
                        slip.pct = (realPnl / paid) * 100;
                    }
                } else if (slip.status === 'hedged') {
                    const total = s1 + s2;
                    const minRet = Math.min(s1 * o1, s2 * o2);
                    slip.totalStake = total;
                    slip.expectedProfit = minRet - total;
                    slip.pct = total > 0 ? (slip.expectedProfit / total) * 100 : 0;
                }
                return slip;
            });

            if (modified) {
                localStorage.setItem('arb_saved_slips', JSON.stringify(savedSlips));
            }
        };

        const getFormattedDateTime = () => {
            const now = new Date();
            return now.toLocaleDateString('ar-MA', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
                ' - ' + now.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });
        };

        const showToast = (msg) => {
            const toast = document.getElementById('toastMsg');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2400);
        };

        const applySettings = () => {
            document.documentElement.setAttribute('data-theme', appSettings.theme);
            const metaColor = appSettings.theme === 'dark' ? '#0c111a' : '#f4f6fa';
            const metaEl = document.getElementById('metaThemeColor');
            if (metaEl) metaEl.setAttribute('content', metaColor);

            // زر الهيدر السريع للثيم
            const themeQuickBtn = document.getElementById('themeQuickBtn');
            if (themeQuickBtn) {
                themeQuickBtn.innerHTML = appSettings.theme === 'dark'
                    ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>'
                    : '<i class="fa-solid fa-moon" style="color: #1055a4;"></i>';
                themeQuickBtn.title = appSettings.theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع المظلم';
            }

            // بطاقة الثيم في تبويب القائمة (tabMenu)
            const menuThemeIcon = document.getElementById('menuThemeIcon');
            const menuThemeDesc = document.getElementById('menuThemeDesc');
            if (menuThemeIcon) {
                menuThemeIcon.innerHTML = appSettings.theme === 'dark'
                    ? '<i class="fa-solid fa-moon" style="color: #60a5fa;"></i>'
                    : '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
            }
            if (menuThemeDesc) {
                menuThemeDesc.textContent = appSettings.theme === 'dark'
                    ? 'الوضع الداكن نشط (انقر للتبديل للفاتح)'
                    : 'الوضع الفاتح نشط (انقر للتبديل للداكن)';
            }

            const curEl = document.getElementById('currencySelect');
            if (curEl) curEl.value = appSettings.currency;
            const defCapEl = document.getElementById('defaultCapitalInput');
            if (defCapEl) defCapEl.value = appSettings.defaultCapital;
            const precEl = document.getElementById('precisionSelect');
            if (precEl) precEl.value = appSettings.precision.toString();
            const tzEl = document.getElementById('matchTimezoneSelect');
            if (tzEl) tzEl.value = localStorage.getItem('arb_match_timezone') || 'gmt';
        };


        // ==================== دوال ريندر السجل الشامل وقائمة التحكم ====================
        const renderFullHistory = () => {
            const container = document.getElementById('fullHistoryContainer');
            if (!container) return;

            let list = [];
            if (currentHistoryFilter === 'all' || currentHistoryFilter === 't1') {
                list = list.concat(historyTab1.map(item => ({ ...item, tabSource: 't1' })));
            }
            if (currentHistoryFilter === 'all' || currentHistoryFilter === 't2') {
                list = list.concat(historyTab2.map(item => ({ ...item, tabSource: 't2' })));
            }

            list.sort((a, b) => (b.id || 0) - (a.id || 0));

            if (list.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 32px 14px; color: var(--text-muted);">
                        <div style="font-size: 2.2rem; margin-bottom: 8px;">📜</div>
                        <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">لا توجد سجلات بعد</div>
                        <div style="font-size: 0.74rem;">بمجرد إجراء أي حسابات أو تجربة خطط ستُحفظ تلقائياً هنا</div>
                    </div>
                `;
                return;
            }

            const p = appSettings.precision;
            const c = cur();

            container.innerHTML = list.map(item => {
                const isT1 = item.tabSource === 't1';
                const isProfit = (item.netProfit || 0) >= 0;
                const profitColor = isProfit ? 'var(--green-accent)' : 'var(--danger-accent)';
                const profitPrefix = isProfit ? '+' : '';

                return `
                    <div class="history-item-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <span style="font-size: 0.72rem; font-weight: 900; padding: 3px 8px; border-radius: 6px; ${isT1 ? 'background: var(--blue-bg); color: var(--blue-accent);' : 'background: var(--amber-bg); color: var(--amber-accent);'}">
                                    ${isT1 ? '⚡ تغطية آنية' : '⏱️ تغطية متأخرة'}
                                </span>
                                <span style="font-size: 0.72rem; color: var(--text-muted); direction: ltr;">${item.time || item.date || ''}</span>
                            </div>
                            <div style="font-size: 0.92rem; font-weight: 900; color: ${profitColor}; direction: ltr;">
                                ${profitPrefix}${(item.netProfit || 0).toFixed(p)}${c} (${profitPrefix}${(item.pct || 0).toFixed(2)}%)
                            </div>
                        </div>

                        <div class="grid-2" style="font-size: 0.77rem; margin-bottom: 8px; background: var(--bg-input); padding: 8px 10px; border-radius: 10px; border: 1px solid var(--border-color);">
                            <div>
                                <div style="color: var(--text-muted); font-size: 0.7rem;">الرهان 1</div>
                                <div style="font-weight: 800; direction: ltr;">
                                    ${(item.stake1 || 0).toFixed(p)}${c} @ ${(item.ratio1 || item.odds1 || 0).toFixed(2)}
                                </div>
                            </div>
                            <div>
                                <div style="color: var(--text-muted); font-size: 0.7rem;">الرهان 2</div>
                                <div style="font-weight: 800; direction: ltr;">
                                    ${(item.stake2 || 0).toFixed(p)}${c} @ ${(item.ratio2 || item.odds2 || 0).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-size: 0.74rem; color: var(--text-muted);">
                                العائد المضمون: <b style="color: var(--text-main); direction: ltr;">${(item.payout || 0).toFixed(p)}${c}</b>
                            </div>
                            <button type="button" class="small-action-btn" onclick="applyHistoryItemToCalc('${item.tabSource}', ${item.id})" style="font-size: 0.72rem; padding: 4px 10px;">
                                تطبيق بالحاسبة ↩️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            const tab3El = document.getElementById('tab3');
            if (tab3El) {
                tab3El.classList.toggle('has-focused-slip', expandedSlipIds.size > 0);
            }

            updateMenuStats();
        };

        // النقر على خلفية تبويب القسائم خارج القسيمة المفتوحة يطويها ويعيد الشاشة لطبيعتها
        const tab3Panel = document.getElementById('tab3');
        if (tab3Panel) {
            tab3Panel.addEventListener('click', (e) => {
                if (expandedSlipIds.size > 0 && !e.target.closest('.slip-ticket')) {
                    expandedSlipIds.clear();
                    document.querySelectorAll('.slip-ticket.expanded').forEach(el => el.classList.remove('expanded'));
                    tab3Panel.classList.remove('has-focused-slip');
                }
            });
        }

        const applyHistoryItemToCalc = (source, id) => {
            if (source === 't1') {
                const item = historyTab1.find(h => h.id === id);
                if (item) {
                    const capEl = document.getElementById('capital');
                    const r1El = document.getElementById('ratio1');
                    const r2El = document.getElementById('ratio2');
                    if (capEl) capEl.value = item.capital || item.totalStake || '';
                    if (r1El) r1El.value = item.ratio1 || item.odds1 || '';
                    if (r2El) r2El.value = item.ratio2 || item.odds2 || '';
                    if (typeof updateTab1 === 'function') updateTab1();
                    if (typeof switchTab === 'function') switchTab('tabCalc');
                    if (typeof switchCalcPane === 'function') switchCalcPane('paneArbitrage');
                    showToast('تم تحميل بيانات العملية في حاسبة التغطية الآنية');
                }
            } else if (source === 't2') {
                const item = historyTab2.find(h => h.id === id);
                if (item) {
                    const mode = item.mode || 'stake1';
                    currentTab2Mode = mode;
                    document.querySelectorAll('.mode-btn').forEach(b => {
                        b.classList.toggle('active', b.dataset.mode === mode);
                    });
                    const labelEl = document.getElementById('stakeInputLabel');
                    const titleEl = document.getElementById('tab2ModeTitle');
                    if (labelEl && titleEl) {
                        if (mode === 'stake1') {
                            labelEl.textContent = 'مبلغ الرهان 1';
                            titleEl.textContent = 'بيانات الدخول الأول (الرهان 1 الأساسي)';
                        } else {
                            labelEl.textContent = 'رأس المال الكلي';
                            titleEl.textContent = 'توزيع ميزانية كلية محددة على الرهانين معاً';
                        }
                    }
                    const amtEl = document.getElementById('t2AmountInput');
                    const o1El = document.getElementById('t2Odds1Input');
                    const pctEl = document.getElementById('t2TargetPctInput');
                    if (amtEl) amtEl.value = (mode === 'total' && item.totalStake ? item.totalStake : item.stake1) || '';
                    if (o1El) o1El.value = item.odds1 || '';
                    if (pctEl) pctEl.value = (typeof item.pct !== 'undefined' ? item.pct : 10);
                    if (typeof syncPctChips === 'function') syncPctChips(item.pct ?? 10);
                    if (typeof updateTab2 === 'function') updateTab2();
                    if (typeof switchTab === 'function') switchTab('tabCalc');
                    if (typeof switchCalcPane === 'function') switchCalcPane('paneDelayed');
                    showToast('تم تحميل بيانات العملية في حاسبة التغطية المتأخرة');
                }
            }
        };
        window.applyHistoryItemToCalc = applyHistoryItemToCalc;

        const updateMenuStats = () => {
            const p = appSettings.precision;
            const c = cur();
            let realizedPnl = 0;
            let wonCount = 0;
            let lostCount = 0;
            let activeCount = 0;
            let totalInvestedClosed = 0;

            savedSlips.forEach(s => {
                if (s.status === 'won' || s.status === 'lost') {
                    realizedPnl += (s.realizedProfit || 0);
                    totalInvestedClosed += (s.totalStake || 0);
                    if (s.status === 'won') wonCount++;
                    if (s.status === 'lost') lostCount++;
                } else if (s.status === 'pending' || s.status === 'hedged') {
                    activeCount++;
                }
            });

            const totalClosed = wonCount + lostCount;
            const winRate = totalClosed > 0 ? ((wonCount / totalClosed) * 100).toFixed(0) : '0';
            const roi = totalInvestedClosed > 0 ? ((realizedPnl / totalInvestedClosed) * 100).toFixed(1) : '0';

            const pnlEl = document.getElementById('menuStatPnl');
            const roiEl = document.getElementById('menuStatRoi');
            const actEl = document.getElementById('menuStatActive');

            if (pnlEl) {
                const prefix = realizedPnl >= 0 ? '+' : '';
                pnlEl.textContent = `${prefix}${realizedPnl.toFixed(p)}${c}`;
                pnlEl.style.color = realizedPnl >= 0 ? 'var(--green-accent)' : 'var(--danger-accent)';
            }
            if (roiEl) {
                roiEl.textContent = `${roi}% | ${winRate}%`;
            }
            if (actEl) {
                actEl.textContent = activeCount.toString();
            }
        };


        // ==================== التحكم في الإعدادات والنسخ الاحتياطي ====================
        const setTheme = (t) => {
            appSettings.theme = t;
            localStorage.setItem('arb_theme', t);
            applySettings();
        };

        const toggleTheme = () => {
            const nextTheme = appSettings.theme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            showToast(nextTheme === 'dark' ? '🌙 تم تفعيل الوضع الداكن' : '☀️ تم تفعيل الوضع الفاتح');
        };

        const quickThemeBtn = document.getElementById('themeQuickBtn');
        if (quickThemeBtn) quickThemeBtn.addEventListener('click', toggleTheme);

        const menuThemeCard = document.getElementById('menuThemeToggleBtn');
        if (menuThemeCard) menuThemeCard.addEventListener('click', toggleTheme);

        // تفاعلات تبويب القائمة (tabMenu)
        const menuGoSlips = document.getElementById('menuGoToSlipsBtn');
        if (menuGoSlips) menuGoSlips.addEventListener('click', () => switchTab('tab3'));

        const menuOpenSet = document.getElementById('menuOpenSettingsItem');
        if (menuOpenSet) menuOpenSet.addEventListener('click', openSettingsModal);

        const menuOpenHlp = document.getElementById('menuOpenHelpItem');
        if (menuOpenHlp) menuOpenHlp.addEventListener('click', () => {
            if (typeof window.openHelpGuideModal === 'function') {
                window.openHelpGuideModal();
            } else {
                const modal = document.getElementById('helpGuideModal');
                if (modal) modal.classList.add('open');
                if (typeof loadAndRenderGuide === 'function') loadAndRenderGuide();
            }
        });

        const menuExp = document.getElementById('menuExportItem');
        if (menuExp) menuExp.addEventListener('click', () => document.getElementById('exportDataBtn').click());

        const menuImp = document.getElementById('menuImportItem');
        if (menuImp) menuImp.addEventListener('click', () => document.getElementById('importDataBtn').click());

        const menuInst = document.getElementById('menuInstallItem');
        if (menuInst) menuInst.addEventListener('click', () => triggerAppInstall());

        const menuClrHist = document.getElementById('menuClearHistoryBtn');
        if (menuClrHist) menuClrHist.addEventListener('click', () => document.getElementById('clearHistoryBtn').click());

        const menuClrSlips = document.getElementById('menuClearSlipsBtn');
        if (menuClrSlips) menuClrSlips.addEventListener('click', () => document.getElementById('clearSlipsBtn').click());

        // فلترة وعمليات السجل الشامل (tab4)
        document.querySelectorAll('.history-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.history-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentHistoryFilter = btn.dataset.hfilter;
                renderFullHistory();
            });
        });

        const clearHistoryTab4 = document.getElementById('clearAllHistoryTab4Btn');
        if (clearHistoryTab4) {
            clearHistoryTab4.addEventListener('click', () => {
                if (!confirm('هل تريد مسح جميع سجلات العمليات؟')) return;
                historyTab1 = [];
                historyTab2 = [];
                localStorage.removeItem('arb_history_t1');
                localStorage.removeItem('arb_history_t2');
                renderHistoryTab1();
                renderHistoryTab2();
                renderFullHistory();
                showToast('تم مسح جميع السجلات بنجاح');
            });
        }

        document.getElementById('currencySelect').addEventListener('change', (e) => {
            appSettings.currency = e.target.value;
            localStorage.setItem('arb_currency', appSettings.currency);
            updateTab1();
            updateTab2();
            renderSlips();
        });

        document.getElementById('defaultCapitalInput').addEventListener('change', (e) => {
            appSettings.defaultCapital = e.target.value || '1000';
            localStorage.setItem('arb_def_capital', appSettings.defaultCapital);
            capitalInput.value = appSettings.defaultCapital;
            updateTab1();
        });

        document.getElementById('precisionSelect').addEventListener('change', (e) => {
            appSettings.precision = parseInt(e.target.value, 10);
            localStorage.setItem('arb_precision', appSettings.precision);
            updateTab1();
            updateTab2();
            renderSlips();
        });

        const matchTzEl = document.getElementById('matchTimezoneSelect');
        if (matchTzEl) {
            matchTzEl.addEventListener('change', (e) => {
                localStorage.setItem('arb_match_timezone', e.target.value);
                if (typeof window.renderMatchesList === 'function' && window.loadedMatchesEvents) {
                    window.renderMatchesList(window.loadedMatchesEvents);
                }
                if (typeof showToast === 'function') {
                    showToast('✓ تم تحديث توقيت عرض المباريات');
                }
            });
        }

        document.getElementById('exportDataBtn').addEventListener('click', () => {
            const backup = {
                slips: savedSlips,
                history1: historyTab1,
                history2: historyTab2,
                settings: appSettings
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `slips-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            showToast('📤 تم تحميل النسخة الاحتياطية');
        });

        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        document.getElementById('importFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (Array.isArray(data.slips)) {
                        savedSlips = data.slips;
                        localStorage.setItem('arb_saved_slips', JSON.stringify(savedSlips));
                    }
                    if (Array.isArray(data.history1)) {
                        historyTab1 = data.history1;
                        localStorage.setItem('arb_history_t1', JSON.stringify(historyTab1));
                    }
                    if (Array.isArray(data.history2)) {
                        historyTab2 = data.history2;
                        localStorage.setItem('arb_history_t2', JSON.stringify(historyTab2));
                    }
                    renderSlips();
                    renderHistoryTab1();
                    renderHistoryTab2();
                    renderFullHistory();
                    showToast('✅ تمت استعادة البيانات بنجاح!');
                } catch {
                    showToast('❌ ملف غير صالح!');
                }
            };
            reader.readAsText(file);
        });

        const settingsModal = document.getElementById('settingsModal');
        function openSettingsModal() {
            if (!settingsModal) return;
            settingsModal.classList.add('open');
            if (typeof window.pushModalHistory === 'function') {
                window.pushModalHistory('settingsModal', () => closeSettingsModal(true));
            }
        }
        function closeSettingsModal(fromPopState = false) {
            if (!settingsModal) return;
            settingsModal.classList.remove('open');
            if (!fromPopState && typeof window.popModalHistory === 'function') {
                window.popModalHistory('settingsModal');
            }
        }
        window.openSettingsModal = openSettingsModal;
        window.closeSettingsModal = closeSettingsModal;

        document.getElementById('openSettingsBtn').addEventListener('click', openSettingsModal);
        document.getElementById('closeSettingsBtn').addEventListener('click', () => closeSettingsModal(false));
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModal(false);
        });

        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            historyTab1 = [];
            historyTab2 = [];
            localStorage.removeItem('arb_history_t1');
            localStorage.removeItem('arb_history_t2');
            renderHistoryTab1();
            renderHistoryTab2();
            renderFullHistory();
            closeSettingsModal(false);
            showToast('تم مسح السجلات السريعة');
        });

        document.getElementById('clearSlipsBtn').addEventListener('click', () => {
            if (!confirm('هل أنت متأكد من حذف جميع القسائم والصفقات؟')) return;
            savedSlips = [];
            expandedSlipIds.clear();
            localStorage.removeItem('arb_saved_slips');
            renderSlips();
            closeSettingsModal(false);
            showToast('تم مسح جميع القسائم المحفوظة');
        });

        // تطبيق الإعدادات الفورية
        applySettings();
        renderFullHistory();
        updateMenuStats();

window.showToast = showToast;
window.applyHistoryItemToCalc = applyHistoryItemToCalc;
window.renderFullHistory = renderFullHistory;
window.applySettings = applySettings;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.updateMenuStats = updateMenuStats;
window.appSettings = appSettings;
window.savedSlips = savedSlips;
window.historyTab1 = historyTab1;
window.historyTab2 = historyTab2;
