// ==================== إدارة التخزين المحلي والإعدادات والنسخ الاحتياطي (Storage Manager) ====================
        // ==================== الإعدادات والذاكرة المحلية ====================
        let appSettings = {
            theme: localStorage.getItem('arb_theme') || 'light',
            currency: localStorage.getItem('arb_currency') || '$',
            defaultCapital: localStorage.getItem('arb_def_capital') || '1000',
            precision: parseInt(localStorage.getItem('arb_precision') || '2', 10)
        };

        let historyTab1 = JSON.parse(localStorage.getItem('arb_history_t1') || '[]');
        let historyTab2 = JSON.parse(localStorage.getItem('arb_history_t2') || '[]');
        let savedSlips = JSON.parse(localStorage.getItem('arb_saved_slips') || '[]');

        let currentTab2Mode = 'stake1';
        let currentSlipFilter = 'all';
        let currentHistoryFilter = 'all';
        let expandedSlipIds = new Set();
        let timerT1 = null;
        let timerT2 = null;

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
            htmlEl.setAttribute('data-theme', appSettings.theme);
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

            list.sort((a, b) => b.id - a.id);

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
                                <span style="font-size: 0.72rem; color: var(--text-muted); direction: ltr;">${item.time || ''}</span>
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

        window.applyHistoryItemToCalc = (source, id) => {
            if (source === 't1') {
                const item = historyTab1.find(h => h.id === id);
                if (item) {
                    capitalInput.value = item.capital;
                    ratio1Input.value = item.ratio1;
                    ratio2Input.value = item.ratio2;
                    updateTab1();
                    switchTab('tabCalc');
                    switchCalcPane('paneArbitrage');
                    showToast('تم تحميل بيانات العملية في حاسبة التغطية الآنية');
                }
            } else if (source === 't2') {
                const item = historyTab2.find(h => h.id === id);
                if (item) {
                    t2AmountInput.value = item.stake1;
                    t2Odds1Input.value = item.odds1;
                    t2TargetPctInput.value = item.pct;
                    syncPctChips(item.pct);
                    updateTab2();
                    switchTab('tabCalc');
                    switchCalcPane('paneDelayed');
                    showToast('تم تحميل بيانات العملية في حاسبة التغطية المتأخرة');
                }
            }
        };

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
        if (menuOpenSet) menuOpenSet.addEventListener('click', () => settingsModal.classList.add('open'));

        const menuOpenHlp = document.getElementById('menuOpenHelpItem');
        if (menuOpenHlp) menuOpenHlp.addEventListener('click', () => {
            helpGuideModal.classList.add('open');
            loadAndRenderGuide();
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
        document.getElementById('openSettingsBtn').addEventListener('click', () => settingsModal.classList.add('open'));
        document.getElementById('closeSettingsBtn').addEventListener('click', () => settingsModal.classList.remove('open'));
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove('open');
        });

        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            historyTab1 = [];
            historyTab2 = [];
            localStorage.removeItem('arb_history_t1');
            localStorage.removeItem('arb_history_t2');
            renderHistoryTab1();
            renderHistoryTab2();
            renderFullHistory();
            settingsModal.classList.remove('open');
            showToast('تم مسح السجلات السريعة');
        });

        document.getElementById('clearSlipsBtn').addEventListener('click', () => {
            if (!confirm('هل أنت متأكد من حذف جميع القسائم والصفقات؟')) return;
            savedSlips = [];
            expandedSlipIds.clear();
            localStorage.removeItem('arb_saved_slips');
            renderSlips();
            settingsModal.classList.remove('open');
            showToast('تم مسح جميع القسائم المحفوظة');
        });

        // التهيئة الأولية
        applySettings();
        capitalInput.value = appSettings.defaultCapital;
        renderHistoryTab1();
        renderHistoryTab2();
        updateTab2();
        renderSlips();
        renderFullHistory();
        updateMenuStats();
        updateInstallUI();
    


window.showToast = showToast;
window.applyHistoryItemToCalc = applyHistoryItemToCalc;
window.renderHistory = renderHistory;
