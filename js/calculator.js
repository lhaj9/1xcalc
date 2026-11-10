// ==================== محرك الحسابات الرياضية والتغطية (Calculator Engine) ====================
        // ==================== منطق التبويب الأول: التغطية الثنائية ====================
        const capitalInput = document.getElementById('capital');
        const ratio1Input = document.getElementById('ratio1');
        const ratio2Input = document.getElementById('ratio2');
        var lastCalcTab1 = null;

        const updateTab1 = () => {
            clearTimeout(timerT1);
            const capital = parseFloat(capitalInput.value);
            const r1 = parseFloat(ratio1Input.value);
            const r2 = parseFloat(ratio2Input.value);
            const p = appSettings.precision;

            const banner = document.getElementById('percentageResult');
            const resBlue = document.getElementById('resultBlue');
            const resGreen = document.getElementById('resultGreen');
            const retBlue = document.getElementById('returnBlue');
            const retGreen = document.getElementById('returnGreen');

            if (isNaN(capital) || isNaN(r1) || isNaN(r2) || capital <= 0 || r1 <= 0 || r2 <= 0) {
                banner.textContent = 'أدخل النسب لبدء الحساب';
                banner.classList.remove('positive', 'negative');
                resBlue.textContent = '0.0';
                resGreen.textContent = '0.0';
                retBlue.textContent = 'العائد: 0.0';
                retGreen.textContent = 'العائد: 0.0';
                lastCalcTab1 = null;
                return;
            }

            const baseFactor = capital / (r1 + r2);
            const blueStake = baseFactor * r2;
            const greenStake = baseFactor * r1;
            const totalReturn = blueStake * r1;
            const netProfit = totalReturn - capital;
            const pct = (netProfit / capital) * 100;
            const statusText = pct >= 0 ? 'رابح' : 'خاسر';

            banner.textContent = `${pct.toFixed(2)}% (${netProfit >= 0 ? '+' : ''}${netProfit.toFixed(p)}${cur()}) - ${statusText}`;
            banner.classList.toggle('positive', pct >= 0);
            banner.classList.toggle('negative', pct < 0);

            resBlue.textContent = blueStake.toFixed(p);
            resGreen.textContent = greenStake.toFixed(p);
            retBlue.textContent = `العائد: ${totalReturn.toFixed(p)}${cur()}`;
            retGreen.textContent = `العائد: ${totalReturn.toFixed(p)}${cur()}`;

            const isLoss = pct < 0;
            [resBlue, resGreen, retBlue, retGreen].forEach(el => el.classList.toggle('strikethrough', isLoss));

            const nowDt = getFormattedDateTime();
            lastCalcTab1 = window.lastCalcTab1 = {
                id: Date.now(),
                type: 'تغطية ثنائية',
                capital: capital,
                stake1: blueStake,
                odds1: r1,
                ratio1: r1,
                stake2: greenStake,
                odds2: r2,
                ratio2: r2,
                totalStake: capital,
                payout: totalReturn,
                netProfit,
                pct,
                time: nowDt,
                date: nowDt
            };

            timerT1 = setTimeout(() => {
                const itemToSave = { ...lastCalcTab1, id: Date.now(), time: getFormattedDateTime(), date: getFormattedDateTime() };
                historyTab1.unshift(itemToSave);
                if (historyTab1.length > 25) historyTab1.pop();
                localStorage.setItem('arb_history_t1', JSON.stringify(historyTab1));
                renderHistoryTab1();
                if (typeof renderFullHistory === 'function') renderFullHistory();
            }, 900);
        };

        const renderHistoryTab1 = () => {
            const list = document.getElementById('historyList1');
            document.getElementById('historyCount1').textContent = historyTab1.length;
            list.innerHTML = historyTab1.map(item => `
                <div class="history-item">
                    <div style="display:flex; justify-content:space-between; font-weight:800; margin-bottom:4px;">
                        <span>المجموع: ${item.totalStake}${cur()}</span>
                        <span style="color:${item.pct < 0 ? 'var(--danger-accent)' : 'var(--green-accent)'}; direction:ltr;">
                            ${item.pct.toFixed(2)}% (${item.netProfit.toFixed(2)}${cur()})
                        </span>
                    </div>
                    <div style="display:flex; justify-content:space-between; color:var(--text-muted); font-size:0.74rem;">
                        <span>الأزرق (${item.odds1}): <b>${item.stake1.toFixed(1)}</b> | الأخضر (${item.odds2}): <b>${item.stake2.toFixed(1)}</b></span>
                        <span>${item.date}</span>
                    </div>
                </div>
            `).join('');
        };

        [capitalInput, ratio1Input, ratio2Input].forEach(el => el.addEventListener('input', updateTab1));
        document.getElementById('resetTab1Btn').addEventListener('click', () => {
            ratio1Input.value = '';
            ratio2Input.value = '';
            updateTab1();
        });

        // ==================== منطق التبويب الثاني: التغطية المتأخرة + المحاكي اليدوي ====================
        const t2AmountInput = document.getElementById('t2AmountInput');
        const t2Odds1Input = document.getElementById('t2Odds1Input');
        const t2TargetPctInput = document.getElementById('t2TargetPctInput');
        const t2CustomOdds2Input = document.getElementById('t2CustomOdds2Input');
        var lastCalcTab2 = null;
        var lastSimCalcTab2 = null;

        const computeDelayedHedge = (amountVal, odds1, targetPct, mode) => {
            const factor = 1 + (targetPct / 100);
            if (factor <= 0) return null;

            let stake1, stake2, totalStake, payout, odds2, netProfit;
            if (mode === 'stake1') {
                stake1 = amountVal;
                payout = stake1 * odds1;
                totalStake = payout / factor;
                stake2 = totalStake - stake1;
            } else {
                totalStake = amountVal;
                payout = totalStake * factor;
                stake1 = payout / odds1;
                stake2 = totalStake - stake1;
            }

            if (stake2 <= 0.001) return { impossible: true, stake1: mode === 'stake1' ? amountVal : 0, odds1 };
            odds2 = payout / stake2;
            netProfit = payout - totalStake;

            return { impossible: false, stake1, odds1, stake2, odds2, totalStake, payout, netProfit, pct: targetPct };
        };

        const computeByCustomOdds2 = (stake1, odds1, customOdds2) => {
            if (isNaN(stake1) || isNaN(odds1) || isNaN(customOdds2) || stake1 <= 0 || odds1 <= 1 || customOdds2 <= 1) {
                return null;
            }
            const payout = stake1 * odds1;
            const stake2 = payout / customOdds2;
            const totalStake = stake1 + stake2;
            const netProfit = payout - totalStake;
            const pct = (netProfit / totalStake) * 100;
            return { stake1, odds1, stake2, odds2: customOdds2, totalStake, payout, netProfit, pct };
        };

        const updateTab2Simulator = (activeStake1, odds1, targetRes) => {
            const p = appSettings.precision;
            const simBox = document.getElementById('t2SimResultsBox');
            const customO2 = parseFloat(t2CustomOdds2Input.value);

            if (isNaN(customO2) || customO2 <= 1 || isNaN(activeStake1) || activeStake1 <= 0 || isNaN(odds1) || odds1 <= 1) {
                simBox.classList.remove('active');
                lastSimCalcTab2 = null;
                return;
            }

            const sim = computeByCustomOdds2(activeStake1, odds1, customO2);
            if (!sim) {
                simBox.classList.remove('active');
                lastSimCalcTab2 = null;
                return;
            }

            lastSimCalcTab2 = window.lastSimCalcTab2 = sim;
            simBox.classList.add('active');

            const verdictEl = document.getElementById('simVerdictBanner');
            const sign = sim.netProfit >= 0 ? '+' : '';
            const statusWord = sim.netProfit >= 0 ? '✅ رابح حالياً' : '❌ خاسر حالياً';
            verdictEl.textContent = `${statusWord}: ${sign}${sim.netProfit.toFixed(p)}${cur()} (${sign}${sim.pct.toFixed(2)}%)`;
            verdictEl.className = 'sim-verdict ' + (sim.netProfit >= 0 ? 'win' : 'loss');

            document.getElementById('simReqStake2').textContent = sim.stake2.toFixed(p);
            document.getElementById('simTotalStake').textContent = `المجموع: ${sim.totalStake.toFixed(p)}${cur()}`;
            document.getElementById('simPayout').textContent = `العائد المضمون: ${sim.payout.toFixed(p)}${cur()}`;

            const compareEl = document.getElementById('simCompareWithTarget');
            if (targetRes && !targetRes.impossible) {
                const diffProfit = sim.netProfit - targetRes.netProfit;
                const diffOdds = customO2 - targetRes.odds2;
                if (Math.abs(diffOdds) < 0.01) {
                    compareEl.innerHTML = `🎯 هذا الاحتمال يطابق هدفك (${targetRes.pct}%) تماماً!`;
                } else if (diffProfit > 0) {
                    compareEl.innerHTML = `🔥 أفضل من هدفك (${targetRes.pct}%) بزيادة <span style="color:var(--green-accent); direction:ltr;">+${diffProfit.toFixed(p)}${cur()} (+${(sim.pct - targetRes.pct).toFixed(1)}%)</span>`;
                } else {
                    compareEl.innerHTML = `⏳ أقل من هدفك (${targetRes.pct}%) بفارق <span style="color:var(--amber-accent); direction:ltr;">${diffProfit.toFixed(p)}${cur()}</span> (ينقصك ارتفاع O2 بمقدار <b>${Math.abs(diffOdds).toFixed(2)}</b>)`;
                }
            } else {
                compareEl.textContent = `الرهان 1: ${sim.stake1.toFixed(p)}${cur()} × ${sim.odds1} | الرهان 2: ${sim.stake2.toFixed(p)}${cur()} × ${sim.odds2}`;
            }
        };

        const updateTab2 = () => {
            clearTimeout(timerT2);
            const amountVal = parseFloat(t2AmountInput.value);
            const odds1 = parseFloat(t2Odds1Input.value);
            const targetPct = parseFloat(t2TargetPctInput.value);
            const p = appSettings.precision;

            const banner = document.getElementById('t2StatusBanner');
            const reqOdds2El = document.getElementById('t2RequiredOdds2');
            const reqStake2El = document.getElementById('t2RequiredStake2');
            const firstBetSumEl = document.getElementById('t2FirstBetSummary');
            const guarReturnEl = document.getElementById('t2GuaranteedReturn');
            const tbody = document.getElementById('t2PlansTableBody');

            if (isNaN(amountVal) || isNaN(odds1) || isNaN(targetPct) || amountVal <= 0 || odds1 <= 1) {
                banner.textContent = 'أدخل مبلغاً صحيحاً واحتمالاً أكبر من 1.00';
                banner.classList.remove('positive', 'negative');
                reqOdds2El.textContent = '0.00';
                reqStake2El.textContent = '0.00';
                tbody.innerHTML = '';
                lastCalcTab2 = null;
                updateTab2Simulator(0, 0, null);
                return;
            }

            const res = computeDelayedHedge(amountVal, odds1, targetPct, currentTab2Mode);
            const activeStake1 = (res && !res.impossible) ? res.stake1 : amountVal;

            if (!res || res.impossible) {
                banner.textContent = `لا يمكن تحقيق ربح ${targetPct}% لأن الاحتمال الأول (${odds1}) منخفض!`;
                banner.classList.remove('positive');
                banner.classList.add('negative');
                reqOdds2El.textContent = 'غير متاح';
                reqStake2El.textContent = '0.00';
                lastCalcTab2 = window.lastCalcTab2 = {
                    type: 'تغطية متأخرة',
                    stake1: activeStake1,
                    odds1: odds1,
                    stake2: 0,
                    odds2: 0,
                    totalStake: activeStake1,
                    payout: activeStake1 * odds1,
                    netProfit: 0,
                    pct: 0
                };
            } else {
                const sign = res.netProfit >= 0 ? '+' : '';
                banner.textContent = `مجموع الرهانين: ${res.totalStake.toFixed(p)}${cur()} | الصافي: ${sign}${res.netProfit.toFixed(p)}${cur()} (${res.pct.toFixed(1)}%)`;
                banner.classList.toggle('positive', res.netProfit >= 0);
                banner.classList.toggle('negative', res.netProfit < 0);

                reqOdds2El.textContent = res.odds2.toFixed(2);
                reqStake2El.textContent = res.stake2.toFixed(p);
                firstBetSumEl.textContent = `الرهان 1: ${res.stake1.toFixed(p)}${cur()} × ${res.odds1}`;
                guarReturnEl.textContent = `العائد الكلي: ${res.payout.toFixed(p)}${cur()}`;

                document.getElementById('sumRowBet1').textContent = `${res.stake1.toFixed(p)}${cur()} × ${res.odds1.toFixed(2)}`;
                document.getElementById('sumRowBet2').textContent = `${res.stake2.toFixed(p)}${cur()} × ${res.odds2.toFixed(2)}`;
                document.getElementById('sumRowTotalStake').textContent = `${res.totalStake.toFixed(p)}${cur()}`;
                document.getElementById('sumRowPayout').textContent = `${res.payout.toFixed(p)}${cur()}`;
                const netEl = document.getElementById('sumRowNetProfit');
                netEl.textContent = `${sign}${res.netProfit.toFixed(p)}${cur()} (${sign}${res.pct.toFixed(1)}%)`;
                netEl.style.color = res.netProfit >= 0 ? 'var(--green-accent)' : 'var(--danger-accent)';

                const nowDt2 = getFormattedDateTime();
                lastCalcTab2 = {
                    id: Date.now(),
                    type: 'تغطية متأخرة',
                    mode: currentTab2Mode,
                    time: nowDt2,
                    date: nowDt2,
                    ...res
                };

                timerT2 = setTimeout(() => {
                    const itemToSave = { ...lastCalcTab2, id: Date.now(), time: getFormattedDateTime(), date: getFormattedDateTime() };
                    historyTab2.unshift(itemToSave);
                    if (historyTab2.length > 25) historyTab2.pop();
                    localStorage.setItem('arb_history_t2', JSON.stringify(historyTab2));
                    renderHistoryTab2();
                    if (typeof renderFullHistory === 'function') renderFullHistory();
                }, 1000);
            }

            updateTab2Simulator(activeStake1, odds1, res);

            const presetPcts = [0, 5, 10, 15, 20, 25, 30, 50];
            tbody.innerHTML = presetPcts.map(pctVal => {
                const rowCalc = computeDelayedHedge(amountVal, odds1, pctVal, currentTab2Mode);
                const isSelected = Math.abs(pctVal - targetPct) < 0.01;
                if (!rowCalc || rowCalc.impossible) {
                    return `<tr style="opacity:0.4;"><td>${pctVal}%</td><td colspan="4">يتطلب احتمال أول أعلى من ${(1 + pctVal / 100).toFixed(2)}</td></tr>`;
                }
                return `
                    <tr class="clickable-row ${isSelected ? 'selected-row' : ''}" data-select-pct="${pctVal}">
                        <td style="color:var(--accent-primary); font-weight:900;">+${pctVal}%</td>
                        <td style="color:var(--amber-accent);">${rowCalc.odds2.toFixed(2)}</td>
                        <td style="color:var(--green-accent);">${rowCalc.stake2.toFixed(p)}${cur()}</td>
                        <td>${rowCalc.totalStake.toFixed(p)}${cur()}</td>
                        <td style="color:var(--green-accent);">+${rowCalc.netProfit.toFixed(p)}${cur()}</td>
                    </tr>
                `;
            }).join('');

            tbody.querySelectorAll('.clickable-row').forEach(row => {
                row.addEventListener('click', () => {
                    const chosenPct = row.dataset.selectPct;
                    t2TargetPctInput.value = chosenPct;
                    syncPctChips(chosenPct);
                    updateTab2();
                });
            });
        };

        t2CustomOdds2Input.addEventListener('input', () => {
            const amountVal = parseFloat(t2AmountInput.value);
            const odds1 = parseFloat(t2Odds1Input.value);
            const targetPct = parseFloat(t2TargetPctInput.value);
            const res = computeDelayedHedge(amountVal, odds1, targetPct, currentTab2Mode);
            const activeStake1 = (res && !res.impossible) ? res.stake1 : amountVal;
            updateTab2Simulator(activeStake1, odds1, res);
        });

        document.getElementById('simPlusBtn').addEventListener('click', () => {
            const current = parseFloat(t2CustomOdds2Input.value) || (lastCalcTab2 && lastCalcTab2.odds2 > 1 ? lastCalcTab2.odds2 : 1.50);
            t2CustomOdds2Input.value = (current + 0.05).toFixed(2);
            t2CustomOdds2Input.dispatchEvent(new Event('input'));
        });

        document.getElementById('simMinusBtn').addEventListener('click', () => {
            const current = parseFloat(t2CustomOdds2Input.value) || (lastCalcTab2 && lastCalcTab2.odds2 > 1 ? lastCalcTab2.odds2 : 1.50);
            t2CustomOdds2Input.value = Math.max(1.02, current - 0.05).toFixed(2);
            t2CustomOdds2Input.dispatchEvent(new Event('input'));
        });

        document.getElementById('applySimToTargetBtn').addEventListener('click', () => {
            if (!lastSimCalcTab2) return;
            t2TargetPctInput.value = lastSimCalcTab2.pct.toFixed(2);
            syncPctChips(lastSimCalcTab2.pct);
            updateTab2();
            showToast('✨ تم اعتماد احتمال المحاكي في الحسابات الحالية!');
        });

        const syncPctChips = (val) => {
            document.querySelectorAll('.pct-chip').forEach(chip => {
                chip.classList.toggle('active', Math.abs(parseFloat(chip.dataset.pct) - parseFloat(val)) < 0.01);
            });
        };

        document.querySelectorAll('.pct-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                t2TargetPctInput.value = chip.dataset.pct;
                syncPctChips(chip.dataset.pct);
                updateTab2();
            });
        });

        t2TargetPctInput.addEventListener('input', () => {
            syncPctChips(t2TargetPctInput.value);
            updateTab2();
        });

        [t2AmountInput, t2Odds1Input].forEach(el => el.addEventListener('input', updateTab2));

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTab2Mode = btn.dataset.mode;

                const labelEl = document.getElementById('stakeInputLabel');
                const titleEl = document.getElementById('tab2ModeTitle');
                if (currentTab2Mode === 'stake1') {
                    labelEl.textContent = 'مبلغ الرهان 1';
                    titleEl.textContent = 'بيانات الدخول الأول (الرهان 1 الأساسي)';
                    t2AmountInput.value = '20';
                } else {
                    labelEl.textContent = 'رأس المال الكلي';
                    titleEl.textContent = 'توزيع ميزانية كلية محددة على الرهانين معاً';
                    t2AmountInput.value = '100';
                }
                updateTab2();
            });
        });

        document.getElementById('resetTab2Btn').addEventListener('click', () => {
            t2Odds1Input.value = '';
            t2CustomOdds2Input.value = '';
            updateTab2();
        });

        const renderHistoryTab2 = () => {
            const list = document.getElementById('historyList2');
            document.getElementById('historyCount2').textContent = historyTab2.length;
            list.innerHTML = historyTab2.map(item => `
                <div class="history-item">
                    <div style="display:flex; justify-content:space-between; font-weight:800; margin-bottom:4px;">
                        <span>مجموع الرهانين: ${item.totalStake.toFixed(2)}${cur()}</span>
                        <span style="color:var(--green-accent); direction:ltr;">+${Number(item.pct).toFixed(1)}% (+${item.netProfit.toFixed(2)}${cur()})</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; color:var(--text-muted); font-size:0.74rem;">
                        <span>رهان1 (${item.odds1}): <b>${item.stake1.toFixed(1)}</b> ⬅️ انتظر (${item.odds2.toFixed(2)}) بمبلغ: <b>${item.stake2.toFixed(1)}</b></span>
                    </div>
                    <div style="text-align:left; font-size:0.68rem; color:var(--text-muted); margin-top:2px;">${item.date}</div>
                </div>
            `).join('');
        };


        // ==================== إدارة أزرار الحاسبة العلوية (Calculator Pane Switching) ====================
        window.switchCalcPane = (paneId) => {
            document.querySelectorAll('.calc-pane').forEach(p => p.style.display = 'none');
            const target = document.getElementById(paneId);
            if (target) target.style.display = 'block';

            document.querySelectorAll('.calc-mode-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.calcPane === paneId);
            });

            if (paneId === 'paneArbitrage') {
                updateTab1();
            } else {
                updateTab2();
            }
        };

        document.querySelectorAll('.calc-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchCalcPane(btn.dataset.calcPane);
            });
        });


window.switchCalcPane = switchCalcPane;
window.updateTab1 = updateTab1;
window.updateTab2 = updateTab2;
window.renderHistoryTab1 = renderHistoryTab1;
window.renderHistoryTab2 = renderHistoryTab2;
window.syncPctChips = syncPctChips;
