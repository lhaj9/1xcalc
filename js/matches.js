// ==================== مركز مباريات الدوريات والبطولات العالمية (SofaScore Engine V3) ====================
(function() {
    'use strict';

    const MAJOR_LEAGUES = [
        // بطولات ودوريات كرة القدم
        { code: 'all', sport: 'soccer', name: 'كل بطولات كرة القدم', shortName: 'الكل', country: 'عالمي', region: 'world', logo: './icon-192.png', flagImg: '' },
        { code: 'uefa.nations', sport: 'soccer', name: 'دوري الأمم الأوروبية (Nations League)', shortName: 'أمم أوروبا', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2288.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.champions', sport: 'soccer', name: 'دوري أبطال أوروبا (Champions League)', shortName: 'دوري الأبطال', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'eng.1', sport: 'soccer', name: 'الدوري الإنجليزي الممتاز (Premier League)', shortName: 'البريميرليغ', country: 'إنجلترا', region: 'england', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
        { code: 'esp.1', sport: 'soccer', name: 'الدوري الإسباني (LaLiga)', shortName: 'لا ليغا', country: 'إسبانيا', region: 'spain', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png', flagImg: 'https://flagcdn.com/w40/es.png' },
        { code: 'ita.1', sport: 'soccer', name: 'الدوري الإيطالي (Serie A)', shortName: 'سيريا A', country: 'إيطاليا', region: 'italy', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png', flagImg: 'https://flagcdn.com/w40/it.png' },
        { code: 'ger.1', sport: 'soccer', name: 'الدوري الألماني (Bundesliga)', shortName: 'البوندسليغا', country: 'ألمانيا', region: 'germany', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png', flagImg: 'https://flagcdn.com/w40/de.png' },
        { code: 'fra.1', sport: 'soccer', name: 'الدوري الفرنسي (Ligue 1)', shortName: 'ليغ 1', country: 'فرنسا', region: 'france', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png', flagImg: 'https://flagcdn.com/w40/fr.png' },
        { code: 'uefa.europa', sport: 'soccer', name: 'الدوري الأوروبي (Europa League)', shortName: 'اليوروبا ليغ', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'ksa.1', sport: 'soccer', name: 'دوري روشن السعودي', shortName: 'دوري روشن', country: 'السعودية', region: 'saudi', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2488.png', flagImg: 'https://flagcdn.com/w40/sa.png' },
        { code: 'por.1', sport: 'soccer', name: 'الدوري البرتغالي (Primeira Liga)', shortName: 'البرتغالي', country: 'البرتغال', region: 'portugal', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/14.png', flagImg: 'https://flagcdn.com/w40/pt.png' },
        { code: 'ned.1', sport: 'soccer', name: 'الدوري الهولندي (Eredivisie)', shortName: 'الهولندي', country: 'هولندا', region: 'netherlands', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png', flagImg: 'https://flagcdn.com/w40/nl.png' },

        // بطولات ودوريات كرة السلة
        { code: 'all', sport: 'basketball', name: 'كل مباريات كرة السلة', shortName: 'الكل', country: 'عالمي', region: 'world', logo: './icon-192.png', flagImg: '' },
        { code: 'nba', sport: 'basketball', name: 'دوري كرة السلة الأمريكي (NBA)', shortName: 'NBA', country: 'الولايات المتحدة', region: 'usa', logo: 'https://a.espncdn.com/i/leaguelogos/nba/500/nba.png', flagImg: 'https://flagcdn.com/w40/us.png' }
    ];

    // الحالة العامة لقسم المباريات والفلاتر بنظام SofaScore
    let currentSport = 'soccer'; // 'soccer' | 'basketball'
    let currentMainView = 'games'; // 'games' (المباريات) | 'leagues' (البطولات)
    let currentStatusMode = 'all'; // 'all' | 'live' | 'pre' | 'post'
    let currentTimeFilter = 'day'; // 'day' | 'all' | '6h' | '12h' | '24h' | '48h' | 'this_week' | 'next_week' | 'last_week' | 'custom'
    let selectedDate = new Date();
    let currentLeague = 'all';
    let customPeriodStart = new Date();
    let customPeriodEnd = new Date();
    let activeSelectingBound = 'start';
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

    // تنسيق وعرض التاريخ في شريط تصفح الأيام بأسلوب SofaScore (< اليوم >)
    const formatDateNavLabel = (d) => {
        const today = new Date();
        const isToday = d.toDateString() === today.toDateString();

        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        const isYest = d.toDateString() === yest.toDateString();

        const tmr = new Date(today);
        tmr.setDate(tmr.getDate() + 1);
        const isTmr = d.toDateString() === tmr.toDateString();

        if (isToday) return 'اليوم';
        if (isYest) return 'أمس';
        if (isTmr) return 'غداً';

        try {
            return d.toLocaleDateString('ar-MA', { weekday: 'short', day: 'numeric', month: 'short' });
        } catch {
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }
    };

    const updateDateNavDisplay = () => {
        const labelEl = document.getElementById('currentDateNavLabel');
        if (!labelEl) return;
        if (currentTimeFilter === 'day') {
            labelEl.textContent = formatDateNavLabel(selectedDate);
        } else {
            const timeFilterLabels = {
                'all': 'كل المواعيد',
                '6h': 'خلال 6 ساعات',
                '12h': 'خلال 12 ساعة',
                '24h': 'خلال 24 ساعة',
                '48h': 'خلال 48 ساعة',
                'this_week': 'الأسبوع الحالي',
                'next_week': 'الأسبوع القادم',
                'last_week': 'نتائج سابقة',
                'custom': 'فترة مخصصة'
            };
            labelEl.textContent = timeFilterLabels[currentTimeFilter] || formatDateNavLabel(selectedDate);
        }
    };

    // التنقل اليومي بالأسهم (< >)
    window.navigateDay = (delta) => {
        currentTimeFilter = 'day';
        selectedDate = new Date(selectedDate.getTime() + delta * 86400000);
        updateDateNavDisplay();
        loadMatches(false);
    };

    window.jumpToToday = () => {
        currentTimeFilter = 'day';
        selectedDate = new Date();
        updateDateNavDisplay();
        loadMatches(false);
    };

    window.selectDayDate = (d) => {
        currentTimeFilter = 'day';
        selectedDate = new Date(d);
        updateDateNavDisplay();
        loadMatches(false);
    };

    // التبديل بين واجهة المباريات (GAMES) ودليل الدوريات (LEAGUES)
    window.switchMainView = (view) => {
        currentMainView = view;
        document.querySelectorAll('.sofa-view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        const gamesCtrl = document.getElementById('sofaGamesControlRow');
        if (gamesCtrl) {
            gamesCtrl.style.display = view === 'games' ? 'flex' : 'none';
        }

        if (view === 'leagues') {
            renderLeaguesDirectory();
        } else {
            renderMatchesList(loadedMatchesEvents);
        }
    };

    // التبديل بين الرياضات (كرة القدم / كرة السلة)
    window.switchSport = (sport) => {
        currentSport = sport;
        currentLeague = 'all';
        document.querySelectorAll('.sofa-sport-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sport === sport);
        });

        const titleEl = document.getElementById('homeMatchesTitle');
        if (titleEl) {
            titleEl.textContent = sport === 'basketball'
                ? 'مركز مباريات كرة السلة (NBA)'
                : 'مركز المباريات';
        }

        loadMatches(true);
    };

    // إظهار وإخفاء شريط البحث المنبثق الأنيق
    window.toggleSearchOverlay = (show) => {
        const overlay = document.getElementById('sofaSearchExpandable');
        const input = document.getElementById('matchSearchInput');
        const btn = document.getElementById('btnToggleSearch');
        if (!overlay) return;

        const isVisible = overlay.style.display !== 'none';
        const targetState = (show !== undefined) ? show : !isVisible;

        if (targetState) {
            overlay.style.display = 'block';
            btn?.classList.add('active');
            setTimeout(() => input?.focus(), 60);
        } else {
            overlay.style.display = 'none';
            btn?.classList.remove('active');
            if (input && input.value) {
                input.value = '';
                const clearBtn = document.getElementById('matchSearchClearBtn');
                if (clearBtn) clearBtn.style.display = 'none';
                renderMatchesList(loadedMatchesEvents);
            }
        }
    };

    // فتح وإغلاق نافذة التصفية المتقدمة (Filter Sheet)
    window.openFilterSheet = () => {
        const modal = document.getElementById('matchesFilterSheetModal');
        if (!modal) return;

        // تحديث حالة الأزرار داخل النافذة
        modal.querySelectorAll('.filter-chip-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.time === currentTimeFilter);
        });
        modal.querySelectorAll('.filter-status-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.status === currentStatusMode);
        });

        // تعبئة قائمة الدوريات
        const selectEl = document.getElementById('filterLeagueSelect');
        if (selectEl) {
            const sportLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport);
            let opts = '';
            sportLeagues.forEach(l => {
                opts += `<option value="${l.code}" ${l.code === currentLeague ? 'selected' : ''}>${l.name}</option>`;
            });
            selectEl.innerHTML = opts;
        }

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    window.closeFilterSheet = () => {
        const modal = document.getElementById('matchesFilterSheetModal');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    window.applyFilterSheet = () => {
        const modal = document.getElementById('matchesFilterSheetModal');
        if (!modal) return;

        const activeTimeBtn = modal.querySelector('.filter-chip-btn.active');
        const activeStatusBtn = modal.querySelector('.filter-status-btn.active');
        const selectLeague = document.getElementById('filterLeagueSelect');

        if (activeTimeBtn) currentTimeFilter = activeTimeBtn.dataset.time;
        if (activeStatusBtn) currentStatusMode = activeStatusBtn.dataset.status;
        if (selectLeague) currentLeague = selectLeague.value;

        // تحديث نقطة التصفية النشطة
        const dot = document.getElementById('filterActiveDot');
        const isCustom = currentTimeFilter !== 'day' || currentStatusMode !== 'all' || currentLeague !== 'all';
        if (dot) dot.style.display = isCustom ? 'inline-block' : 'none';

        closeFilterSheet();
        updateDateNavDisplay();
        loadMatches(false);
        showToast('✓ تم تطبيق الفلاتر المحددة بنجاح');
    };

    window.resetFilterSheet = () => {
        currentTimeFilter = 'day';
        selectedDate = new Date();
        currentStatusMode = 'all';
        currentLeague = 'all';

        const dot = document.getElementById('filterActiveDot');
        if (dot) dot.style.display = 'none';

        closeFilterSheet();
        updateDateNavDisplay();
        loadMatches(false);
        showToast('↺ تم إعادة ضبط الفلاتر');
    };

    // جلب المباريات الشامل
    const loadMatches = async (forceRefresh = false) => {
        const container = document.getElementById('homeMatchesContainer');
        if (!container) return;

        if (forceRefresh) {
            matchResponseCache.clear();
        }

        updateDateNavDisplay();

        if (currentMainView === 'leagues') {
            renderLeaguesDirectory();
            return;
        }

        container.innerHTML = `
            <div class="match-loading-card">
                <div class="match-spinner"></div>
                <div style="font-weight: 800; font-size: 0.88rem;">جاري جلب وفحص جدول المباريات المباشرة...</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">تحديث مباشر وشامل من مصادر الرياضة العالمية</div>
            </div>
        `;

        const relevantLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport && l.code !== 'all');
        const targetLeagues = currentLeague === 'all'
            ? relevantLeagues.map(l => l.code)
            : [currentLeague];

        const tasks = [];

        if (currentTimeFilter === 'day') {
            const dStr = toESPNDate(selectedDate);
            targetLeagues.forEach(lCode => {
                tasks.push(fetchLeagueScoreboard(currentSport, lCode, dStr));
            });
        } else if (currentTimeFilter === 'custom') {
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
            // all / 6h / 12h / 24h / 48h:
            targetLeagues.forEach(lCode => {
                tasks.push(fetchLeagueScoreboard(currentSport, lCode, null));
            });
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

            // حساب عدد المباريات لكل بطولة
            tournamentMatchCounts.clear();
            loadedMatchesEvents.forEach(ev => {
                const c = ev.leagueCode || 'unknown';
                tournamentMatchCounts.set(c, (tournamentMatchCounts.get(c) || 0) + 1);
            });

            const liveCount = loadedMatchesEvents.filter(ev => ev.status?.type?.state === 'in').length;
            const liveBadge = document.getElementById('liveStatusBadge');
            const livePulse = document.getElementById('homeLivePulse');
            if (liveBadge) liveBadge.textContent = liveCount;
            if (livePulse) livePulse.style.display = liveCount > 0 ? 'inline-block' : 'none';

            renderMatchesList(loadedMatchesEvents);
        } catch (e) {
            container.innerHTML = `
                <div class="match-loading-card">
                    <div style="font-size:1.5rem; margin-bottom:6px;">⚠️</div>
                    <div style="font-weight:800; font-size:0.88rem;">تعذر جلب جدول المباريات</div>
                    <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">يرجى التحقق من اتصال الإنترنت، ثم المحاولة ثانية.</div>
                    <button type="button" class="match-refresh-btn" onclick="loadMatches(true)" style="margin-top:10px;">إعادة المحاولة</button>
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

    // عرض دليل الدوريات والبطولات (SofaScore LEAGUES Tab)
    const renderLeaguesDirectory = () => {
        const container = document.getElementById('homeMatchesContainer');
        if (!container) return;

        const sportLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport && l.code !== 'all');

        let html = `
            <div class="sofa-leagues-dir">
                <div class="sofa-leagues-header">
                    <div style="font-weight:900; font-size:0.92rem; color:var(--text-main); display:flex; align-items:center; gap:7px;">
                        <i class="fa-solid fa-trophy" style="color:var(--accent-primary);"></i>
                        <span>قائمة الدوريات والبطولات</span>
                    </div>
                    <span style="font-size:0.74rem; color:var(--text-muted); font-weight:800;">${sportLeagues.length} بطولة</span>
                </div>

                <!-- زر عرض كل البطولات -->
                <div class="sofa-league-row ${currentLeague === 'all' ? 'active' : ''}" onclick="selectLeagueFromDirectory('all')">
                    <div class="sofa-league-info">
                        <span class="sofa-country-icon">🌐</span>
                        <div class="sofa-league-names">
                            <span class="sofa-league-main-name">جميع البطولات والدوريات</span>
                            <span class="sofa-league-sub-name">عرض شامل لكل المباريات والنتائج</span>
                        </div>
                    </div>
                    <div class="sofa-league-meta">
                        <span class="sofa-league-count-badge">${loadedMatchesEvents.length}</span>
                        <i class="fa-solid fa-chevron-left sofa-league-arrow"></i>
                    </div>
                </div>
        `;

        sportLeagues.forEach(league => {
            const count = tournamentMatchCounts.get(league.code) || 0;
            const isFav = favoriteLeagues.has(league.code);
            const isSelected = currentLeague === league.code;

            const logoImg = league.logo
                ? `<img src="${league.logo}" class="sofa-league-thumb" alt="" onerror="this.style.display='none'">`
                : '';
            const flagImg = league.flagImg
                ? `<img src="${league.flagImg}" class="sofa-country-flag" alt="" onerror="this.style.display='none'">`
                : `<span class="sofa-country-icon">⚽</span>`;

            html += `
                <div class="sofa-league-row ${isSelected ? 'active' : ''}" onclick="selectLeagueFromDirectory('${league.code}')">
                    <div class="sofa-league-info">
                        ${logoImg || flagImg}
                        <div class="sofa-league-names">
                            <span class="sofa-league-main-name">${league.name}</span>
                            <span class="sofa-league-sub-name">${league.country || 'دولي'}</span>
                        </div>
                    </div>
                    <div class="sofa-league-meta">
                        <span class="sofa-league-count-badge">${count}</span>
                        <button type="button" class="sofa-star-btn ${isFav ? 'is-fav' : ''}" 
                                onclick="event.stopPropagation(); toggleFavoriteLeague('${league.code}')" 
                                title="${isFav ? 'إزالة من المفضلة' : 'تثبيت في المفضلة'}">
                            <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                        </button>
                        <i class="fa-solid fa-chevron-left sofa-league-arrow"></i>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    };

    window.selectLeagueFromDirectory = (leagueCode) => {
        currentLeague = leagueCode;
        switchMainView('games');
        loadMatches(false);
    };

    window.toggleFavoriteLeague = (leagueCode) => {
        if (favoriteLeagues.has(leagueCode)) {
            favoriteLeagues.delete(leagueCode);
            showToast('⭐ تمت الإزالة من المفضلة');
        } else {
            favoriteLeagues.add(leagueCode);
            showToast('⭐ تمت الإضافة للمفضلة');
        }
        saveFavoriteLeagues();
        if (currentMainView === 'leagues') {
            renderLeaguesDirectory();
        } else {
            renderMatchesList(loadedMatchesEvents);
        }
    };

    // رسم وعرض المباريات في واجهة GAMES
    const renderMatchesList = (events) => {
        const container = document.getElementById('homeMatchesContainer');
        if (!container) return;

        if (currentMainView === 'leagues') {
            renderLeaguesDirectory();
            return;
        }

        let filtered = [...events];

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
                const leagueName = (ev.leagueMeta?.name || '').toLowerCase();
                return title.includes(query) || home.includes(query) || away.includes(query) || leagueName.includes(query);
            });
        }

        // 3. تصفية بالزمن السريع (6h, 12h, 24h, 48h)
        const nowMs = Date.now();
        const hoursMap = { '6h': 6, '12h': 12, '24h': 24, '48h': 48 };
        if (hoursMap[currentTimeFilter]) {
            const limitMs = nowMs + (hoursMap[currentTimeFilter] * 3600 * 1000);
            filtered = filtered.filter(ev => {
                const mTime = new Date(ev.date).getTime();
                return (ev.status?.type?.state === 'in') || (mTime >= (nowMs - 3600000) && mTime <= limitMs);
            });
        }

        // 4. تصفية بنوع الحالة (مباشر / قادمة / منتهية / الكل)
        if (currentStatusMode === 'live') {
            filtered = filtered.filter(ev => ev.status?.type?.state === 'in');
        } else if (currentStatusMode === 'pre') {
            filtered = filtered.filter(ev => ev.status?.type?.state === 'pre');
        } else if (currentStatusMode === 'post') {
            filtered = filtered.filter(ev => ev.status?.type?.state === 'post');
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="match-loading-card" style="padding: 24px 16px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">⚽</div>
                    <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">لا توجد مباريات مطابقة للخيارات المحددة</div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin: 6px auto 14px auto; max-width: 320px; line-height: 1.5;">
                        ${query ? 'جرب البحث باسم فريق آخر أو مسح حقل البحث' : 'يمكنك التبديل إلى يوم آخر بالأسهم في الأعلى أو استعراض جميع المواعيد المتاحة.'}
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <button type="button" class="match-refresh-btn" onclick="jumpToToday()" style="padding: 7px 14px;">
                            <i class="fa-solid fa-calendar-day"></i> الانتقال إلى اليوم
                        </button>
                        <button type="button" class="match-refresh-btn" onclick="resetFilterSheet()" style="padding: 7px 14px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
                            <i class="fa-solid fa-rotate-left"></i> إعادة ضبط الفلاتر
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const liveMatches = filtered.filter(ev => ev.status?.type?.state === 'in');
        const otherMatches = filtered.filter(ev => ev.status?.type?.state !== 'in');

        let html = '';

        // إذا كان هناك مباريات جارية الآن مباشرة (LIVE Banner)
        if (liveMatches.length > 0 && currentStatusMode !== 'post') {
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

        // عرض المباريات إما حسب البطولة في اليوم المحدد (SofaScore Day Mode) أو حسب الأيام في المدى المفتوح
        if (currentTimeFilter === 'day') {
            // تجميع المباريات حسب البطولات والدوريات (SofaScore Style Tournament Cards)
            const leagueGroups = {};
            otherMatches.forEach(ev => {
                const lCode = ev.leagueCode || 'unknown';
                if (!leagueGroups[lCode]) {
                    leagueGroups[lCode] = {
                        meta: ev.leagueMeta || { name: 'بطولة رياضية', country: 'دولي' },
                        matches: []
                    };
                }
                leagueGroups[lCode].matches.push(ev);
            });

            for (const [lCode, grp] of Object.entries(leagueGroups)) {
                const isFav = favoriteLeagues.has(lCode);
                const logoImg = grp.meta.logo
                    ? `<img src="${grp.meta.logo}" class="sofa-tourn-logo" alt="" onerror="this.style.display='none'">`
                    : '';
                const flagImg = grp.meta.flagImg
                    ? `<img src="${grp.meta.flagImg}" class="sofa-tourn-flag" alt="" onerror="this.style.display='none'">`
                    : '';

                html += `
                    <div class="sofa-tournament-card">
                        <div class="sofa-tourn-header">
                            <div class="sofa-tourn-title-wrap">
                                ${logoImg || flagImg}
                                <div class="sofa-tourn-titles">
                                    <span class="sofa-tourn-name">${grp.meta.name}</span>
                                    <span class="sofa-tourn-country">${grp.meta.country || 'دولي'}</span>
                                </div>
                            </div>
                            <div class="sofa-tourn-meta">
                                <span class="sofa-tourn-count">${grp.matches.length} مباريات</span>
                                <button type="button" class="sofa-star-btn ${isFav ? 'is-fav' : ''}" 
                                        onclick="event.stopPropagation(); toggleFavoriteLeague('${lCode}')" 
                                        title="${isFav ? 'إزالة من المفضلة' : 'تثبيت في المفضلة'}">
                                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                                </button>
                            </div>
                        </div>
                        <div class="sofa-tourn-matches">
                `;

                grp.matches.forEach(ev => {
                    html += buildMatchCardHTML(ev);
                });

                html += `
                        </div>
                    </div>
                `;
            }
        } else {
            // وضع التواريخ المتعددة (الأسبوع الحالي/القادم/النتائج) مع نظام الطي والفتح الذكي
            const dayGroups = {};
            otherMatches.forEach(ev => {
                const d = new Date(ev.date);
                const dayKey = d.toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                if (!dayGroups[dayKey]) dayGroups[dayKey] = [];
                dayGroups[dayKey].push(ev);
            });

            const dayEntries = Object.entries(dayGroups);

            if (dayEntries.length > 1) {
                html += `
                    <div class="day-groups-toolbar">
                        <span class="day-groups-summary">
                            <i class="fa-regular fa-calendar-days"></i> ${dayEntries.length} أيام (${otherMatches.length} مباراة)
                        </span>
                        <div class="day-groups-toggle-btns">
                            <button type="button" class="btn-group-toggle" onclick="toggleAllDayGroups(false)" title="فتح وتوسيع جميع الأيام">
                                <i class="fa-solid fa-angles-down"></i> توسيع الكل
                            </button>
                            <button type="button" class="btn-group-toggle" onclick="toggleAllDayGroups(true)" title="طي جميع الأيام">
                                <i class="fa-solid fa-angles-up"></i> طي الكل
                            </button>
                        </div>
                    </div>
                `;
            }

            const DEFAULT_MATCHES_THRESHOLD = 10;
            let accumulatedOpenMatches = 0;
            const hasActiveSearch = Boolean(query);

            dayEntries.forEach(([dayTitle, matches], index) => {
                const dayId = `dayGroup_${index}`;
                let isCollapsed = false;

                if (hasActiveSearch) {
                    isCollapsed = false;
                } else if (index === 0) {
                    isCollapsed = false;
                    accumulatedOpenMatches += matches.length;
                } else {
                    if (accumulatedOpenMatches < DEFAULT_MATCHES_THRESHOLD) {
                        isCollapsed = false;
                        accumulatedOpenMatches += matches.length;
                    } else {
                        isCollapsed = true;
                    }
                }

                let dayCardsHtml = '';
                matches.forEach(ev => {
                    dayCardsHtml += buildMatchCardHTML(ev);
                });

                html += `
                    <div class="day-group-section ${isCollapsed ? 'is-collapsed' : ''}" id="${dayId}">
                        <div class="day-group-header" 
                             onclick="toggleDayGroup('${dayId}')" 
                             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleDayGroup('${dayId}');}"
                             role="button" 
                             tabindex="0" 
                             aria-expanded="${!isCollapsed}"
                             title="انقر لطي أو فتح مباريات هذا التاريخ">
                            <div class="day-group-title">
                                <span class="day-group-icon">📅</span>
                                <span>${dayTitle}</span>
                            </div>
                            <div class="day-group-meta">
                                <span class="day-group-badge">${matches.length} مباريات</span>
                                <i class="fa-solid fa-chevron-down day-group-chevron"></i>
                            </div>
                        </div>
                        <div class="day-group-body">
                            ${dayCardsHtml}
                        </div>
                    </div>
                `;
            });
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
                    <button type="button" class="btn-match-action btn-copy-title" onclick="event.stopPropagation(); copyMatchTitle('${matchTitle.replace(/'/g, "\\'")}')" title="نسخ اسم المباراة">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <button type="button" class="btn-match-action btn-calc-direct" onclick="event.stopPropagation(); transferMatchToCalc('${matchTitle.replace(/'/g, "\\'")}', '${isLive ? 'delayed' : 'arbitrage'}')" title="فتح وحساب صفقة في الحاسبة مباشرة">
                        <i class="fa-solid fa-bolt"></i>
                        <span>حساب الصفقة ⚡</span>
                    </button>
                    <button type="button" class="btn-match-action btn-stats-view" onclick="event.stopPropagation(); openMatchStats('${ev.id}', '${ev.leagueCode || currentLeague}')" title="عرض الإحصائيات">
                        <i class="fa-solid fa-chart-simple"></i>
                        <span>الإحصائيات</span>
                    </button>
                    ${venueName ? `<span class="match-venue-tag" title="الملعب"><i class="fa-solid fa-location-dot"></i> ${venueName}</span>` : ''}
                </div>
            </div>
        `;
    };

    window.transferMatchToCalc = (matchTitle, mode = 'arbitrage') => {
        const input1 = document.getElementById('tab1SlipName');
        const input2 = document.getElementById('tab2SlipName');
        if (input1) input1.value = matchTitle;
        if (input2) input2.value = matchTitle;

        if (typeof window.switchTab === 'function') {
            window.switchTab('tabCalc');
        }

        const btnModeArbitrage = document.getElementById('btnModeArbitrage');
        const btnModeDelayed = document.getElementById('btnModeDelayed');
        if (mode === 'delayed' && btnModeDelayed) {
            btnModeDelayed.click();
        } else if (btnModeArbitrage) {
            btnModeArbitrage.click();
        }

        showToast(`⚡ تم نقل [${matchTitle}] إلى الحاسبة!`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.copyMatchTitle = (matchTitle) => {
        navigator.clipboard.writeText(matchTitle).then(() => {
            showToast(`📋 تم نسخ: ${matchTitle}`);
        });
    };

    window.toggleDayGroup = (dayId) => {
        const section = document.getElementById(dayId);
        if (!section) return;
        section.classList.toggle('is-collapsed');
        const isCollapsed = section.classList.contains('is-collapsed');
        const header = section.querySelector('.day-group-header');
        if (header) {
            header.setAttribute('aria-expanded', !isCollapsed);
        }
    };

    window.toggleAllDayGroups = (collapse = true) => {
        document.querySelectorAll('.day-group-section').forEach(sec => {
            if (collapse) {
                sec.classList.add('is-collapsed');
                sec.querySelector('.day-group-header')?.setAttribute('aria-expanded', 'false');
            } else {
                sec.classList.remove('is-collapsed');
                sec.querySelector('.day-group-header')?.setAttribute('aria-expanded', 'true');
            }
        });
    };

    // الربط الخارجي
    window.loadMatches = loadMatches;
    window.renderMatchesList = renderMatchesList;
    window.MAJOR_LEAGUES = MAJOR_LEAGUES;
})();
