// ==================== مركز مباريات الدوريات والبطولات العالمية (SofaScore & Global Live Engine V5) ====================
(function() {
    'use strict';

    // قائمة الدوريات الكبرى والبطولات العالمية مع التغطية الشاملة
    const MAJOR_LEAGUES = [
        // بطولات ودوريات كرة القدم العالمية
        { code: 'all', sport: 'soccer', name: 'كل بطولات كرة القدم (تغطية عالمية شاملة)', shortName: 'الكل', country: 'عالمي', region: 'world', logo: './icon-192.png', flagImg: '' },
        { code: 'uefa.nations', sport: 'soccer', name: 'دوري الأمم الأوروبية (Nations League)', shortName: 'أمم أوروبا', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2288.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.champions', sport: 'soccer', name: 'دوري أبطال أوروبا (Champions League)', shortName: 'دوري الأبطال', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.europa', sport: 'soccer', name: 'الدوري الأوروبي (Europa League)', shortName: 'اليوروبا ليغ', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.europa.conf', sport: 'soccer', name: 'دوري المؤتمر الأوروبي (Conference League)', shortName: 'دوري المؤتمر', country: 'أوروبا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2288.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'eng.1', sport: 'soccer', name: 'الدوري الإنجليزي الممتاز (Premier League)', shortName: 'البريميرليغ', country: 'إنجلترا', region: 'england', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
        { code: 'eng.fa', sport: 'soccer', name: 'كأس الاتحاد الإنجليزي (FA Cup)', shortName: 'كأس إنجلترا', country: 'إنجلترا', region: 'england', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
        { code: 'esp.1', sport: 'soccer', name: 'الدوري الإسباني (LaLiga)', shortName: 'لا ليغا', country: 'إسبانيا', region: 'spain', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png', flagImg: 'https://flagcdn.com/w40/es.png' },
        { code: 'esp.copa_del_rey', sport: 'soccer', name: 'كأس ملك إسبانيا (Copa del Rey)', shortName: 'كأس الملك', country: 'إسبانيا', region: 'spain', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png', flagImg: 'https://flagcdn.com/w40/es.png' },
        { code: 'ita.1', sport: 'soccer', name: 'الدوري الإيطالي (Serie A)', shortName: 'سيريا A', country: 'إيطاليا', region: 'italy', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png', flagImg: 'https://flagcdn.com/w40/it.png' },
        { code: 'ger.1', sport: 'soccer', name: 'الدوري الألماني (Bundesliga)', shortName: 'البوندسليغا', country: 'ألمانيا', region: 'germany', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png', flagImg: 'https://flagcdn.com/w40/de.png' },
        { code: 'fra.1', sport: 'soccer', name: 'الدوري الفرنسي (Ligue 1)', shortName: 'ليغ 1', country: 'فرنسا', region: 'france', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png', flagImg: 'https://flagcdn.com/w40/fr.png' },
        { code: 'ksa.1', sport: 'soccer', name: 'دوري روشن السعودي (Roshn Saudi League)', shortName: 'دوري روشن', country: 'السعودية', region: 'saudi', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2488.png', flagImg: 'https://flagcdn.com/w40/sa.png' },
        { code: 'por.1', sport: 'soccer', name: 'الدوري البرتغالي (Primeira Liga)', shortName: 'البرتغالي', country: 'البرتغال', region: 'portugal', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/14.png', flagImg: 'https://flagcdn.com/w40/pt.png' },
        { code: 'ned.1', sport: 'soccer', name: 'الدوري الهولندي (Eredivisie)', shortName: 'الهولندي', country: 'هولندا', region: 'netherlands', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png', flagImg: 'https://flagcdn.com/w40/nl.png' },
        { code: 'tur.1', sport: 'soccer', name: 'الدوري التركي (Süper Lig)', shortName: 'التركي', country: 'تركيا', region: 'europe', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', flagImg: 'https://flagcdn.com/w40/tr.png' },
        
        // بطولات ودوريات الأمريكتين
        { code: 'col.1', sport: 'soccer', name: 'الدوري الكولومبي (Liga DIMAYOR)', shortName: 'كولومبيا', country: 'كولومبيا', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/650.png', flagImg: 'https://flagcdn.com/w40/co.png' },
        { code: 'bra.1', sport: 'soccer', name: 'الدوري البرازيلي (Brasileirão Serie A)', shortName: 'البرازيل', country: 'البرازيل', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/85.png', flagImg: 'https://flagcdn.com/w40/br.png' },
        { code: 'arg.1', sport: 'soccer', name: 'الدوري الأرجنتيني (Liga Profesional)', shortName: 'الأرجنتين', country: 'الأرجنتين', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1.png', flagImg: 'https://flagcdn.com/w40/ar.png' },
        { code: 'mex.1', sport: 'soccer', name: 'الدوري المكسيكي (Liga BBVA MX)', shortName: 'المكسيك', country: 'المكسيك', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/22.png', flagImg: 'https://flagcdn.com/w40/mx.png' },
        { code: 'usa.1', sport: 'soccer', name: 'الدوري الأمريكي (MLS)', shortName: 'MLS', country: 'الولايات المتحدة', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png', flagImg: 'https://flagcdn.com/w40/us.png' },
        { code: 'conmebol.libertadores', sport: 'soccer', name: 'كوبا ليبرتادوريس (Copa Libertadores)', shortName: 'ليبرتادوريس', country: 'أمريكا الجنوبية', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2684.png', flagImg: 'https://flagcdn.com/w40/ar.png' },
        { code: 'conmebol.sudamericana', sport: 'soccer', name: 'كوبا سود أمريكانا (Sudamericana)', shortName: 'سود أمريكانا', country: 'أمريكا الجنوبية', region: 'americas', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2685.png', flagImg: 'https://flagcdn.com/w40/br.png' },

        // بطولات كرة السلة
        { code: 'all', sport: 'basketball', name: 'كل مباريات كرة السلة (NBA والمحترفين)', shortName: 'الكل', country: 'عالمي', region: 'world', logo: './icon-192.png', flagImg: '' },
        { code: 'nba', sport: 'basketball', name: 'دوري كرة السلة الأمريكي (NBA)', shortName: 'NBA', country: 'الولايات المتحدة', region: 'usa', logo: 'https://a.espncdn.com/i/leaguelogos/nba/500/nba.png', flagImg: 'https://flagcdn.com/w40/us.png' },
        { code: 'mens-college-basketball', sport: 'basketball', name: 'دوري الجامعات الأمريكي (NCAA Basketball)', shortName: 'NCAA', country: 'الولايات المتحدة', region: 'usa', logo: 'https://a.espncdn.com/i/leaguelogos/ncaa/500/ncaa.png', flagImg: 'https://flagcdn.com/w40/us.png' }
    ];

    // قاموس تحسين أسماء البطولات الدولية المجمعة
    const TOURNAMENT_NAME_MAP = {
        'colombian primera a': { name: 'الدوري الكولومبي (Liga DIMAYOR)', country: 'كولومبيا', flag: 'https://flagcdn.com/w40/co.png' },
        'bolivian liga profesional': { name: 'الدوري البوليفي (División Profesional)', country: 'بوليفيا', flag: 'https://flagcdn.com/w40/bo.png' },
        'brazilian serie a': { name: 'الدوري البرازيلي (Brasileirão)', country: 'البرازيل', flag: 'https://flagcdn.com/w40/br.png' },
        'argentine liga profesional de fútbol': { name: 'الدوري الأرجنتيني الممتاز', country: 'الأرجنتين', flag: 'https://flagcdn.com/w40/ar.png' },
        'mexican liga bbva mx': { name: 'الدوري المكسيكي (Liga MX)', country: 'المكسيك', flag: 'https://flagcdn.com/w40/mx.png' },
        'ncaam soccer': { name: 'دوري الجامعات الأمريكي (NCAA)', country: 'الولايات المتحدة', flag: 'https://flagcdn.com/w40/us.png' },
        'ncaaw soccer': { name: 'دوري الجامعات الأمريكي للسيدات', country: 'الولايات المتحدة', flag: 'https://flagcdn.com/w40/us.png' },
        'spanish copa del rey': { name: 'كأس ملك إسبانيا (Copa del Rey)', country: 'إسبانيا', flag: 'https://flagcdn.com/w40/es.png' },
        'english premier league': { name: 'الدوري الإنجليزي الممتاز', country: 'إنجلترا', flag: 'https://flagcdn.com/w40/gb-eng.png' },
        'english fa cup': { name: 'كأس الاتحاد الإنجليزي (FA Cup)', country: 'إنجلترا', flag: 'https://flagcdn.com/w40/gb-eng.png' },
        'spanish laliga': { name: 'الدوري الإسباني (LaLiga)', country: 'إسبانيا', flag: 'https://flagcdn.com/w40/es.png' },
        'italian serie a': { name: 'الدوري الإيطالي (Serie A)', country: 'إيطاليا', flag: 'https://flagcdn.com/w40/it.png' },
        'german bundesliga': { name: 'الدوري الألماني (Bundesliga)', country: 'ألمانيا', flag: 'https://flagcdn.com/w40/de.png' },
        'french ligue 1': { name: 'الدوري الفرنسي (Ligue 1)', country: 'فرنسا', flag: 'https://flagcdn.com/w40/fr.png' },
        'uefa nations league': { name: 'دوري الأمم الأوروبية (Nations League)', country: 'أوروبا', flag: 'https://flagcdn.com/w40/eu.png' },
        'uefa champions league': { name: 'دوري أبطال أوروبا', country: 'أوروبا', flag: 'https://flagcdn.com/w40/eu.png' },
        'saudi professional league': { name: 'دوري روشن السعودي', country: 'السعودية', flag: 'https://flagcdn.com/w40/sa.png' }
    };

    // قاموس مطابقة الدول لأعلامها وأسمائها بالعربية
    const COUNTRY_FLAG_MAP = {
        'colombia': { flag: 'https://flagcdn.com/w40/co.png', ar: 'كولومبيا' },
        'bolivia': { flag: 'https://flagcdn.com/w40/bo.png', ar: 'بوليفيا' },
        'brazil': { flag: 'https://flagcdn.com/w40/br.png', ar: 'البرازيل' },
        'argentina': { flag: 'https://flagcdn.com/w40/ar.png', ar: 'الأرجنتين' },
        'mexico': { flag: 'https://flagcdn.com/w40/mx.png', ar: 'المكسيك' },
        'united states': { flag: 'https://flagcdn.com/w40/us.png', ar: 'الولايات المتحدة' },
        'usa': { flag: 'https://flagcdn.com/w40/us.png', ar: 'الولايات المتحدة' },
        'england': { flag: 'https://flagcdn.com/w40/gb-eng.png', ar: 'إنجلترا' },
        'spain': { flag: 'https://flagcdn.com/w40/es.png', ar: 'إسبانيا' },
        'italy': { flag: 'https://flagcdn.com/w40/it.png', ar: 'إيطاليا' },
        'germany': { flag: 'https://flagcdn.com/w40/de.png', ar: 'ألمانيا' },
        'france': { flag: 'https://flagcdn.com/w40/fr.png', ar: 'فرنسا' },
        'portugal': { flag: 'https://flagcdn.com/w40/pt.png', ar: 'البرتغال' },
        'netherlands': { flag: 'https://flagcdn.com/w40/nl.png', ar: 'هولندا' },
        'turkey': { flag: 'https://flagcdn.com/w40/tr.png', ar: 'تركيا' },
        'saudi arabia': { flag: 'https://flagcdn.com/w40/sa.png', ar: 'السعودية' },
        'costa rica': { flag: 'https://flagcdn.com/w40/cr.png', ar: 'كوستاريكا' },
        'jamaica': { flag: 'https://flagcdn.com/w40/jm.png', ar: 'جامايكا' },
        'paraguay': { flag: 'https://flagcdn.com/w40/py.png', ar: 'باراغواي' },
        'uruguay': { flag: 'https://flagcdn.com/w40/uy.png', ar: 'أوروغواي' },
        'chile': { flag: 'https://flagcdn.com/w40/cl.png', ar: 'تشيلي' },
        'ecuador': { flag: 'https://flagcdn.com/w40/ec.png', ar: 'الإكوادور' },
        'peru': { flag: 'https://flagcdn.com/w40/pe.png', ar: 'بيرو' }
    };

    // الحالة العامة لقسم المباريات والفلاتر
    let currentSport = 'soccer'; // 'soccer' | 'basketball'
    let currentMainView = 'games'; // 'games' | 'leagues'
    let currentStatusMode = 'all'; // 'all' | 'live' | 'pre' | 'post'
    let currentTimeFilter = 'day'; // 'day' | 'all' | '6h' | '12h' | '24h' | '48h' | 'this_week' | 'next_week' | 'last_week' | 'custom'
    let selectedDate = new Date();
    let currentLeague = 'all';
    let customPeriodStart = new Date();
    let customPeriodEnd = new Date(Date.now() + 86400000);

    let loadedMatchesEvents = [];
    let tournamentMatchCounts = new Map();
    let matchResponseCache = new Map();

    // إدارة عداد الدقائق الحي محلياً (Local Live Minute Ticker)
    let liveTickerInterval = null;
    const matchMinutesMap = new Map(); // id -> { baseMinute: number, isExtra: boolean, baseTime: number, originalStr: string }

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
    window.toESPNDate = toESPNDate;

    const isSameDate = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
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
            let url = '';
            if (sport === 'basketball') {
                const sub = (leagueCode === 'all' || leagueCode === 'nba') ? 'nba' : leagueCode;
                url = `https://site.api.espn.com/apis/site/v2/sports/basketball/${sub}/scoreboard`;
            } else {
                const sub = leagueCode === 'all' ? 'all' : leagueCode;
                url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${sub}/scoreboard`;
            }

            if (dateStr) {
                url += `?dates=${dateStr}`;
            }

            const res = await fetch(url);
            if (!res.ok) return [];

            const data = await res.json();
            const knownMeta = MAJOR_LEAGUES.find(l => l.code === leagueCode && l.sport === sport);

            const events = (data.events || []).map(ev => {
                const comp = ev.competitions?.[0] || {};
                let leagueMeta = knownMeta;

                // إذا كانت من الخلاصة العالمية الشاملة (soccer/all)، استخرج اسم وهوية البطولة الحقيقية
                if (!leagueMeta || leagueCode === 'all') {
                    const rawNote = (comp.altGameNote || ev.season?.slug || ev.league?.name || '').toLowerCase();
                    let mapped = null;
                    for (const [key, val] of Object.entries(TOURNAMENT_NAME_MAP)) {
                        if (rawNote.includes(key) || key.includes(rawNote)) {
                            mapped = val;
                            break;
                        }
                    }

                    const rawCountry = (comp.venue?.address?.country || '').toLowerCase();
                    const cInfo = COUNTRY_FLAG_MAP[rawCountry];

                    const resolvedName = mapped ? mapped.name : (comp.altGameNote || ev.season?.slug || ev.league?.name || 'بطولة رياضية دولية');
                    const resolvedCountry = mapped ? mapped.country : (cInfo ? cInfo.ar : (comp.venue?.address?.country || 'دولي'));
                    const resolvedFlag = mapped ? mapped.flag : (cInfo ? cInfo.flag : 'https://flagcdn.com/w40/un.png');

                    leagueMeta = {
                        name: resolvedName,
                        shortName: resolvedName,
                        country: resolvedCountry,
                        logo: './icon-192.png',
                        flagImg: resolvedFlag
                    };
                }

                return {
                    ...ev,
                    sport,
                    leagueCode: ev.leagueCode || leagueCode,
                    leagueMeta
                };
            });

            const hasLive = events.some(e => e.status?.type?.state === 'in');
            const ttl = hasLive ? 25000 : 240000;
            matchResponseCache.set(cacheKey, { data: events, timestamp: now, ttl });
            return events;
        } catch (err) {
            return [];
        }
    };

    // نظام تحديث الدقائق الحية محلياً في بطاقات المباريات (Live Minute Ticker Engine)
    const initLiveMinuteTicker = () => {
        if (liveTickerInterval) clearInterval(liveTickerInterval);

        liveTickerInterval = setInterval(() => {
            const liveCards = document.querySelectorAll('.match-card.is-live');
            if (liveCards.length === 0) return;

            const now = Date.now();
            liveCards.forEach(card => {
                const eventId = card.dataset.eventId;
                if (!eventId || !matchMinutesMap.has(eventId)) return;

                const track = matchMinutesMap.get(eventId);
                if (track.isSpecial) return; // HT, FT, Postponed

                const elapsedMinutes = Math.floor((now - track.baseTime) / 60000);
                if (elapsedMinutes <= 0) return;

                let currentMinute = track.baseMinute + elapsedMinutes;

                // القيود المنطقية لأوقات كرة القدم
                if (track.baseMinute <= 45 && currentMinute > 45) {
                    currentMinute = 45; // انتظار إعلان الوقت بدل الضائع أو الاستراحة
                } else if (track.baseMinute > 45 && currentMinute > 90) {
                    currentMinute = 90;
                }

                const displayStr = track.isExtra ? track.originalStr : `${currentMinute}'`;

                // تحديث نص الشارة العلوية
                const badgeEl = card.querySelector('.status-live .live-min-text');
                if (badgeEl) badgeEl.textContent = displayStr;

                // تحديث التسمية الفرعية أسفل النتيجة
                const subLabel = card.querySelector('.status-sub-label.live-label .live-min-sub');
                if (subLabel) subLabel.textContent = displayStr;
            });
        }, 30000); // فحص وتحديث كل 30 ثانية لضمان الدقة
    };

    // تحليل الدقيقة من نص ESPN المباشر
    const parseMinuteDetail = (eventId, detailStr) => {
        const raw = (detailStr || '').trim();
        const now = Date.now();

        if (!raw || raw.toLowerCase().includes('ht') || raw.toLowerCase().includes('half') || raw.toLowerCase().includes('ft')) {
            matchMinutesMap.set(eventId, { isSpecial: true, originalStr: raw });
            return raw;
        }

        // استخراج الرقم (مثلاً '38 أو 38' أو 90+2')
        const match = raw.match(/(\d+)/);
        if (match) {
            const minNum = parseInt(match[1], 10);
            const isExtra = raw.includes('+');
            matchMinutesMap.set(eventId, {
                baseMinute: minNum,
                isExtra,
                baseTime: now,
                originalStr: raw,
                isSpecial: false
            });
        } else {
            matchMinutesMap.set(eventId, { isSpecial: true, originalStr: raw });
        }

        return raw;
    };

    // تنسيق وعرض التاريخ في شريط تصفح الأيام بأسلوب SofaScore (< اليوم >)
    const formatDateNavLabel = (d) => {
        const today = new Date();
        const isToday = isSameDate(d, today);

        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        const isYest = isSameDate(d, yest);

        const tmr = new Date(today);
        tmr.setDate(tmr.getDate() + 1);
        const isTmr = isSameDate(d, tmr);

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
                'all': 'كل المواعيد المتاحة',
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
        // إزالة فلتر المباشر تماماً عند تغيير التاريخ لأن المباشر خاص باليوم فقط
        currentStatusMode = 'all';
        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.remove('active');
        document.querySelectorAll('.sofa-live-pill, .status-switch-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        selectedDate = new Date(selectedDate.getTime() + delta * 86400000);
        updateDateNavDisplay();
        loadMatches(false);
    };

    window.jumpToToday = () => {
        currentTimeFilter = 'day';
        currentStatusMode = 'all';
        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.remove('active');
        document.querySelectorAll('.sofa-live-pill, .status-switch-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        selectedDate = new Date();
        updateDateNavDisplay();
        loadMatches(false);
    };

    window.selectDayDate = (d) => {
        currentTimeFilter = 'day';
        currentStatusMode = 'all';
        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.remove('active');
        document.querySelectorAll('.sofa-live-pill, .status-switch-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        selectedDate = new Date(d);
        updateDateNavDisplay();
        loadMatches(false);
    };

    window.applyCustomPeriod = (start, end) => {
        customPeriodStart = new Date(start);
        customPeriodEnd = new Date(end);
        currentTimeFilter = 'custom';
        currentStatusMode = 'all';
        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.remove('active');
        updateDateNavDisplay();
        loadMatches(true);
    };

    window.showAllAvailableMatches = () => {
        currentTimeFilter = 'all';
        currentStatusMode = 'all';
        currentLeague = 'all';
        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.remove('active');
        updateDateNavDisplay();
        loadMatches(false);
        showToast('🌐 تم عرض كل المواعيد المتاحة');
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
            renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
        }
    };

    // التبديل بين الرياضات (كرة القدم / كرة السلة)
    window.switchSport = (sport) => {
        currentSport = sport;
        window.currentSport = sport;
        currentLeague = 'all';
        window.currentLeague = 'all';
        document.querySelectorAll('.sofa-sport-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sport === sport);
        });

        const titleEl = document.getElementById('homeMatchesTitle');
        if (titleEl) {
            titleEl.textContent = sport === 'basketball'
                ? 'مركز مباريات كرة السلة (NBA والمحترفين)'
                : 'مركز المباريات';
        }

        loadMatches(true);
    };

    // إظهار وإخفاء شريط البحث المنبثق
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
                renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
            }
        }
    };

    // فتح وإغلاق نافذة التصفية المتقدمة (Filter Sheet)
    window.openFilterSheet = () => {
        const modal = document.getElementById('matchesFilterSheetModal');
        if (!modal) return;

        modal.querySelectorAll('.filter-chip-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.time === currentTimeFilter);
        });
        modal.querySelectorAll('.filter-status-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.status === currentStatusMode);
        });

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
        if (selectLeague) {
            currentLeague = selectLeague.value;
            window.currentLeague = currentLeague;
        }

        const dot = document.getElementById('filterActiveDot');
        const isCustom = currentTimeFilter !== 'day' || currentStatusMode !== 'all' || currentLeague !== 'all';
        if (dot) dot.style.display = isCustom ? 'inline-block' : 'none';

        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.toggle('active', currentStatusMode === 'live');

        closeFilterSheet();
        updateDateNavDisplay();
        loadMatches(false);
        showToast('✓ تم تطبيق الفلاتر بنجاح');
    };

    window.resetFilterSheet = () => {
        currentTimeFilter = 'day';
        selectedDate = new Date();
        currentStatusMode = 'all';
        currentLeague = 'all';
        window.currentLeague = 'all';

        const dot = document.getElementById('filterActiveDot');
        if (dot) dot.style.display = 'none';

        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBtn) liveBtn.classList.remove('active');

        closeFilterSheet();
        updateDateNavDisplay();
        loadMatches(false);
        showToast('↺ تم إعادة ضبط الفلاتر');
    };

    // جلب المباريات الشامل مع الفصل الذكي للتواريخ ودعم التغذية العالمية الحية LIVE
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
                <div style="font-weight: 800; font-size: 0.88rem;">جاري جلب وفحص جدول المباريات...</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">تحديث مباشر من سيرفرات الرياضة العالمية</div>
            </div>
        `;

        const relevantLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport && l.code !== 'all');
        const targetLeagues = currentLeague === 'all'
            ? relevantLeagues.map(l => l.code)
            : [currentLeague];

        const tasks = [];
        const isViewingToday = isSameDate(selectedDate, new Date());

        // 1. في كرة القدم:
        if (currentSport === 'soccer') {
            if (currentTimeFilter === 'day') {
                const dStr = toESPNDate(selectedDate);
                // إذا كنا نشاهد اليوم: نجلب الخلاصة العالمية الحية بدون تاريخ لضمان التقاط أي مباراة جارية الآن
                if (isViewingToday) {
                    tasks.push(fetchLeagueScoreboard('soccer', 'all', null));
                }
                tasks.push(fetchLeagueScoreboard('soccer', 'all', dStr));
            } else if (currentTimeFilter === 'all' || currentTimeFilter === '6h' || currentTimeFilter === '12h' || currentTimeFilter === '24h') {
                tasks.push(fetchLeagueScoreboard('soccer', 'all', null));
            }
        } else if (currentSport === 'basketball') {
            tasks.push(fetchLeagueScoreboard('basketball', 'nba', null));
            tasks.push(fetchLeagueScoreboard('basketball', 'mens-college-basketball', null));
            if (currentTimeFilter === 'day') {
                const dStr = toESPNDate(selectedDate);
                tasks.push(fetchLeagueScoreboard('basketball', 'nba', dStr));
                tasks.push(fetchLeagueScoreboard('basketball', 'mens-college-basketball', dStr));
            }
        }

        // 2. جلب الدوريات المحددة أو الدوريات الكبرى
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

            let rawEvents = Array.from(uniqueMap.values());

            // عزل المباريات المباشرة عن التواريخ السابقة والقادمة:
            // إن كان المستخدم يتصفح يوماً غير "اليوم" (أمس، غداً، تاريخ ماضي)، نستبعد أي مباراة مباشرة جارية اليوم
            if (currentTimeFilter === 'day' && !isViewingToday) {
                const targetDayStr = toESPNDate(selectedDate);
                rawEvents = rawEvents.filter(ev => {
                    const evDStr = toESPNDate(new Date(ev.date));
                    return evDStr === targetDayStr && ev.status?.type?.state !== 'in';
                });
            }

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

            // تصدير الحالة العامة للوحدات الأخرى
            window.loadedMatchesEvents = loadedMatchesEvents;
            window.currentSport = currentSport;
            window.currentLeague = currentLeague;

            // تحديث عدادات المباريات للبطولات
            tournamentMatchCounts.clear();
            loadedMatchesEvents.forEach(ev => {
                const c = ev.leagueCode || 'unknown';
                tournamentMatchCounts.set(c, (tournamentMatchCounts.get(c) || 0) + 1);
            });

            // تحديث شارة المباريات المباشرة وحالة زر المباشر
            const liveCount = loadedMatchesEvents.filter(ev => ev.status?.type?.state === 'in').length;
            const liveBadge = document.getElementById('liveStatusBadge');
            const livePulse = document.getElementById('homeLivePulse');
            const liveBtn = document.getElementById('statusBtnLive');
            if (liveBadge) liveBadge.textContent = liveCount;
            if (livePulse) livePulse.style.display = liveCount > 0 ? 'inline-block' : 'none';
            if (liveBtn) liveBtn.classList.toggle('active', currentStatusMode === 'live');

            // خاصية التحويل التلقائي الذكي عند خلو مباريات اليوم:
            // إن فتح المستخدم التطبيق على "اليوم" ولم تكن هناك مباريات لليوم (وليس في وضع فلترة المباشر)، يتم التحويل تلقائياً لكل المواعيد المتاحة
            if (currentTimeFilter === 'day' && isViewingToday && loadedMatchesEvents.length === 0 && currentStatusMode !== 'live') {
                currentTimeFilter = 'all';
                updateDateNavDisplay();
                loadMatches(false);
                return;
            }

            renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
            initLiveMinuteTicker();
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

                <div class="sofa-league-row ${currentLeague === 'all' ? 'active' : ''}" onclick="selectLeagueFromDirectory('all')">
                    <div class="sofa-league-info">
                        <span class="sofa-country-icon">🌐</span>
                        <div class="sofa-league-names">
                            <span class="sofa-league-main-name">جميع البطولات والدوريات</span>
                            <span class="sofa-league-sub-name">تغطية شاملة لكل المباريات المباشرة والنتائج</span>
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
        window.currentLeague = leagueCode;
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
            renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
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

        const list = Array.isArray(events) ? events : (loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
        let filtered = [...list];

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
            if (currentStatusMode === 'live') {
                container.innerHTML = `
                    <div class="match-loading-card" style="padding: 24px 16px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">🔴</div>
                        <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">لا توجد مباريات جارية الآن مباشرة (LIVE)</div>
                        <div style="font-size: 0.74rem; color: var(--text-muted); margin: 6px auto 14px auto; max-width: 320px; line-height: 1.5;">
                            لا توجد مباريات ملعوبة في هذه اللحظة، يمكنك تصفح جدول مباريات اليوم أو المواعيد القادمة.
                        </div>
                        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                            <button type="button" class="match-refresh-btn" onclick="toggleLiveFilter('all')" style="padding: 7px 14px;">
                                <i class="fa-solid fa-calendar-day"></i> عرض جميع مباريات اليوم
                            </button>
                            <button type="button" class="match-refresh-btn" onclick="showAllAvailableMatches()" style="padding: 7px 14px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
                                <i class="fa-solid fa-list-ul"></i> كل المواعيد المتاحة
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="match-loading-card" style="padding: 24px 16px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">⚽</div>
                    <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">لا توجد مباريات مطابقة للخيارات المحددة</div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin: 6px auto 14px auto; max-width: 320px; line-height: 1.5;">
                        ${query ? 'جرب البحث باسم فريق آخر أو مسح حقل البحث' : 'يمكنك التبديل إلى يوم آخر بالأسهم في الأعلى أو استعراض كل المواعيد المتاحة.'}
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <button type="button" class="match-refresh-btn" onclick="showAllAvailableMatches()" style="padding: 7px 14px;">
                            <i class="fa-solid fa-list-ul"></i> عرض كل المواعيد المتاحة
                        </button>
                        <button type="button" class="match-refresh-btn" onclick="jumpToToday()" style="padding: 7px 14px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
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

        let html = '';

        // 1. إذا تم اختيار فلتر "مباشر" حصراً، نعرض المباريات المباشرة مقسمة حسب الدوريات بقوائم مفتوحة
        if (currentStatusMode === 'live') {
            html += `
                <div class="live-section-banner" style="margin-bottom: 10px;">
                    <div style="display:flex; align-items:center; gap:7px;">
                        <span class="live-dot-pulse"></span>
                        <span>مباريات جارية الآن مباشرة (LIVE)</span>
                    </div>
                    <span style="direction:ltr;">${filtered.length} Live</span>
                </div>
            `;

            const liveLeagueGroups = {};
            filtered.forEach(ev => {
                const lKey = ev.leagueMeta?.name || ev.leagueCode || 'unknown';
                if (!liveLeagueGroups[lKey]) {
                    liveLeagueGroups[lKey] = {
                        meta: ev.leagueMeta || { name: 'بطولة رياضية', country: 'دولي' },
                        matches: []
                    };
                }
                liveLeagueGroups[lKey].matches.push(ev);
            });

            let tIdx = 0;
            for (const grp of Object.values(liveLeagueGroups)) {
                html += renderTournamentGroup(grp, `liveTournCard_${tIdx++}`, false);
            }
            container.innerHTML = html;
            return;
        }

        // 2. عرض المباريات في اليوم المحدد مقسمة حسب الدوريات والبلدان بقوائم منسدلة مفتوحة
        if (currentTimeFilter === 'day') {
            const leagueGroups = {};
            filtered.forEach(ev => {
                const lKey = ev.leagueMeta?.name || ev.leagueCode || 'unknown';
                if (!leagueGroups[lKey]) {
                    leagueGroups[lKey] = {
                        meta: ev.leagueMeta || { name: 'بطولة رياضية', country: 'دولي' },
                        matches: []
                    };
                }
                leagueGroups[lKey].matches.push(ev);
            });

            const tournEntries = Object.entries(leagueGroups);

            if (tournEntries.length > 1) {
                html += `
                    <div class="tourn-groups-toolbar">
                        <span class="tourn-summary">
                            <i class="fa-solid fa-trophy"></i> ${tournEntries.length} دوريات (${filtered.length} مباراة)
                        </span>
                        <div class="tourn-toggle-btns">
                            <button type="button" class="btn-group-toggle" onclick="toggleAllTournGroups(false)" title="فتح وتوسيع جميع الدوريات">
                                <i class="fa-solid fa-angles-down"></i> توسيع الكل
                            </button>
                            <button type="button" class="btn-group-toggle" onclick="toggleAllTournGroups(true)" title="طي جميع الدوريات">
                                <i class="fa-solid fa-angles-up"></i> طي الكل
                            </button>
                        </div>
                    </div>
                `;
            }

            let tIdx = 0;
            for (const [, grp] of tournEntries) {
                html += renderTournamentGroup(grp, `tournCard_${tIdx++}`, false);
            }
        } else {
            // 3. وضع التواريخ المتعددة مع نظام الطي والفتح الذكي وتقسيم الدوريات داخل كل يوم
            const dayGroups = {};
            filtered.forEach(ev => {
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
                            <i class="fa-regular fa-calendar-days"></i> ${dayEntries.length} أيام (${filtered.length} مباراة)
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

            const DEFAULT_MATCHES_THRESHOLD = 15;
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

                // تقسيم مباريات كل يوم حسب البطولات والدوريات بقوائم منسدلة
                const dayLeagueGroups = {};
                matches.forEach(ev => {
                    const lKey = ev.leagueMeta?.name || ev.leagueCode || 'unknown';
                    if (!dayLeagueGroups[lKey]) {
                        dayLeagueGroups[lKey] = {
                            meta: ev.leagueMeta || { name: 'بطولة رياضية', country: 'دولي' },
                            matches: []
                        };
                    }
                    dayLeagueGroups[lKey].matches.push(ev);
                });

                let dayCardsHtml = '';
                let dTournIdx = 0;
                for (const grp of Object.values(dayLeagueGroups)) {
                    dayCardsHtml += renderTournamentGroup(grp, `dayTournCard_${index}_${dTournIdx++}`, false);
                }

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

    function buildMatchCardHTML(ev) {
        const comp = ev.competitions?.[0] || {};
        const competitors = comp.competitors || [];
        const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
        const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

        const state = ev.status?.type?.state; // 'pre', 'in', 'post'
        const isLive = state === 'in';
        const isFinished = state === 'post';
        const rawDetail = ev.status?.type?.detail || '';
        const statusDetail = isLive ? parseMinuteDetail(ev.id, rawDetail) : rawDetail;

        const homeScore = parseInt(home.score, 10);
        const awayScore = parseInt(away.score, 10);
        const hasScores = !isNaN(homeScore) && !isNaN(awayScore);

        const homeWon = isFinished && hasScores && (homeScore > awayScore);
        const awayWon = isFinished && hasScores && (awayScore > homeScore);

        const rLower = rawDetail.toLowerCase();
        let preStatusText = '-';
        let postStatusText = 'FT';

        if (rLower.includes('postponed')) {
            preStatusText = 'مؤجلة';
            postStatusText = 'مؤجلة';
        } else if (rLower.includes('cancel')) {
            preStatusText = 'ملغاة';
            postStatusText = 'ملغاة';
        } else if (rLower.includes('aet')) {
            postStatusText = 'AET';
        } else if (rLower.includes('pen')) {
            postStatusText = 'PEN';
        }

        const homeLogo = home.team?.logo || './icon-192.png';
        const awayLogo = away.team?.logo || './icon-192.png';
        const homeName = home.team?.displayName || home.team?.name || 'المضيف';
        const awayName = away.team?.displayName || away.team?.name || 'الضيف';

        // 1. عمود التوقيت والدقائق (يسار)
        const matchTime = formatMatchTime(ev.date);
        let statusBottomHtml = '';

        if (isLive) {
            statusBottomHtml = `<span class="sofa-row-live-min">${statusDetail || 'مباشر'}</span>`;
        } else if (isFinished) {
            statusBottomHtml = `<span class="sofa-row-post-text">${postStatusText}</span>`;
        } else if (preStatusText !== '-') {
            statusBottomHtml = `<span class="sofa-row-postponed">${preStatusText}</span>`;
        } else {
            statusBottomHtml = `<span class="sofa-row-sched-dash">-</span>`;
        }

        // 2. عمود النتيجة (يمين)
        let homeScoreHtml = '';
        let awayScoreHtml = '';
        if (hasScores) {
            const liveCls = isLive ? 'score-live' : '';
            homeScoreHtml = `<span class="sofa-row-score ${liveCls} ${homeWon ? 'score-winner' : (awayWon ? 'score-loser' : '')}">${homeScore}</span>`;
            awayScoreHtml = `<span class="sofa-row-score ${liveCls} ${awayWon ? 'score-winner' : (homeWon ? 'score-loser' : '')}">${awayScore}</span>`;
        } else if (isLive) {
            homeScoreHtml = `<span class="sofa-row-score score-live">0</span>`;
            awayScoreHtml = `<span class="sofa-row-score score-live">0</span>`;
        } else {
            homeScoreHtml = `<span class="sofa-row-score score-pre">-</span>`;
            awayScoreHtml = `<span class="sofa-row-score score-pre">-</span>`;
        }

        const safeHomeName = (homeName || '').replace(/'/g, "\\'");

        return `
            <div class="sofa-match-row ${isLive ? 'is-live-row' : ''}" 
                 data-event-id="${ev.id}" 
                 onclick="openMatchStats('${ev.id}', '${ev.leagueCode || currentLeague}')" 
                 role="button" 
                 tabindex="0"
                 title="انقر لعرض تفاصيل وإحصائيات وحاسبة المباراة">
                
                <!-- عمود الوقت والدقيقة (يسار) -->
                <div class="sofa-row-time-col">
                    <span class="sofa-row-time">${matchTime}</span>
                    <div class="sofa-row-status">${statusBottomHtml}</div>
                </div>

                <!-- عمود الفريقين رأسياً (وسط) -->
                <div class="sofa-row-teams-col">
                    <div class="sofa-row-team ${homeWon ? 'is-winner' : (awayWon ? 'is-loser' : '')}">
                        <img src="${homeLogo}" alt="" class="sofa-row-crest" loading="lazy" onerror="this.src='./icon-192.png'">
                        <span class="sofa-row-team-name">${homeName}</span>
                    </div>
                    <div class="sofa-row-team ${awayWon ? 'is-winner' : (homeWon ? 'is-loser' : '')}">
                        <img src="${awayLogo}" alt="" class="sofa-row-crest" loading="lazy" onerror="this.src='./icon-192.png'">
                        <span class="sofa-row-team-name">${awayName}</span>
                    </div>
                </div>

                <!-- عمود النتيجة (يمين) -->
                <div class="sofa-row-scores-col">
                    ${homeScoreHtml}
                    ${awayScoreHtml}
                </div>

                <!-- أيقونة التنبيهات (أقصى اليمين) -->
                <div class="sofa-row-action-col">
                    <button type="button" class="sofa-row-bell-btn" title="تنبيهات المباراة" onclick="event.stopPropagation(); showToast('🔔 تم ضبط التنبيه لمباراة ${safeHomeName}');">
                        <i class="fa-regular fa-bell"></i>
                    </button>
                </div>
            </div>
        `;
    }

    function renderTournamentGroup(grp, tournId, isCollapsed = false) {
        const isFav = favoriteLeagues.has(grp.matches[0]?.leagueCode);
        const logoImg = grp.meta.logo
            ? `<img src="${grp.meta.logo}" class="sofa-tourn-logo" alt="" onerror="this.style.display='none'">`
            : '';
        const flagImg = grp.meta.flagImg
            ? `<img src="${grp.meta.flagImg}" class="sofa-tourn-flag" alt="" onerror="this.style.display='none'">`
            : '';

        let matchesHtml = '';
        grp.matches.forEach(ev => {
            matchesHtml += buildMatchCardHTML(ev);
        });

        return `
            <div class="sofa-tournament-card ${isCollapsed ? 'is-collapsed' : ''}" id="${tournId}">
                <div class="sofa-tourn-header" onclick="toggleTournGroup('${tournId}')" role="button" tabindex="0" aria-expanded="${!isCollapsed}" title="انقر لطي أو فتح مباريات هذه البطولة">
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
                                onclick="event.stopPropagation(); toggleFavoriteLeague('${grp.matches[0]?.leagueCode || tournId}')" 
                                title="${isFav ? 'إزالة من المفضلة' : 'تثبيت في المفضلة'}">
                            <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                        </button>
                        <i class="fa-solid fa-chevron-down sofa-tourn-chevron"></i>
                    </div>
                </div>
                <div class="sofa-tourn-matches">
                    ${matchesHtml}
                </div>
            </div>
        `;
    }

    window.toggleTournGroup = (tournId) => {
        const card = document.getElementById(tournId);
        if (!card) return;
        card.classList.toggle('is-collapsed');
        const header = card.querySelector('.sofa-tourn-header');
        if (header) {
            const isCollapsed = card.classList.contains('is-collapsed');
            header.setAttribute('aria-expanded', !isCollapsed);
        }
    };

    window.toggleAllTournGroups = (collapse = true) => {
        document.querySelectorAll('.sofa-tournament-card').forEach(card => {
            card.classList.toggle('is-collapsed', collapse);
            card.querySelector('.sofa-tourn-header')?.setAttribute('aria-expanded', !collapse);
        });
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

    let lastToggleLiveTime = 0;
    window.toggleLiveFilter = (forceMode) => {
        const now = Date.now();
        if (!forceMode && (now - lastToggleLiveTime < 180)) return;
        lastToggleLiveTime = now;

        const btn = document.getElementById('statusBtnLive');
        if (typeof forceMode === 'string') {
            currentStatusMode = forceMode;
        } else {
            currentStatusMode = (currentStatusMode === 'live') ? 'all' : 'live';
        }

        const isLive = (currentStatusMode === 'live');
        if (btn) {
            btn.classList.toggle('active', isLive);
        }

        if (isLive) {
            const isViewingToday = isSameDate(selectedDate, new Date());
            if (!isViewingToday || currentTimeFilter !== 'day') {
                selectedDate = new Date();
                currentTimeFilter = 'day';
                updateDateNavDisplay();
                loadMatches(true);
                return;
            }

            // إذا تم تفعيل فلتر مباشر ولكن لا توجد أي مباريات مباشرة في الذاكرة حالياً، نجلب التحديث فوراً
            const hasLiveInMemory = (loadedMatchesEvents || []).some(ev => ev.status?.type?.state === 'in');
            if (!hasLiveInMemory) {
                loadMatches(true);
                return;
            }
        }

        renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
    };

    // الربط والتصدير الخارجي
    window.loadMatches = loadMatches;
    window.renderMatchesList = renderMatchesList;
    window.buildMatchCardHTML = buildMatchCardHTML;
    window.MAJOR_LEAGUES = MAJOR_LEAGUES;
    window.getSelectedDate = () => selectedDate;
})();
