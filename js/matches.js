// ==================== مركز مباريات الدوريات والبطولات العالمية (Matches Hub Engine) ====================
        // ==================== مركز مباريات الدوريات والبطولات العالمية (1XBET Engine V2) ====================
        const MAJOR_LEAGUES = [
            // بطولات ودوريات كرة القدم
            { code: 'all', sport: 'soccer', name: 'كل بطولات كرة القدم', shortName: 'الكل', logo: './icon-192.png', flagImg: '' },
            { code: 'uefa.nations', sport: 'soccer', name: 'دوري الأمم الأوروبية (Nations League)', shortName: 'أمم أوروبا', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2288.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
            { code: 'uefa.champions', sport: 'soccer', name: 'دوري أبطال أوروبا', shortName: 'دوري الأبطال', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
            { code: 'eng.1', sport: 'soccer', name: 'الدوري الإنجليزي الممتاز', shortName: 'البريميرليغ', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
            { code: 'esp.1', sport: 'soccer', name: 'الدوري الإسباني (LaLiga)', shortName: 'لا ليغا', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png', flagImg: 'https://flagcdn.com/w40/es.png' },
            { code: 'ita.1', sport: 'soccer', name: 'الدوري الإيطالي (Serie A)', shortName: 'سيريا A', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png', flagImg: 'https://flagcdn.com/w40/it.png' },
            { code: 'ger.1', sport: 'soccer', name: 'الدوري الألماني (Bundesliga)', shortName: 'البوندسليغا', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png', flagImg: 'https://flagcdn.com/w40/de.png' },
            { code: 'fra.1', sport: 'soccer', name: 'الدوري الفرنسي (Ligue 1)', shortName: 'ليغ 1', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png', flagImg: 'https://flagcdn.com/w40/fr.png' },
            { code: 'uefa.europa', sport: 'soccer', name: 'الدوري الأوروبي (Europa League)', shortName: 'اليوروبا ليغ', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
            { code: 'ksa.1', sport: 'soccer', name: 'دوري روشن السعودي', shortName: 'دوري روشن', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2488.png', flagImg: 'https://flagcdn.com/w40/sa.png' },
            { code: 'por.1', sport: 'soccer', name: 'الدوري البرتغالي (Primeira Liga)', shortName: 'البرتغالي', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/14.png', flagImg: 'https://flagcdn.com/w40/pt.png' },
            { code: 'ned.1', sport: 'soccer', name: 'الدوري الهولندي (Eredivisie)', shortName: 'الهولندي', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png', flagImg: 'https://flagcdn.com/w40/nl.png' },

            // بطولات كرة السلة
            { code: 'all', sport: 'basketball', name: 'كل مباريات كرة السلة', shortName: 'الكل', logo: './icon-192.png', flagImg: '' },
            { code: 'nba', sport: 'basketball', name: 'دوري كرة السلة الأمريكي (NBA)', shortName: 'NBA', logo: 'https://a.espncdn.com/i/leaguelogos/nba/500/nba.png', flagImg: 'https://flagcdn.com/w40/us.png' }
        ];

        // الحالة العامة لقسم المباريات والفلاتر
        let currentSport = 'soccer'; // 'soccer' | 'basketball'
        let currentStatusMode = 'all'; // 'all' | 'live' | 'pre'
        let currentTimeFilter = 'all'; // 'all' | '6h' | '12h' | '24h' | '48h' | 'this_week' | 'next_week' | 'last_week' | 'custom'
        let currentLeague = 'all';
        let customPeriodStart = new Date();
        let customPeriodEnd = new Date();
        let activeSelectingBound = 'start'; // 'start' | 'end'
        let calViewingMonth = new Date().getMonth();
        let calViewingYear = new Date().getFullYear();

        let loadedMatchesEvents = [];
        let tournamentMatchCounts = new Map();
        let matchResponseCache = new Map();

        // إدارة البطولات المفضلة في التخزين المحلي
        let favoriteLeagues = new Set();
        try {
            const savedFavs = JSON.parse(localStorage.getItem('arb_fav_leagues') || '[]');
            if (Array.isArray(savedFavs) && savedFavs.length > 0) {
                savedFavs.forEach(c => favoriteLeagues.add(c));
            } else {
                ['uefa.nations', 'uefa.champions', 'eng.1', 'esp.1'].forEach(c => favoriteLeagues.add(c));
            }
        } catch {
            ['uefa.nations', 'uefa.champions', 'eng.1', 'esp.1'].forEach(c => favoriteLeagues.add(c));
        }

        const saveFavoriteLeagues = () => {
            try {
                localStorage.setItem('arb_fav_leagues', JSON.stringify(Array.from(favoriteLeagues)));
            } catch {}
        };

        const toESPNDate = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}${m}${day}`;
        };

        const getMonday = (d) => {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            date.setDate(diff);
            date.setHours(0, 0, 0, 0);
            return date;
        };

        const getDaysArray = (startDate, count) => {
            const list = [];
            for (let i = 0; i < count; i++) {
                const day = new Date(startDate);
                day.setDate(startDate.getDate() + i);
                list.push(day);
            }
            return list;
        };

        // جلب جدول مباريات دوري محدد عبر واجهة ESPN العامة
        // عند عدم تمرير dateStr يقوم بجلب الجولة الحالية الرسمية مباشرة
        const fetchLeagueScoreboard = async (sport, leagueCode, dateStr = null) => {
            const cacheKey = `${sport}_${leagueCode}_${dateStr || 'default'}`;
            const now = Date.now();

            if (matchResponseCache.has(cacheKey)) {
                const item = matchResponseCache.get(cacheKey);
                if (now - item.timestamp < item.ttl) {
                    return item.data;
                }
            }

            try {
                let sportPath = sport === 'basketball' ? 'basketball/nba' : `soccer/${leagueCode}`;
                let url = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard`;
                if (dateStr) {
                    url += `?dates=${dateStr}`;
                }

                const res = await fetch(url);
                if (!res.ok) return [];

                const data = await res.json();
                const leagueMeta = MAJOR_LEAGUES.find(l => l.code === leagueCode && l.sport === sport) || { name: 'رياضة', flag: '⚽' };
                const events = (data.events || []).map(ev => ({
                    ...ev,
                    sport,
                    leagueCode,
                    leagueMeta
                }));

                const hasLive = events.some(e => e.status?.type?.state === 'in');
                const ttl = hasLive ? 30000 : 300000;
                matchResponseCache.set(cacheKey, { data: events, timestamp: now, ttl });
                return events;
            } catch (err) {
                return [];
            }
        };

        // رسم شريط البطولات التفاعلي مع عدادات المباريات والنجوم المفضلة
        const renderTournamentsBar = () => {
            const container = document.getElementById('tournamentsBarContainer');
            if (!container) return;

            const sportLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport);
            const allPill = sportLeagues.find(l => l.code === 'all');
            const otherLeagues = sportLeagues.filter(l => l.code !== 'all');

            // ترتيب البطولات: المفضلة أولاً ثم حسب عدد المباريات
            otherLeagues.sort((a, b) => {
                const favA = favoriteLeagues.has(a.code) ? 1 : 0;
                const favB = favoriteLeagues.has(b.code) ? 1 : 0;
                if (favA !== favB) return favB - favA;

                const countA = tournamentMatchCounts.get(a.code) || 0;
                const countB = tournamentMatchCounts.get(b.code) || 0;
                return countB - countA;
            });

            const sortedList = allPill ? [allPill, ...otherLeagues] : otherLeagues;

            let html = '';
            sortedList.forEach(league => {
                const isAll = league.code === 'all';
                const count = isAll ? loadedMatchesEvents.length : (tournamentMatchCounts.get(league.code) || 0);
                const isFav = favoriteLeagues.has(league.code);
                const isActive = currentLeague === league.code;

                const logoImg = league.logo ? `<img src="${league.logo}" class="league-pill-icon" alt="" onerror="this.style.display='none'">` : '';
                const flagImg = league.flagImg ? `<img src="${league.flagImg}" class="league-pill-flag" alt="" onerror="this.style.display='none'">` : '';

                html += `
                    <button type="button" class="tournament-item-pill ${isActive ? 'active' : ''}" data-league="${league.code}">
                        ${logoImg}
                        ${flagImg}
                        <span>${league.shortName || league.name}</span>
                        <span class="tournament-match-badge">${count}</span>
                        ${!isAll ? `<i class="fa-solid fa-star tournament-fav-star ${isFav ? 'is-fav' : ''}" data-fav-league="${league.code}" title="${isFav ? 'إزالة من المفضلة' : 'تثبيت في المفضلة'}"></i>` : ''}
                    </button>
                `;
            });

            container.innerHTML = html;

            container.querySelectorAll('.tournament-item-pill').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const starClicked = e.target.closest('.tournament-fav-star');
                    if (starClicked) {
                        e.stopPropagation();
                        const fCode = starClicked.dataset.favLeague;
                        if (favoriteLeagues.has(fCode)) {
                            favoriteLeagues.delete(fCode);
                            showToast('⭐ تم إزالة البطولة من المفضلة');
                        } else {
                            favoriteLeagues.add(fCode);
                            showToast('⭐ تم تثبيت البطولة في أول القائمة');
                        }
                        saveFavoriteLeagues();
                        renderTournamentsBar();
                        return;
                    }

                    container.querySelectorAll('.tournament-item-pill').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentLeague = btn.dataset.league;
                    renderMatchesList(loadedMatchesEvents);
                });
            });
        };

        // المحرك الرئيسي الذكي لجلب مباريات الجولات المباشرة والمجدولة
        const loadMatches = async (forceRefresh = false) => {
            const container = document.getElementById('homeMatchesContainer');
            if (!container) return;

            if (forceRefresh) {
                matchResponseCache.clear();
            }

            container.innerHTML = `
                <div class="match-loading-card">
                    <div class="match-spinner"></div>
                    <div style="font-weight: 800; font-size: 0.88rem;">جاري جلب وفحص جدول المباريات المباشرة والجدول...</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">تحديث مباشر وشامل من مصادر الرياضة العالمية</div>
                </div>
            `;

            const relevantLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport && l.code !== 'all');
            const targetLeagues = currentLeague === 'all'
                ? relevantLeagues.map(l => l.code)
                : [currentLeague];

            const tasks = [];

            // إذا كان الفلتر مخصصاً أو أسبوعياً، نجلب التواريخ المحددة
            if (currentTimeFilter === 'custom') {
                const s = new Date(customPeriodStart);
                const e = new Date(customPeriodEnd);
                s.setHours(0,0,0,0);
                e.setHours(0,0,0,0);
                const cur = new Date(s);
                let count = 0;
                while (cur <= e && count < 14) {
                    const dStr = toESPNDate(cur);
                    targetLeagues.forEach(lCode => {
                        tasks.push(fetchLeagueScoreboard(currentSport, lCode, dStr));
                    });
                    cur.setDate(cur.getDate() + 1);
                    count++;
                }
            } else if (currentTimeFilter === 'this_week') {
                const monday = getMonday(new Date());
                const weekDays = getDaysArray(monday, 7);
                targetLeagues.forEach(lCode => {
                    weekDays.forEach(d => {
                        tasks.push(fetchLeagueScoreboard(currentSport, lCode, toESPNDate(d)));
                    });
                });
            } else if (currentTimeFilter === 'next_week') {
                const nextMon = getMonday(new Date());
                nextMon.setDate(nextMon.getDate() + 7);
                const weekDays = getDaysArray(nextMon, 7);
                targetLeagues.forEach(lCode => {
                    weekDays.forEach(d => {
                        tasks.push(fetchLeagueScoreboard(currentSport, lCode, toESPNDate(d)));
                    });
                });
            } else if (currentTimeFilter === 'last_week') {
                const lastMon = getMonday(new Date());
                lastMon.setDate(lastMon.getDate() - 7);
                const weekDays = getDaysArray(lastMon, 7);
                targetLeagues.forEach(lCode => {
                    weekDays.forEach(d => {
                        tasks.push(fetchLeagueScoreboard(currentSport, lCode, toESPNDate(d)));
                    });
                });
            } else {
                // الحالة الافتراضية الذكية (All / 6h / 12h / 24h / 48h):
                // 1. جلب الجولات الرسمية النشطة الحالية مباشرة لجميع الدوريات
                targetLeagues.forEach(lCode => {
                    tasks.push(fetchLeagueScoreboard(currentSport, lCode, null));
                });

                // 2. إذا كانت كرة قدم، جلب مواعيد دوري الأمم الأوروبية المقبلة (أهم بطولة جارية هذا الأسبوع 12-15 نوفمبر)
                if (currentSport === 'soccer') {
                    const upcomingNationsDays = ['20261112', '20261113', '20261114', '20261115'];
                    upcomingNationsDays.forEach(dStr => {
                        tasks.push(fetchLeagueScoreboard('soccer', 'uefa.nations', dStr));
                    });
                }
            }

            try {
                const results = await Promise.all(tasks);
                const allEvents = results.flat();

                const uniqueMap = new Map();
                allEvents.forEach(ev => {
                    if (!uniqueMap.has(ev.id)) uniqueMap.set(ev.id, ev);
                });

                const rawEvents = Array.from(uniqueMap.values());
                const stateOrder = { 'in': 1, 'pre': 2, 'post': 3 };

                loadedMatchesEvents = rawEvents.sort((a, b) => {
                    const orderA = stateOrder[a.status?.type?.state] || 4;
                    const orderB = stateOrder[b.status?.type?.state] || 4;

                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }

                    if (orderA === 1) {
                        return new Date(b.date) - new Date(a.date);
                    } else if (orderA === 2) {
                        return new Date(a.date) - new Date(b.date);
                    } else {
                        return new Date(b.date) - new Date(a.date);
                    }
                });

                // حساب أعداد المباريات لكل دوري لتحديث شارات العداد
                tournamentMatchCounts.clear();
                loadedMatchesEvents.forEach(ev => {
                    const c = ev.leagueCode || 'unknown';
                    tournamentMatchCounts.set(c, (tournamentMatchCounts.get(c) || 0) + 1);
                });

                // تحديث عدادات وشارة المباشر
                const liveCount = loadedMatchesEvents.filter(ev => ev.status?.type?.state === 'in').length;
                const liveBadge = document.getElementById('liveStatusBadge');
                const livePulse = document.getElementById('homeLivePulse');
                if (liveBadge) liveBadge.textContent = liveCount;
                if (livePulse) livePulse.style.display = liveCount > 0 ? 'inline-block' : 'none';

                renderTournamentsBar();
                renderMatchesList(loadedMatchesEvents);
            } catch (e) {
                container.innerHTML = `
                    <div class="match-loading-card">
                        <div style="font-size:1.5rem; margin-bottom:6px;">⚠️</div>
                        <div style="font-weight:800;">تعذر جلب بيانات المباريات</div>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 10px 0;">يرجى التأكد من اتصال الإنترنت ثم المحاولة ثانية</div>
                        <button type="button" class="match-refresh-btn" onclick="loadMatches(true)" style="padding:7px 16px;">
                            <i class="fa-solid fa-rotate"></i> إعادة المحاولة الآن
                        </button>
                    </div>
                `;
            }
        };

        const formatMatchTime = (iso) => {
            try {
                return new Date(iso).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });
            } catch {
                return '';
            }
        };

        // تصفية وعرض قائمة المباريات في الواجهة بذكاء واحترافية
        const renderMatchesList = (events) => {
            const container = document.getElementById('homeMatchesContainer');
            if (!container) return;

            let filtered = events;

            // 1. تصفية بالدوري إن كان محدداً
            if (currentLeague !== 'all') {
                filtered = filtered.filter(ev => ev.leagueCode === currentLeague);
            }

            // 2. تصفية بالبحث السريع إن وُجد نص
            const query = (document.getElementById('matchSearchInput')?.value || '').trim().toLowerCase();
            if (query) {
                filtered = filtered.filter(ev => {
                    const title = (ev.name || '').toLowerCase();
                    const comp = ev.competitions?.[0];
                    const home = comp?.competitors?.[0]?.team?.displayName?.toLowerCase() || '';
                    const away = comp?.competitors?.[1]?.team?.displayName?.toLowerCase() || '';
                    return title.includes(query) || home.includes(query) || away.includes(query);
                });
            }

            // 3. تصفية بالزمن السريع (6h, 12h, 24h, 48h, custom)
            const nowMs = Date.now();
            const hoursMap = { '6h': 6, '12h': 12, '24h': 24, '48h': 48 };
            if (hoursMap[currentTimeFilter]) {
                const limitMs = nowMs + (hoursMap[currentTimeFilter] * 3600 * 1000);
                filtered = filtered.filter(ev => {
                    const mTime = new Date(ev.date).getTime();
                    return (ev.status?.type?.state === 'in') || (mTime >= (nowMs - 3600000) && mTime <= limitMs);
                });

                if (filtered.length === 0) {
                    const hoursNum = hoursMap[currentTimeFilter];
                    container.innerHTML = `
                        <div class="match-loading-card" style="padding: 22px 14px;">
                            <div style="font-size: 1.8rem; margin-bottom: 6px; color: var(--accent-primary);"><i class="fa-regular fa-clock"></i></div>
                            <div style="font-weight: 900; font-size: 0.88rem; color: var(--text-main);">لا توجد مباريات تنطلق خلال الـ ${hoursNum} ساعة القادمة</div>
                            <div style="font-size: 0.73rem; color: var(--text-muted); margin: 6px auto 12px auto; max-width: 320px; line-height: 1.4;">
                                يمكنك تصفح جدول مواعيد المباريات القادمة للأيام المقبلة، أو التبديل إلى "الكل" لاستعراض المباريات المكتملة والمقبلة.
                            </div>
                            <div style="display: flex; gap: 8px; justify-content: center;">
                                <button type="button" class="match-refresh-btn" onclick="switchMatchesStatusMode('pre')" style="padding: 6px 14px; font-size: 0.75rem;">
                                    <i class="fa-regular fa-clock"></i> المباريات القادمة والجدول
                                </button>
                                <button type="button" class="match-refresh-btn" onclick="switchMatchesTimeFilter('all')" style="padding: 6px 14px; font-size: 0.75rem; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
                                    <i class="fa-solid fa-layer-group"></i> عرض الكل
                                </button>
                            </div>
                        </div>
                    `;
                    return;
                }
            }

            // 4. تصفية بنوع الحالة (مباشر / قادمة / الكل)
            if (currentStatusMode === 'live') {
                const liveOnly = filtered.filter(ev => ev.status?.type?.state === 'in');
                if (liveOnly.length === 0) {
                    container.innerHTML = `
                        <div class="match-loading-card" style="padding: 24px 16px;">
                            <div style="font-size: 2rem; margin-bottom: 8px; color: #ef4444;"><i class="fa-solid fa-satellite-dish"></i></div>
                            <div style="font-weight: 900; font-size: 0.92rem; color: var(--text-main);">لا توجد مباريات جارية الآن مباشرة (LIVE)</div>
                            <div style="font-size: 0.74rem; color: var(--text-muted); margin: 6px auto 14px auto; max-width: 330px; line-height: 1.5;">
                                المباريات المباشرة تُبث لحظياً مع النتيجة ودقيقة اللعب فور إطلاق الحكم صافرة البداية. يمكنك تصفح المباريات القادمة في الجدول أو استعراض نتائج الجولة.
                            </div>
                            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                                <button type="button" class="match-refresh-btn" onclick="switchMatchesStatusMode('pre')" style="padding: 7px 14px;">
                                    <i class="fa-regular fa-clock"></i> المباريات القادمة والجدول
                                </button>
                                <button type="button" class="match-refresh-btn" onclick="switchMatchesStatusMode('all')" style="padding: 7px 14px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
                                    <i class="fa-solid fa-layer-group"></i> جميع المباريات
                                </button>
                            </div>
                        </div>
                    `;
                    return;
                }
                filtered = liveOnly;
            } else if (currentStatusMode === 'pre') {
                const preOnly = filtered.filter(ev => ev.status?.type?.state === 'pre');
                if (preOnly.length === 0) {
                    container.innerHTML = `
                        <div class="match-loading-card" style="padding: 24px 16px;">
                            <div style="font-size: 2rem; margin-bottom: 8px; color: var(--accent-primary);"><i class="fa-regular fa-calendar-days"></i></div>
                            <div style="font-weight: 900; font-size: 0.92rem; color: var(--text-main);">لا توجد مباريات مجدولة قادمة في هذا الدوري حالياً</div>
                            <div style="font-size: 0.74rem; color: var(--text-muted); margin: 6px auto 14px auto; max-width: 330px; line-height: 1.5;">
                                الدوريات قد تكون في فترة توقف مؤقت أو انتهت جولات هذا الأسبوع. يمكنك التبديل إلى "كل البطولات" لرؤية مباريات دوري الأمم الأوروبية والبطولات الجارية.
                            </div>
                            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                                <button type="button" class="match-refresh-btn" onclick="switchMatchesStatusMode('all')" style="padding: 7px 14px;">
                                    <i class="fa-solid fa-layer-group"></i> استعراض جميع المباريات
                                </button>
                            </div>
                        </div>
                    `;
                    return;
                }
                filtered = preOnly;
            }

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="match-loading-card">
                        <div style="font-size:1.6rem; margin-bottom:6px;">⚽</div>
                        <div style="font-weight:800; font-size:0.88rem;">لا توجد مباريات مطابقة للفلتر المحدد</div>
                        <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
                            ${query ? 'جرب البحث باسم فريق آخر أو مسح حقل البحث' : 'جرب اختيار فترة زمنية أخرى كـ "الأسبوع الحالي" أو التبديل إلى "جميع المباريات"'}
                        </div>
                    </div>
                `;
                return;
            }

            const liveMatches = filtered.filter(ev => ev.status?.type?.state === 'in');
            const otherMatches = filtered.filter(ev => ev.status?.type?.state !== 'in');

            let html = '';

            // كتلة المباريات المباشرة الحية الجارية الآن
            if (liveMatches.length > 0) {
                html += `
                    <div class="live-section-banner">
                        <div style="display:flex; align-items:center; gap:7px;">
                            <span class="live-dot-pulse"></span>
                            <span>مباريات جارية الآن مباشرة (LIVE)</span>
                        </div>
                        <span style="direction:ltr;">${liveMatches.length} Live</span>
                    </div>
                `;

                liveMatches.forEach(ev => {
                    html += buildMatchCardHTML(ev);
                });
            }

            // تجميع باقي المباريات بحسب الأيام
            if (otherMatches.length > 0) {
                const dayGroups = {};
                otherMatches.forEach(ev => {
                    const d = new Date(ev.date);
                    const dayKey = d.toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    if (!dayGroups[dayKey]) dayGroups[dayKey] = [];
                    dayGroups[dayKey].push(ev);
                });

                for (const [dayTitle, matches] of Object.entries(dayGroups)) {
                    html += `
                        <div class="day-group-header">
                            <span>📅 ${dayTitle}</span>
                            <span style="font-size:0.69rem; color:var(--text-muted);">${matches.length} مباريات</span>
                        </div>
                    `;

                    matches.forEach(ev => {
                        html += buildMatchCardHTML(ev);
                    });
                }
            }

            container.innerHTML = html;
        };

        const buildMatchCardHTML = (ev) => {
            const comp = ev.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

            const state = ev.status?.type?.state; // 'pre', 'in', 'post'
            const isLive = state === 'in';
            const isFinished = state === 'post';
            const statusDetail = ev.status?.type?.detail || '';

            const homeScore = parseInt(home.score, 10);
            const awayScore = parseInt(away.score, 10);
            const hasScores = !isNaN(homeScore) && !isNaN(awayScore);

            const homeWon = isFinished && hasScores && (homeScore > awayScore);
            const awayWon = isFinished && hasScores && (awayScore > homeScore);

            let badgeHtml = '';
            if (isLive) {
                badgeHtml = `<span class="match-status-badge status-live"><span class="live-dot-pulse"></span> مباشر ${statusDetail}</span>`;
            } else if (isFinished) {
                badgeHtml = `<span class="match-status-badge status-post"><i class="fa-solid fa-check-double"></i> انتهت (${statusDetail})</span>`;
            } else {
                badgeHtml = `<span class="match-status-badge status-pre"><i class="fa-regular fa-clock"></i> ${formatMatchTime(ev.date)}</span>`;
            }

            const homeLogo = home.team?.logo || './icon-192.png';
            const awayLogo = away.team?.logo || './icon-192.png';
            const homeName = home.team?.displayName || 'المضيف';
            const awayName = away.team?.displayName || 'الضيف';
            const matchTitle = `${homeName} ضد ${awayName}`;
            const venueName = comp.venue?.fullName || '';

            let scoreCenter = '';
            if ((isLive || isFinished) && hasScores) {
                // مباراة جارية مباشرة أو منتهية بنتيجة مؤكدة
                scoreCenter = `
                    <div class="score-center-strip">
                        <div class="score-dual-row">
                            <span class="team-score-num ${isLive ? 'digit-live' : (homeWon ? 'digit-winner' : (awayWon ? 'digit-loser' : ''))}">
                                ${homeScore}
                            </span>
                            <span class="score-sep">:</span>
                            <span class="team-score-num ${isLive ? 'digit-live' : (awayWon ? 'digit-winner' : (homeWon ? 'digit-loser' : ''))}">
                                ${awayScore}
                            </span>
                        </div>
                        <span class="status-sub-label ${isLive ? 'live-label' : ''}">
                            ${isLive ? `<span class="live-dot-pulse"></span> ${statusDetail}` : (statusDetail || 'FT')}
                        </span>
                    </div>
                `;
            } else if (isLive && !hasScores) {
                // مباراة انطلقت لتوها ولم تسجل أهداف بعد
                scoreCenter = `
                    <div class="score-center-strip">
                        <div class="score-dual-row">
                            <span class="team-score-num digit-live">0</span>
                            <span class="score-sep">:</span>
                            <span class="team-score-num digit-live">0</span>
                        </div>
                        <span class="status-sub-label live-label">
                            <span class="live-dot-pulse"></span> ${statusDetail || 'مباشر'}
                        </span>
                    </div>
                `;
            } else {
                // مباراة قادمة غير ملعوبة: عرض - : - مع تفاصيل/توقيت اللقاء (لا تظهر أصفار 0-0 أبداً)
                scoreCenter = `
                    <div class="score-center-strip">
                        <div class="score-dual-row">
                            <span class="team-score-num score-pre-dash">-</span>
                            <span class="score-sep">:</span>
                            <span class="team-score-num score-pre-dash">-</span>
                        </div>
                        <span class="status-sub-label">
                            ${statusDetail || 'قريباً'}
                        </span>
                    </div>
                `;
            }

            const leagueLogoImg = ev.leagueMeta?.logo 
                ? `<img src="${ev.leagueMeta.logo}" class="league-card-mini-logo" alt="" onerror="this.style.display='none'">` 
                : '';
            const leagueFlagImg = ev.leagueMeta?.flagImg 
                ? `<img src="${ev.leagueMeta.flagImg}" class="league-card-flag" alt="" onerror="this.style.display='none'">` 
                : '';

            return `
                <div class="match-card ${isLive ? 'is-live' : ''}" onclick="openMatchStats('${ev.id}', '${ev.leagueCode || currentLeague}')" title="انقر لعرض إحصائيات وتفاصيل المباراة">
                    <div class="match-card-top">
                        <span class="league-tag">
                            ${leagueLogoImg}
                            ${leagueFlagImg}
                            <span>${ev.leagueMeta?.name || 'رياضة'}</span>
                        </span>
                        ${badgeHtml}
                    </div>

                    <div class="match-card-body">
                        <!-- الفريق المضيف (الأيمن في RTL) -->
                        <div class="team-box ${homeWon ? 'is-winner' : (awayWon ? 'is-loser' : '')}">
                            <img src="${homeLogo}" alt="${homeName}" class="team-crest" loading="lazy" onerror="this.src='./icon-192.png'">
                            <span class="team-name-label">${homeName}</span>
                            ${homeWon ? '<span class="winner-tag">فائز ✓</span>' : ''}
                        </div>

                        ${scoreCenter}

                        <!-- الفريق الضيف (الأيسر في RTL) -->
                        <div class="team-box ${awayWon ? 'is-winner' : (homeWon ? 'is-loser' : '')}">
                            <img src="${awayLogo}" alt="${awayName}" class="team-crest" loading="lazy" onerror="this.src='./icon-192.png'">
                            <span class="team-name-label">${awayName}</span>
                            ${awayWon ? '<span class="winner-tag">فائز ✓</span>' : ''}
                        </div>
                    </div>

                    <div class="match-card-footer">
                        <span class="match-venue">${venueName ? '🏟️ ' + venueName : ''}</span>
                        <div class="match-action-tools">
                            <button type="button" class="btn-match-stats" onclick="event.stopPropagation(); openMatchStats('${ev.id}', '${ev.leagueCode || currentLeague}')" title="عرض تفاصيل وإحصائيات المباراة">
                                <i class="fa-solid fa-chart-simple"></i>
                                <span>الإحصائيات</span>
                            </button>
                            <button type="button" class="btn-match-calc" onclick="event.stopPropagation(); transferMatchToCalc('${matchTitle.replace(/'/g, "\\'")}', '${isLive ? 'delayed' : 'arbitrage'}')">
                                <i class="fa-solid fa-calculator"></i>
                                <span>حساب الصفقة ⚡</span>
                            </button>
                            <button type="button" class="btn-match-copy" onclick="event.stopPropagation(); copyMatchTitle('${matchTitle.replace(/'/g, "\\'")}')" title="نسخ اسم المباراة">
                                <i class="fa-regular fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        };

        window.transferMatchToCalc = (matchTitle, preferredMode = 'delayed') => {
            switchTab('tabCalc');
            if (preferredMode === 'arbitrage') {
                switchCalcPane('paneArbitrage');
            } else {
                switchCalcPane('paneDelayed');
            }

            const t1Input = document.getElementById('tab1SlipName');
            const t2Input = document.getElementById('tab2SlipName');
            if (t1Input) t1Input.value = matchTitle;
            if (t2Input) t2Input.value = matchTitle;

            showToast(`⚡ تم نقل [${matchTitle}] إلى الحاسبة!`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.copyMatchTitle = (matchTitle) => {
            navigator.clipboard.writeText(matchTitle).then(() => {
                showToast(`📋 تم نسخ: ${matchTitle}`);
            });
        };

        window.switchMatchesStatusMode = (status) => {
            currentStatusMode = status;
            document.querySelectorAll('.status-switch-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.status === status);
            });
            renderMatchesList(loadedMatchesEvents);
        };

        window.switchMatchesTimeFilter = (time) => {
            currentTimeFilter = time;
            document.querySelectorAll('.time-chip').forEach(c => {
                c.classList.toggle('active', c.dataset.time === time);
            });
            loadMatches(false);
        };


window.loadMatches = loadMatches;
window.switchMatchesStatusMode = switchMatchesStatusMode;
window.switchMatchesTimeFilter = switchMatchesTimeFilter;
window.renderTournamentsBar = renderTournamentsBar;
