// ==================== نظام إدارة القسائم ومحفظة الصفقات (Slips Manager) ====================
        // ==================== منطق التبويب الثالث: نظام القسائم المُدقق بالكامل ====================
        const createSlip = (calcData, customName, initialStatus) => {
            if (!calcData || !calcData.stake1 || !calcData.odds1) {
                showToast('أدخل بيانات الرهان الأول أولاً لإنشاء القسيمة!');
                return;
            }
            const newId = Date.now();
            const isHedgedNow = initialStatus === 'hedged';

            const newSlip = {
                id: newId,
                title: customName.trim() || (calcData.type === 'تغطية متأخرة' ? 'صفقة مباشر (بانتظار التغطية)' : 'صفقة تغطية ثنائية'),
                type: calcData.type,
                createdAt: getFormattedDateTime(),
                settledAt: null,
                status: initialStatus,
                hedgePlayed: isHedgedNow,
                stake1: calcData.stake1,
                odds1: calcData.odds1,
                stake2: calcData.stake2 || 0,
                odds2: calcData.odds2 || 0,
                totalStake: isHedgedNow ? calcData.totalStake : calcData.stake1,
                plannedTotalStake: calcData.totalStake || calcData.stake1,
                payout: calcData.payout || (calcData.stake1 * calcData.odds1),
                expectedProfit: calcData.netProfit || 0,
                realizedProfit: 0,
                pct: calcData.pct || 0
            };

            savedSlips.unshift(newSlip);
            localStorage.setItem('arb_saved_slips', JSON.stringify(savedSlips));
            renderSlips();
            showToast('🎟️ تم إنشاء القسيمة! انقر عليها في قسم القسائم لإدارتها');
        };

        document.getElementById('saveTab1SlipBtn').addEventListener('click', () => {
            const nameInput = document.getElementById('tab1SlipName');
            createSlip(lastCalcTab1, nameInput.value, 'hedged');
            nameInput.value = '';
        });

        document.getElementById('saveTab2SlipBtn').addEventListener('click', () => {
            const nameInput = document.getElementById('tab2SlipName');
            const sourceCalc = lastSimCalcTab2 ? { type: 'تغطية متأخرة', ...lastSimCalcTab2 } : lastCalcTab2;
            createSlip(sourceCalc, nameInput.value, 'pending');
            nameInput.value = '';
        });

        window.toggleSlipExpand = (id) => {
            const wasOpen = expandedSlipIds.has(id);

            // طي أي قسيمة مفتوحة مسبقاً للتركيز على قسيمة واحدة فقط
            expandedSlipIds.forEach(prevId => {
                const prevEl = document.getElementById(`slip-card-${prevId}`);
                if (prevEl) prevEl.classList.remove('expanded');
            });
            expandedSlipIds.clear();

            if (!wasOpen) {
                expandedSlipIds.add(id);
                const cardEl = document.getElementById(`slip-card-${id}`);
                if (cardEl) {
                    cardEl.classList.add('expanded');
                    setTimeout(() => {
                        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 80);
                }
            }

            const tab3El = document.getElementById('tab3');
            if (tab3El) {
                tab3El.classList.toggle('has-focused-slip', expandedSlipIds.size > 0);
            }
        };

        window.onSlipLiveOddsInput = (id, mode) => {
            const p = appSettings.precision;
            const slip = savedSlips.find(s => s.id === id);
            if (!slip) return;

            const o2Input = document.getElementById(`slip-o2-${id}`);
            const s2Input = document.getElementById(`slip-s2-${id}`);
            const previewEl = document.getElementById(`slip-preview-${id}`);
            if (!o2Input || !s2Input || !previewEl) return;

            const o2Val = parseFloat(o2Input.value);
            if (isNaN(o2Val) || o2Val <= 1) {
                previewEl.innerHTML = `<span style="color:var(--text-muted);">أدخل احتمال الرهان الثاني (أكبر من 1.00) لحساب النتيجة</span>`;
                return;
            }

            let s2Val = parseFloat(s2Input.value);
            if (mode === 'odds' || isNaN(s2Val) || s2Val <= 0) {
                s2Val = (slip.stake1 * slip.odds1) / o2Val;
                s2Input.value = s2Val.toFixed(p);
            }

            const totalStake = slip.stake1 + s2Val;
            const returnIf1Wins = slip.stake1 * slip.odds1;
            const returnIf2Wins = s2Val * o2Val;
            const effectiveReturn = Math.abs(returnIf1Wins - returnIf2Wins) < 0.2 ? returnIf1Wins : Math.min(returnIf1Wins, returnIf2Wins);
            const netProfit = effectiveReturn - totalStake;
            const pct = (netProfit / totalStake) * 100;
            const sign = netProfit >= 0 ? '+' : '';
            const color = netProfit >= 0 ? 'var(--green-accent)' : 'var(--danger-accent)';
            const badgeText = netProfit >= 0 ? '✅ تغطية رابحة' : '❌ تغطية بخسارة';

            previewEl.innerHTML = `
                <span>${badgeText} عند O2=${o2Val.toFixed(2)}</span>
                <span style="color:${color}; direction:ltr;">${sign}${netProfit.toFixed(p)}${cur()} (${sign}${pct.toFixed(2)}%) | المجموع: ${totalStake.toFixed(p)}${cur()}</span>
            `;
        };

        window.applySlipLiveHedge = (id, actionMode) => {
            const p = appSettings.precision;
            const o2Input = document.getElementById(`slip-o2-${id}`);
            const s2Input = document.getElementById(`slip-s2-${id}`);
            const o2Val = parseFloat(o2Input ? o2Input.value : 0);
            const s2Val = parseFloat(s2Input ? s2Input.value : 0);

            if (isNaN(o2Val) || o2Val <= 1 || isNaN(s2Val) || s2Val <= 0) {
                showToast('⚠️ أدخل احتمال ومبلغ الرهان الثاني بشكل صحيح أولاً!');
                return;
            }

            savedSlips = savedSlips.map(slip => {
                if (slip.id !== id) return slip;
                slip.odds2 = o2Val;
                slip.stake2 = s2Val;
                slip.plannedTotalStake = slip.stake1 + s2Val;

                const ret1 = slip.stake1 * slip.odds1;
                const ret2 = s2Val * o2Val;
                slip.payout = Math.abs(ret1 - ret2) < 0.2 ? ret1 : Math.min(ret1, ret2);
                slip.expectedProfit = slip.payout - slip.plannedTotalStake;
                slip.pct = (slip.expectedProfit / slip.plannedTotalStake) * 100;

                if (actionMode === 'settle_now') {
                    slip.hedgePlayed = true;
                    slip.totalStake = slip.plannedTotalStake;
                    slip.realizedProfit = slip.expectedProfit;
                    slip.status = slip.realizedProfit >= 0 ? 'won' : 'lost';
                    slip.settledAt = getFormattedDateTime();
                    const sign = slip.realizedProfit >= 0 ? '+' : '';
                    const word = slip.realizedProfit >= 0 ? '✅ رابحة' : '❌ خاسرة';
                    showToast(`${word}: أُغلقت القسيمة بصافي ${sign}${slip.realizedProfit.toFixed(p)}${cur()}`);
                } else if (actionMode === 'hedge_active') {
                    slip.hedgePlayed = true;
                    slip.status = 'hedged';
                    slip.totalStake = slip.plannedTotalStake;
                    showToast(`🛡️ تم تأمين القسيمة بالرهان 2 (${s2Val.toFixed(p)}${cur()} × ${o2Val.toFixed(2)})!`);
                } else {
                    showToast('📊 تم تحديث حسابات التغطية المحتملة في القسيمة!');
                }
                return slip;
            });

            localStorage.setItem('arb_saved_slips', JSON.stringify(savedSlips));
            renderSlips();
        };

        window.updateSlipStatus = (id, action) => {
            const p = appSettings.precision;
            savedSlips = savedSlips.map(slip => {
                if (slip.id !== id) return slip;

                if (action === 'settle_hedged') {
                    const total = slip.stake1 + slip.stake2;
                    const ret1 = slip.stake1 * slip.odds1;
                    const ret2 = slip.stake2 * slip.odds2;
                    const finalReturn = Math.abs(ret1 - ret2) < 0.2 ? ret1 : Math.min(ret1, ret2);
                    const netPnl = finalReturn - total;

                    slip.hedgePlayed = true;
                    slip.totalStake = total;
                    slip.realizedProfit = netPnl;
                    slip.pct = total > 0 ? (netPnl / total) * 100 : 0;
                    slip.status = netPnl >= 0 ? 'won' : 'lost';
                    slip.settledAt = getFormattedDateTime();

                    if (netPnl >= 0) {
                        showToast(`✅ أُغلقت كقسيمة رابحة: +${netPnl.toFixed(p)}${cur()}`);
                    } else {
                        showToast(`❌ أُغلقت كقسيمة خاسرة: ${netPnl.toFixed(p)}${cur()}`);
                    }
                } else if (action === 'won_bet1_only') {
                    const netPnl = (slip.stake1 * slip.odds1) - slip.stake1;
                    slip.hedgePlayed = false;
                    slip.realizedProfit = netPnl;
                    slip.totalStake = slip.stake1;
                    slip.stake2 = 0;
                    slip.pct = (netPnl / slip.stake1) * 100;
                    slip.status = netPnl >= 0 ? 'won' : 'lost';
                    slip.settledAt = getFormattedDateTime();
                    showToast(`🎯 ربح الرهان 1 كاملاً: +${netPnl.toFixed(p)}${cur()}`);
                } else if (action === 'lost_early') {
                    slip.hedgePlayed = false;
                    slip.status = 'lost';
                    slip.realizedProfit = -slip.stake1;
                    slip.totalStake = slip.stake1;
                    slip.stake2 = 0;
                    slip.pct = -100;
                    slip.settledAt = getFormattedDateTime();
                    showToast(`❌ سُجلت خسارة الرهان الأول (-${slip.stake1.toFixed(p)}${cur()})`);
                } else if (action === 'custom_cashout') {
                    const invested = (slip.status === 'hedged' || slip.hedgePlayed) ? (slip.stake1 + slip.stake2) : slip.stake1;
                    const userReturn = prompt(`💵 المدفوع في القسيمة هو ${invested.toFixed(p)}${cur()}.\nأدخل إجمالي المبلغ الذي عاد إليك فعلياً (0 إذا خسرت بالكامل):`, invested.toFixed(p));
                    if (userReturn === null) return slip;
                    const retNum = parseFloat(userReturn);
                    if (isNaN(retNum) || retNum < 0) {
                        showToast('رقم غير صالح!');
                        return slip;
                    }
                    slip.totalStake = invested;
                    slip.realizedProfit = retNum - invested;
                    slip.pct = invested > 0 ? (slip.realizedProfit / invested) * 100 : 0;
                    slip.status = slip.realizedProfit >= 0 ? 'won' : 'lost';
                    slip.settledAt = getFormattedDateTime();
                    showToast(`💵 أُغلقت القسيمة بصافي: ${slip.realizedProfit >= 0 ? '+' : ''}${slip.realizedProfit.toFixed(p)}${cur()}`);
                } else if (action === 'reopen_slip') {
                    slip.status = slip.hedgePlayed && slip.stake2 > 0 ? 'hedged' : 'pending';
                    slip.realizedProfit = 0;
                    slip.settledAt = null;
                    showToast('🔄 تمت إعادة فتح القسيمة للتعديل');
                } else if (action === 'rename_slip') {
                    const newName = prompt('✏️ أدخل الاسم الجديد للقسيمة أو المباراة:', slip.title);
                    if (newName && newName.trim()) {
                        slip.title = newName.trim();
                        showToast('✏️ تم تحديث اسم القسيمة');
                    }
                }
                return slip;
            });

            localStorage.setItem('arb_saved_slips', JSON.stringify(savedSlips));
            renderSlips();
        };

        window.copyTextVal = (val) => {
            navigator.clipboard.writeText(val).then(() => showToast(`تم نسخ المبلغ: ${val}`));
        };

        window.deleteSlip = (id) => {
            savedSlips = savedSlips.filter(s => s.id !== id);
            expandedSlipIds.delete(id);
            localStorage.setItem('arb_saved_slips', JSON.stringify(savedSlips));
            renderSlips();
            showToast('🗑️ تم حذف القسيمة');
        };

        const renderSlips = () => {
            sanitizeAndAuditSlips();

            const p = appSettings.precision;
            const container = document.getElementById('slipsContainer');
            const searchQuery = (document.getElementById('searchSlipsInput').value || '').trim().toLowerCase();

            const cPending = savedSlips.filter(s => s.status === 'pending').length;
            const cHedged = savedSlips.filter(s => s.status === 'hedged').length;
            const cWon = savedSlips.filter(s => s.status === 'won').length;
            const cLost = savedSlips.filter(s => s.status === 'lost').length;
            const activeCount = cPending + cHedged;

            const elSlipsBadge = document.getElementById('slipsBadge');
            if (elSlipsBadge) elSlipsBadge.textContent = activeCount;
            const elBottomBadge = document.getElementById('bottomSlipsBadge');
            if (elBottomBadge) elBottomBadge.textContent = activeCount;
            const elPillBadge = document.getElementById('pillSlipsBadge');
            if (elPillBadge) elPillBadge.textContent = activeCount;

            const totalSlipsCountEl = document.getElementById('statTotalSlipsCount');
            if (totalSlipsCountEl) totalSlipsCountEl.textContent = `إجمالي: ${savedSlips.length} صفقات`;

            document.getElementById('statPendingCount').textContent = activeCount;
            document.getElementById('statWonCount').textContent = cWon;
            document.getElementById('statLostCount').textContent = cLost;

            document.getElementById('fCountAll').textContent = savedSlips.length;
            document.getElementById('fCountPending').textContent = cPending;
            document.getElementById('fCountHedged').textContent = cHedged;
            document.getElementById('fCountWon').textContent = cWon;
            document.getElementById('fCountLost').textContent = cLost;

            const activeInvested = savedSlips
                .filter(s => s.status === 'pending' || s.status === 'hedged')
                .reduce((acc, s) => acc + (s.status === 'pending' ? s.stake1 : (s.stake1 + s.stake2)), 0);

            const settledSlips = savedSlips.filter(s => s.status === 'won' || s.status === 'lost');
            const grossWin = settledSlips
                .filter(s => (s.realizedProfit || 0) > 0)
                .reduce((acc, s) => acc + s.realizedProfit, 0);
            const grossLoss = settledSlips
                .filter(s => (s.realizedProfit || 0) < 0)
                .reduce((acc, s) => acc + s.realizedProfit, 0);

            const realizedProfit = grossWin + grossLoss;
            const totalSettledStake = settledSlips.reduce((acc, s) => acc + (s.totalStake || s.stake1 || 0), 0);

            const hedgedSlips = savedSlips.filter(s => s.status === 'hedged');
            const lockedHedgedPnl = hedgedSlips.reduce((acc, s) => acc + (s.expectedProfit || 0), 0);

            const roiPct = totalSettledStake > 0 ? (realizedProfit / totalSettledStake) * 100 : 0;
            const winRate = settledSlips.length > 0 ? (cWon / settledSlips.length) * 100 : 0;

            document.getElementById('statActiveInvested').textContent = `${activeInvested.toFixed(p)}${cur()}`;
            const profEl = document.getElementById('statRealizedProfit');
            profEl.textContent = `${realizedProfit >= 0 ? '+' : ''}${realizedProfit.toFixed(p)}${cur()}`;
            profEl.style.color = realizedProfit >= 0 ? 'var(--green-accent)' : 'var(--danger-accent)';

            document.getElementById('statGrossWin').innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> أرباح: <b dir="ltr">+${grossWin.toFixed(p)}${cur()}</b>`;
            document.getElementById('statGrossLoss').innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> خسائر: <b dir="ltr">${grossLoss.toFixed(p)}${cur()}</b>`;

            const lockedEl = document.getElementById('statLockedHedgedPnl');
            if (hedgedSlips.length > 0) {
                lockedEl.style.display = 'inline-flex';
                lockedEl.innerHTML = `<i class="fa-solid fa-shield-halved"></i> صافي مؤمّن قيد الإغلاق (${hedgedSlips.length}): <b dir="ltr">${lockedHedgedPnl >= 0 ? '+' : ''}${lockedHedgedPnl.toFixed(p)}${cur()}</b>`;
            } else {
                lockedEl.style.display = 'none';
            }

            const roiEl = document.getElementById('statRoiVal');
            if (roiEl) roiEl.textContent = `${roiPct >= 0 ? '+' : ''}${roiPct.toFixed(1)}%`;
            const winEl = document.getElementById('statWinRateVal');
            if (winEl) winEl.textContent = `${winRate.toFixed(0)}%`;

            let filtered = currentSlipFilter === 'all' ? savedSlips : savedSlips.filter(s => s.status === currentSlipFilter);
            if (searchQuery) {
                filtered = filtered.filter(s => s.title.toLowerCase().includes(searchQuery) || s.type.toLowerCase().includes(searchQuery));
            }

            if (filtered.length === 0) {
                container.innerHTML = `<div class="card" style="text-align:center; padding:32px 15px; color:var(--text-muted);">
                    <div style="font-size:2rem; margin-bottom:6px;">🎟️</div>
                    <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px;">لا توجد قسائم مطابقة</div>
                    <div style="font-size:0.75rem;">اختر تصفية أخرى أو أضف قسيمة جديدة من التبويب الأول أو الثاني</div>
                </div>`;
                updateMenuStats();
                return;
            }

            const statusMeta = {
                pending: { text: '⏳ بانتظار التغطية', cls: 'tag-pending', dot: 'dot-pending' },
                hedged: { text: '🛡️ مؤمّنة (ربح مضمون)', cls: 'tag-hedged', dot: 'dot-hedged' },
                won: { text: '✅ رابحة ومحسومة', cls: 'tag-won', dot: 'dot-won' },
                lost: { text: '❌ خاسرة ومحسومة', cls: 'tag-lost', dot: 'dot-lost' }
            };

            container.innerHTML = filtered.map(slip => {
                const st = statusMeta[slip.status] || statusMeta.pending;
                const isSettled = slip.status === 'won' || slip.status === 'lost';
                const displayProfit = isSettled ? slip.realizedProfit : slip.expectedProfit;
                const profitColor = displayProfit >= 0 ? 'var(--green-accent)' : 'var(--danger-accent)';
                const isExpanded = expandedSlipIds.has(slip.id);

                const defaultO2 = slip.odds2 > 1 ? slip.odds2.toFixed(2) : '';
                const defaultS2 = slip.stake2 > 0 ? slip.stake2.toFixed(p) : '';
                const wasHedgePlayed = slip.hedgePlayed || slip.status === 'hedged' || (isSettled && slip.stake2 > 0 && slip.totalStake > slip.stake1 + 0.001);

                // السطر المضغوط في رأس القسيمة
                let compactSummary = '';
                if (slip.status === 'pending') {
                    compactSummary = `<span>رهان 1: <b>${slip.stake1.toFixed(p)}${cur()}</b> @ ${slip.odds1.toFixed(2)}</span>
                                      <span style="color:var(--amber-accent);">⇋ انتظر O2: <b>${slip.odds2 > 1 ? slip.odds2.toFixed(2) : 'مفتوح'}</b></span>`;
                } else if (slip.status === 'hedged') {
                    compactSummary = `<span>المجموع: <b>${(slip.stake1 + slip.stake2).toFixed(p)}${cur()}</b></span>
                                      <span style="color:var(--blue-accent);">O1: ${slip.odds1.toFixed(2)} ⇋ O2: ${slip.odds2.toFixed(2)}</span>`;
                } else {
                    compactSummary = `<span>المدفوع: <b>${(slip.totalStake || slip.stake1).toFixed(p)}${cur()}</b></span>
                                      <span style="color:var(--text-muted); font-size:0.72rem;">أُغلقت: ${slip.settledAt || slip.createdAt}</span>`;
                }

                // كارت الرهان الثاني في وضع التوسيع
                let leg2Header = '';
                let leg2Class = 'target-leg';
                if (wasHedgePlayed) {
                    leg2Header = `<div style="color:var(--green-accent); font-weight:800; margin-bottom:2px;"><i class="fa-solid fa-shield-halved"></i> الرهان 2 (تم الدخول والتأمين)</div>`;
                    leg2Class = 'played-leg';
                } else if (isSettled) {
                    leg2Header = `<div style="color:var(--text-muted); font-weight:800; margin-bottom:2px;">🚫 الرهان 2 (لم يُلعب)</div>`;
                } else {
                    leg2Header = `<div style="color:var(--amber-accent); font-weight:800; margin-bottom:2px;"><i class="fa-solid fa-hourglass-half"></i> الرهان 2 (المستهدف للتغطية)</div>`;
                }

                return `
                    <div class="slip-ticket status-${slip.status} ${isExpanded ? 'expanded' : ''}" id="slip-card-${slip.id}">
                        <!-- رأس القسيمة المضغوط -->
                        <div class="slip-compact-header" onclick="toggleSlipExpand(${slip.id})">
                            <div class="slip-row-1">
                                <div class="slip-title-wrap">
                                    <span class="status-dot ${st.dot}"></span>
                                    <span class="slip-title">${slip.title}</span>
                                    <span class="slip-active-badge"><i class="fa-solid fa-pen-ruler"></i> جارية للتعديل</span>
                                </div>
                                <span class="status-tag ${st.cls}">${st.text}</span>
                            </div>

                            <div class="slip-row-2">
                                <div class="compact-bet-pill">${compactSummary}</div>
                                <div class="compact-pnl-badge" style="color:${profitColor};">
                                    <span dir="ltr">${displayProfit >= 0 ? '+' : ''}${displayProfit.toFixed(p)}${cur()}</span>
                                    <span class="expand-chevron">▼</span>
                                </div>
                            </div>
                        </div>

                        <!-- تفاصيل وخيارات القسيمة المفتوحة -->
                        <div class="slip-expand-body">
                            <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); padding-top:8px;">
                                <span>النوع: ${slip.type} | تاريخ الإنشاء: ${slip.createdAt}</span>
                                ${slip.settledAt ? `<span>تاريخ الإغلاق: ${slip.settledAt}</span>` : ''}
                            </div>

                            <!-- 1. تفاصيل الرهانين الأول والثاني -->
                            <div class="slip-legs">
                                <div class="leg-box active-leg">
                                    <div style="color:var(--blue-accent); font-weight:800; margin-bottom:2px;">
                                        <i class="fa-solid fa-circle-check"></i> الرهان 1 (الأساسي)
                                    </div>
                                    <div style="font-weight:900; font-size:0.88rem; direction:ltr;">
                                        ${slip.stake1.toFixed(p)}${cur()} × ${slip.odds1.toFixed(2)}
                                    </div>
                                    <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
                                        عائد الرهان 1: ${(slip.stake1 * slip.odds1).toFixed(p)}${cur()}
                                    </div>
                                </div>

                                <div class="leg-box ${leg2Class}">
                                    ${leg2Header}
                                    <div style="font-weight:900; font-size:0.88rem; direction:ltr;">
                                        ${slip.stake2 > 0 ? `${slip.stake2.toFixed(p)}${cur()} × ${slip.odds2.toFixed(2)}` : 'لم يُلعب بعد'}
                                    </div>
                                    <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
                                        ${slip.stake2 > 0 
                                            ? `العائد: ${(slip.stake2 * slip.odds2).toFixed(p)}${cur()} | <span style="cursor:pointer; color:var(--accent-primary); font-weight:bold;" onclick="copyTextVal('${slip.stake2.toFixed(p)}')">📋 نسخ S2</span>` 
                                            : 'بانتظار إدخال احتمال O2 بالأسفل'}
                                    </div>
                                </div>
                            </div>

                            <!-- 2. محاكي وفاحص احتمال التغطية أثناء المباشر (يظهر لجميع القسائم النشطة) -->
                            ${!isSettled ? `
                                <div class="slip-live-calc">
                                    <div class="slip-live-title">
                                        <span><i class="fa-solid fa-bolt"></i> تحديث وفحص احتمال الرهان 2 (Live O2):</span>
                                        <span style="font-size:0.68rem; color:var(--text-muted);">حساب وتحديث فوري</span>
                                    </div>
                                    <div class="slip-live-grid">
                                        <div class="mini-input-group">
                                            <label>احتمال الرهان 2 (O2) الآن في المباراة</label>
                                            <input type="number" id="slip-o2-${slip.id}" value="${defaultO2}" placeholder="مثلاً 2.10" step="0.05" inputmode="decimal"
                                                oninput="onSlipLiveOddsInput(${slip.id}, 'odds')">
                                        </div>
                                        <div class="mini-input-group">
                                            <label>المبلغ المطلوب للدخول (S2)</label>
                                            <input type="number" id="slip-s2-${slip.id}" value="${defaultS2}" placeholder="يحسب تلقائياً" step="any" inputmode="decimal"
                                                oninput="onSlipLiveOddsInput(${slip.id}, 'stake')">
                                        </div>
                                    </div>
                                    <div class="slip-live-preview" id="slip-preview-${slip.id}">
                                        <span>النتيجة المتوقعة بهذا الاحتمال:</span>
                                        <span style="color:${profitColor}; direction:ltr; font-weight:900;">
                                            ${displayProfit >= 0 ? '+' : ''}${displayProfit.toFixed(p)}${cur()} (${slip.pct.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:5px;">
                                        <button type="button" class="settle-btn btn-outline-blue" onclick="applySlipLiveHedge(${slip.id}, 'hedge_active')">
                                            <i class="fa-solid fa-shield-halved"></i> تأمين ودخول الرهان 2
                                        </button>
                                        <button type="button" class="settle-btn btn-primary-win" onclick="applySlipLiveHedge(${slip.id}, 'settle_now')">
                                            <i class="fa-solid fa-check-double"></i> اعتماد وإغلاق بربح فوراً
                                        </button>
                                    </div>
                                    <div style="font-size:0.67rem; color:var(--text-muted); margin-top:5px; text-align:center;">
                                        💡 زر "تأمين ودخول الرهان 2" يحفظ الأرقام ويبقي المباراة جارية، وزر "اعتماد وإغلاق" يرحّل الربح ويغلقها فوراً
                                    </div>
                                </div>
                            ` : ''}

                            <!-- 3. صندوق سيناريوهات إنهاء وإغلاق القسيمة الشامل (يظهر لجميع القسائم النشطة) -->
                            ${!isSettled ? `
                                <div class="slip-settle-card ${slip.status === 'hedged' ? 'card-hedged' : 'card-pending'}">
                                    <div class="settle-card-title">
                                        <span><i class="fa-solid fa-flag-checkered"></i> خيارات إنهاء وإغلاق القسيمة:</span>
                                        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:800;">
                                            ${slip.status === 'hedged' ? '🛡️ مؤمّنة بالرهانين' : '⏳ بانتظار التغطية'}
                                        </span>
                                    </div>

                                    <!-- خيار 1: إنهاء المباراة واعتماد الربح المضمون بالرهانين -->
                                    <div class="settle-option-item">
                                        <button type="button" class="settle-btn ${slip.expectedProfit >= 0 ? 'btn-primary-win' : 'btn-outline-red'}" onclick="updateSlipStatus(${slip.id}, 'settle_hedged')">
                                            <i class="fa-solid fa-trophy"></i> إنهاء المباراة واعتماد الربح المضمون (${slip.expectedProfit >= 0 ? '+' : ''}${slip.expectedProfit.toFixed(p)}${cur()})
                                        </button>
                                        <div class="settle-btn-desc">
                                            انتهت المباراة! اضغط هنا لترحيل صافي ربح الرهانين المضمون إلى محفظتك وإغلاق القسيمة.
                                        </div>
                                    </div>

                                    <!-- خيار 2: فوز الرهان 1 فقط (دون تغطية) -->
                                    <div class="settle-option-item" style="margin-top:8px;">
                                        <button type="button" class="settle-btn btn-outline-green" onclick="updateSlipStatus(${slip.id}, 'won_bet1_only')">
                                            <i class="fa-solid fa-circle-check"></i> إغلاق القسيمة على فوز الرهان 1 فقط (+${((slip.stake1 * slip.odds1) - slip.stake1).toFixed(p)}${cur()})
                                        </button>
                                        <div class="settle-btn-desc">
                                            في حال انتهت المباراة بفوز رهانك الأول كاملاً دون الحاجة للرهان الثاني (احتساب عائد الرهان 1 كاملاً).
                                        </div>
                                    </div>

                                    <!-- خيار 3: خسارة الرهان 1 مبكراً -->
                                    <div class="settle-option-item" style="margin-top:8px;">
                                        <button type="button" class="settle-btn btn-outline-red" onclick="updateSlipStatus(${slip.id}, 'lost_early')">
                                            <i class="fa-solid fa-circle-xmark"></i> احتساب خسارة الرهان 1 فقط (-${slip.stake1.toFixed(p)}${cur()})
                                        </button>
                                        <div class="settle-btn-desc">
                                            في حال خسر الرهان الأول مبكراً قبل التمكن من التغطية (تسجيل خسارة مبلغ الرهان 1 فقط).
                                        </div>
                                    </div>

                                    <!-- خيار 4: تسوية كاش آوت يدوي -->
                                    <div class="settle-option-item" style="margin-top:8px; padding-top:6px; border-top:1px dashed var(--border-color);">
                                        <button type="button" class="settle-btn btn-outline-muted" onclick="updateSlipStatus(${slip.id}, 'custom_cashout')">
                                            <i class="fa-solid fa-money-bill-wave"></i> تسوية كاش آوت يدوي (Cashout)
                                        </button>
                                        <div class="settle-btn-desc">
                                            في حال قمت بعمل كاش آوت مبكر في تطبيق المراهنات واسترددت جزءاً من المال فعلياً.
                                        </div>
                                    </div>
                                </div>
                            ` : ''}

                            <!-- 4. في حال كانت القسيمة محسومة ومغلقة مسبقاً -->
                            ${isSettled ? `
                                <div class="settled-final-badge ${slip.status === 'won' ? 'final-won' : 'final-lost'}">
                                    <div>
                                        ${slip.status === 'won' 
                                            ? `🏆 تم إغلاق القسيمة بنجاح كرابحة: صافي الربح المحقق +${slip.realizedProfit.toFixed(p)}${cur()} (${slip.pct.toFixed(1)}%)` 
                                            : `❌ تم إغلاق القسيمة كخاسرة: صافي الخسارة ${slip.realizedProfit.toFixed(p)}${cur()}`}
                                    </div>
                                    <div style="font-size:0.7rem; opacity:0.85; margin-top:3px;">
                                        تاريخ الحسم: ${slip.settledAt || slip.createdAt}
                                    </div>
                                </div>
                                <button type="button" class="settle-btn btn-outline-muted" onclick="updateSlipStatus(${slip.id}, 'reopen_slip')" style="margin-bottom:8px;">
                                    <i class="fa-solid fa-rotate-left"></i> إعادة فتح القسيمة للتعديل أو استئناف اللعب
                                </button>
                            ` : ''}

                            <!-- 4. شريط أدوات إدارة القسيمة (تعديل الاسم وحذف) -->
                            <div class="slip-footer-tools">
                                <button type="button" class="tool-link-btn" onclick="updateSlipStatus(${slip.id}, 'rename_slip')">
                                    <i class="fa-solid fa-pen-to-square"></i> تعديل الاسم
                                </button>
                                <button type="button" class="tool-link-btn btn-delete" onclick="deleteSlip(${slip.id})">
                                    <i class="fa-solid fa-trash-can"></i> حذف القسيمة
                                </button>
                            </div>

                            <!-- 5. زر طي وإغلاق القسيمة لتمييز نهاية حدودها بوضوح -->
                            <div class="slip-footer-collapse-bar">
                                <button type="button" class="slip-collapse-btn" onclick="toggleSlipExpand(${slip.id})">
                                    <i class="fa-solid fa-chevron-up"></i> إغلاق وطي تفاصيل القسيمة ✕
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            updateMenuStats();
        };

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSlipFilter = btn.dataset.filter;
                renderSlips();
            });
        });

        document.getElementById('searchSlipsInput').addEventListener('input', renderSlips);

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = document.getElementById(btn.dataset.copy).textContent;
                navigator.clipboard.writeText(val).then(() => showToast(`تم نسخ المبلغ: ${val}`));
            });
        });

        document.getElementById('historyToggle1').addEventListener('click', () => document.getElementById('historyContent1').classList.toggle('open'));
        document.getElementById('historyToggle2').addEventListener('click', () => document.getElementById('historyContent2').classList.toggle('open'));


window.toggleSlipExpand = toggleSlipExpand;
window.copyTextVal = copyTextVal;
window.applySlipLiveHedge = applySlipLiveHedge;
window.updateSlipStatus = updateSlipStatus;
window.deleteSlip = deleteSlip;
window.renderSlips = renderSlips;
window.addSlip = addSlip;
