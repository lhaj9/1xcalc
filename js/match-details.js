// ==================== مركز تفاصيل وإحصائيات المباراة (Match Details & 6 Tabs) ====================
        const matchSummaryCache = new Map();
        const standingsCache = new Map();
        let currentActiveStatsEventId = null;
        let currentActiveStatsLeague = null;
        let currentActiveStatsSport = 'soccer';
        let currentActiveStatsTab = 'statsTabOverview';
        let currentActiveStatsData = null;

        // دالة إضافة المباراة مباشرة إلى القسائم كصفقة نشطة O₂ مع التحديث اللحظي
        window.addMatchToSavedSlips = (matchTitle, mode = 'delayed') => {
            try {
                const raw = localStorage.getItem('arb_saved_slips') || '[]';
                let slipsList = [];
                try { slipsList = JSON.parse(raw); } catch { slipsList = []; }
                if (!Array.isArray(slipsList)) slipsList = [];

                const titleClean = (matchTitle || '').trim();
                const existing = slipsList.find(s => (s.title || s.slipName || '').trim().toLowerCase() === titleClean.toLowerCase());
                if (existing) {
                    const existMsg = `⚡ هذه المباراة مسجلة بالفعل كصفقة نشطة في القسائم!`;
                    if (typeof window.showToast === 'function') window.showToast(existMsg);
                    else if (typeof showToast === 'function') showToast(existMsg);
                    return;
                }

                const newSlip = {
                    id: Date.now(),
                    title: titleClean,
                    type: mode === 'delayed' ? 'رهان متأخر' : 'رهان موازنة',
                    createdAt: new Date().toLocaleDateString('ar-MA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric' }),
                    settledAt: null,
                    status: 'pending',
                    hedgePlayed: false,
                    stake1: 100,
                    odds1: 2.10,
                    stake2: 105,
                    odds2: 2.00,
                    totalStake: 205,
                    plannedTotalStake: 205,
                    payout: 210,
                    expectedProfit: 5,
                    realizedProfit: 0,
                    pct: 2.44
                };

                slipsList.unshift(newSlip);
                localStorage.setItem('arb_saved_slips', JSON.stringify(slipsList));
                try { if (typeof savedSlips !== 'undefined') savedSlips = slipsList; } catch {}
                window.savedSlips = slipsList;

                // 1. تحديث زر الحفظ في المودال فوراً وبشكل لحظي
                const btnHero = document.getElementById('btnHeroSaveSlip');
                if (btnHero) {
                    btnHero.classList.add('is-saved');
                    btnHero.innerHTML = '<i class="fa-solid fa-check"></i> <span>مضافة للقسائم O₂</span>';
                }

                // 2. تحديث تبويب القسائم فورياً
                if (typeof window.renderSlips === 'function') {
                    window.renderSlips();
                }

                // 3. تحديث قائمة المباريات فورياً لإظهار شارة الصفقة النشطة O2 دون الحاجة لإعادة تحميل
                if (typeof window.renderMatchesList === 'function' && window.loadedMatchesEvents) {
                    window.renderMatchesList(window.loadedMatchesEvents);
                }

                const msg = `⚡ تم حفظ [${titleClean}] كصفقة نشطة O₂! ظهرت الشارة في القائمة فوراً.`;
                if (typeof window.showToast === 'function') {
                    window.showToast(msg);
                } else if (typeof showToast === 'function') {
                    showToast(msg);
                }
            } catch (e) {
                if (typeof window.showToast === 'function') {
                    window.showToast('تعذر حفظ الصفقة في القسائم');
                } else if (typeof showToast === 'function') {
                    showToast('تعذر حفظ الصفقة في القسائم');
                }
            }
        };

        // نسخ تفاصيل المباراة الشاملة إلى الحافظة (الملخص الكامل)
        window.copyMatchDetails = () => {
            const data = currentActiveStatsData;
            const comp = data?.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const homeScore = home.score !== undefined ? home.score : '-';
            const awayScore = away.score !== undefined ? away.score : '-';

            const state = comp.status?.type?.state || 'pre';
            const statusDetail = comp.status?.type?.detail || (state === 'in' ? 'مباشر' : (state === 'post' ? 'انتهت' : 'قريباً'));

            const leagueMeta = (window.MAJOR_LEAGUES || []).find(l => l.code === currentActiveStatsLeague) || { name: 'بطولة رياضية' };
            const leagueName = leagueMeta.name || 'كرة قدم';

            const venue = data?.gameInfo?.venue?.fullName || comp.venue?.fullName || '';

            let dateStr = '';
            try {
                if (comp.date) {
                    const tzMode = localStorage.getItem('arb_match_timezone') || 'gmt';
                    const tzOpt = (tzMode === 'local') ? {} : { timeZone: 'UTC' };
                    const tzSuffix = (tzMode === 'local') ? ' (توقيت محلي)' : ' (توقيت غرينتش GMT)';
                    dateStr = new Date(comp.date).toLocaleString('ar-MA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        ...tzOpt
                    }) + tzSuffix;
                }
            } catch {}

            let text = `🏆 مباراة: ${homeName} ضد ${awayName}\n`;
            text += `⚽ البطولة: ${leagueName}\n`;
            if (state === 'in' || state === 'post') {
                text += `📊 الحالة: ${statusDetail} | النتيجة: [${homeScore} - ${awayScore}]\n`;
            } else {
                text += `📊 الحالة: قادمة (لم تبدأ بعد)\n`;
            }
            if (dateStr) text += `📅 الموعد: ${dateStr}\n`;
            if (venue) text += `🏟️ الملعب: ${venue}\n`;
            text += `⚡ تم النسخ عبر تطبيق B-Calc`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('📋 تم نسخ تفاصيل المباراة الشاملة إلى الحافظة!');
                }).catch(() => {
                    window.copyMatchTitle(`${homeName} ضد ${awayName}`);
                });
            } else {
                window.copyMatchTitle(`${homeName} ضد ${awayName}`);
            }
        };

        // زر إغلاق أسفل محتوى التبويبات للعودة للقائمة بعد إزالة الأزرار المكررة ونقلها للأعلى
        const renderTabBottomActions = (matchTitle, isLive) => {
            return `
                <div class="stats-tab-bottom-actions" style="margin-top:16px;">
                    <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                        <i class="fa-solid fa-xmark"></i>
                        <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                    </button>
                </div>
            `;
        };

        const openMatchStats = async (eventId, leagueCode) => {
            const modal = document.getElementById('matchStatsModal');
            if (!modal) return;

            currentActiveStatsEventId = eventId;
            window.currentActiveStatsEventId = eventId;
            currentActiveStatsSport = window.currentSport || 'soccer';
            currentActiveStatsTab = 'statsTabOverview';

            // العثور على بيانات اللقاء من الذاكرة الحية أولاً
            const foundEv = (window.loadedMatchesEvents || []).find(e => e.id === eventId);

            // استخراج كود الدوري الدقيق لتجنب طلب soccer/all/summary الذي يعيد 404
            let resolvedLeague = (leagueCode && leagueCode !== 'all' && leagueCode !== 'unknown') ? leagueCode : '';
            if (!resolvedLeague && foundEv) {
                const uidMatch = (foundEv.uid || '').match(/~l:([^~]+)/);
                if (uidMatch && uidMatch[1]) {
                    resolvedLeague = uidMatch[1];
                } else if (foundEv.leagueCode && foundEv.leagueCode !== 'all') {
                    resolvedLeague = foundEv.leagueCode;
                } else if (foundEv.league?.slug) {
                    resolvedLeague = foundEv.league.slug;
                }
            }
            if (!resolvedLeague) resolvedLeague = 'all';
            currentActiveStatsLeague = resolvedLeague;

            document.querySelectorAll('.stats-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset?.tab === 'statsTabOverview');
            });

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('stats-modal-open');

            if (typeof window.pushModalHistory === 'function') {
                window.pushModalHistory('matchStatsModal', () => closeMatchStats(true));
            }

            // إذا كانت المباراة متوفرة في الذاكرة، نعرض فوراً الهيدر والنتيجة اللحظية
            if (foundEv) {
                const initialData = {
                    header: {
                        id: foundEv.id,
                        season: foundEv.season || {},
                        competitions: foundEv.competitions || []
                    },
                    gameInfo: {
                        venue: foundEv.competitions?.[0]?.venue || {},
                        attendance: null,
                        officials: []
                    },
                    boxscore: { teams: [] },
                    keyEvents: (foundEv.competitions?.[0]?.details || []).map(d => ({
                        text: d.type?.text || d.text || '',
                        clock: { displayValue: d.clock?.displayValue || '' },
                        scoringPlay: d.scoringPlay || false
                    })),
                    plays: [],
                    commentary: [],
                    rosters: []
                };
                currentActiveStatsData = initialData;
                renderMatchSummary(initialData);
            } else {
                const heroBanner = document.getElementById('statsHeroBanner');
                if (heroBanner) {
                    heroBanner.innerHTML = `
                        <div style="text-align:center; padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:8px;">
                            <div class="match-spinner"></div>
                            <span style="font-size:0.8rem; font-weight:800; color:var(--text-muted);">جاري تجهيز وتفصيل بيانات اللقاء...</span>
                        </div>
                    `;
                }
            }

            const sheetBody = document.getElementById('statsSheetBody');
            if (sheetBody && (!currentActiveStatsData || !currentActiveStatsData.boxscore?.teams?.length)) {
                sheetBody.innerHTML = `
                    <div class="stats-loading-box" style="text-align:center; padding:35px 16px; color:var(--text-muted);">
                        <div style="font-size:1.8rem; margin-bottom:8px;">⚽</div>
                        <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">جاري استخراج إحصائيات الأداء والأحداث المباشرة...</div>
                        <div style="font-size:0.72rem; margin-top:4px; opacity:0.8;">الاستحواذ • التسديدات • الأخطاء • مسجلو الأهداف</div>
                    </div>
                `;
            }

            const cacheKey = `${currentActiveStatsLeague}_${eventId}`;
            const cached = matchSummaryCache.get(cacheKey);
            const now = Date.now();
            if (cached && (now - cached.timestamp < 30000 || cached.isFinished)) {
                currentActiveStatsData = cached.data;
                renderMatchSummary(cached.data);
                return;
            }

            try {
                let url = '';
                const activeSport = window.currentSport || 'soccer';
                if (activeSport === 'basketball') {
                    const bLeague = (currentActiveStatsLeague === 'mens-college-basketball') ? 'mens-college-basketball' : 'nba';
                    url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/${bLeague}/summary?event=${eventId}`;
                } else {
                    const sLeague = (currentActiveStatsLeague === 'all' || !currentActiveStatsLeague) ? 'all' : currentActiveStatsLeague;
                    url = `https://site.web.api.espn.com/apis/site/v2/sports/soccer/${sLeague}/summary?event=${eventId}`;
                }

                let res = await fetch(url);
                if (!res.ok && currentActiveStatsLeague !== 'all') {
                    const altRes = await fetch(`https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${eventId}`).catch(() => null);
                    if (altRes && altRes.ok) res = altRes;
                }

                if (res.ok) {
                    const data = await res.json();
                    const isFinished = data.header?.competitions?.[0]?.status?.type?.state === 'post';
                    matchSummaryCache.set(cacheKey, { data, timestamp: now, isFinished });
                    currentActiveStatsData = data;
                    renderMatchSummary(data);
                } else if (!foundEv) {
                    throw new Error(`HTTP ${res.status}`);
                }
            } catch (err) {
                if (!foundEv && sheetBody) {
                    sheetBody.innerHTML = `
                        <div class="stats-empty-state">
                            <div class="stats-empty-icon" style="color:var(--danger-accent);">⚠️</div>
                            <div style="font-weight:800; font-size:0.85rem; color:var(--text-main);">تعذر جلب تفاصيل وإحصائيات المباراة</div>
                            <div style="font-size:0.73rem;">يرجى التحقق من اتصال الإنترنت، أو إعادة المحاولة.</div>
                            <button type="button" class="match-refresh-btn" onclick="openMatchStats('${eventId}', '${currentActiveStatsLeague}')" style="margin-top:10px; padding:6px 14px; font-size:0.75rem;">
                                <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة
                            </button>
                        </div>
                    `;
                }
            }
        };

        const closeMatchStats = (fromPopState = false) => {
            window.currentActiveStatsEventId = null;
            const modal = document.getElementById('matchStatsModal');
            if (modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
            document.body.classList.remove('stats-modal-open');

            if (!fromPopState && typeof window.popModalHistory === 'function') {
                window.popModalHistory('matchStatsModal');
            }
        };

        const refreshCurrentMatchStats = async () => {
            if (!currentActiveStatsEventId) return;
            const refreshIcon = document.querySelector('#refreshStatsBtn i');
            if (refreshIcon) refreshIcon.classList.add('fa-spin');

            const cacheKey = `${currentActiveStatsLeague}_${currentActiveStatsEventId}`;
            matchSummaryCache.delete(cacheKey);

            await openMatchStats(currentActiveStatsEventId, currentActiveStatsLeague);
            if (refreshIcon) refreshIcon.classList.remove('fa-spin');
            showToast('🔄 تم تحديث إحصائيات المباراة');
        };

        const renderMatchSummary = (data) => {
            if (!data) return;

            const header = data.header || {};
            const comp = header.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const defaultTeamShield = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png';
            const homeLogo = (typeof window.getTeamLogoUrl === 'function' ? window.getTeamLogoUrl(home.team, currentActiveStatsSport) : home.team?.logo) || defaultTeamShield;
            const awayLogo = (typeof window.getTeamLogoUrl === 'function' ? window.getTeamLogoUrl(away.team, currentActiveStatsSport) : away.team?.logo) || defaultTeamShield;

            const state = comp.status?.type?.state || 'pre';
            const isLive = state === 'in';
            const isFinished = state === 'post';
            const rawClock = comp.status?.displayClock ? `${comp.status.displayClock} ${comp.status?.type?.detail || ''}` : (comp.status?.type?.detail || '');
            const parsedMinute = isLive && typeof window.parseMinuteDetail === 'function'
                ? window.parseMinuteDetail(currentActiveStatsEventId, rawClock, comp.date || header.date)
                : rawClock;
            const statusDetail = isLive && typeof window.formatLiveMinuteHTML === 'function'
                ? window.formatLiveMinuteHTML(parsedMinute)
                : (parsedMinute || (isLive ? 'مباشر' : (isFinished ? 'انتهت' : 'قريباً')));

            const homeScore = parseInt(home.score, 10);
            const awayScore = parseInt(away.score, 10);
            const hasScore = !isNaN(homeScore) && !isNaN(awayScore);

            const homeWon = isFinished && hasScore && (homeScore > awayScore);
            const awayWon = isFinished && hasScore && (awayScore > homeScore);

            const venueName = data.gameInfo?.venue?.fullName || comp.venue?.fullName || '';
            const matchTitle = `${homeName} ضد ${awayName}`;

            let isAlreadySavedSlip = false;
            try {
                const rawSlips = localStorage.getItem('arb_saved_slips') || '[]';
                const parsedSlips = JSON.parse(rawSlips);
                if (Array.isArray(parsedSlips)) {
                    isAlreadySavedSlip = parsedSlips.some(s => (s.title || s.slipName || '').trim().toLowerCase() === matchTitle.trim().toLowerCase());
                }
            } catch {}

            // 1. تحديث الترويسة
            const leagueMeta = (typeof window.MAJOR_LEAGUES !== 'undefined' ? window.MAJOR_LEAGUES : MAJOR_LEAGUES).find(l => l.code === currentActiveStatsLeague) || { name: 'رياضة', flag: '⚽' };
            const leagueLogoEl = document.getElementById('statsLeagueLogo');
            const leagueFlagEl = document.getElementById('statsLeagueFlag');
            const leagueNameEl = document.getElementById('statsLeagueName');
            const matchRoundEl = document.getElementById('statsMatchRound');

            const hasValidLeagueLogo = leagueMeta.logo && leagueMeta.logo !== './icon-192.png' && leagueMeta.logo.startsWith('http');
            if (leagueLogoEl) {
                if (hasValidLeagueLogo) {
                    leagueLogoEl.src = leagueMeta.logo;
                    leagueLogoEl.style.display = 'block';
                    leagueLogoEl.onerror = () => {
                        leagueLogoEl.style.display = 'none';
                        if (leagueFlagEl && leagueMeta.flagImg) leagueFlagEl.style.display = 'inline-block';
                    };
                } else {
                    leagueLogoEl.style.display = 'none';
                }
            }
            if (leagueFlagEl) {
                if (leagueMeta.flagImg) {
                    leagueFlagEl.src = leagueMeta.flagImg;
                    leagueFlagEl.style.display = hasValidLeagueLogo ? 'none' : 'inline-block';
                } else {
                    leagueFlagEl.style.display = 'none';
                }
            }
            if (leagueNameEl) leagueNameEl.textContent = leagueMeta.name || 'كرة قدم';
            if (matchRoundEl) {
                const dateStr = header.season?.year ? `موسم ${header.season.year}` : '';
                matchRoundEl.textContent = `${statusDetail} ${dateStr ? '• ' + dateStr : ''}`;
            }

            // 2. تحديث بطاقة النتيجة البارزة
            const heroBanner = document.getElementById('statsHeroBanner');
            if (heroBanner) {
                let scoreCenterHtml = '';
                const rawDate = comp.date || header.date || '';
                const rLower = (statusDetail || '').toLowerCase();
                let cleanStatus = statusDetail;
                if (isFinished) {
                    cleanStatus = 'انتهت المباراة';
                    if (rLower.includes('postponed')) cleanStatus = 'مباراة مؤجلة';
                    else if (rLower.includes('cancel')) cleanStatus = 'مباراة ملغاة';
                    else if (rLower.includes('aet')) cleanStatus = 'بعد التمديد (AET)';
                    else if (rLower.includes('pen')) cleanStatus = 'ركلات الترجيح';
                } else if (!isLive) {
                    cleanStatus = 'لم تبدأ بعد';
                    if (rLower.includes('postponed')) cleanStatus = 'مباراة مؤجلة';
                    else if (rLower.includes('cancel')) cleanStatus = 'مباراة ملغاة';
                    else if (rawDate) {
                        try {
                            if (typeof window.formatMatchTime === 'function') {
                                cleanStatus = window.formatMatchTime(rawDate);
                            } else {
                                const dObj = new Date(rawDate);
                                cleanStatus = dObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
                            }
                        } catch {
                            cleanStatus = 'قادمة';
                        }
                    }
                }

                if ((isLive || isFinished) && hasScore) {
                    scoreCenterHtml = `
                        <div class="stats-hero-center">
                            <div class="stats-hero-score-row">
                                <span class="stats-hero-score-num ${isLive ? 'digit-live' : (homeWon ? 'score-winner' : (awayWon ? 'score-loser' : ''))}">
                                    ${homeScore}
                                </span>
                                <span class="stats-hero-sep">:</span>
                                <span class="stats-hero-score-num ${isLive ? 'digit-live' : (awayWon ? 'score-winner' : (homeWon ? 'score-loser' : ''))}">
                                    ${awayScore}
                                </span>
                            </div>
                            <span class="stats-hero-status ${isLive ? 'tag-live' : 'tag-post'}">
                                ${isLive ? '<span class="live-dot-pulse"></span> ' + statusDetail : cleanStatus}
                            </span>
                            ${venueName ? `<span class="stats-hero-venue" title="${venueName}">${venueName}</span>` : ''}
                        </div>
                    `;
                } else if (isLive) {
                    scoreCenterHtml = `
                        <div class="stats-hero-center">
                            <div class="stats-hero-score-row">
                                <span class="stats-hero-score-num digit-live">0</span>
                                <span class="stats-hero-sep">:</span>
                                <span class="stats-hero-score-num digit-live">0</span>
                            </div>
                            <span class="stats-hero-status tag-live">
                                <span class="live-dot-pulse"></span> ${statusDetail || 'مباشر'}
                            </span>
                            ${venueName ? `<span class="stats-hero-venue" title="${venueName}">${venueName}</span>` : ''}
                        </div>
                    `;
                } else {
                    // مباراة قادمة غير ملعوبة: عرض - : - بدلاً من 0 : 0
                    scoreCenterHtml = `
                        <div class="stats-hero-center">
                            <div class="stats-hero-score-row">
                                <span class="stats-hero-score-num score-pre-dash">-</span>
                                <span class="stats-hero-sep">:</span>
                                <span class="stats-hero-score-num score-pre-dash">-</span>
                            </div>
                            <span class="stats-hero-status tag-pre">${cleanStatus}</span>
                            ${venueName ? `<span class="stats-hero-venue" title="${venueName}">${venueName}</span>` : ''}
                        </div>
                    `;
                }

                heroBanner.innerHTML = `
                    <div class="stats-hero-grid">
                        <div class="stats-team-box ${homeWon ? 'is-winner' : ''}">
                            <img src="${homeLogo}" alt="${homeName}" class="stats-team-crest" onerror="this.onerror=null; this.src='https://a.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png';">
                            <span class="stats-team-name">${homeName}</span>
                            ${homeWon ? '<span class="winner-tag">فائز ✓</span>' : ''}
                        </div>

                        ${scoreCenterHtml}

                        <div class="stats-team-box ${awayWon ? 'is-winner' : ''}">
                            <img src="${awayLogo}" alt="${awayName}" class="stats-team-crest" onerror="this.onerror=null; this.src='https://a.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png';">
                            <span class="stats-team-name">${awayName}</span>
                            ${awayWon ? '<span class="winner-tag">فائز ✓</span>' : ''}
                        </div>
                    </div>

                    <div class="stats-hero-actions-bar">
                        <!-- زر الحساب والتأمين الرئيسي العريض -->
                        <button type="button" class="btn-hero-primary-calc" onclick="transferMatchToCalc('${matchTitle.replace(/'/g, "\\'")}', '${isLive ? 'delayed' : 'arbitrage'}'); closeMatchStats();" title="فتح المباراة وحساب أرباح وتأمين الصفقة فوراً في الحاسبة">
                            <i class="fa-solid fa-bolt"></i>
                            <span>حساب وتأمين الصفقة ⚡</span>
                        </button>
                        
                        <!-- صف الأزرار الفرعية المتناسقة 50% / 50% -->
                        <div class="stats-hero-sub-row">
                            <button type="button" class="btn-hero-sub-action btn-hero-copy-details" onclick="copyMatchDetails()" title="نسخ تقرير وتفاصيل المباراة الشاملة">
                                <i class="fa-regular fa-copy"></i>
                                <span>نسخ تفاصيل المباراة</span>
                            </button>
                            <button type="button" class="btn-hero-sub-action btn-hero-save-slip ${isAlreadySavedSlip ? 'is-saved' : ''}" id="btnHeroSaveSlip" onclick="addMatchToSavedSlips('${matchTitle.replace(/'/g, "\\'")}', '${isLive ? 'delayed' : 'arbitrage'}')" title="إضافة وتثبيت المباراة في القسائم كصفقة نشطة O₂">
                                <i class="fa-solid ${isAlreadySavedSlip ? 'fa-check' : 'fa-plus-circle'}"></i>
                                <span>${isAlreadySavedSlip ? 'مضافة للقسائم O₂' : 'إضافة للقسائم O₂'}</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            renderActiveStatsTabPane();
        };

        const renderActiveStatsTabPane = () => {
            const data = currentActiveStatsData;
            const sheetBody = document.getElementById('statsSheetBody');
            if (!sheetBody || !data) return;

            if (currentActiveStatsTab === 'statsTabOverview') {
                renderOverviewTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabEvents') {
                renderEventsTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabCommentary') {
                renderCommentaryTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabLineups') {
                renderLineupsTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabH2H') {
                renderH2HTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabStandings') {
                renderStandingsTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabInfo') {
                renderInfoTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabNews') {
                renderNewsTab(data, sheetBody);
            }
        };

        // التبويب 1: إحصائيات الأداء (Team Stats)
        const renderOverviewTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const isLive = comp.status?.type?.state === 'in';
            const isFinished = comp.status?.type?.state === 'post';

            const boxscoreTeams = data.boxscore?.teams || [];
            if (!Array.isArray(boxscoreTeams) || boxscoreTeams.length < 2) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">📊</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">
                            ${isLive ? 'إحصائيات الأداء التراكمية غير متوفرة لهذه البطولة' : (isFinished ? 'إحصائيات الأداء الرقمية غير مسجلة' : 'المباراة لم تبدأ بعد')}
                        </div>
                        <div style="font-size: 0.73rem; max-width: 320px; line-height: 1.4; color: var(--text-muted); margin-top: 4px;">
                            ${isLive ? 'المزود لا يوفر عدادات الاستحواذ والتسديدات لهذه البطولة المحددة، يمكنك متابعة وقائع وأحداث المباراة في تبويب أبرز الأحداث.' : 'ستتوفر أرقام وإحصائيات اللقاء فور انطلاق المباراة وتوفرها من المصدر الرسمي.'}
                        </div>
                        <div style="margin-top: 12px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                            <button type="button" class="match-refresh-btn" onclick="document.querySelector('.stats-tab-btn[data-tab=statsTabEvents]')?.click()" style="padding: 7px 15px; font-size: 0.76rem;">
                                <i class="fa-solid fa-timeline"></i> الانتقال إلى أبرز الأحداث والوقائع
                            </button>
                            <button type="button" class="match-refresh-btn" onclick="document.querySelector('.stats-tab-btn[data-tab=statsTabInfo]')?.click()" style="padding: 7px 15px; font-size: 0.76rem; background:var(--bg-card); color:var(--text-main); border:1px solid var(--border-color);">
                                <i class="fa-solid fa-circle-info"></i> بطاقة معلومات اللقاء
                            </button>
                        </div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            let homeTeamStats = boxscoreTeams.find(t => t.homeAway === 'home' || t.team?.id === home.id || t.team?.id === home.team?.id);
            let awayTeamStats = boxscoreTeams.find(t => t.homeAway === 'away' || t.team?.id === away.id || t.team?.id === away.team?.id);
            if (!homeTeamStats) homeTeamStats = boxscoreTeams[0];
            if (!awayTeamStats) awayTeamStats = boxscoreTeams[1];

            const getStat = (tObj, names) => {
                if (!tObj || !Array.isArray(tObj.statistics)) return null;
                for (const n of names) {
                    const item = tObj.statistics.find(s => s.name?.toLowerCase() === n.toLowerCase() || s.label?.toLowerCase() === n.toLowerCase());
                    if (item && item.displayValue !== undefined) return item.displayValue;
                }
                return null;
            };

            const metrics = [
                { label: 'الاستحواذ على الكرة', keys: ['possessionPct', 'possession'], suffix: '%', isPct: true },
                { label: 'إجمالي التسديدات', keys: ['shots', 'totalShots', 'shotsSummary'] },
                { label: 'التسديدات على المرمى', keys: ['shotsOnTarget', 'shotsOnGoal'] },
                { label: 'الضربات الركنية', keys: ['cornerKicks', 'corners', 'wonCorners'] },
                { label: 'الأخطاء المرتكبة', keys: ['foulsCommitted', 'fouls'] },
                { label: 'البطاقات الصفراء', keys: ['yellowCards', 'yellowCard'] },
                { label: 'البطاقات الحمراء', keys: ['redCards', 'redCard'] },
                { label: 'حالات التسلل', keys: ['offsides', 'offside'] },
                { label: 'تصديات الحارس', keys: ['saves'] }
            ];

            const availableRows = [];
            metrics.forEach(m => {
                const rawHome = getStat(homeTeamStats, m.keys);
                const rawAway = getStat(awayTeamStats, m.keys);
                if (rawHome !== null || rawAway !== null) {
                    const cleanHome = (rawHome !== null ? String(rawHome).replace('%', '').trim() : '0');
                    const cleanAway = (rawAway !== null ? String(rawAway).replace('%', '').trim() : '0');
                    const numHome = parseFloat(cleanHome) || 0;
                    const numAway = parseFloat(cleanAway) || 0;
                    const displayHome = cleanHome + (m.suffix || '');
                    const displayAway = cleanAway + (m.suffix || '');
                    availableRows.push({
                        label: m.label,
                        displayHome,
                        displayAway,
                        numHome,
                        numAway,
                        isPct: m.isPct
                    });
                }
            });

            if (availableRows.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">📊</div>
                        <div style="font-weight:800; font-size:0.85rem; color:var(--text-main);">لم تتوفر مقاييس رقمية للأداء بعد</div>
                        <div style="font-size:0.73rem; color:var(--text-muted); margin-top:4px;">المزود لم يرسل عدادات الأداء لهذه المباراة بعد.</div>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:2px 4px; font-size:0.75rem; font-weight:800; color:var(--text-muted); margin-bottom:2px;">
                    <span style="color:#3b82f6;">● ${home.team?.displayName || 'المضيف'}</span>
                    <span>📈 مقارنة الأداء التراكمي</span>
                    <span style="color:#10b981;">● ${away.team?.displayName || 'الضيف'}</span>
                </div>
                ${availableRows.map(row => {
                    let homeWidth = 50;
                    let awayWidth = 50;
                    if (row.isPct) {
                        homeWidth = Math.min(100, Math.max(0, row.numHome));
                        awayWidth = 100 - homeWidth;
                    } else {
                        const total = row.numHome + row.numAway;
                        if (total > 0) {
                            homeWidth = Math.round((row.numHome / total) * 100);
                            awayWidth = 100 - homeWidth;
                        }
                    }

                    const homeLeading = row.numHome > row.numAway;
                    const awayLeading = row.numAway > row.numHome;

                    return `
                        <div class="stats-duel-card">
                            <div class="stats-duel-labels">
                                <span class="stats-duel-num-home" style="${homeLeading ? 'color:#2563eb; font-size:0.92rem;' : ''}">
                                    ${row.displayHome}
                                </span>
                                <span class="stats-duel-label-title">${row.label}</span>
                                <span class="stats-duel-num-away" style="${awayLeading ? 'color:#059669; font-size:0.92rem;' : ''}">
                                    ${row.displayAway}
                                </span>
                            </div>
                            <div class="stats-duel-track">
                                <div class="stats-duel-bar-home" style="width: ${homeWidth}%;"></div>
                                <div class="stats-duel-bar-away" style="width: ${awayWidth}%;"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // التبويب 2: أبرز الأحداث (Key Events)
        const renderEventsTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const isLive = comp.status?.type?.state === 'in';

            const events = data.keyEvents || data.plays || comp.details || [];
            if (!Array.isArray(events) || events.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">⏱️</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">
                            ${isLive ? 'لا توجد أهداف أو بطاقات مسجلة حتى اللحظة' : 'لم تُسجل أحداث رئيسية'}
                        </div>
                        <div style="font-size: 0.73rem; color: var(--text-muted); margin-top: 4px;">
                            ${isLive ? 'المباراة جارية حالياً، وسيتم رصد الأهداف والإنذارات فور حدوثها في الوقت الحقيقي.' : 'المباراة انتهت دون تسجيل أهداف أو بطاقات في سجل الوقائع.'}
                        </div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            container.innerHTML = `
                <div style="font-weight:800; font-size:0.78rem; color:var(--text-muted); margin-bottom:4px;">
                    ⚽ أبرز وقائع ومجريات اللقاء (${events.length})
                </div>
                ${events.map(e => {
                    const text = e.text || e.shortText || '';
                    const min = e.clock?.displayValue || (e.period?.number ? `${e.period.number}'` : '–');
                    
                    const isGoal = e.scoringPlay || text.includes('Goal') || text.includes('هدف');
                    const isRed = text.includes('Red Card') || text.includes('حمراء');
                    const isYellow = text.includes('Yellow Card') || text.includes('صفراء');
                    const isSub = text.includes('Substitution') || text.includes('تبديل');

                    let icon = '⚡';
                    let minClass = '';
                    if (isGoal) {
                        icon = '⚽';
                        minClass = 'is-goal';
                    } else if (isRed) {
                        icon = '🟥';
                        minClass = 'is-card-red';
                    } else if (isYellow) {
                        icon = '🟨';
                        minClass = 'is-card-yellow';
                    } else if (isSub) {
                        icon = '🔄';
                    }

                    return `
                        <div class="stats-event-item">
                            <span class="stats-event-min ${minClass}">${min}</span>
                            <span style="font-size:1rem;">${icon}</span>
                            <span class="stats-event-content">${text}</span>
                        </div>
                    `;
                }).join('')}
                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // التبويب 3: التعليق المباشر (Live Commentary)
        const renderCommentaryTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const isLive = comp.status?.type?.state === 'in';

            const commentary = data.commentary || data.plays || [];
            if (!Array.isArray(commentary) || commentary.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">💬</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">لا يتوفر تعليق كتابي مباشر حالياً</div>
                        <div style="font-size: 0.73rem;">التعليق النصي والوصف الدقيق لمجريات اللقاء ينطلق مع صافرة البداية للمباريات المتاحة.</div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            container.innerHTML = `
                <div style="font-weight:800; font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">
                    💬 التعليق المباشر ووصف مجريات اللقاء (${commentary.length} لقطة)
                </div>
                <div class="commentary-list">
                    ${commentary.map(item => {
                        const min = item.time || item.clock?.displayValue || (item.period ? `${item.period}'` : '–');
                        const text = item.text || item.shortText || '';
                        return `
                            <div class="commentary-card">
                                <span class="commentary-min">${min}</span>
                                <span class="commentary-text">${text}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // إدارة الفريق المعروض على أرضية الملعب التكتيكية
        let activePitchTeamIdx = 0;
        window.switchPitchTeam = (idx) => {
            activePitchTeamIdx = idx;
            const sheetBody = document.getElementById('statsSheetBody');
            if (sheetBody && currentActiveStatsData) {
                renderLineupsTab(currentActiveStatsData, sheetBody);
            }
        };

        // التبويب 4: التشكيلة والخطط التكتيكية على أرضية الملعب (Tactical Pitch & Lineups)
        const renderLineupsTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const isLive = comp.status?.type?.state === 'in';

            const rosters = data.rosters || [];
            if (!Array.isArray(rosters) || rosters.length < 2) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">👥</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">التشكيلة الرسمية لم تُعلن بعد</div>
                        <div style="font-size: 0.73rem; max-width: 320px; line-height: 1.4;">
                            يتم اعتماد التشكيلات والخطط التكتيكية الرسمية قبل انطلاق المباراة بنحو ساعة تقريباً من مصادر الأندية الرسمية.
                        </div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            const homeRoster = rosters.find(r => r.team?.id === home.id || r.team?.id === home.team?.id) || rosters[0];
            const awayRoster = rosters.find(r => r.team?.id === away.id || r.team?.id === away.team?.id) || rosters[1];

            const currentRoster = (activePitchTeamIdx === 0) ? homeRoster : awayRoster;
            const currentMeta = (activePitchTeamIdx === 0) ? home : away;
            const currentTeamName = currentMeta.team?.displayName || (activePitchTeamIdx === 0 ? 'المضيف' : 'الضيف');
            const teamColor = (activePitchTeamIdx === 0) ? '#3b82f6' : '#10b981';

            const formation = currentRoster.formation || '4-3-3';
            const allPlayers = currentRoster.roster || [];
            const starters = allPlayers.filter(p => p.starter !== false && !p.subbedIn);
            const activeStarters = starters.length >= 11 ? starters.slice(0, 11) : allPlayers.slice(0, 11);
            const subs = allPlayers.filter(p => p.starter === false || p.subbedIn);
            const coach = currentRoster.coach?.[0]?.displayName || 'غير متوفر';

            // تفكيك خطة اللعب وتوزيع اللاعبين في خطوط الملعب عمودياً (GK -> DEF -> MID -> ATT)
            let formationParts = formation.split('-').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);
            if (formationParts.length === 0) formationParts = [4, 3, 3];

            // حارس المرمى
            const gkPlayer = activeStarters.find(p => {
                const pos = (p.position?.abbreviation || p.position?.name || '').toUpperCase();
                return pos.includes('G') || pos.includes('حارس');
            }) || activeStarters[0];

            const outfieldPlayers = activeStarters.filter(p => p !== gkPlayer);

            // تقسيم باقي اللاعبين حسب خطوط الخطة
            const pitchLines = [];
            pitchLines.push([gkPlayer]); // الخط 0: الحارس

            let outfieldIdx = 0;
            formationParts.forEach(lineCount => {
                const linePlayers = [];
                for (let i = 0; i < lineCount && outfieldIdx < outfieldPlayers.length; i++) {
                    linePlayers.push(outfieldPlayers[outfieldIdx++]);
                }
                if (linePlayers.length > 0) {
                    pitchLines.push(linePlayers);
                }
            });

            // رسم اللاعبين على أرضية الملعب الأخضر
            let pitchLinesHtml = '';
            pitchLines.forEach(line => {
                let nodesHtml = '';
                line.forEach(p => {
                    if (!p) return;
                    const ath = p.athlete || {};
                    const name = ath.displayName || ath.shortName || 'لاعب';
                    const num = ath.jersey || p.jersey || '–';
                    nodesHtml += `
                        <div class="pitch-player-node" title="${name} (#${num})">
                            <div class="pitch-player-shirt" style="border-color:${teamColor};">${num}</div>
                            <span class="pitch-player-name">${name}</span>
                        </div>
                    `;
                });
                pitchLinesHtml += `<div class="pitch-formation-line">${nodesHtml}</div>`;
            });

            container.innerHTML = `
                <div class="pitch-container-wrap">
                    <!-- أزرار التبديل التفاعلية بين تشكيلة الفريقين -->
                    <div class="pitch-team-switch-row">
                        <button type="button" class="pitch-team-tab-btn ${activePitchTeamIdx === 0 ? 'active' : ''}" onclick="switchPitchTeam(0)">
                            <span style="color:#3b82f6;">●</span>
                            <span>${home.team?.displayName || 'المضيف'}</span>
                            <span style="font-size:0.68rem; opacity:0.8;">(${homeRoster.formation || '4-3-3'})</span>
                        </button>
                        <button type="button" class="pitch-team-tab-btn ${activePitchTeamIdx === 1 ? 'active' : ''}" onclick="switchPitchTeam(1)">
                            <span style="color:#10b981;">●</span>
                            <span>${away.team?.displayName || 'الضيف'}</span>
                            <span style="font-size:0.68rem; opacity:0.8;">(${awayRoster.formation || '4-3-3'})</span>
                        </button>
                    </div>

                    <!-- أرضية الملعب الخضراء الواقعية (Soccer Pitch) -->
                    <div class="tactical-pitch">
                        <div class="pitch-penalty-area-top"></div>
                        <div class="pitch-half-line"></div>
                        <div class="pitch-center-circle"></div>
                        <div class="pitch-penalty-area-bottom"></div>
                        ${pitchLinesHtml}
                    </div>

                    <!-- بطاقة معلومات التشكيلة وقائمة البدلاء -->
                    <div class="lineup-starters-card">
                        <div class="lineup-team-section-title">
                            <span style="color:${teamColor};">● ${currentTeamName}</span>
                            <span class="formation-pill">خطة اللعب: ${formation}</span>
                        </div>

                        ${subs.length > 0 ? `
                            <div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); margin:8px 0 6px 0;">دكة البدلاء (Substitutes):</div>
                            <div class="lineup-players-list">
                                ${subs.map(p => {
                                    const ath = p.athlete || {};
                                    const name = ath.displayName || 'لاعب';
                                    const num = ath.jersey || p.jersey || '–';
                                    const pos = ath.position?.abbreviation || 'SUB';
                                    return `
                                        <div class="player-row" style="opacity:0.88;">
                                            <div class="player-num-pos">
                                                <span class="player-num-badge">${num}</span>
                                                <span>${name}</span>
                                            </div>
                                            <span class="player-pos-badge" style="background:var(--bg-card); color:var(--text-muted);">${pos}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : ''}

                        <div class="coach-bar">
                            <i class="fa-solid fa-user-tie"></i>
                            <span>المدير الفني: <b>${coach}</b></span>
                        </div>
                    </div>
                </div>

                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // التبويب 5: المواجهات المباشرة التاريخية (Head-to-Head - H2H)
        const renderH2HTab = (data, container) => {
            const series = data.seasonseries?.[0] || {};
            const h2hEvents = series.events || [];
            const lastFive = data.lastFiveGames || [];

            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const isLive = comp.status?.type?.state === 'in';

            if (h2hEvents.length === 0 && lastFive.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">🤝</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">لا توجد سجلات مواجهات تاريخية مباشرة كافية</div>
                        <div style="font-size: 0.73rem; max-width: 320px; line-height: 1.4;">
                            تتوفر المواجهات المباشرة المجمعة للبطولات الكبرى عند وجود لقاءات سابقة مسجلة بين الفريقين.
                        </div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            let homeWins = 0, awayWins = 0, draws = 0, totalGoals = 0;
            h2hEvents.forEach(ev => {
                const comps = ev.competitors || [];
                const c1 = comps[0] || {};
                const c2 = comps[1] || {};
                const s1 = parseInt(c1.score, 10) || 0;
                const s2 = parseInt(c2.score, 10) || 0;
                totalGoals += (s1 + s2);
                if (s1 === s2) {
                    draws++;
                } else if (c1.winner) {
                    if (c1.team?.id === home.id || c1.team?.id === home.team?.id) homeWins++;
                    else awayWins++;
                } else if (c2.winner) {
                    if (c2.team?.id === home.id || c2.team?.id === home.team?.id) homeWins++;
                    else awayWins++;
                }
            });

            const avgGoals = h2hEvents.length > 0 ? (totalGoals / h2hEvents.length).toFixed(1) : '–';

            let h2hHistoryHtml = '';
            if (h2hEvents.length > 0) {
                h2hEvents.forEach(ev => {
                    const c1 = ev.competitors?.[0] || {};
                    const c2 = ev.competitors?.[1] || {};
                    const dateStr = ev.date ? new Date(ev.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
                    h2hHistoryHtml += `
                        <div class="h2h-history-row">
                            <div style="display:flex; flex-direction:column; gap:2px; max-width:65%;">
                                <div style="display:flex; align-items:center; gap:6px; font-weight:800;">
                                    <span>${c1.team?.displayName || 'فريق'}</span>
                                    <span style="font-size:0.75rem; color:var(--text-muted);">ضد</span>
                                    <span>${c2.team?.displayName || 'فريق'}</span>
                                </div>
                                <span style="font-size:0.67rem; color:var(--text-muted);">${ev.competitionName || 'مباراة سابقة'} • ${dateStr}</span>
                            </div>
                            <div style="font-weight:900; font-size:0.95rem; background:var(--bg-input); padding:3px 10px; border-radius:8px;">
                                ${c1.score || 0} - ${c2.score || 0}
                            </div>
                        </div>
                    `;
                });
            }

            let formHtml = '';
            if (lastFive.length >= 2) {
                const renderTeamRecentForm = (tf) => {
                    const tName = tf.team?.displayName || 'فريق';
                    const evs = tf.events || [];
                    return `
                        <div style="margin-top:10px;">
                            <div style="font-weight:800; font-size:0.78rem; margin-bottom:6px; color:var(--text-main); display:flex; justify-content:space-between; align-items:center;">
                                <span>${tName}</span>
                                <div style="display:flex; gap:4px;">
                                    ${evs.map(e => {
                                        const res = (e.gameResult || 'D').toUpperCase();
                                        const cls = res === 'W' ? 'form-w' : (res === 'L' ? 'form-l' : 'form-d');
                                        const resAr = res === 'W' ? 'ف' : (res === 'L' ? 'خ' : 'ت');
                                        return `<span class="form-badge-pill ${cls}" title="${res === 'W' ? 'فوز' : (res === 'L' ? 'خسارة' : 'تعادل')}">${resAr}</span>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                };
                formHtml = `
                    <div class="h2h-summary-card" style="margin-top:12px;">
                        <div style="font-weight:900; font-size:0.84rem; color:var(--text-main); margin-bottom:8px;">
                            <i class="fa-solid fa-chart-line" style="color:var(--accent-primary);"></i>
                            <span>سجل المباريات الأخيرة (Recent Form)</span>
                        </div>
                        ${renderTeamRecentForm(lastFive[0])}
                        ${renderTeamRecentForm(lastFive[1])}
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="h2h-summary-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-weight:900; font-size:0.86rem; color:var(--text-main);">
                            <i class="fa-solid fa-handshake" style="color:var(--accent-primary);"></i>
                            <span>ملخص المواجهات السابقة (${h2hEvents.length} لقاءات)</span>
                        </div>
                        <span style="font-size:0.72rem; color:var(--text-muted); font-weight:800;">${series.summary || ''}</span>
                    </div>

                    <div class="h2h-stats-grid">
                        <div class="h2h-stat-box">
                            <div class="h2h-stat-num" style="color:#3b82f6;">${homeWins}</div>
                            <div class="h2h-stat-label">فوز ${homeName}</div>
                        </div>
                        <div class="h2h-stat-box">
                            <div class="h2h-stat-num" style="color:#f59e0b;">${draws}</div>
                            <div class="h2h-stat-label">تعادل</div>
                        </div>
                        <div class="h2h-stat-box">
                            <div class="h2h-stat-num" style="color:#10b981;">${awayWins}</div>
                            <div class="h2h-stat-label">فوز ${awayName}</div>
                        </div>
                    </div>

                    <div style="margin-top:8px; font-size:0.72rem; color:var(--text-muted); text-align:center; font-weight:700;">
                        معدل الأهداف في المواجهات: <b style="color:var(--text-main); font-size:0.8rem;">${avgGoals}</b> هدف / مباراة
                    </div>
                </div>

                ${h2hHistoryHtml ? `
                    <div class="h2h-summary-card" style="padding:0; overflow:hidden;">
                        <div style="padding:10px 14px; background:var(--bg-input); font-weight:900; font-size:0.8rem; border-bottom:1px solid var(--border-color);">
                            نتائج آخر المواجهات التاريخية المباشرة
                        </div>
                        ${h2hHistoryHtml}
                    </div>
                ` : ''}

                ${formHtml}

                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // التبويب 5: جدول ترتيب البطولة الحي (Live Standings)
        const renderStandingsTab = async (data, container) => {
            container.innerHTML = `
                <div class="stats-loading-box" style="text-align:center; padding:25px 10px; color:var(--text-muted);">
                    <div class="match-spinner"></div>
                    <div style="font-size:0.82rem; font-weight:800; margin-top:8px; color:var(--text-main);">جاري جلب جدول الترتيب المحدث للدوري...</div>
                </div>
            `;

            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = (home.team?.displayName || '').toLowerCase();
            const awayName = (away.team?.displayName || '').toLowerCase();
            const matchTitle = `${home.team?.displayName || 'المضيف'} ضد ${away.team?.displayName || 'الضيف'}`;
            const isLive = comp.status?.type?.state === 'in';

            const leagueCode = currentActiveStatsLeague;
            let entries = [];

            if (standingsCache.has(leagueCode)) {
                entries = standingsCache.get(leagueCode);
            } else {
                try {
                    let url = `https://site.web.api.espn.com/apis/v2/sports/soccer/${leagueCode}/standings`;
                    let res = await fetch(url).catch(() => null);
                    if (!res || !res.ok) {
                        url = `https://site.web.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/standings`;
                        res = await fetch(url).catch(() => null);
                    }
                    if (res && res.ok) {
                        const sData = await res.json();
                        entries = sData.children?.[0]?.standings?.entries || sData.standings?.[0]?.entries || [];
                        standingsCache.set(leagueCode, entries);
                    }
                } catch {}
            }

            if (!entries || entries.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">🏆</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">جدول الترتيب غير متاح لهذه البطولة</div>
                        <div style="font-size: 0.73rem;">البطولات الإقصائية أو الكؤوس لا تعتمد نظام الترتيب النقطي.</div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            const getStatVal = (entry, statNames) => {
                if (!entry.stats || !Array.isArray(entry.stats)) return '–';
                for (const sName of statNames) {
                    const s = entry.stats.find(item => item.name === sName || item.type === sName);
                    if (s && s.displayValue !== undefined) return s.displayValue;
                }
                return '–';
            };

            container.innerHTML = `
                <div style="font-weight:800; font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">
                    🏆 جدول ترتيب الدوري الحي (الفرق المحددة باللون الأزرق هي أطراف المباراة)
                </div>
                <div class="standings-table-wrap">
                    <table class="standings-table">
                        <thead>
                            <tr>
                                <th style="width:28px;">#</th>
                                <th style="text-align:right;">الفريق</th>
                                <th>لعب</th>
                                <th>فارق</th>
                                <th>نقاط</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${entries.map((entry, idx) => {
                                const tName = entry.team?.displayName || entry.team?.name || 'فريق';
                                const defaultShield = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png';
                                const logo = (typeof window.getTeamLogoUrl === 'function' ? window.getTeamLogoUrl(entry.team, currentActiveStatsSport) : (entry.team?.logos?.[0]?.href || entry.team?.logo)) || defaultShield;
                                const tLower = tName.toLowerCase();
                                const isMatchTeam = tLower.includes(homeName) || homeName.includes(tLower) || tLower.includes(awayName) || awayName.includes(tLower);

                                const rank = getStatVal(entry, ['rank']) !== '–' ? getStatVal(entry, ['rank']) : (idx + 1);
                                const gp = getStatVal(entry, ['gamesPlayed', 'gp']);
                                const diff = getStatVal(entry, ['pointDifferential', 'goalDifferential', 'gd']);
                                const pts = getStatVal(entry, ['points', 'pts']);

                                return `
                                    <tr class="${isMatchTeam ? 'standings-row-active' : ''}">
                                        <td><b>${rank}</b></td>
                                        <td>
                                            <div class="standings-team-name-cell">
                                                <img src="${logo}" alt="" class="standings-team-mini-logo" onerror="this.onerror=null; this.src='${defaultShield}';">
                                                <span>${tName}</span>
                                                ${isMatchTeam ? '<span style="font-size:0.62rem; background:var(--accent-primary); color:#fff; padding:1px 5px; border-radius:4px;">مباراة الآن</span>' : ''}
                                            </div>
                                        </td>
                                        <td>${gp}</td>
                                        <td style="direction:ltr;">${diff}</td>
                                        <td><b style="color:var(--accent-primary); font-size:0.84rem;">${pts}</b></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // التبويب 6: معلومات اللقاء (Match Info)
        const renderInfoTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const gameInfo = data.gameInfo || {};
            const venue = gameInfo.venue || comp.venue || {};
            const venueName = venue.fullName;
            const city = venue.address?.city || '';
            const venueDisplay = venueName ? (city ? `${venueName} (${city})` : venueName) : 'غير متوفر';

            const officialsList = (gameInfo.officials || []).map(o => o.displayName).filter(Boolean);
            const officials = officialsList.length > 0 ? officialsList.join('، ') : 'غير متوفر';
            const attendance = gameInfo.attendance ? `${Number(gameInfo.attendance).toLocaleString('ar-MA')} متفرج` : 'غير متوفر';
            
            let dateStr = 'غير متوفر';
            try {
                if (comp.date) {
                    const tzMode = localStorage.getItem('arb_match_timezone') || 'gmt';
                    const tzOpt = (tzMode === 'local') ? {} : { timeZone: 'UTC' };
                    const tzSuffix = (tzMode === 'local') ? ' (توقيت محلي)' : ' (توقيت غرينتش GMT)';
                    dateStr = new Date(comp.date).toLocaleString('ar-MA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        ...tzOpt
                    }) + tzSuffix;
                }
            } catch { }

            const home = comp.competitors?.find(c => c.homeAway === 'home') || {};
            const away = comp.competitors?.find(c => c.homeAway === 'away') || {};
            const matchTitle = `${home.team?.displayName || 'المضيف'} ضد ${away.team?.displayName || 'الضيف'}`;
            const isLive = comp.status?.type?.state === 'in';

            container.innerHTML = `
                <div style="font-weight:800; font-size:0.78rem; color:var(--text-muted); margin-bottom:4px;">
                    ℹ️ بطاقة معلومات المباراة الرسمية
                </div>

                <div class="stats-info-box">
                    <span class="stats-info-icon"><i class="fa-solid fa-calendar-days"></i></span>
                    <div class="stats-info-meta">
                        <span class="stats-info-label">الموعد والتوقيت</span>
                        <span class="stats-info-val">${dateStr}</span>
                    </div>
                </div>

                <div class="stats-info-box">
                    <span class="stats-info-icon"><i class="fa-solid fa-stadium"></i></span>
                    <div class="stats-info-meta">
                        <span class="stats-info-label">الملعب والمدينة</span>
                        <span class="stats-info-val">${venueDisplay}</span>
                    </div>
                </div>

                <div class="stats-info-box">
                    <span class="stats-info-icon"><i class="fa-solid fa-user-tie"></i></span>
                    <div class="stats-info-meta">
                        <span class="stats-info-label">طاقم التحكيم</span>
                        <span class="stats-info-val">${officials}</span>
                    </div>
                </div>

                <div class="stats-info-box">
                    <span class="stats-info-icon"><i class="fa-solid fa-users"></i></span>
                    <div class="stats-info-meta">
                        <span class="stats-info-label">الحضور الجماهيري</span>
                        <span class="stats-info-val">${attendance}</span>
                    </div>
                </div>

                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        const formatMatchNewsTime = (dateStr) => {
            if (!dateStr) return '';
            try {
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return '';
                const diffMs = Date.now() - d.getTime();
                const diffSec = Math.floor(diffMs / 1000);
                if (diffSec < 60) return 'الآن';
                const diffMin = Math.floor(diffSec / 60);
                if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
                const diffHour = Math.floor(diffMin / 60);
                if (diffHour < 24) return `منذ ${diffHour} ساعة`;
                const diffDay = Math.floor(diffHour / 24);
                if (diffDay === 1) return 'أمس';
                if (diffDay < 7) return `منذ ${diffDay} أيام`;
                return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
            } catch {
                return '';
            }
        };

        const escapeHtmlDetails = (str) => {
            if (str == null) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        // التبويب 8: تقارير وأخبار اللقاء (Match Reports & News)
        const renderNewsTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const isLive = comp.status?.type?.state === 'in';

            const article = data.article;
            const relatedArticles = (data.news?.articles || []).filter(a => a && (a.headline || a.description));

            if (!article && relatedArticles.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">📰</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">لا توجد تقارير أو أخبار منشورة لهذه المباراة حالياً</div>
                        <div style="font-size: 0.73rem;">تُنشر تقارير المباريات والتحليلات عادةً قبل انطلاق المباريات الكبرى ومباشرةً بعد نهايتها.</div>
                    </div>
                    ${renderTabBottomActions(matchTitle, isLive)}
                `;
                return;
            }

            let recapHTML = '';
            if (article) {
                const recapHeadline = escapeHtmlDetails(article.headline || article.description || '');
                const recapImg = article.images?.[0]?.url || '';
                const recapTime = formatMatchNewsTime(article.published);
                const recapByline = article.byline ? escapeHtmlDetails(article.byline) : '';
                const recapHref = article.links?.web?.href || '';
                const recapStory = article.story || (article.description ? `<p>${escapeHtmlDetails(article.description)}</p>` : '');

                recapHTML = `
                    <div class="match-recap-card">
                        <div class="match-recap-badge-header">
                            <span><i class="fa-solid fa-file-lines"></i> تقرير ومجريات اللقاء (Match Recap)</span>
                            ${recapTime ? `<span>${recapTime}</span>` : ''}
                        </div>
                        ${recapImg ? `<img src="${recapImg}" class="match-recap-img" alt="${recapHeadline}" onerror="this.style.display='none'">` : ''}
                        <div class="match-recap-body">
                            <h3 class="match-recap-headline">${recapHeadline}</h3>
                            ${recapByline ? `
                                <div style="font-size: 0.72rem; color: var(--text-muted); display:flex; align-items:center; gap:5px;">
                                    <i class="fa-solid fa-pen-nib"></i> <span>${recapByline}</span>
                                </div>
                            ` : ''}
                            <div class="match-recap-story" dir="ltr">
                                ${recapStory}
                            </div>
                            ${recapHref ? `
                                <a href="${recapHref}" target="_blank" rel="noopener noreferrer" class="news-source-btn" style="margin-top: 8px;">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    <span>قراءة التقرير الكامل على ESPN</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
            }

            let relatedHTML = '';
            if (relatedArticles.length > 0) {
                const items = relatedArticles.map((art) => {
                    const artHeadline = escapeHtmlDetails(art.headline || art.description || '');
                    const artDesc = escapeHtmlDetails(art.description || '');
                    const artThumb = art.images?.[0]?.url || '';
                    const artTime = formatMatchNewsTime(art.published);
                    const artHref = art.links?.web?.href || '';
                    const artDataAttr = encodeURIComponent(JSON.stringify(art));

                    return `
                        <div class="match-article-card" data-article-json="${artDataAttr}" onclick="if (window.openNewsDetailModal) { try { window.openNewsDetailModal(JSON.parse(decodeURIComponent(this.dataset.articleJson))); } catch { window.open('${artHref || '#'}', '_blank'); } } else { window.open('${artHref || '#'}', '_blank'); }" role="button" tabindex="0">
                            ${artThumb ? `<img src="${artThumb}" class="match-article-thumb" alt="${artHeadline}" onerror="this.style.display='none'">` : ''}
                            <div class="match-article-info">
                                <div class="match-article-headline">${artHeadline}</div>
                                ${artDesc && artDesc !== artHeadline ? `<div class="match-article-desc">${artDesc}</div>` : ''}
                                <div class="match-article-meta">
                                    ${artTime ? `<span><i class="fa-regular fa-clock"></i> ${artTime}</span>` : ''}
                                    <span>• ESPN</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                relatedHTML = `
                    <div class="match-related-news-section">
                        <div class="match-related-title">
                            <i class="fa-solid fa-newspaper" style="color:var(--accent-primary);"></i>
                            <span>أخبار ومقالات مرتبطة باللقاء (${relatedArticles.length})</span>
                        </div>
                        ${items}
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="match-news-tab-container">
                    ${recapHTML}
                    ${relatedHTML}
                </div>
                ${renderTabBottomActions(matchTitle, isLive)}
            `;
        };

        // مستمعات أحداث نافذة تفاصيل المباراة
        const statsModalEl = document.getElementById('matchStatsModal');
        if (statsModalEl) {
            document.getElementById('closeStatsModalBtn')?.addEventListener('click', () => closeMatchStats(false));
            document.getElementById('closeStatsModalX')?.addEventListener('click', () => closeMatchStats(false));
            document.getElementById('refreshStatsBtn')?.addEventListener('click', refreshCurrentMatchStats);
            statsModalEl.addEventListener('click', (e) => {
                if (e.target === statsModalEl) closeMatchStats(false);
            });
            document.querySelectorAll('.stats-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentActiveStatsTab = btn.dataset?.tab || 'statsTabOverview';
                    renderActiveStatsTabPane();
                });
            });
        }


window.openMatchStats = openMatchStats;
window.closeMatchStats = closeMatchStats;
window.switchStatsTab = (tabId) => {
    currentActiveStatsTab = tabId;
    renderActiveStatsTabPane();
};
