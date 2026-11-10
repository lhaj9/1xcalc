// ==================== مركز تفاصيل وإحصائيات المباراة (Match Details & 6 Tabs) ====================
        // ==================== مركز تفاصيل وإحصائيات المباراة (Match Details & 6 Tabs) ====================
        const matchSummaryCache = new Map();
        const standingsCache = new Map();
        let currentActiveStatsEventId = null;
        let currentActiveStatsLeague = null;
        let currentActiveStatsTab = 'statsTabOverview';
        let currentActiveStatsData = null;

        window.openMatchStats = async (eventId, leagueCode) => {
            const modal = document.getElementById('matchStatsModal');
            if (!modal) return;

            currentActiveStatsEventId = eventId;
            currentActiveStatsLeague = leagueCode || currentLeague || 'all';
            currentActiveStatsTab = 'statsTabOverview';

            if (currentActiveStatsLeague === 'all' || !currentActiveStatsLeague) {
                const foundEv = loadedMatchesEvents.find(e => e.id === eventId);
                if (foundEv && foundEv.leagueCode && foundEv.leagueCode !== 'all') {
                    currentActiveStatsLeague = foundEv.leagueCode;
                } else {
                    currentActiveStatsLeague = 'all';
                }
            }

            document.querySelectorAll('.stats-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === 'statsTabOverview');
            });

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('stats-modal-open');

            const heroBanner = document.getElementById('statsHeroBanner');
            const sheetBody = document.getElementById('statsSheetBody');
            if (heroBanner) {
                heroBanner.innerHTML = `
                    <div style="text-align:center; padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:8px;">
                        <div class="match-spinner"></div>
                        <span style="font-size:0.8rem; font-weight:800; color:var(--text-muted);">جاري تجهيز وتفصيل بيانات اللقاء...</span>
                    </div>
                `;
            }
            if (sheetBody) {
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
                if (currentSport === 'basketball') {
                    const bLeague = (currentActiveStatsLeague === 'mens-college-basketball') ? 'mens-college-basketball' : 'nba';
                    url = `https://site.api.espn.com/apis/site/v2/sports/basketball/${bLeague}/summary?event=${eventId}`;
                } else {
                    const sLeague = (currentActiveStatsLeague === 'all' || !currentActiveStatsLeague) ? 'all' : currentActiveStatsLeague;
                    url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${sLeague}/summary?event=${eventId}`;
                }

                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const isFinished = data.header?.competitions?.[0]?.status?.type?.state === 'post';
                matchSummaryCache.set(cacheKey, { data, timestamp: now, isFinished });
                currentActiveStatsData = data;
                renderMatchSummary(data);
            } catch (err) {
                if (sheetBody) {
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

        window.closeMatchStats = () => {
            const modal = document.getElementById('matchStatsModal');
            if (modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
            document.body.classList.remove('stats-modal-open');
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
            const homeLogo = home.team?.logo || home.team?.logos?.[0]?.href || './icon-192.png';
            const awayLogo = away.team?.logo || away.team?.logos?.[0]?.href || './icon-192.png';

            const state = comp.status?.type?.state || 'pre';
            const isLive = state === 'in';
            const isFinished = state === 'post';
            const statusDetail = comp.status?.type?.detail || (isLive ? 'مباشر' : (isFinished ? 'انتهت' : 'قريباً'));

            const homeScore = parseInt(home.score, 10);
            const awayScore = parseInt(away.score, 10);
            const hasScore = !isNaN(homeScore) && !isNaN(awayScore);

            const homeWon = isFinished && hasScore && (homeScore > awayScore);
            const awayWon = isFinished && hasScore && (awayScore > homeScore);

            const venueName = data.gameInfo?.venue?.fullName || comp.venue?.fullName || '';
            const matchTitle = `${homeName} ضد ${awayName}`;

            // 1. تحديث الترويسة
            const leagueMeta = MAJOR_LEAGUES.find(l => l.code === currentActiveStatsLeague) || { name: 'رياضة', flag: '⚽' };
            const leagueLogoEl = document.getElementById('statsLeagueLogo');
            const leagueFlagEl = document.getElementById('statsLeagueFlag');
            const leagueNameEl = document.getElementById('statsLeagueName');
            const matchRoundEl = document.getElementById('statsMatchRound');

            if (leagueLogoEl) {
                if (leagueMeta.logo) {
                    leagueLogoEl.src = leagueMeta.logo;
                    leagueLogoEl.style.display = 'block';
                } else {
                    leagueLogoEl.style.display = 'none';
                }
            }
            if (leagueFlagEl) {
                if (leagueMeta.flagImg) {
                    leagueFlagEl.src = leagueMeta.flagImg;
                    leagueFlagEl.style.display = 'block';
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
                                ${isLive ? '<span class="live-dot-pulse"></span> ' : ''}${statusDetail}
                            </span>
                            ${venueName ? `<span class="stats-hero-venue">🏟️ ${venueName}</span>` : ''}
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
                                <span class="live-dot-pulse"></span> ${statusDetail}
                            </span>
                            ${venueName ? `<span class="stats-hero-venue">🏟️ ${venueName}</span>` : ''}
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
                            <span class="stats-hero-status tag-pre">${statusDetail || 'لم تبدأ بعد'}</span>
                            ${venueName ? `<span class="stats-hero-venue">🏟️ ${venueName}</span>` : ''}
                        </div>
                    `;
                }

                heroBanner.innerHTML = `
                    <div class="stats-hero-grid">
                        <div class="stats-team-box ${homeWon ? 'is-winner' : ''}">
                            <img src="${homeLogo}" alt="${homeName}" class="stats-team-crest" onerror="this.src='./icon-192.png'">
                            <span class="stats-team-name">${homeName}</span>
                            ${homeWon ? '<span class="winner-tag">فائز ✓</span>' : ''}
                        </div>

                        ${scoreCenterHtml}

                        <div class="stats-team-box ${awayWon ? 'is-winner' : ''}">
                            <img src="${awayLogo}" alt="${awayName}" class="stats-team-crest" onerror="this.src='./icon-192.png'">
                            <span class="stats-team-name">${awayName}</span>
                            ${awayWon ? '<span class="winner-tag">فائز ✓</span>' : ''}
                        </div>
                    </div>

                    <button type="button" class="btn-stats-hero-calc" onclick="transferMatchToCalc('${matchTitle.replace(/'/g, "\\'")}', '${isLive ? 'delayed' : 'arbitrage'}'); closeMatchStats();">
                        <i class="fa-solid fa-calculator"></i>
                        <span>فتح وحساب صفقة لهذه المباراة في الحاسبة ⚡</span>
                    </button>
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
            } else if (currentActiveStatsTab === 'statsTabStandings') {
                renderStandingsTab(data, sheetBody);
            } else if (currentActiveStatsTab === 'statsTabInfo') {
                renderInfoTab(data, sheetBody);
            }
        };

        // التبويب 1: إحصائيات الأداء (Team Stats)
        const renderOverviewTab = (data, container) => {
            const boxscoreTeams = data.boxscore?.teams || [];
            if (!Array.isArray(boxscoreTeams) || boxscoreTeams.length < 2) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">📊</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">إحصائيات الأداء التراكمية غير متوفرة بعد</div>
                        <div style="font-size: 0.73rem; max-width: 320px; line-height: 1.4;">
                            المباراة لم تبدأ بعد أو لم يكتمل جمع أرقام الأداء (الاستحواذ، التسديدات، الركنيات). ستظهر الأرقام فور انطلاق صافرة اللقاء.
                        </div>
                    </div>
                `;
                return;
            }

            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

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
                    const numHome = parseFloat(rawHome) || 0;
                    const numAway = parseFloat(rawAway) || 0;
                    const displayHome = (rawHome !== null ? rawHome : '0') + (m.suffix || '');
                    const displayAway = (rawAway !== null ? rawAway : '0') + (m.suffix || '');
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
                <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                </button>
            `;
        };

        // التبويب 2: أبرز الأحداث (Key Events)
        const renderEventsTab = (data, container) => {
            const events = data.keyEvents || [];
            if (!Array.isArray(events) || events.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">⏱️</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">لم تُسجل أحداث رئيسية بعد</div>
                        <div style="font-size: 0.73rem;">سيتم رصد الأهداف والبطاقات فور حدوثها في المباراة مباشرة.</div>
                    </div>
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
                <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                </button>
            `;
        };

        // التبويب 3: التعليق المباشر (Live Commentary)
        const renderCommentaryTab = (data, container) => {
            const commentary = data.commentary || data.plays || [];
            if (!Array.isArray(commentary) || commentary.length === 0) {
                container.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon">💬</div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">لا يتوفر تعليق كتابي مباشر حالياً</div>
                        <div style="font-size: 0.73rem;">التعليق النصي والوصف الدقيق لمجريات اللقاء ينطلق مع صافرة البداية للمباريات المتاحة.</div>
                    </div>
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
                <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                </button>
            `;
        };

        // التبويب 4: التشكيلة والخطط التكتيكية (Lineups & Formations)
        const renderLineupsTab = (data, container) => {
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
                `;
                return;
            }

            const comp = data.header?.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

            let homeRoster = rosters.find(r => r.team?.id === home.id || r.team?.id === home.team?.id) || rosters[0];
            let awayRoster = rosters.find(r => r.team?.id === away.id || r.team?.id === away.team?.id) || rosters[1];

            const renderTeamRosterSection = (teamRoster, teamMeta, color) => {
                const formation = teamRoster.formation || 'غير محدد';
                const players = teamRoster.roster || [];
                const starters = players.filter(p => p.starter !== false && !p.subbedIn);
                const subs = players.filter(p => p.starter === false || p.subbedIn);
                const coach = teamRoster.coach?.[0]?.displayName || 'المدرب الفني';

                return `
                    <div class="lineup-starters-card">
                        <div class="lineup-team-section-title">
                            <span style="color:${color};">● ${teamMeta.team?.displayName || 'الفريق'}</span>
                            <span class="formation-pill">خطة اللعب: ${formation}</span>
                        </div>

                        <div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); margin:6px 0 4px 0;">اللاعبون الأساسيون (Starting XI):</div>
                        <div class="lineup-players-list">
                            ${(starters.length > 0 ? starters : players.slice(0, 11)).map(p => {
                                const athlete = p.athlete || {};
                                const name = athlete.displayName || 'لاعب';
                                const num = athlete.jersey || '–';
                                const pos = athlete.position?.abbreviation || athlete.position?.name || 'PL';
                                return `
                                    <div class="player-row">
                                        <div class="player-num-pos">
                                            <span class="player-num-badge">${num}</span>
                                            <span>${name}</span>
                                        </div>
                                        <span class="player-pos-badge">${pos}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        ${subs.length > 0 ? `
                            <div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); margin:10px 0 4px 0;">دكة البدلاء (Substitutes):</div>
                            <div class="lineup-players-list">
                                ${subs.map(p => {
                                    const athlete = p.athlete || {};
                                    const name = athlete.displayName || 'لاعب';
                                    const num = athlete.jersey || '–';
                                    const pos = athlete.position?.abbreviation || 'SUB';
                                    return `
                                        <div class="player-row" style="opacity:0.85;">
                                            <div class="player-num-pos">
                                                <span class="player-num-badge" style="opacity:0.8;">${num}</span>
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
                `;
            };

            container.innerHTML = `
                <div class="lineups-wrap">
                    ${renderTeamRosterSection(homeRoster, home, '#3b82f6')}
                    ${renderTeamRosterSection(awayRoster, away, '#10b981')}
                </div>
                <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                </button>
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

            const leagueCode = currentActiveStatsLeague;
            let entries = [];

            if (standingsCache.has(leagueCode)) {
                entries = standingsCache.get(leagueCode);
            } else {
                try {
                    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/standings`;
                    const res = await fetch(url);
                    if (res.ok) {
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
                                const logo = entry.team?.logos?.[0]?.href || entry.team?.logo || './icon-192.png';
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
                                                <img src="${logo}" alt="" class="standings-team-mini-logo" onerror="this.src='./icon-192.png'">
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
                <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                </button>
            `;
        };

        // التبويب 6: معلومات اللقاء (Match Info)
        const renderInfoTab = (data, container) => {
            const comp = data.header?.competitions?.[0] || {};
            const gameInfo = data.gameInfo || {};
            const venue = gameInfo.venue || comp.venue || {};
            const venueName = venue.fullName || 'غير محدد';
            const city = venue.address?.city || '';
            const venueDisplay = city ? `${venueName} (${city})` : venueName;

            const officials = (gameInfo.officials || []).map(o => o.displayName).filter(Boolean).join('، ') || 'طاقم تحكيم رسمي';
            const attendance = gameInfo.attendance ? `${Number(gameInfo.attendance).toLocaleString('ar-MA')} متفرج` : 'غير معلن';
            
            let dateStr = '–';
            try {
                if (comp.date) {
                    dateStr = new Date(comp.date).toLocaleString('ar-MA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch { }

            const home = comp.competitors?.find(c => c.homeAway === 'home') || {};
            const away = comp.competitors?.find(c => c.homeAway === 'away') || {};
            const matchTitle = `${home.team?.displayName || 'المضيف'} ضد ${away.team?.displayName || 'الضيف'}`;

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

                <div style="margin-top:8px; display:flex; gap:8px;">
                    <button type="button" class="btn-calc-action" style="flex:1; padding:9px;" onclick="copyMatchTitle('${matchTitle.replace(/'/g, "\\'")}')">
                        <i class="fa-regular fa-copy"></i>
                        <span>نسخ تفاصيل المباراة</span>
                    </button>
                    <button type="button" class="btn-calc-action btn-calc-save" style="flex:1; padding:9px;" onclick="transferMatchToCalc('${matchTitle.replace(/'/g, "\\'")}', 'delayed'); closeMatchStats();">
                        <i class="fa-solid fa-bolt"></i>
                        <span>حساب الصفقة</span>
                    </button>
                </div>

                <button type="button" class="btn-stats-bottom-close" onclick="closeMatchStats()">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق تفاصيل المباراة والعودة للقائمة</span>
                </button>
            `;
        };

        // مستمعات أحداث نافذة تفاصيل المباراة
        const statsModalEl = document.getElementById('matchStatsModal');
        if (statsModalEl) {
            document.getElementById('closeStatsModalBtn')?.addEventListener('click', closeMatchStats);
            document.getElementById('closeStatsModalX')?.addEventListener('click', closeMatchStats);
            document.getElementById('refreshStatsBtn')?.addEventListener('click', refreshCurrentMatchStats);
            statsModalEl.addEventListener('click', (e) => {
                if (e.target === statsModalEl) closeMatchStats();
            });
            document.querySelectorAll('.stats-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentActiveStatsTab = btn.dataset.tab;
                    renderActiveStatsTabPane();
                });
            });
        }


window.openMatchStats = openMatchStats;
window.closeMatchStats = closeMatchStats;
