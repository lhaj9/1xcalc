// ==================== مركز مباريات الدوريات والبطولات العالمية (SofaScore & Global Live Engine V5) ====================
(function() {
    'use strict';

    // قائمة الدوريات الكبرى والبطولات العالمية مع التغطية الشاملة
    const MAJOR_LEAGUES = [
        // خيار التغطية العالمية الشاملة
        { code: 'all', sport: 'soccer', name: 'كل بطولات كرة القدم (تغطية عالمية شاملة)', shortName: 'الكل', country: 'عالمي', region: 'world', category: 'all', logo: '', flagImg: '' },

        // === 1. البطولات القارية والدولية (Continental & International) ===
        { code: 'caf.champions', sport: 'soccer', name: 'دوري أبطال إفريقيا (CAF Champions League)', shortName: 'أبطال إفريقيا', country: 'إفريقيا', region: 'africa', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2391.png', flagImg: 'https://flagcdn.com/w40/un.png' },
        { code: 'caf.confed', sport: 'soccer', name: 'كأس الكونفيدرالية الإفريقية (CAF Confed)', shortName: 'الكونفيدرالية', country: 'إفريقيا', region: 'africa', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2391.png', flagImg: 'https://flagcdn.com/w40/un.png' },
        { code: 'caf.nations', sport: 'soccer', name: 'كأس الأمم الإفريقية (AFCON)', shortName: 'أمم إفريقيا', country: 'إفريقيا', region: 'africa', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/76.png', flagImg: 'https://flagcdn.com/w40/un.png' },
        { code: 'afc.champions', sport: 'soccer', name: 'دوري أبطال آسيا للنخبة (AFC Champions League Elite)', shortName: 'أبطال آسيا', country: 'آسيا', region: 'asia', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2200.png', flagImg: 'https://flagcdn.com/w40/un.png' },
        { code: 'uefa.champions', sport: 'soccer', name: 'دوري أبطال أوروبا (Champions League)', shortName: 'دوري الأبطال', country: 'أوروبا', region: 'europe', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.europa', sport: 'soccer', name: 'الدوري الأوروبي (Europa League)', shortName: 'اليوروبا ليغ', country: 'أوروبا', region: 'europe', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.europa.conf', sport: 'soccer', name: 'دوري المؤتمر الأوروبي (Conference League)', shortName: 'دوري المؤتمر', country: 'أوروبا', region: 'europe', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/20296.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'uefa.nations', sport: 'soccer', name: 'دوري الأمم الأوروبية (Nations League)', shortName: 'أمم أوروبا', country: 'أوروبا', region: 'europe', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2395.png', flagImg: 'https://flagcdn.com/w40/eu.png' },
        { code: 'fifa.world', sport: 'soccer', name: 'كأس العالم (FIFA World Cup)', shortName: 'المونديال', country: 'دولي', region: 'world', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/4.png', flagImg: 'https://flagcdn.com/w40/un.png' },
        { code: 'fifa.cwc', sport: 'soccer', name: 'كأس العالم للأندية (Club World Cup)', shortName: 'مونديال الأندية', country: 'دولي', region: 'world', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1932.png', flagImg: 'https://flagcdn.com/w40/un.png' },
        { code: 'conmebol.libertadores', sport: 'soccer', name: 'كوبا ليبرتادوريس (Copa Libertadores)', shortName: 'ليبرتادوريس', country: 'أمريكا الجنوبية', region: 'americas', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/58.png', flagImg: 'https://flagcdn.com/w40/ar.png' },
        { code: 'conmebol.sudamericana', sport: 'soccer', name: 'كوبا سود أمريكانا (Sudamericana)', shortName: 'سود أمريكانا', country: 'أمريكا الجنوبية', region: 'americas', category: 'continental', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1208.png', flagImg: 'https://flagcdn.com/w40/br.png' },

        // === 2. الدوريات الأوروبية والعالمية (Domestic Leagues) ===
        { code: 'eng.1', sport: 'soccer', name: 'الدوري الإنجليزي الممتاز (Premier League)', shortName: 'البريميرليغ', country: 'إنجلترا', region: 'england', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
        { code: 'eng.2', sport: 'soccer', name: 'دوري البطولة الإنجليزية (Championship)', shortName: 'التشامبيونشيب', country: 'إنجلترا', region: 'england', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/24.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
        { code: 'eng.fa', sport: 'soccer', name: 'كأس الاتحاد الإنجليزي (FA Cup)', shortName: 'كأس إنجلترا', country: 'إنجلترا', region: 'england', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/40.png', flagImg: 'https://flagcdn.com/w40/gb-eng.png' },
        { code: 'esp.1', sport: 'soccer', name: 'الدوري الإسباني (LaLiga)', shortName: 'لا ليغا', country: 'إسبانيا', region: 'spain', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png', flagImg: 'https://flagcdn.com/w40/es.png' },
        { code: 'esp.2', sport: 'soccer', name: 'الدوري الإسباني الدرجة الثانية (Segunda)', shortName: 'سيغوندا', country: 'إسبانيا', region: 'spain', category: 'domestic', logo: 'http://a.espncdn.com/i/leaguelogos/soccer/500/107.png', flagImg: 'https://flagcdn.com/w40/es.png' },
        { code: 'esp.copa_del_rey', sport: 'soccer', name: 'كأس ملك إسبانيا (Copa del Rey)', shortName: 'كأس الملك', country: 'إسبانيا', region: 'spain', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/80.png', flagImg: 'https://flagcdn.com/w40/es.png' },
        { code: 'ita.1', sport: 'soccer', name: 'الدوري الإيطالي (Serie A)', shortName: 'سيريا A', country: 'إيطاليا', region: 'italy', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png', flagImg: 'https://flagcdn.com/w40/it.png' },
        { code: 'ger.1', sport: 'soccer', name: 'الدوري الألماني (Bundesliga)', shortName: 'البوندسليغا', country: 'ألمانيا', region: 'germany', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png', flagImg: 'https://flagcdn.com/w40/de.png' },
        { code: 'ger.2', sport: 'soccer', name: 'الدوري الألماني الدرجة الثانية (2. Bundesliga)', shortName: 'البوندسليغا 2', country: 'ألمانيا', region: 'germany', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/97.png', flagImg: 'https://flagcdn.com/w40/de.png' },
        { code: 'fra.1', sport: 'soccer', name: 'الدوري الفرنسي (Ligue 1)', shortName: 'ليغ 1', country: 'فرنسا', region: 'france', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png', flagImg: 'https://flagcdn.com/w40/fr.png' },
        { code: 'por.1', sport: 'soccer', name: 'الدوري البرتغالي (Primeira Liga)', shortName: 'البرتغالي', country: 'البرتغال', region: 'portugal', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/14.png', flagImg: 'https://flagcdn.com/w40/pt.png' },
        { code: 'ned.1', sport: 'soccer', name: 'الدوري الهولندي (Eredivisie)', shortName: 'الهولندي', country: 'هولندا', region: 'netherlands', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png', flagImg: 'https://flagcdn.com/w40/nl.png' },
        { code: 'tur.1', sport: 'soccer', name: 'الدوري التركي (Süper Lig)', shortName: 'التركي', country: 'تركيا', region: 'europe', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/18.png', flagImg: 'https://flagcdn.com/w40/tr.png' },
        { code: 'sco.1', sport: 'soccer', name: 'الدوري الاسكتلندي (Premiership)', shortName: 'الاسكتلندي', country: 'اسكتلندا', region: 'scotland', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/45.png', flagImg: 'https://flagcdn.com/w40/gb-sct.png' },
        { code: 'ksa.1', sport: 'soccer', name: 'دوري روشن السعودي (Roshn Saudi League)', shortName: 'دوري روشن', country: 'السعودية', region: 'saudi', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2488.png', flagImg: 'https://flagcdn.com/w40/sa.png' },
        { code: 'usa.1', sport: 'soccer', name: 'الدوري الأمريكي (MLS)', shortName: 'MLS', country: 'الولايات المتحدة', region: 'americas', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png', flagImg: 'https://flagcdn.com/w40/us.png' },
        { code: 'bra.1', sport: 'soccer', name: 'الدوري البرازيلي (Brasileirão Serie A)', shortName: 'البرازيل', country: 'البرازيل', region: 'americas', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/85.png', flagImg: 'https://flagcdn.com/w40/br.png' },
        { code: 'arg.1', sport: 'soccer', name: 'الدوري الأرجنتيني (Liga Profesional)', shortName: 'الأرجنتين', country: 'الأرجنتين', region: 'americas', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1.png', flagImg: 'https://flagcdn.com/w40/ar.png' },
        { code: 'mex.1', sport: 'soccer', name: 'الدوري المكسيكي (Liga BBVA MX)', shortName: 'المكسيك', country: 'المكسيك', region: 'americas', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/22.png', flagImg: 'https://flagcdn.com/w40/mx.png' },
        { code: 'col.1', sport: 'soccer', name: 'الدوري الكولومبي (Liga DIMAYOR)', shortName: 'كولومبيا', country: 'كولومبيا', region: 'americas', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1543.png', flagImg: 'https://flagcdn.com/w40/co.png' },
        { code: 'rus.1', sport: 'soccer', name: 'الدوري الروسي الممتاز (Russian Premier)', shortName: 'الدوري الروسي', country: 'روسيا', region: 'europe', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/106.png', flagImg: 'https://flagcdn.com/w40/ru.png' },
        { code: 'aus.1', sport: 'soccer', name: 'الدوري الأسترالي (A-League)', shortName: 'الدوري الأسترالي', country: 'أستراليا', region: 'asia', category: 'domestic', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1308.png', flagImg: 'https://flagcdn.com/w40/au.png' },

        // === 3. بطولات كرة السلة ===
        { code: 'all', sport: 'basketball', name: 'كل مباريات كرة السلة (NBA والمحترفين)', shortName: 'الكل', country: 'عالمي', region: 'world', category: 'all', logo: '', flagImg: '' },
        { code: 'nba', sport: 'basketball', name: 'دوري كرة السلة الأمريكي (NBA)', shortName: 'NBA', country: 'الولايات المتحدة', region: 'usa', category: 'domestic', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png', flagImg: 'https://flagcdn.com/w40/us.png' },
        { code: 'mens-college-basketball', sport: 'basketball', name: 'دوري الجامعات الأمريكي (NCAA Basketball)', shortName: 'NCAA', country: 'الولايات المتحدة', region: 'usa', category: 'domestic', logo: 'https://a.espncdn.com/redesign/assets/img/icons/NCAASports_MensBasketball.png', flagImg: 'https://flagcdn.com/w40/us.png' }
    ];

    // قاموس تحسين أسماء وشعارات وأعلام البطولات الدولية المجمعة
    const TOURNAMENT_NAME_MAP = {
        'caf champions league': { name: 'دوري أبطال إفريقيا (CAF Champions League)', country: 'إفريقيا', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2391.png' },
        'caf confederation cup': { name: 'كأس الكونفيدرالية الإفريقية (CAF Confed)', country: 'إفريقيا', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2391.png' },
        'africa cup of nations': { name: 'كأس الأمم الإفريقية (AFCON)', country: 'إفريقيا', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/76.png' },
        'afc champions league elite': { name: 'دوري أبطال آسيا للنخبة (AFC Champions League Elite)', country: 'آسيا', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2200.png' },
        'afc champions league': { name: 'دوري أبطال آسيا للنخبة', country: 'آسيا', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2200.png' },
        'fifa club world cup': { name: 'كأس العالم للأندية (Club World Cup)', country: 'دولي', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1932.png' },
        'fifa world cup': { name: 'كأس العالم (FIFA World Cup)', country: 'دولي', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/4.png' },
        'scottish premiership': { name: 'الدوري الاسكتلندي (Premiership)', country: 'اسكتلندا', flag: 'https://flagcdn.com/w40/gb-sct.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/45.png' },
        'spanish laliga 2': { name: 'الدوري الإسباني الدرجة الثانية (Segunda)', country: 'إسبانيا', flag: 'https://flagcdn.com/w40/es.png', logo: 'http://a.espncdn.com/i/leaguelogos/soccer/500/107.png' },
        'colombian primera a': { name: 'الدوري الكولومبي (Liga DIMAYOR)', country: 'كولومبيا', flag: 'https://flagcdn.com/w40/co.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1543.png' },
        'bolivian liga profesional': { name: 'الدوري البوليفي (División Profesional)', country: 'بوليفيا', flag: 'https://flagcdn.com/w40/bo.png', logo: '' },
        'brazilian serie a': { name: 'الدوري البرازيلي (Brasileirão)', country: 'البرازيل', flag: 'https://flagcdn.com/w40/br.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/85.png' },
        'argentine liga profesional de fútbol': { name: 'الدوري الأرجنتيني الممتاز', country: 'الأرجنتين', flag: 'https://flagcdn.com/w40/ar.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1.png' },
        'mexican liga bbva mx': { name: 'الدوري المكسيكي (Liga MX)', country: 'المكسيك', flag: 'https://flagcdn.com/w40/mx.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/22.png' },
        'ncaam soccer': { name: 'دوري الجامعات الأمريكي (NCAA)', country: 'الولايات المتحدة', flag: 'https://flagcdn.com/w40/us.png', logo: 'https://a.espncdn.com/redesign/assets/img/icons/NCAASports_MensBasketball.png' },
        'ncaaw soccer': { name: 'دوري الجامعات الأمريكي للسيدات', country: 'الولايات المتحدة', flag: 'https://flagcdn.com/w40/us.png', logo: '' },
        'spanish copa del rey': { name: 'كأس ملك إسبانيا (Copa del Rey)', country: 'إسبانيا', flag: 'https://flagcdn.com/w40/es.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/80.png' },
        'english premier league': { name: 'الدوري الإنجليزي الممتاز (Premier League)', country: 'إنجلترا', flag: 'https://flagcdn.com/w40/gb-eng.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png' },
        'english fa cup': { name: 'كأس الاتحاد الإنجليزي (FA Cup)', country: 'إنجلترا', flag: 'https://flagcdn.com/w40/gb-eng.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/40.png' },
        'english league championship': { name: 'دوري البطولة الإنجليزية (Championship)', country: 'إنجلترا', flag: 'https://flagcdn.com/w40/gb-eng.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/24.png' },
        'spanish laliga': { name: 'الدوري الإسباني (LaLiga)', country: 'إسبانيا', flag: 'https://flagcdn.com/w40/es.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png' },
        'italian serie a': { name: 'الدوري الإيطالي (Serie A)', country: 'إيطاليا', flag: 'https://flagcdn.com/w40/it.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png' },
        'german bundesliga': { name: 'الدوري الألماني (Bundesliga)', country: 'ألمانيا', flag: 'https://flagcdn.com/w40/de.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png' },
        'french ligue 1': { name: 'الدوري الفرنسي (Ligue 1)', country: 'فرنسا', flag: 'https://flagcdn.com/w40/fr.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png' },
        'uefa nations league': { name: 'دوري الأمم الأوروبية (Nations League)', country: 'أوروبا', flag: 'https://flagcdn.com/w40/eu.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2395.png' },
        'uefa champions league': { name: 'دوري أبطال أوروبا (Champions League)', country: 'أوروبا', flag: 'https://flagcdn.com/w40/eu.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png' },
        'saudi professional league': { name: 'دوري روشن السعودي (Roshn Saudi League)', country: 'السعودية', flag: 'https://flagcdn.com/w40/sa.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2488.png' }
    };

    // قاموس مطابقة الدول لأعلامها وأسمائها بالعربية
    const COUNTRY_FLAG_MAP = {
        'morocco': { flag: 'https://flagcdn.com/w40/ma.png', ar: 'المغرب' },
        'egypt': { flag: 'https://flagcdn.com/w40/eg.png', ar: 'مصر' },
        'algeria': { flag: 'https://flagcdn.com/w40/dz.png', ar: 'الجزائر' },
        'tunisia': { flag: 'https://flagcdn.com/w40/tn.png', ar: 'تونس' },
        'scotland': { flag: 'https://flagcdn.com/w40/gb-sct.png', ar: 'اسكتلندا' },
        'africa': { flag: 'https://flagcdn.com/w40/un.png', ar: 'إفريقيا' },
        'asia': { flag: 'https://flagcdn.com/w40/un.png', ar: 'آسيا' },
        'world': { flag: 'https://flagcdn.com/w40/un.png', ar: 'دولي' },
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
        'peru': { flag: 'https://flagcdn.com/w40/pe.png', ar: 'بيرو' },
        'russia': { flag: 'https://flagcdn.com/w40/ru.png', ar: 'روسيا' },
        'australia': { flag: 'https://flagcdn.com/w40/au.png', ar: 'أستراليا' }
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

    // إدارة المباريات المفضلة والمثبتة في الأعلى (Pinned Matches)
    let favoriteMatches = new Set();
    try {
        const savedPinned = JSON.parse(localStorage.getItem('arb_pinned_matches') || '[]');
        if (Array.isArray(savedPinned)) {
            savedPinned.forEach(id => favoriteMatches.add(String(id)));
        }
    } catch {}

    const saveFavoriteMatches = () => {
        try {
            localStorage.setItem('arb_pinned_matches', JSON.stringify(Array.from(favoriteMatches)));
        } catch {}
    };

    window.toggleFavoriteMatch = (matchId) => {
        const sId = String(matchId);
        if (favoriteMatches.has(sId)) {
            favoriteMatches.delete(sId);
            showToast('📌 تم إلغاء تثبيت المباراة');
        } else {
            favoriteMatches.add(sId);
            showToast('📌 تم تثبيت المباراة في الأعلى');
        }
        saveFavoriteMatches();
        renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
    };

    window.clearAllFavoriteMatches = () => {
        favoriteMatches.clear();
        saveFavoriteMatches();
        renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
        showToast('📌 تم إلغاء تثبيت جميع المباريات');
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

    // قاموس تحويل معرّفات ESPN الرقمية والسلاسل إلى الأكواد المعيارية للبطولات (Canonical League Mapper)
    const ESPN_ID_TO_CODE = {
        '700': 'eng.1',
        '23': 'eng.1',
        '3914': 'eng.2',
        '24': 'eng.2',
        '8097': 'eng.w.1',
        '40': 'eng.fa',
        '740': 'esp.1',
        '15': 'esp.1',
        '80': 'esp.copa_del_rey',
        '20956': 'esp.w.1',
        '730': 'ita.1',
        '12': 'ita.1',
        '720': 'ger.1',
        '10': 'ger.1',
        '3927': 'ger.2',
        '97': 'ger.2',
        '710': 'fra.1',
        '9': 'fra.1',
        '20922': 'uefa.nations',
        '2395': 'uefa.nations',
        '2': 'uefa.champions',
        '2310': 'uefa.europa',
        '20296': 'uefa.europa.conf',
        '3946': 'tur.1',
        '18': 'tur.1',
        '3906': 'por.1',
        '14': 'por.1',
        '3901': 'ned.1',
        '11': 'ned.1',
        '3939': 'rus.1',
        '106': 'rus.1',
        '2488': 'ksa.1',
        '770': 'usa.1',
        '19': 'usa.1',
        '1308': 'aus.1',
        '20955': 'bra.1',
        '85': 'bra.1',
        '1': 'arg.1',
        '22': 'mex.1',
        '1543': 'col.1',
        '58': 'conmebol.libertadores',
        '1208': 'conmebol.sudamericana',
        '2391': 'caf.champions',
        '18000': 'caf.confed',
        '3908': 'caf.nations',
        '76': 'caf.nations',
        '3902': 'afc.champions',
        '2200': 'afc.champions',
        '606': 'fifa.world',
        '4': 'fifa.world',
        '5501': 'fifa.cwc',
        '1932': 'fifa.cwc',
        '735': 'sco.1',
        '45': 'sco.1',
        '3950': 'esp.2',
        '107': 'esp.2',
        'nba': 'nba',
        'mens-college-basketball': 'mens-college-basketball'
    };

    // خريطة كبرى لأشهر أندية العالم لربط مبارياتها بالدوري الصحيح فوراً حتى لو جاءت من خلاصة عامة
    const KNOWN_CLUBS = {
        // الدوري الإنجليزي الممتاز (Premier League)
        'manchester city': 'eng.1', 'man city': 'eng.1', 'arsenal': 'eng.1', 'liverpool': 'eng.1',
        'aston villa': 'eng.1', 'tottenham': 'eng.1', 'tottenham hotspur': 'eng.1', 'chelsea': 'eng.1',
        'newcastle': 'eng.1', 'newcastle united': 'eng.1', 'manchester united': 'eng.1', 'man utd': 'eng.1',
        'west ham': 'eng.1', 'west ham united': 'eng.1', 'brighton': 'eng.1', 'brighton & hove albion': 'eng.1',
        'bournemouth': 'eng.1', 'afc bournemouth': 'eng.1', 'fulham': 'eng.1', 'wolverhampton': 'eng.1',
        'wolves': 'eng.1', 'everton': 'eng.1', 'brentford': 'eng.1', 'crystal palace': 'eng.1',
        'nottingham forest': 'eng.1', 'nottingham': 'eng.1', 'leicester city': 'eng.1', 'leicester': 'eng.1',
        'ipswich town': 'eng.1', 'ipswich': 'eng.1', 'southampton': 'eng.1', 'leeds united': 'eng.1',
        'sunderland': 'eng.1', 'coventry city': 'eng.1',

        // الدوري الإسباني (LaLiga)
        'real madrid': 'esp.1', 'barcelona': 'esp.1', 'fc barcelona': 'esp.1', 'atletico madrid': 'esp.1',
        'atlético madrid': 'esp.1', 'athletic club': 'esp.1', 'athletic bilbao': 'esp.1', 'real sociedad': 'esp.1',
        'real betis': 'esp.1', 'villarreal': 'esp.1', 'valencia': 'esp.1', 'sevilla': 'esp.1',
        'girona': 'esp.1', 'celta vigo': 'esp.1', 'mallorca': 'esp.1', 'osasuna': 'esp.1',
        'rayo vallecano': 'esp.1', 'getafe': 'esp.1', 'alaves': 'esp.1', 'deportivo alaves': 'esp.1',
        'las palmas': 'esp.1', 'leganes': 'esp.1', 'valladolid': 'esp.1', 'espanyol': 'esp.1',

        // الدوري الإيطالي (Serie A)
        'inter milan': 'ita.1', 'inter': 'ita.1', 'internazionale': 'ita.1', 'ac milan': 'ita.1',
        'milan': 'ita.1', 'juventus': 'ita.1', 'napoli': 'ita.1', 'roma': 'ita.1', 'as roma': 'ita.1',
        'lazio': 'ita.1', 'atalanta': 'ita.1', 'fiorentina': 'ita.1', 'bologna': 'ita.1', 'torino': 'ita.1',
        'monza': 'ita.1', 'genoa': 'ita.1', 'udinese': 'ita.1', 'cagliari': 'ita.1', 'verona': 'ita.1',
        'hellas verona': 'ita.1', 'empoli': 'ita.1', 'parma': 'ita.1', 'como': 'ita.1', 'venezia': 'ita.1',
        'lecce': 'ita.1',

        // الدوري الألماني (Bundesliga)
        'bayern munich': 'ger.1', 'bayern münchen': 'ger.1', 'borussia dortmund': 'ger.1', 'dortmund': 'ger.1',
        'bayer leverkusen': 'ger.1', 'leverkusen': 'ger.1', 'rb leipzig': 'ger.1', 'leipzig': 'ger.1',
        'eintracht frankfurt': 'ger.1', 'frankfurt': 'ger.1', 'vfb stuttgart': 'ger.1', 'stuttgart': 'ger.1',
        'borussia mönchengladbach': 'ger.1', 'gladbach': 'ger.1', 'wolfsburg': 'ger.1', 'freiburg': 'ger.1',
        'werder bremen': 'ger.1', 'augsburg': 'ger.1', 'heidenheim': 'ger.1', 'mainz': 'ger.1',
        'union berlin': 'ger.1', 'st. pauli': 'ger.1', 'holstein kiel': 'ger.1', 'bochum': 'ger.1',
        'hoffenheim': 'ger.1',

        // الدوري الفرنسي (Ligue 1)
        'paris saint-germain': 'fra.1', 'psg': 'fra.1', 'monaco': 'fra.1', 'as monaco': 'fra.1',
        'marseille': 'fra.1', 'olympique marseille': 'fra.1', 'lille': 'fra.1', 'lyon': 'fra.1',
        'olympique lyonnais': 'fra.1', 'lens': 'fra.1', 'rennes': 'fra.1', 'nice': 'fra.1',

        // دوري روشن السعودي (Saudi Pro League)
        'al hilal': 'ksa.1', 'al-hilal': 'ksa.1', 'al nassr': 'ksa.1', 'al-nassr': 'ksa.1',
        'al ittihad': 'ksa.1', 'al-ittihad': 'ksa.1', 'al ahli': 'ksa.1', 'al-ahli': 'ksa.1',
        'al shabab': 'ksa.1', 'al ettifaq': 'ksa.1', 'al qadsiah': 'ksa.1',

        // الأندية المغربية (Moroccan Clubs)
        'raja casablanca': 'caf.confed', 'raja': 'caf.confed', 'raja club athletic': 'caf.confed',
        'wydad': 'caf.champions', 'wydad ac': 'caf.champions', 'wydad casablanca': 'caf.champions',
        'as far': 'caf.confed', 'far rabat': 'caf.confed', 'asfar': 'caf.confed',
        'rs berkane': 'caf.champions', 'rsb berkane': 'caf.champions', 'berkane': 'caf.champions',
        'maghreb as de fes': 'caf.champions', 'maghreb de fes': 'caf.champions', 'mas fes': 'caf.champions',
        'fus rabat': 'caf.confed', 'ittihad tanger': 'caf.confed', 'hassania agadir': 'caf.confed', 'olympic safi': 'caf.confed',

        // الأندية العربية والإفريقية (Arab & African Giants)
        'al ahly': 'caf.confed', 'zamalek': 'caf.champions', 'pyramids fc': 'caf.champions', 'pyramids': 'caf.champions',
        'esperance': 'caf.champions', 'es tunis': 'caf.champions', 'club africain': 'caf.champions', 'club sportif sfaxien': 'caf.confed',
        'mc alger': 'caf.champions', 'usm alger': 'caf.confed', 'cr belouizdad': 'caf.champions',
        'al hilal omdurman': 'caf.champions', 'al ahli tripoli': 'caf.confed',

        // الدوري الاسكتلندي (Scottish Premiership)
        'celtic': 'sco.1', 'rangers': 'sco.1', 'aberdeen': 'sco.1', 'hearts': 'sco.1', 'hibernian': 'sco.1',

        // دوري الدرجة الثانية الإسباني (LaLiga 2 / Segunda)
        'espanyol': 'esp.2', 'real zaragoza': 'esp.2', 'levante': 'esp.2', 'sporting gijon': 'esp.2',
        'cadiz': 'esp.2', 'malaga': 'esp.2', 'elche': 'esp.2', 'real oviedo': 'esp.2', 'albacete': 'esp.2',

        // دوري أستراليا (A-League)
        'central coast mariners': 'aus.1', 'perth glory': 'aus.1', 'brisbane roar': 'aus.1',
        'sydney fc': 'aus.1', 'melbourne victory': 'aus.1', 'melbourne city': 'aus.1',
        'adelaide united': 'aus.1', 'western united': 'aus.1', 'wellington phoenix': 'aus.1',

        // الدوري الروسي (Russian Premier)
        'gazovik orenburg': 'rus.1', 'orenburg': 'rus.1', 'fc baltika': 'rus.1', 'akron tolyatti': 'rus.1',
        'fakel voronezh': 'rus.1', 'rubin kazan': 'rus.1', 'zenit': 'rus.1', 'spartak moscow': 'rus.1',
        'cska moscow': 'rus.1', 'dynamo moscow': 'rus.1', 'lokomotiv moscow': 'rus.1', 'krasnodar': 'rus.1',

        // كرة السلة NBA
        'celtics': 'nba', 'boston celtics': 'nba', 'lakers': 'nba', 'los angeles lakers': 'nba',
        'warriors': 'nba', 'golden state warriors': 'nba', 'miami heat': 'nba', 'bulls': 'nba',
        'chicago bulls': 'nba', 'nuggets': 'nba', 'denver nuggets': 'nba', 'bucks': 'nba',
        'milwaukee bucks': 'nba', 'suns': 'nba', 'phoenix suns': 'nba', 'mavericks': 'nba',
        'dallas mavericks': 'nba', 'knicks': 'nba', 'new york knicks': 'nba', 'clippers': 'nba',
        '76ers': 'nba', 'philadelphia 76ers': 'nba', 'timberwolves': 'nba', 'cavaliers': 'nba',
        'thunder': 'nba', 'pacers': 'nba', 'rockets': 'nba', 'grizzlies': 'nba', 'magic': 'nba'
    };

    const resolveCanonicalCode = (rawCode, slug, name, competitors = []) => {
        const rawTrimmed = String(rawCode || '').trim();
        if (rawTrimmed && MAJOR_LEAGUES.some(l => l.code === rawTrimmed)) {
            return rawTrimmed;
        }
        if (rawTrimmed && ESPN_ID_TO_CODE[rawTrimmed]) {
            return ESPN_ID_TO_CODE[rawTrimmed];
        }
        const slugTrimmed = String(slug || '').trim();
        if (slugTrimmed && MAJOR_LEAGUES.some(l => l.code === slugTrimmed)) {
            return slugTrimmed;
        }

        const t = `${rawCode || ''} ${slug || ''} ${name || ''}`.toLowerCase();
        if (t.includes('caf champions') || t.includes('caf-champions')) return 'caf.champions';
        if (t.includes('caf confed') || t.includes('caf-confed') || t.includes('caf confederation')) return 'caf.confed';
        if (t.includes('africa cup of nations') || t.includes('caf nations') || t.includes('afcon')) return 'caf.nations';
        if (t.includes('afc champions') || t.includes('afc-champions') || t.includes('acl elite')) return 'afc.champions';
        if (t.includes('club world cup') || t.includes('fifa cwc')) return 'fifa.cwc';
        if (t.includes('fifa world cup') || (t.includes('world cup') && !t.includes('club') && !t.includes('qualifying'))) return 'fifa.world';
        if (t.includes('premier-league') || t.includes('premier league') || t.includes('epl')) return 'eng.1';
        if (t.includes('championship')) return 'eng.2';
        if (t.includes('fa-cup') || t.includes('fa cup')) return 'eng.fa';
        if (t.includes('laliga 2') || t.includes('segunda') || t.includes('hypermotion')) return 'esp.2';
        if (t.includes('laliga') || t.includes('la liga') || t.includes('primera division')) return 'esp.1';
        if (t.includes('copa del rey') || t.includes('copa-del-rey')) return 'esp.copa_del_rey';
        if (t.includes('serie a') || t.includes('serie-a')) return 'ita.1';
        if (t.includes('2. bundesliga') || t.includes('2-bundesliga')) return 'ger.2';
        if (t.includes('bundesliga')) return 'ger.1';
        if (t.includes('ligue 1') || t.includes('ligue-1')) return 'fra.1';
        if (t.includes('champions league') || t.includes('champions-league') || t.includes('ucl')) return 'uefa.champions';
        if (t.includes('europa league') || t.includes('europa-league') || t.includes('uel')) return 'uefa.europa';
        if (t.includes('conference league') || t.includes('conference-league') || t.includes('uecl')) return 'uefa.europa.conf';
        if (t.includes('nations league') || t.includes('nations-league')) return 'uefa.nations';
        if (t.includes('roshn') || t.includes('saudi')) return 'ksa.1';
        if (t.includes('primeira liga') || t.includes('primeira-liga') || t.includes('portuguese')) return 'por.1';
        if (t.includes('eredivisie') || t.includes('dutch')) return 'ned.1';
        if (t.includes('super lig') || t.includes('süper lig') || t.includes('super-lig') || t.includes('turkish')) return 'tur.1';
        if (t.includes('scottish premiership') || t.includes('spfl') || t.includes('scottish')) return 'sco.1';
        if (t.includes('russian premier') || t.includes('russian') || t.includes('russia')) return 'rus.1';
        if (t.includes('a-league') || t.includes('australian')) return 'aus.1';
        if (t.includes('colombian') || t.includes('dimayor')) return 'col.1';
        if (t.includes('brasileirao') || t.includes('brazilian')) return 'bra.1';
        if (t.includes('argentine') || t.includes('argentina')) return 'arg.1';
        if (t.includes('mexican') || t.includes('liga mx') || t.includes('bbva mx')) return 'mex.1';
        if (t.includes('major league soccer') || t.includes('mls')) return 'usa.1';
        if (t.includes('libertadores')) return 'conmebol.libertadores';
        if (t.includes('sudamericana')) return 'conmebol.sudamericana';
        if (t.includes('nba')) return 'nba';
        if (t.includes('college basketball') || t.includes('ncaa')) return 'mens-college-basketball';

        // مطابقة ذكية بناءً على أسماء الأندية الشهيرة إذا كانت البطولة تظهر كعامة
        if (Array.isArray(competitors) && competitors.length > 0) {
            for (const c of competitors) {
                const teamName = (c.team?.displayName || c.team?.name || '').toLowerCase();
                for (const [clubKey, leagueVal] of Object.entries(KNOWN_CLUBS)) {
                    if (teamName.includes(clubKey)) {
                        return leagueVal;
                    }
                }
            }
        }

        return rawCode || 'other';
    };

    // دالة استخراج وتوليد الشعار الرسمي للفرق الرياضية بدقة من سيرفرات ESPN العالمية
    const getTeamLogoUrl = (team, sport = 'soccer') => {
        if (!team) return '';
        if (typeof team.logo === 'string' && team.logo.startsWith('http')) return team.logo;
        if (Array.isArray(team.logos) && team.logos[0]?.href && team.logos[0].href.startsWith('http')) {
            return team.logos[0].href;
        }

        // استخراج معرف النادي الرقمي من id أو uid
        let teamId = team.id;
        if (!teamId && team.uid) {
            const m = String(team.uid).match(/~t:([^~]+)/);
            if (m) teamId = m[1];
        }

        if (teamId && /^\d+$/.test(String(teamId).trim())) {
            const cleanId = String(teamId).trim();
            const sportPath = (sport === 'basketball') ? 'nba' : 'soccer';
            return `https://a.espncdn.com/i/teamlogos/${sportPath}/500/${cleanId}.png`;
        }

        return '';
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
                url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/${sub}/scoreboard`;
            } else {
                const sub = leagueCode === 'all' ? 'all' : leagueCode;
                url = `https://site.web.api.espn.com/apis/site/v2/sports/soccer/${sub}/scoreboard`;
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
                const competitors = comp.competitors || [];

                // 1. استخراج كود أو معرّف الدوري الأولي من ESPN
                let rawCode = (leagueCode !== 'all') ? leagueCode : '';
                if (!rawCode) {
                    const uidMatch = (ev.uid || '').match(/~l:([^~]+)/);
                    if (uidMatch && uidMatch[1]) {
                        rawCode = uidMatch[1];
                    } else if (ev.league?.id) {
                        rawCode = ev.league.id;
                    } else if (comp.league?.id) {
                        rawCode = comp.league.id;
                    } else if (ev.league?.slug) {
                        rawCode = ev.league.slug;
                    } else if (comp.league?.slug) {
                        rawCode = comp.league.slug;
                    }
                }

                // إذا لم يتوفر كود ومازلنا في خلاصة عامة، نبحث في قائمة الدوريات المرفقة في البيانات data.leagues
                if (!rawCode && Array.isArray(data.leagues)) {
                    const evLeagueId = ev.leagueId || comp.leagueId;
                    if (evLeagueId) {
                        const matchedL = data.leagues.find(l => String(l.id) === String(evLeagueId));
                        if (matchedL) rawCode = matchedL.slug || matchedL.id;
                    } else if (data.leagues.length === 1 && leagueCode !== 'all') {
                        rawCode = data.leagues[0].slug || data.leagues[0].id;
                    }
                }

                const rawSlug = ev.season?.slug || ev.league?.slug || comp.league?.slug || '';
                const rawName = comp.altGameNote || ev.league?.name || comp.league?.name || ev.name || '';

                // 2. توحيد ومطابقة كود البطولة المعياري مع الاستعانة بأسماء الأندية الشهيرة
                const canonicalCode = resolveCanonicalCode(rawCode, rawSlug, rawName, competitors);

                // 3. البحث عن البطولة من القائمة المعيارية
                let leagueMeta = MAJOR_LEAGUES.find(l => l.code === canonicalCode && l.sport === sport);

                // استخراج الشعار الرسمي للدوري من استجابة ESPN إن توفرت
                const espnLeagueLogo = ev.league?.logos?.[0]?.href 
                    || comp.league?.logos?.[0]?.href 
                    || (Array.isArray(data.leagues) ? data.leagues.find(l => String(l.id) === String(rawCode) || l.slug === rawSlug)?.logos?.[0]?.href : '')
                    || '';

                if (leagueMeta && !leagueMeta.logo && espnLeagueLogo) {
                    leagueMeta.logo = espnLeagueLogo;
                }

                if (!leagueMeta) {
                    const rawNote = `${rawName} ${rawSlug}`.toLowerCase();
                    let mapped = null;
                    for (const [key, val] of Object.entries(TOURNAMENT_NAME_MAP)) {
                        if (rawNote.includes(key) || key.includes(rawNote)) {
                            mapped = val;
                            break;
                        }
                    }

                    const rawCountry = (comp.venue?.address?.country || '').toLowerCase();
                    const cInfo = COUNTRY_FLAG_MAP[rawCountry];

                    const resolvedName = mapped ? mapped.name : (comp.altGameNote || ev.season?.slug || ev.league?.name || 'بطولة رياضية');
                    const resolvedCountry = mapped ? mapped.country : (cInfo ? cInfo.ar : (comp.venue?.address?.country || 'دولي'));
                    const resolvedFlag = mapped ? mapped.flag : (cInfo ? cInfo.flag : 'https://flagcdn.com/w40/un.png');

                    leagueMeta = {
                        code: canonicalCode,
                        sport,
                        name: resolvedName,
                        shortName: resolvedName,
                        country: resolvedCountry,
                        logo: mapped?.logo || espnLeagueLogo || '',
                        flagImg: resolvedFlag
                    };
                }

                return {
                    ...ev,
                    sport,
                    leagueCode: canonicalCode,
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

    // نظام تحديث الدقائق الحية محلياً في بطاقات المباريات ومودال الإحصائيات (Live Minute Ticker Engine)
    const initLiveMinuteTicker = () => {
        if (liveTickerInterval) clearInterval(liveTickerInterval);

        liveTickerInterval = setInterval(() => {
            const now = Date.now();
            const liveRows = document.querySelectorAll('.sofa-match-row.is-live-row');

            if (liveRows.length > 0) {
                liveRows.forEach(row => {
                    const eventId = row.dataset.eventId;
                    if (!eventId || !matchMinutesMap.has(eventId)) return;

                    const track = matchMinutesMap.get(eventId);
                    if (track.isSpecial) return; // HT, FT, Postponed

                    const elapsedMinutes = Math.floor((now - track.baseTime) / 60000);
                    let currentMinute = track.baseMinute + elapsedMinutes;
                    let extraVal = track.extraMinute || 0;
                    let isExtra = track.isExtra;

                    // في حال كانت الدقيقة محسوبة محلياً من بداية المباراة
                    if (track.calculatedFromKickoff && track.matchDate) {
                        const totalFromStart = Math.floor((now - track.matchDate) / 60000);
                        if (totalFromStart > 47 && totalFromStart <= 62) {
                            track.isSpecial = true;
                            track.isHalftime = true;
                            const minEl = row.querySelector('.sofa-row-live-min');
                            if (minEl && minEl.textContent !== 'استراحة') minEl.innerHTML = 'استراحة';
                            return;
                        } else if (totalFromStart > 62) {
                            const secondHalfElapsed = totalFromStart - 62;
                            const totalCalculated = 45 + secondHalfElapsed;
                            if (totalCalculated > 90) {
                                currentMinute = 90;
                                extraVal = totalCalculated - 90; // يستمر بالعد ولا يتوقف عند 90 أبداً!
                                isExtra = true;
                            } else {
                                currentMinute = totalCalculated;
                                extraVal = 0;
                                isExtra = false;
                            }
                        }
                    } else if (isExtra) {
                        extraVal = track.extraMinute + elapsedMinutes;
                    } else if (currentMinute > 90) {
                        extraVal = currentMinute - 90;
                        currentMinute = 90;
                        isExtra = true;
                    }

                    const displayHTML = isExtra
                        ? `${currentMinute}+${extraVal}<span class="live-apostrophe">'</span>`
                        : `${currentMinute}<span class="live-apostrophe">'</span>`;

                    const minEl = row.querySelector('.sofa-row-live-min');
                    if (minEl && minEl.innerHTML !== displayHTML) {
                        minEl.innerHTML = displayHTML;
                    }
                });
            }

            // تحديث نافذة إحصائيات وتفاصيل المباراة اللحظية إن كانت مفتوحة
            if (window.currentActiveStatsEventId && matchMinutesMap.has(window.currentActiveStatsEventId)) {
                const track = matchMinutesMap.get(window.currentActiveStatsEventId);
                const modalLiveTag = document.querySelector('#statsHeroBanner .stats-hero-status.tag-live');
                if (modalLiveTag && !track.isSpecial) {
                    const elapsedMinutes = Math.floor((now - track.baseTime) / 60000);
                    let curMin = track.baseMinute + elapsedMinutes;
                    let extraVal = track.extraMinute || 0;
                    let isExtra = track.isExtra;

                    if (isExtra) {
                        extraVal = track.extraMinute + elapsedMinutes;
                    } else if (curMin > 90) {
                        extraVal = curMin - 90;
                        curMin = 90;
                        isExtra = true;
                    }

                    const dispHtml = isExtra
                        ? `${curMin}+${extraVal}<span class="live-apostrophe">'</span>`
                        : `${curMin}<span class="live-apostrophe">'</span>`;

                    modalLiveTag.innerHTML = `<span class="live-dot-pulse"></span> ${dispHtml}`;
                }
            }
        }, 10000); // تحديث فوري دوري كل 10 ثوانٍ لضمان استجابة وتزامن عداد الدقائق محلياً
    };

    // استخراج عدد البطاقات الحمراء للفريق من تفاصيل المباراة
    const getTeamRedCardCount = (ev, teamId) => {
        if (!ev) return 0;
        const comp = ev.competitions?.[0] || {};
        let count = 0;

        // 1. من خلال competitor statistics / redCards
        const competitors = comp.competitors || [];
        const competitor = competitors.find(c => String(c.id) === String(teamId) || String(c.team?.id) === String(teamId));
        if (competitor && competitor.redCards) {
            return parseInt(competitor.redCards, 10) || 0;
        }

        // 2. من خلال تفاصيل الأحداث details
        const details = comp.details || [];
        if (Array.isArray(details)) {
            details.forEach(det => {
                const isRed = det.redCard === true || 
                              (det.type?.text && det.type.text.toLowerCase().includes('red card')) ||
                              (det.type?.id && String(det.type.id) === '2');
                const matchTeam = String(det.team?.id) === String(teamId);
                if (isRed && matchTeam) {
                    count++;
                }
            });
        }
        return count;
    };

    // فحص وجود تذكرة/صفقة نشطة في حاسبة الأرباح تطابق أحد الفريقين (In-Play Hedge Linker)
    const getActiveHedgeSlip = (homeName, awayName) => {
        try {
            const raw1 = localStorage.getItem('arb_saved_slips') || localStorage.getItem('arb_slips_tab1');
            const slips = raw1 ? JSON.parse(raw1) : [];
            if (!Array.isArray(slips) || slips.length === 0) return null;

            const hLow = (homeName || '').toLowerCase().trim();
            const aLow = (awayName || '').toLowerCase().trim();

            return slips.find(s => {
                const name = (s.title || s.slipName || s.matchTitle || '').toLowerCase();
                return (hLow && name.includes(hLow)) || (aLow && name.includes(aLow));
            }) || null;
        } catch {
            return null;
        }
    };

    window.openInPlayHedge = (matchTitle) => {
        window.transferMatchToCalc(matchTitle, 'delayed');
    };

    // التحديث الموضعي السلس لعناصر الـ DOM دون وميض ودون إعادة بناء القائمة (In-Place DOM Live Updates)
    const updateMatchesDOMInPlace = (events) => {
        const container = document.getElementById('homeMatchesContainer');
        if (!container) return;

        events.forEach(ev => {
            const row = container.querySelector(`.sofa-match-row[data-event-id="${ev.id}"]`);
            if (!row) return;

            const comp = ev.competitions?.[0] || {};
            const competitors = comp.competitors || [];
            const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
            const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};

            const homeScore = parseInt(home.score, 10);
            const awayScore = parseInt(away.score, 10);
            const hasScores = !isNaN(homeScore) && !isNaN(awayScore);

            // 1. مقارنة الأهداف واكتشاف تسجيل هدف جديد لإطلاق الوميض والتنبيه
            const scoreEls = row.querySelectorAll('.sofa-row-scores-col .sofa-row-score');
            if (scoreEls.length >= 2 && hasScores) {
                const oldHomeScore = parseInt(scoreEls[0].textContent, 10);
                const oldAwayScore = parseInt(scoreEls[1].textContent, 10);

                if (!isNaN(oldHomeScore) && !isNaN(oldAwayScore)) {
                    if (homeScore > oldHomeScore || awayScore > oldAwayScore) {
                        // تفعيل تأثير الوميض الأخضر على بطاقة المباراة
                        row.classList.remove('goal-flash-highlight');
                        void row.offsetWidth; // force reflow
                        row.classList.add('goal-flash-highlight');
                        setTimeout(() => row.classList.remove('goal-flash-highlight'), 3800);

                        // استخراج مسجل الهدف إن وُجد
                        let scorerInfo = '';
                        const details = comp.details || [];
                        const lastGoal = details.filter(d => d.scoringPlay === true || d.scoreValue === 1).pop();
                        if (lastGoal && lastGoal.athletesInvolved && lastGoal.athletesInvolved[0]) {
                            scorerInfo = ` (${lastGoal.athletesInvolved[0].displayName})`;
                        }

                        const scoringTeam = (homeScore > oldHomeScore)
                            ? (home.team?.displayName || 'المضيف')
                            : (away.team?.displayName || 'الضيف');

                        const activeHedgeSlip = getActiveHedgeSlip(home.team?.displayName, away.team?.displayName);
                        if (activeHedgeSlip) {
                            showToast(`⚡ تنبيه صفقة نشطة O₂! هدف في مباراة ${scoringTeam}${scorerInfo} - [${homeScore} - ${awayScore}]! توجه للحاسبة لتأمين أرباح الهيدج.`);
                        } else {
                            showToast(`⚽ هدف! ${scoringTeam}${scorerInfo} - [${homeScore} - ${awayScore}]`);
                        }
                    }
                }

                scoreEls[0].textContent = homeScore;
                scoreEls[1].textContent = awayScore;
                if (ev.status?.type?.state === 'in') {
                    scoreEls[0].classList.add('score-live');
                    scoreEls[1].classList.add('score-live');
                }
            }

            // 2. تحديث عداد الدقائق الحية في الواجهة مع وميض الشرطة
            const statusEl = row.querySelector('.sofa-row-status');
            if (statusEl && ev.status?.type?.state === 'in') {
                const rawDetail = ev.status?.displayClock ? `${ev.status.displayClock} ${ev.status?.type?.detail || ''}` : (ev.status?.type?.detail || '');
                const statusDetail = parseMinuteDetail(ev.id, rawDetail, ev.date);
                statusEl.innerHTML = formatLiveMinuteHTML(statusDetail);
                row.classList.add('is-live-row');
            }

            // 3. تحديث شارات البطاقات الحمراء (بطاقة حمراء منفردة وأنيقة)
            const homeRed = getTeamRedCardCount(ev, home.id || home.team?.id);
            const awayRed = getTeamRedCardCount(ev, away.id || away.team?.id);
            const teamEls = row.querySelectorAll('.sofa-row-teams-col .sofa-row-team-name');
            if (teamEls.length >= 2) {
                let homeBadge = teamEls[0].querySelector('.red-card-badge');
                if (homeRed > 0) {
                    if (!homeBadge) {
                        homeBadge = document.createElement('span');
                        teamEls[0].appendChild(homeBadge);
                    }
                    homeBadge.className = homeRed > 1 ? 'red-card-badge has-multiple' : 'red-card-badge';
                    homeBadge.title = homeRed > 1 ? `${homeRed} بطاقات حمراء` : 'بطاقة حمراء (طرد)';
                    homeBadge.textContent = homeRed > 1 ? String(homeRed) : '';
                } else if (homeBadge) {
                    homeBadge.remove();
                }

                let awayBadge = teamEls[1].querySelector('.red-card-badge');
                if (awayRed > 0) {
                    if (!awayBadge) {
                        awayBadge = document.createElement('span');
                        teamEls[1].appendChild(awayBadge);
                    }
                    awayBadge.className = awayRed > 1 ? 'red-card-badge has-multiple' : 'red-card-badge';
                    awayBadge.title = awayRed > 1 ? `${awayRed} بطاقات حمراء` : 'بطاقة حمراء (طرد)';
                    awayBadge.textContent = awayRed > 1 ? String(awayRed) : '';
                } else if (awayBadge) {
                    awayBadge.remove();
                }
            }
        });

        syncFilterControlsUI();
    };

    // التحديث الدوري الخلفي الذكي للمباريات الحية (Smart Polling & Visibility API)
    // يستمر دائماً كل 30 ثانية ما دام المستخدم داخل الموقع (حتى عند الانتقال لتبويب القسائم أو أي قسم آخر)
    // ويتوقف فقط إذا غادر المتصفح/قفل الشاشة (document.hidden)، ويعود فوراً عند فتح التطبيق
    let liveAutoFetchInterval = null;
    const initLiveAutoFetch = () => {
        if (liveAutoFetchInterval) {
            clearInterval(liveAutoFetchInterval);
            liveAutoFetchInterval = null;
        }

        const pollFrequency = 30000; // استعلام خفيف كل 30 ثانية للأحداث المباشرة

        liveAutoFetchInterval = setInterval(() => {
            // توقف فقط إذا غادر المستخدم الموقع بالكامل (تم تصغير المتصفح أو قفل شاشة الهاتف)
            if (document.hidden) return;

            // استعلام خفيف وتحديث صامت لنتائج وأهداف ودقائق المباريات الحية
            loadMatches(false, false);
        }, pollFrequency);

        // مراقبة Visibility API لتحديث النتائج فوراً وبدون انتظار عند رجوع المستخدم للتطبيق بعد مغادرته
        if (!window._visibilityListenerAdded) {
            window._visibilityListenerAdded = true;
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    loadMatches(false, false);
                }
            });
        }
    };

    // تحليل وتتبع الدقيقة محلياً من مزود البيانات أو حسابها من توقيت انطلاق المباراة
    const parseMinuteDetail = (eventId, detailStr, matchDate) => {
        const raw = (detailStr || '').trim();
        const now = Date.now();

        const lower = raw.toLowerCase();
        if (lower.includes('ht') || lower.includes('half') || lower.includes('استراحة')) {
            matchMinutesMap.set(eventId, { isSpecial: true, isHalftime: true, originalStr: 'استراحة' });
            return 'استراحة';
        }

        if (lower.includes('ft') || lower.includes('full') || lower.includes('انتهت')) {
            matchMinutesMap.set(eventId, { isSpecial: true, isFinished: true, originalStr: 'FT' });
            return 'FT';
        }

        if (lower.includes('postponed') || lower.includes('cancel') || lower.includes('مؤجل') || lower.includes('ملغ')) {
            matchMinutesMap.set(eventId, { isSpecial: true, originalStr: raw });
            return raw;
        }

        // 1. هل المزود وفر رقماً صريحاً للدقيقة مع وقت إضافي؟ (مثلاً: 45+2 أو 90'+4' أو 90 +4)
        const extraMatch = raw.match(/(\d+)\s*\'?\s*\+\s*(\d+)/);
        if (extraMatch) {
            const minNum = parseInt(extraMatch[1], 10);
            const extraNum = parseInt(extraMatch[2], 10);

            matchMinutesMap.set(eventId, {
                baseMinute: minNum,
                extraMinute: extraNum,
                isExtra: true,
                baseTime: now,
                originalStr: raw,
                isSpecial: false,
                matchDate: matchDate ? new Date(matchDate).getTime() : null,
                calculatedFromKickoff: false
            });

            return `${minNum}+${extraNum}'`;
        }

        // 2. هل المزود وفر رقماً مفرداً للدقيقة؟ (مثلاً: 38 أو 38' أو 92')
        const singleMatch = raw.match(/(\d+)/);
        if (singleMatch) {
            let minNum = parseInt(singleMatch[1], 10);
            let extraNum = 0;
            let isExtra = false;

            if (minNum > 90) {
                extraNum = minNum - 90;
                minNum = 90;
                isExtra = true;
            }

            matchMinutesMap.set(eventId, {
                baseMinute: minNum,
                extraMinute: extraNum,
                isExtra,
                baseTime: now,
                originalStr: raw,
                isSpecial: false,
                matchDate: matchDate ? new Date(matchDate).getTime() : null,
                calculatedFromKickoff: false
            });

            return isExtra ? `${minNum}+${extraNum}'` : `${minNum}'`;
        }

        // 3. إذا لم يوفر المزود الدقيقة صراحة: يتم حساب الدقيقة لحظياً وتتبعها محلياً على جهاز المستخدم
        // مع عدم التوقف عند 90 أبداً واستمرار العد في الوقت الإضافي
        if (matchDate) {
            const startTime = new Date(matchDate).getTime();
            const elapsedFromStart = Math.max(0, Math.floor((now - startTime) / 60000));

            let calcMin = 1;
            let extraMin = 0;
            let isHt = false;
            let isExtra = false;

            if (elapsedFromStart <= 0) {
                calcMin = 1;
            } else if (elapsedFromStart <= 47) {
                if (elapsedFromStart > 45) {
                    calcMin = 45;
                    extraMin = elapsedFromStart - 45;
                    isExtra = true;
                } else {
                    calcMin = elapsedFromStart;
                }
            } else if (elapsedFromStart <= 62) {
                isHt = true;
            } else {
                const secondHalfElapsed = elapsedFromStart - 62;
                const totalCalculated = 45 + secondHalfElapsed;
                if (totalCalculated > 90) {
                    calcMin = 90;
                    extraMin = totalCalculated - 90; // يستمر بالعد في الوقت الإضافي ولا يتوقف عند 90 أبداً!
                    isExtra = true;
                } else {
                    calcMin = totalCalculated;
                }
            }

            if (isHt) {
                matchMinutesMap.set(eventId, { isSpecial: true, isHalftime: true, originalStr: 'استراحة', matchDate: startTime, baseTime: now });
                return 'استراحة';
            }

            matchMinutesMap.set(eventId, {
                baseMinute: calcMin,
                extraMinute: extraMin,
                isExtra,
                baseTime: now,
                originalStr: isExtra ? `${calcMin}+${extraMin}'` : `${calcMin}'`,
                isSpecial: false,
                matchDate: startTime,
                calculatedFromKickoff: true
            });

            return isExtra ? `${calcMin}+${extraMin}'` : `${calcMin}'`;
        }

        matchMinutesMap.set(eventId, { isSpecial: true, originalStr: raw || 'مباشر' });
        return raw || 'مباشر';
    };

    // تنسيق وعرض الدقيقة مع الشرطة الوماضة (Flashing Live Apostrophe) والوقت بدل الضائع (+4)
    const formatLiveMinuteHTML = (minStr) => {
        if (!minStr) return '<span class="sofa-row-live-min">مباشر</span>';
        const str = String(minStr).trim();
        if (str.includes('استراحة') || str.toLowerCase().includes('ht')) {
            return `<span class="sofa-row-live-min">استراحة</span>`;
        }
        if (str.toLowerCase().includes('ft') || str.includes('انتهت')) {
            return `<span class="sofa-row-post-text">انتهت</span>`;
        }

        // مطابقة نمط الدقيقة والوقت الإضافي مثلاً 90+4 أو 90'+4' أو 45+2 أو 38' أو 38
        const extraMatch = str.match(/(\d+)\s*\'?\s*\+\s*(\d+)/);
        if (extraMatch) {
            const base = extraMatch[1];
            const added = extraMatch[2];
            return `<span class="sofa-row-live-min">${base}+${added}<span class="live-apostrophe">'</span></span>`;
        }

        const singleMatch = str.match(/(\d+)/);
        if (singleMatch) {
            const num = parseInt(singleMatch[1], 10);
            if (num > 90) {
                return `<span class="sofa-row-live-min">90+${num - 90}<span class="live-apostrophe">'</span></span>`;
            }
            return `<span class="sofa-row-live-min">${num}<span class="live-apostrophe">'</span></span>`;
        }

        return `<span class="sofa-row-live-min">${str}</span>`;
    };
    window.formatLiveMinuteHTML = formatLiveMinuteHTML;

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
        } else if (currentTimeFilter === 'custom' && customPeriodStart && customPeriodEnd) {
            labelEl.textContent = `${formatDateNavLabel(customPeriodStart)} - ${formatDateNavLabel(customPeriodEnd)}`;
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

    // مزامنة شارات الشريط المضغوط للرياضة وطريقة العرض
    function syncNavSummaryChips() {
        const sportIcon = currentSport === 'basketball' ? '🏀' : '⚽';
        const sportText = currentSport === 'basketball' ? 'كرة السلة' : 'كرة القدم';
        const viewText = currentMainView === 'leagues' ? 'دليل البطولات' : 'المباريات اليومية';

        const sIconEl = document.getElementById('summarySportIcon');
        const sTextEl = document.getElementById('summarySportText');
        const vIconEl = document.getElementById('summaryViewIcon');
        const vTextEl = document.getElementById('summaryViewText');

        if (sIconEl) sIconEl.textContent = sportIcon;
        if (sTextEl) sTextEl.textContent = sportText;
        if (vIconEl) vIconEl.innerHTML = currentMainView === 'leagues' ? '<i class="fa-solid fa-trophy"></i>' : '<i class="fa-solid fa-futbol"></i>';
        if (vTextEl) vTextEl.textContent = viewText;
    }

    // فتح وإغلاق شريط الخيارات المنسدل
    window.toggleNavCollapse = (forceOpen) => {
        const expandBody = document.getElementById('sofaNavExpandBody');
        const chevron = document.getElementById('navCollapseChevron');
        const hintText = document.getElementById('navToggleHintText');
        const bar = document.getElementById('sofaNavSummaryBar');
        if (!expandBody) return;

        const isCurrentlyOpen = expandBody.style.display !== 'none';
        const willOpen = (forceOpen !== undefined) ? forceOpen : !isCurrentlyOpen;

        if (willOpen) {
            expandBody.style.display = 'block';
            chevron?.classList.add('is-open');
            if (hintText) hintText.textContent = 'إغلاق ✕';
            bar?.classList.add('is-open');
        } else {
            expandBody.style.display = 'none';
            chevron?.classList.remove('is-open');
            if (hintText) hintText.textContent = 'تغيير';
            bar?.classList.remove('is-open');
        }
    };

    // إغلاق اللوحة عند النقر خارجها
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('sofaNavCollapsible');
        const expandBody = document.getElementById('sofaNavExpandBody');
        if (wrapper && expandBody && expandBody.style.display !== 'none') {
            if (!wrapper.contains(e.target)) {
                window.toggleNavCollapse(false);
            }
        }
    });

    // التبديل بين واجهة المباريات (GAMES) ودليل الدوريات (LEAGUES)
    window.switchMainView = (view) => {
        currentMainView = view;
        document.querySelectorAll('.sofa-view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        syncNavSummaryChips();

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

        syncNavSummaryChips();

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
            // حساب عدد مباريات كل دوري في الذاكرة الحالية
            const counts = new Map();
            const events = loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []);
            events.forEach(ev => {
                const code = ev.leagueCode || 'other';
                counts.set(code, (counts.get(code) || 0) + 1);
            });

            const sportLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport);
            let opts = `<option value="all">🌐 جميع البطولات والدوريات (${events.length} مباراة)</option>`;

            const continentalList = sportLeagues.filter(l => l.category === 'continental' && l.code !== 'all');
            const domesticList = sportLeagues.filter(l => l.category === 'domestic' && l.code !== 'all');
            const otherList = sportLeagues.filter(l => !['continental', 'domestic', 'all'].includes(l.category) && l.code !== 'all');

            if (continentalList.length > 0) {
                opts += `<optgroup label="🏆 البطولات القارية والدولية">`;
                continentalList.forEach(l => {
                    const c = counts.get(l.code) || 0;
                    const countBadge = c > 0 ? ` (${c} مباريات)` : ' (0)';
                    opts += `<option value="${l.code}" ${l.code === currentLeague ? 'selected' : ''}>${l.name}${countBadge}</option>`;
                });
                opts += `</optgroup>`;
            }

            if (domesticList.length > 0) {
                opts += `<optgroup label="⚽ الدوريات الأوروبية والعالمية">`;
                domesticList.forEach(l => {
                    const c = counts.get(l.code) || 0;
                    const countBadge = c > 0 ? ` (${c} مباريات)` : ' (0)';
                    opts += `<option value="${l.code}" ${l.code === currentLeague ? 'selected' : ''}>${l.name}${countBadge}</option>`;
                });
                opts += `</optgroup>`;
            }

            if (otherList.length > 0) {
                opts += `<optgroup label="🏀 بطولات ورياضات أخرى">`;
                otherList.forEach(l => {
                    const c = counts.get(l.code) || 0;
                    const countBadge = c > 0 ? ` (${c} مباريات)` : ' (0)';
                    opts += `<option value="${l.code}" ${l.code === currentLeague ? 'selected' : ''}>${l.name}${countBadge}</option>`;
                });
                opts += `</optgroup>`;
            }

            // إضافة أي بطولات أخرى إضافية موجودة في اليوم الحالي ولم تكن ضمن القائمة الثابتة
            const seenCodes = new Set(sportLeagues.map(l => l.code));
            let extraOpts = '';
            events.forEach(ev => {
                const cCode = ev.leagueCode;
                if (cCode && !seenCodes.has(cCode) && cCode !== 'other') {
                    seenCodes.add(cCode);
                    const lName = ev.leagueMeta?.name || cCode;
                    const c = counts.get(cCode) || 0;
                    extraOpts += `<option value="${cCode}" ${cCode === currentLeague ? 'selected' : ''}>${lName} (${c} مباريات)</option>`;
                }
            });
            if (extraOpts) {
                opts += `<optgroup label="🌐 دوريات وبطولات إضافية نشطة">${extraOpts}</optgroup>`;
            }

            selectEl.innerHTML = opts;
            selectEl.value = currentLeague || 'all';
        }

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (typeof window.pushModalHistory === 'function') {
            window.pushModalHistory('matchesFilterSheetModal', () => window.closeFilterSheet(true));
        }
    };

    window.closeFilterSheet = (fromPopState = false) => {
        const modal = document.getElementById('matchesFilterSheetModal');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (!fromPopState && typeof window.popModalHistory === 'function') {
            window.popModalHistory('matchesFilterSheetModal');
        }
    };

    window.applyFilterSheet = () => {
        const modal = document.getElementById('matchesFilterSheetModal');
        if (!modal) return;

        const activeTimeBtn = modal.querySelector('.filter-chip-btn.active');
        const activeStatusBtn = modal.querySelector('.filter-status-btn.active');
        const selectLeague = document.getElementById('filterLeagueSelect');

        const prevTime = currentTimeFilter;
        if (activeTimeBtn) currentTimeFilter = activeTimeBtn.dataset.time;
        if (activeStatusBtn) currentStatusMode = activeStatusBtn.dataset.status;
        if (selectLeague) {
            currentLeague = selectLeague.value;
            window.currentLeague = currentLeague;
        }

        closeFilterSheet();
        syncFilterControlsUI();

        // إذا تغيرت الفترة الزمنية نعيد جلب البيانات من المصدر، وإلا نحدث العرض فورياً من الذاكرة
        if (prevTime !== currentTimeFilter) {
            loadMatches(false);
        } else {
            renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
        }
        showToast('✓ تم تطبيق الفلاتر بنجاح');
    };

    window.resetFilterSheet = () => {
        currentTimeFilter = 'day';
        selectedDate = new Date();
        currentStatusMode = 'all';
        currentLeague = 'all';
        window.currentLeague = 'all';

        closeFilterSheet();
        syncFilterControlsUI();
        loadMatches(false);
        showToast('↺ تم إعادة ضبط الفلاتر');
    };

    // جلب المباريات الشامل مع الفصل الذكي للتواريخ ودعم التغذية العالمية الحية LIVE
    const loadMatches = async (forceRefresh = false, showLoading = true) => {
        const container = document.getElementById('homeMatchesContainer');
        if (!container) return;

        if (forceRefresh) {
            matchResponseCache.clear();
        }

        updateDateNavDisplay();
        fetchAndRenderNewsTicker(currentSport, currentLeague);

        if (currentMainView === 'leagues') {
            renderLeaguesDirectory();
            return;
        }

        if (showLoading || !container.children.length) {
            container.innerHTML = `
                <div class="match-loading-card">
                    <div class="match-spinner"></div>
                    <div style="font-weight: 800; font-size: 0.88rem;">جاري جلب وفحص جدول المباريات...</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">تحديث مباشر من سيرفرات الرياضة العالمية</div>
                </div>
            `;
        }

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
            } else if (currentTimeFilter === '24h' || currentTimeFilter === '48h') {
                const today = new Date();
                const d1 = toESPNDate(today);
                const tmr = new Date(today); tmr.setDate(tmr.getDate() + 1);
                const d2 = toESPNDate(tmr);
                tasks.push(fetchLeagueScoreboard('soccer', 'all', null));
                tasks.push(fetchLeagueScoreboard('soccer', 'all', d1));
                tasks.push(fetchLeagueScoreboard('soccer', 'all', d2));
                if (currentTimeFilter === '48h') {
                    const afterTmr = new Date(today); afterTmr.setDate(afterTmr.getDate() + 2);
                    tasks.push(fetchLeagueScoreboard('soccer', 'all', toESPNDate(afterTmr)));
                }
            } else if (currentTimeFilter === 'all' || currentTimeFilter === '6h' || currentTimeFilter === '12h') {
                tasks.push(fetchLeagueScoreboard('soccer', 'all', null));
                tasks.push(fetchLeagueScoreboard('soccer', 'all', toESPNDate(new Date())));
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

        // 2. جلب الدوريات المحددة أو الدوريات الكبرى بذكاء وسرعة
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
            const topMajorSoccer = ['eng.1', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'caf.champions', 'afc.champions', 'uefa.nations'];
            while (cur <= e && count < 14) {
                const dStr = toESPNDate(cur);
                if (currentSport === 'soccer') {
                    if (currentLeague === 'all') {
                        tasks.push(fetchLeagueScoreboard('soccer', 'all', dStr));
                        topMajorSoccer.forEach(lCode => tasks.push(fetchLeagueScoreboard('soccer', lCode, dStr)));
                    } else {
                        tasks.push(fetchLeagueScoreboard('soccer', currentLeague, dStr));
                    }
                } else {
                    targetLeagues.forEach(lCode => tasks.push(fetchLeagueScoreboard(currentSport, lCode, dStr)));
                }
                cur.setDate(cur.getDate() + 1);
                count++;
            }
        } else if (currentTimeFilter === 'this_week') {
            const monday = getMonday(new Date());
            const weekDays = getDaysArray(monday, 7);
            const topMajorSoccer = ['eng.1', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'caf.champions', 'afc.champions', 'uefa.nations'];
            weekDays.forEach(d => {
                const dStr = toESPNDate(d);
                if (currentSport === 'soccer') {
                    if (currentLeague === 'all') {
                        tasks.push(fetchLeagueScoreboard('soccer', 'all', dStr));
                        topMajorSoccer.forEach(lCode => tasks.push(fetchLeagueScoreboard('soccer', lCode, dStr)));
                    } else {
                        tasks.push(fetchLeagueScoreboard('soccer', currentLeague, dStr));
                    }
                } else {
                    targetLeagues.forEach(lCode => tasks.push(fetchLeagueScoreboard(currentSport, lCode, dStr)));
                }
            });
        } else if (currentTimeFilter === 'next_week') {
            const nextMon = getMonday(new Date());
            nextMon.setDate(nextMon.getDate() + 7);
            const weekDays = getDaysArray(nextMon, 7);
            const topMajorSoccer = ['eng.1', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'caf.champions', 'afc.champions', 'uefa.nations'];
            weekDays.forEach(d => {
                const dStr = toESPNDate(d);
                if (currentSport === 'soccer') {
                    if (currentLeague === 'all') {
                        tasks.push(fetchLeagueScoreboard('soccer', 'all', dStr));
                        topMajorSoccer.forEach(lCode => tasks.push(fetchLeagueScoreboard('soccer', lCode, dStr)));
                    } else {
                        tasks.push(fetchLeagueScoreboard('soccer', currentLeague, dStr));
                    }
                } else {
                    targetLeagues.forEach(lCode => tasks.push(fetchLeagueScoreboard(currentSport, lCode, dStr)));
                }
            });
        } else if (currentTimeFilter === 'last_week') {
            const lastMon = getMonday(new Date());
            lastMon.setDate(lastMon.getDate() - 7);
            const weekDays = getDaysArray(lastMon, 7);
            const topMajorSoccer = ['eng.1', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'caf.champions', 'afc.champions', 'uefa.nations'];
            weekDays.forEach(d => {
                const dStr = toESPNDate(d);
                if (currentSport === 'soccer') {
                    if (currentLeague === 'all') {
                        tasks.push(fetchLeagueScoreboard('soccer', 'all', dStr));
                        topMajorSoccer.forEach(lCode => tasks.push(fetchLeagueScoreboard('soccer', lCode, dStr)));
                    } else {
                        tasks.push(fetchLeagueScoreboard('soccer', currentLeague, dStr));
                    }
                } else {
                    targetLeagues.forEach(lCode => tasks.push(fetchLeagueScoreboard(currentSport, lCode, dStr)));
                }
            });
        } else {
            // all / 6h / 12h / 24h / 48h:
            targetLeagues.forEach(lCode => {
                tasks.push(fetchLeagueScoreboard(currentSport, lCode, null));
            });
            if (currentSport === 'soccer') {
                const today = new Date();
                for (let i = 1; i <= 4; i++) {
                    const upcomingDay = new Date(today);
                    upcomingDay.setDate(today.getDate() + i);
                    tasks.push(fetchLeagueScoreboard('soccer', 'uefa.nations', toESPNDate(upcomingDay)));
                }
            }
        }

        try {
            const results = await Promise.all(tasks);
            const allEvents = results.flat();

            const uniqueMap = new Map();
            allEvents.forEach(ev => {
                if (!uniqueMap.has(ev.id)) {
                    uniqueMap.set(ev.id, ev);
                } else {
                    const existing = uniqueMap.get(ev.id);
                    const existingIsGeneric = !existing.leagueCode || existing.leagueCode === 'all' || existing.leagueCode === 'other' || !existing.leagueMeta?.logo;
                    const newIsSpecific = ev.leagueCode && ev.leagueCode !== 'all' && ev.leagueCode !== 'other' && ev.leagueMeta?.logo;
                    if (existingIsGeneric && newIsSpecific) {
                        uniqueMap.set(ev.id, ev);
                    }
                }
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

            if (!showLoading && container.querySelector('.sofa-match-row')) {
                updateMatchesDOMInPlace(loadedMatchesEvents);
            } else {
                renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
            }

            // مزامنة حالة الصفقات وتبويب القسائم في حال كان مفتوحاً
            if (typeof window.renderSlips === 'function' && document.getElementById('tab3')?.classList.contains('active')) {
                window.renderSlips();
            }

            initLiveMinuteTicker();
            initLiveAutoFetch();
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
        if (!iso) return '';
        try {
            const d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            const tzMode = localStorage.getItem('arb_match_timezone') || 'gmt';
            if (tzMode === 'local') {
                return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            // الافتراضي: توقيت غرينتش الرسمي (GMT / UTC) المناسب للمغرب
            return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
        } catch {
            return '';
        }
    };

    // مزامنة حالة عناصر التحكم والشارات ونقطة التصفية في كل واجهات التطبيق
    const syncFilterControlsUI = () => {
        // 1. زر المباشر في الترويسة العلوية
        const liveCount = (loadedMatchesEvents || []).filter(ev => ev.status?.type?.state === 'in').length;
        const liveBadge = document.getElementById('liveStatusBadge');
        const livePulse = document.getElementById('homeLivePulse');
        const liveBtn = document.getElementById('statusBtnLive');
        if (liveBadge) liveBadge.textContent = liveCount;
        if (livePulse) livePulse.style.display = liveCount > 0 ? 'inline-block' : 'none';
        if (liveBtn) liveBtn.classList.toggle('active', currentStatusMode === 'live');

        // 2. نقطة التصفية النشطة على زر "تصفية"
        const dot = document.getElementById('filterActiveDot');
        const hasActiveFilter = (currentStatusMode !== 'all') || (currentLeague !== 'all') || (currentTimeFilter !== 'day');
        if (dot) dot.style.display = hasActiveFilter ? 'inline-block' : 'none';

        // 3. تحديث شريط عرض التاريخ
        updateDateNavDisplay();

        // 4. مزامنة أزرار نافذة الفلاتر المنبثقة
        const modal = document.getElementById('matchesFilterSheetModal');
        if (modal) {
            modal.querySelectorAll('.filter-chip-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.time === currentTimeFilter);
            });
            modal.querySelectorAll('.filter-status-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.status === currentStatusMode);
            });
            const selectEl = document.getElementById('filterLeagueSelect');
            if (selectEl && selectEl.value !== currentLeague) {
                selectEl.value = currentLeague;
            }
        }
    };

    // عرض دليل الدوريات والبطولات (SofaScore LEAGUES Tab)
    const renderLeaguesDirectory = () => {
        const container = document.getElementById('homeMatchesContainer');
        if (!container) return;

        // 1. جمع كافة الدوريات المعروفة + أي دوريات إضافية نشطة تحتوي على مباريات في هذا التاريخ
        const allKnownSportLeagues = MAJOR_LEAGUES.filter(l => l.sport === currentSport && l.code !== 'all');
        const knownCodes = new Set(allKnownSportLeagues.map(l => l.code));

        const extraActiveLeagues = [];
        (loadedMatchesEvents || []).forEach(ev => {
            const c = ev.leagueCode;
            if (c && !knownCodes.has(c) && !extraActiveLeagues.some(l => l.code === c)) {
                extraActiveLeagues.push({
                    code: c,
                    sport: currentSport,
                    name: ev.leagueMeta?.name || c,
                    shortName: ev.leagueMeta?.shortName || c,
                    country: ev.leagueMeta?.country || 'دولي',
                    logo: (ev.leagueMeta?.logo && ev.leagueMeta.logo !== './icon-192.png') ? ev.leagueMeta.logo : '',
                    flagImg: ev.leagueMeta?.flagImg || 'https://flagcdn.com/w40/un.png'
                });
                knownCodes.add(c);
            }
        });

        const combinedLeagues = [...allKnownSportLeagues, ...extraActiveLeagues];

        // ترتيب الدوريات: التي بها مباريات في هذا التاريخ أولاً مرتبة تنازلياً حسب عدد المباريات ثم أبجدياً
        const sortLeaguesList = (list) => {
            return list.sort((a, b) => {
                const countA = tournamentMatchCounts.get(a.code) || 0;
                const countB = tournamentMatchCounts.get(b.code) || 0;
                if (countA !== countB) return countB - countA;
                return (a.name || '').localeCompare(b.name || '', 'ar');
            });
        };

        const totalMatchesCount = loadedMatchesEvents.length;

        const renderLeagueRowHTML = (league) => {
            const count = tournamentMatchCounts.get(league.code) || 0;
            const isFav = favoriteLeagues.has(league.code);
            const isSelected = currentLeague === league.code;

            const hasValidLogo = league.logo && league.logo !== './icon-192.png' && league.logo.startsWith('http');
            const logoImg = hasValidLogo
                ? `<img src="${league.logo}" class="sofa-league-thumb" alt="" onerror="this.style.display='none'; const n = this.parentElement.querySelector('.sofa-country-flag'); if(n) n.style.display='inline-block';">`
                : '';
            const flagImg = league.flagImg
                ? `<img src="${league.flagImg}" class="sofa-country-flag" alt="" style="${hasValidLogo ? 'display:none;' : ''}" onerror="this.style.display='none'">`
                : `<span class="sofa-country-icon" style="${hasValidLogo ? 'display:none;' : ''}">⚽</span>`;

            return `
                <div class="sofa-league-row ${isSelected ? 'active' : ''}" onclick="selectLeagueFromDirectory('${league.code}')">
                    <div class="sofa-league-info">
                        ${logoImg}
                        ${flagImg}
                        <div class="sofa-league-names">
                            <span class="sofa-league-main-name">${league.name}</span>
                            <span class="sofa-league-sub-name">${league.country || 'دولي'}</span>
                        </div>
                    </div>
                    <div class="sofa-league-meta">
                        <span class="sofa-league-count-badge ${count > 0 ? 'has-matches' : ''}">${count}</span>
                        <button type="button" class="sofa-star-btn ${isFav ? 'is-fav' : ''}" 
                                onclick="event.stopPropagation(); toggleFavoriteLeague('${league.code}')" 
                                title="${isFav ? 'إزالة من المفضلة' : 'تثبيت في المفضلة'}">
                            <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                        </button>
                        <i class="fa-solid fa-chevron-left sofa-league-arrow"></i>
                    </div>
                </div>
            `;
        };

        let html = `
            <div class="sofa-leagues-dir">
                <div class="sofa-leagues-header">
                    <div style="font-weight:900; font-size:0.92rem; color:var(--text-main); display:flex; align-items:center; gap:7px;">
                        <i class="fa-solid fa-trophy" style="color:var(--accent-primary);"></i>
                        <span>قائمة الدوريات والبطولات المتاحة</span>
                    </div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:800;">${combinedLeagues.length} بطولة</span>
                </div>

                <!-- خيار جميع البطولات والدوريات -->
                <div class="sofa-league-row ${currentLeague === 'all' ? 'active' : ''}" onclick="selectLeagueFromDirectory('all')">
                    <div class="sofa-league-info">
                        <span class="sofa-country-icon">🌐</span>
                        <div class="sofa-league-names">
                            <span class="sofa-league-main-name">جميع البطولات والدوريات</span>
                            <span class="sofa-league-sub-name">تغطية شاملة لكل المباريات المباشرة والنتائج</span>
                        </div>
                    </div>
                    <div class="sofa-league-meta">
                        <span class="sofa-league-count-badge" style="background:var(--accent-bg); color:var(--accent-primary); font-weight:900;">${totalMatchesCount}</span>
                        <i class="fa-solid fa-chevron-left sofa-league-arrow"></i>
                    </div>
                </div>
        `;

        const favLeagues = sortLeaguesList(combinedLeagues.filter(l => favoriteLeagues.has(l.code)));
        const continentalLeagues = sortLeaguesList(combinedLeagues.filter(l => l.category === 'continental'));
        const domesticLeagues = sortLeaguesList(combinedLeagues.filter(l => l.category === 'domestic'));
        const otherActiveLeagues = sortLeaguesList(combinedLeagues.filter(l => !['continental', 'domestic'].includes(l.category)));

        if (favLeagues.length > 0) {
            html += `
                <div class="sofa-leagues-category-title">
                    <i class="fa-solid fa-star" style="color:var(--amber-accent);"></i>
                    <span>البطولات المفضلة والمثبتة</span>
                </div>
            `;
            favLeagues.forEach(l => { html += renderLeagueRowHTML(l); });
        }

        if (currentSport === 'soccer') {
            if (continentalLeagues.length > 0) {
                html += `
                    <div class="sofa-leagues-category-title">
                        <i class="fa-solid fa-trophy"></i>
                        <span>🏆 البطولات القارية والدولية</span>
                    </div>
                `;
                continentalLeagues.forEach(l => { html += renderLeagueRowHTML(l); });
            }

            if (domesticLeagues.length > 0) {
                html += `
                    <div class="sofa-leagues-category-title">
                        <i class="fa-solid fa-futbol"></i>
                        <span>⚽ الدوريات الأوروبية والعالمية</span>
                    </div>
                `;
                domesticLeagues.forEach(l => { html += renderLeagueRowHTML(l); });
            }

            if (otherActiveLeagues.length > 0) {
                html += `
                    <div class="sofa-leagues-category-title">
                        <i class="fa-solid fa-earth-americas"></i>
                        <span>🌐 دوريات وبطولات إضافية نشطة</span>
                    </div>
                `;
                otherActiveLeagues.forEach(l => { html += renderLeagueRowHTML(l); });
            }
        } else {
            html += `
                <div class="sofa-leagues-category-title">
                    <i class="fa-solid fa-basketball"></i>
                    <span>🏀 بطولات كرة السلة للمحترفين</span>
                </div>
            `;
            sortLeaguesList(combinedLeagues).forEach(l => { html += renderLeagueRowHTML(l); });
        }

        html += `</div>`;
        container.innerHTML = html;
    };

    window.selectLeagueFromDirectory = (leagueCode) => {
        currentLeague = leagueCode;
        window.currentLeague = leagueCode;
        switchMainView('games');
        syncFilterControlsUI();
        renderMatchesList(loadedMatchesEvents.length ? loadedMatchesEvents : (window.loadedMatchesEvents || []));
    };

    window.toggleFavoriteLeague = (leagueCode) => {
        if (!leagueCode) return;
        if (favoriteLeagues.has(leagueCode)) {
            favoriteLeagues.delete(leagueCode);
            showToast('⭐ تمت إزالة الدوري من المفضلة وإلغاء تثبيته');
        } else {
            favoriteLeagues.add(leagueCode);
            showToast('⭐ تم تمييز الدوري وتثبيته في الأعلى!');
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
            let emptyMsg = 'لا توجد مباريات مطابقة للخيارات المحددة';
            if (currentStatusMode === 'live') emptyMsg = 'لا توجد مباريات جارية الآن مباشرة (LIVE)';
            else if (currentLeague !== 'all') emptyMsg = 'لا توجد مباريات مطابقة لهذه البطولة في هذا التاريخ';

            container.innerHTML = `
                <div class="match-loading-card" style="padding: 24px 16px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">${currentStatusMode === 'live' ? '🔴' : '⚽'}</div>
                    <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">${emptyMsg}</div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin: 6px auto 14px auto; max-width: 320px; line-height: 1.5;">
                        ${query ? 'جرب البحث باسم فريق آخر أو مسح حقل البحث' : 'يمكنك إلغاء التصفية أو التبديل إلى تاريخ آخر بالأسهم في الأعلى.'}
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        ${currentLeague !== 'all' ? `
                            <button type="button" class="match-refresh-btn" onclick="selectLeagueFromDirectory('all')" style="padding: 7px 14px;">
                                <i class="fa-solid fa-list-ul"></i> عرض كل البطولات
                            </button>
                        ` : ''}
                        ${currentStatusMode === 'live' ? `
                            <button type="button" class="match-refresh-btn" onclick="toggleLiveFilter('all')" style="padding: 7px 14px;">
                                <i class="fa-solid fa-calendar-day"></i> كل مباريات اليوم
                            </button>
                        ` : ''}
                        <button type="button" class="match-refresh-btn" onclick="showAllAvailableMatches()" style="padding: 7px 14px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
                            <i class="fa-solid fa-globe"></i> كل المواعيد المتاحة
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

        // شريط تنبيه وجود تصفية ببطولة محددة
        if (currentLeague !== 'all') {
            const activeLeagueMeta = MAJOR_LEAGUES.find(l => l.code === currentLeague) || { name: currentLeague };
            html += `
                <div class="active-league-banner">
                    <div style="display:flex; align-items:center; gap:7px;">
                        <i class="fa-solid fa-trophy" style="color:var(--accent-primary);"></i>
                        <span>تصفية ببطولة: <b>${activeLeagueMeta.name}</b> (${filtered.length} مباراة)</span>
                    </div>
                    <button type="button" class="btn-clear-league-filter" onclick="selectLeagueFromDirectory('all')">
                        ✕ إلغاء وإظهار الكل
                    </button>
                </div>
            `;
        }

        // إذا تم اختيار فلتر "مباشر" حصراً، نعرض لافتة المباشر
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
        }

        // تجميع المباريات حسب التاريخ مع نظام الطي والفتح الذكي وتثبيت التاريخ أثناء التمرير (Sticky Date Headers)
        const dayGroups = {};
        filtered.forEach(ev => {
            const d = new Date(ev.date);
            const dayKey = d.toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!dayGroups[dayKey]) dayGroups[dayKey] = [];
            dayGroups[dayKey].push(ev);
        });

        const dayEntries = Object.entries(dayGroups);

        // شريط ملخص التصفية وأزرار الطي/التوسيع العام
        if (dayEntries.length > 0) {
            const isSingleDay = dayEntries.length === 1;
            const summaryIcon = isSingleDay ? 'fa-solid fa-trophy' : 'fa-regular fa-calendar-days';
            const uniqueLeaguesCount = new Set(filtered.map(ev => ev.leagueMeta?.name || ev.leagueCode)).size;
            const summaryText = isSingleDay
                ? `${uniqueLeaguesCount} دوريات (${filtered.length} مباراة)`
                : `${dayEntries.length} أيام (${filtered.length} مباراة)`;

            html += `
                <div class="day-groups-toolbar">
                    <span class="day-groups-summary">
                        <i class="${summaryIcon}"></i> ${summaryText}
                    </span>
                    <div class="day-groups-toggle-btns">
                        <button type="button" class="btn-group-toggle" onclick="toggleAllDayGroups(false)" title="فتح وتوسيع جميع القوائم">
                            <i class="fa-solid fa-angles-down"></i> توسيع الكل
                        </button>
                        <button type="button" class="btn-group-toggle" onclick="toggleAllDayGroups(true)" title="طي جميع القوائم">
                            <i class="fa-solid fa-angles-up"></i> طي الكل
                        </button>
                    </div>
                </div>
            `;
        }

        const DEFAULT_MATCHES_THRESHOLD = 20;
        let accumulatedOpenMatches = 0;
        const hasActiveSearch = Boolean(query);

        dayEntries.forEach(([dayTitle, matches], index) => {
            const dayId = `dayGroup_${index}`;
            let isCollapsed = false;

            if (dayEntries.length === 1 || hasActiveSearch) {
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

            // تقسيم مباريات هذا اليوم حسب البطولات والدوريات مع فرز وتثبيت الدوريات المميزة في الأعلى
            const dayLeagueGroups = {};
            matches.forEach(ev => {
                const lCode = ev.leagueCode || ev.leagueMeta?.code || 'unknown';
                const lKey = lCode + '_' + (ev.leagueMeta?.name || '');
                if (!dayLeagueGroups[lKey]) {
                    dayLeagueGroups[lKey] = {
                        leagueCode: lCode,
                        meta: ev.leagueMeta || { name: 'بطولة رياضية', country: 'دولي' },
                        matches: []
                    };
                }
                dayLeagueGroups[lKey].matches.push(ev);
            });

            // فرز الدوريات: الدوريات المميزة بنجمة تظهر أولاً في قمة اليوم
            const sortedLeagueGroups = Object.values(dayLeagueGroups).sort((a, b) => {
                const aCode = a.leagueCode || a.matches[0]?.leagueCode || '';
                const bCode = b.leagueCode || b.matches[0]?.leagueCode || '';
                const aFav = (aCode && favoriteLeagues.has(aCode)) ? 1 : 0;
                const bFav = (bCode && favoriteLeagues.has(bCode)) ? 1 : 0;
                if (aFav !== bFav) return bFav - aFav;
                return 0;
            });

            let dayCardsHtml = '';
            let dTournIdx = 0;
            for (const grp of sortedLeagueGroups) {
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
        const rawDetail = ev.status?.displayClock ? `${ev.status.displayClock} ${ev.status?.type?.detail || ''}` : (ev.status?.type?.detail || '');
        const statusDetail = isLive ? parseMinuteDetail(ev.id, rawDetail, ev.date) : rawDetail;

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

        const defaultTeamShield = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png';
        const homeLogo = getTeamLogoUrl(home.team, ev.sport || currentSport) || defaultTeamShield;
        const awayLogo = getTeamLogoUrl(away.team, ev.sport || currentSport) || defaultTeamShield;
        const homeName = home.team?.displayName || home.team?.name || 'المضيف';
        const awayName = away.team?.displayName || away.team?.name || 'الضيف';

        // 1. عمود التوقيت والدقائق (يسار) مع وميض الشرطة في المباريات المباشرة
        const matchTime = formatMatchTime(ev.date);
        let statusBottomHtml = '';

        if (isLive) {
            statusBottomHtml = formatLiveMinuteHTML(statusDetail);
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
        const safeAwayName = (awayName || '').replace(/'/g, "\\'");

        // 3. فحص البطاقات الحمراء (بطاقة حمراء منفردة وأنيقة) وربط الحاسبة بالصفقات النشطة (In-Play Hedge)
        const homeRed = getTeamRedCardCount(ev, home.id || home.team?.id);
        const awayRed = getTeamRedCardCount(ev, away.id || away.team?.id);
        const homeRedHtml = homeRed > 0 ? `<span class="red-card-badge ${homeRed > 1 ? 'has-multiple' : ''}" title="بطاقة حمراء (طرد)">${homeRed > 1 ? homeRed : ''}</span>` : '';
        const awayRedHtml = awayRed > 0 ? `<span class="red-card-badge ${awayRed > 1 ? 'has-multiple' : ''}" title="بطاقة حمراء (طرد)">${awayRed > 1 ? awayRed : ''}</span>` : '';

        const hedgeSlip = getActiveHedgeSlip(homeName, awayName);
        const hedgePillHtml = hedgeSlip
            ? `<span class="hedge-active-pill" onclick="event.stopPropagation(); openInPlayHedge('${safeHomeName} vs ${safeAwayName}')" title="تأمين وفتح حاسبة الهيدج المباشر (Hedge O₂)"><i class="fa-solid fa-bolt"></i> صفقة نشطة O₂</span>`
            : '';

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
                        <img src="${homeLogo}" alt="" class="sofa-row-crest" loading="lazy" onerror="this.onerror=null; this.src='${defaultTeamShield}';">
                        <span class="sofa-row-team-name">${homeName} ${homeRedHtml}</span>
                    </div>
                    <div class="sofa-row-team ${awayWon ? 'is-winner' : (homeWon ? 'is-loser' : '')}">
                        <img src="${awayLogo}" alt="" class="sofa-row-crest" loading="lazy" onerror="this.onerror=null; this.src='${defaultTeamShield}';">
                        <span class="sofa-row-team-name">${awayName} ${awayRedHtml}</span>
                    </div>
                    ${hedgePillHtml ? `<div style="margin-top:2px;">${hedgePillHtml}</div>` : ''}
                </div>

                <!-- عمود النتيجة (يمين) -->
                <div class="sofa-row-scores-col">
                    ${homeScoreHtml}
                    ${awayScoreHtml}
                </div>
            </div>
        `;
    }

    function renderTournamentGroup(grp, tournId, isCollapsed = false) {
        const lCode = grp.leagueCode || grp.matches[0]?.leagueCode || grp.meta?.code || '';
        const isFav = Boolean(lCode && favoriteLeagues.has(lCode));
        const matchedMajor = MAJOR_LEAGUES.find(l => l.code === lCode && l.sport === (grp.matches[0]?.sport || currentSport));
        const metaLogo = (grp.meta?.logo && grp.meta.logo !== './icon-192.png' && grp.meta.logo.startsWith('http')) ? grp.meta.logo : (matchedMajor?.logo || '');
        const metaFlag = (grp.meta?.flagImg && grp.meta.flagImg.startsWith('http')) ? grp.meta.flagImg : (matchedMajor?.flagImg || '');
        const hasValidLogo = metaLogo && metaLogo !== './icon-192.png' && metaLogo.startsWith('http');
        const hasValidFlag = metaFlag && metaFlag.startsWith('http');
        
        const logoImg = hasValidLogo
            ? `<img src="${metaLogo}" class="sofa-tourn-logo" alt="" onerror="this.style.display='none'; const n = this.parentElement.querySelector('.sofa-tourn-flag'); if(n && n.getAttribute('src')) { n.style.display='inline-block'; } else { const f = this.parentElement.querySelector('.sofa-tourn-fallback-icon'); if(f) f.style.display='inline-block'; }">`
            : '';
        const flagImg = hasValidFlag
            ? `<img src="${metaFlag}" class="sofa-tourn-flag" alt="" style="${hasValidLogo ? 'display:none;' : ''}" onerror="this.style.display='none'; const f = this.parentElement.querySelector('.sofa-tourn-fallback-icon'); if(f) f.style.display='inline-block';">`
            : '';
        const fallbackIcon = `<span class="sofa-tourn-fallback-icon" style="${(hasValidLogo || hasValidFlag) ? 'display:none;' : 'display:inline-block;'}">🏆</span>`;

        let matchesHtml = '';
        grp.matches.forEach(ev => {
            matchesHtml += buildMatchCardHTML(ev);
        });

        return `
            <div class="sofa-tournament-card ${isFav ? 'is-favorite-league' : ''} ${isCollapsed ? 'is-collapsed' : ''}" id="${tournId}">
                <div class="sofa-tourn-header" onclick="toggleTournGroup('${tournId}')" role="button" tabindex="0" aria-expanded="${!isCollapsed}" title="انقر لطي أو فتح مباريات هذه البطولة">
                    <div class="sofa-tourn-title-wrap">
                        ${logoImg}
                        ${flagImg}
                        ${fallbackIcon}
                        <div class="sofa-tourn-titles">
                            <span class="sofa-tourn-name">${grp.meta.name}</span>
                            <span class="sofa-tourn-country">${grp.meta.country || 'دولي'}</span>
                        </div>
                    </div>
                    <div class="sofa-tourn-meta">
                        <span class="sofa-tourn-count">${grp.matches.length} مباريات</span>
                        <button type="button" class="sofa-star-btn ${isFav ? 'is-fav' : ''}" 
                                onclick="event.stopPropagation(); toggleFavoriteLeague('${lCode || tournId}')" 
                                title="${isFav ? 'إلغاء تمييز الدوري من المفضلة' : 'تثبيت وتمييز هذا الدوري في المفضلة بالأعلى'}">
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
            const stakeInput = document.getElementById('t2InitialStake');
            const odds1Input = document.getElementById('t2InitialOdds');
            if (stakeInput && !stakeInput.value) stakeInput.value = '100';
            if (odds1Input && !odds1Input.value) odds1Input.value = '2.10';
            stakeInput?.dispatchEvent(new Event('input'));
        } else if (btnModeArbitrage) {
            btnModeArbitrage.click();
            const cap = document.getElementById('capital');
            const r1 = document.getElementById('ratio1');
            const r2 = document.getElementById('ratio2');
            if (cap && !cap.value) cap.value = '100';
            if (r1 && !r1.value) r1.value = '2.10';
            if (r2 && !r2.value) r2.value = '2.00';
            cap?.dispatchEvent(new Event('input'));
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

    // ==================== نظام شريط الأخبار الرياضية العاجلة والنافذة المنبثقة ====================
    const newsCache = new Map(); // key -> { articles: Array, timestamp: number }
    const NEWS_CACHE_TTL = 15 * 60 * 1000; // 15 دقيقة
    let currentTickerArticles = [];

    const escapeHtml = (str) => {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const formatRelativeNewsTime = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            const diffMs = Date.now() - d.getTime();
            const diffSec = Math.floor(diffMs / 1000);
            if (diffSec < 60) return 'الآن';
            const diffMin = Math.floor(diffSec / 60);
            if (diffMin < 60) return `منذ ${diffMin} د`;
            const diffHour = Math.floor(diffMin / 60);
            if (diffHour < 24) return `منذ ${diffHour} س`;
            const diffDay = Math.floor(diffHour / 24);
            if (diffDay === 1) return 'أمس';
            if (diffDay < 7) return `منذ ${diffDay} أيام`;
            return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        } catch {
            return '';
        }
    };

    const fetchLeagueNews = async (sport = currentSport, leagueCode = currentLeague) => {
        let targetCode = leagueCode;
        if (sport === 'basketball') {
            targetCode = 'nba';
        } else {
            if (!targetCode || targetCode === 'all') {
                targetCode = 'eng.1';
            }
        }

        const cacheKey = `${sport}_${targetCode}`;
        const now = Date.now();
        if (newsCache.has(cacheKey)) {
            const entry = newsCache.get(cacheKey);
            if (now - entry.timestamp < NEWS_CACHE_TTL && entry.articles?.length > 0) {
                return entry.articles;
            }
        }

        try {
            let url = '';
            if (sport === 'basketball') {
                url = 'https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/news';
            } else {
                url = `https://site.web.api.espn.com/apis/site/v2/sports/soccer/${targetCode}/news`;
            }

            let res = await fetch(url);
            let data = null;
            if (res.ok) {
                data = await res.json();
            }

            let articles = data?.articles || [];

            // إذا لم يتوفر أي خبر لهذا الدوري وكان كرة قدم، نستخدم الدوري الإنجليزي الممتاز كبديل احترافي
            if ((!articles || articles.length === 0) && sport === 'soccer' && targetCode !== 'eng.1') {
                const fallbackRes = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/soccer/eng.1/news').catch(() => null);
                if (fallbackRes && fallbackRes.ok) {
                    const fbData = await fallbackRes.json();
                    articles = fbData?.articles || [];
                }
            }

            articles = (articles || []).filter(a => a && (a.headline || a.description));

            if (articles.length > 0) {
                newsCache.set(cacheKey, { articles, timestamp: now });
            }

            return articles;
        } catch (err) {
            console.warn('[NewsTicker] Error loading news:', err);
            return [];
        }
    };

    const renderNewsTicker = (articles) => {
        const container = document.getElementById('newsTickerContainer');
        const track = document.getElementById('newsTickerTrack');
        if (!container || !track) return;

        if (!articles || articles.length === 0) {
            container.style.display = 'none';
            return;
        }

        currentTickerArticles = articles;

        const segmentHTML = articles.map((art, idx) => {
            const headline = escapeHtml(art.headline || art.description || '');
            const relTime = formatRelativeNewsTime(art.published);
            return `
                <div class="news-ticker-item" onclick="openNewsDetailModal(${idx})" role="button" tabindex="0" title="${headline}">
                    <span class="news-ticker-dot">●</span>
                    <span class="news-ticker-text">${headline}</span>
                    ${relTime ? `<span class="news-ticker-time">${relTime}</span>` : ''}
                    <span class="news-ticker-sep">•</span>
                </div>
            `;
        }).join('');

        // تكرار الأخبار مرتين لضمان حلقة شريط مستمرة وسلسة دون أي فواصل
        track.innerHTML = `
            <div class="news-ticker-segment">${segmentHTML}</div>
            <div class="news-ticker-segment" aria-hidden="true">${segmentHTML}</div>
        `;

        container.style.display = 'flex';
    };

    const fetchAndRenderNewsTicker = async (sport = currentSport, leagueCode = currentLeague) => {
        const articles = await fetchLeagueNews(sport, leagueCode);
        renderNewsTicker(articles);
    };

    const openNewsDetailModal = (articleOrIndex) => {
        let article = null;
        if (typeof articleOrIndex === 'number') {
            article = currentTickerArticles[articleOrIndex];
        } else if (articleOrIndex && typeof articleOrIndex === 'object') {
            article = articleOrIndex;
        }

        if (!article) return;

        const modal = document.getElementById('newsDetailModal');
        const body = document.getElementById('newsModalBody');
        if (!modal || !body) return;

        const headline = escapeHtml(article.headline || article.description || 'تفاصيل الخبر الرياضي');
        const imgUrl = article.images?.[0]?.url || (typeof article.image === 'string' ? article.image : '');
        const relTime = formatRelativeNewsTime(article.published);
        const byline = article.byline ? escapeHtml(article.byline) : '';
        const webHref = article.links?.web?.href || article.link || '';

        // استخراج وتنسيق محتوى الخبر
        let storyContent = '';
        if (article.story) {
            storyContent = article.story;
        } else if (article.description) {
            storyContent = `<p>${escapeHtml(article.description)}</p>`;
        } else {
            storyContent = `<p>${headline}</p>`;
        }

        body.innerHTML = `
            ${imgUrl ? `
                <div class="news-modal-hero-img-wrap">
                    <img src="${imgUrl}" class="news-modal-hero-img" alt="${headline}" onerror="this.parentElement.style.display='none'">
                </div>
            ` : ''}

            <h2 class="news-modal-headline">${headline}</h2>

            <div class="news-modal-meta">
                ${relTime ? `
                    <div class="news-modal-meta-item">
                        <i class="fa-regular fa-clock"></i>
                        <span>${relTime}</span>
                    </div>
                ` : ''}
                ${byline ? `
                    <div class="news-modal-meta-item">
                        <i class="fa-solid fa-pen-nib"></i>
                        <span>${byline}</span>
                    </div>
                ` : ''}
                <div class="news-modal-meta-item">
                    <i class="fa-solid fa-satellite-dish"></i>
                    <span>ESPN Global Sports</span>
                </div>
            </div>

            <!-- حاوية نص الخبر مع ضبطها بالكامل dir="ltr" ومحاذاة يسار text-align: left للحفاظ على جمالية الإنجليزية -->
            <div class="news-modal-story-wrap" dir="ltr">
                ${storyContent}
            </div>

            <div class="news-modal-actions">
                ${webHref ? `
                    <a href="${webHref}" target="_blank" rel="noopener noreferrer" class="news-source-btn">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        <span>قراءة التقرير الكامل على ESPN</span>
                    </a>
                ` : ''}
                <button type="button" class="news-modal-close-btn" onclick="closeNewsDetailModal(false)">
                    <i class="fa-solid fa-xmark"></i>
                    <span>إغلاق النافذة</span>
                </button>
            </div>
        `;

        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('news-modal-open');
        });

        // تسجيل النافذة في سجل التاريخ لدعم زر الرجوع بالهاتف
        if (typeof window.pushModalHistory === 'function') {
            window.pushModalHistory('newsDetailModal', () => closeNewsDetailModal(true));
        }
    };

    const closeNewsDetailModal = (fromPopState = false) => {
        const modal = document.getElementById('newsDetailModal');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('news-modal-open');

        if (!fromPopState && typeof window.popModalHistory === 'function') {
            window.popModalHistory('newsDetailModal');
        }

        setTimeout(() => {
            if (!modal.classList.contains('open')) {
                modal.style.display = 'none';
            }
        }, 250);
    };

    // ربط أحداث نافذة الأخبار المنبثقة
    const initNewsModalEvents = () => {
        const closeBtn = document.getElementById('closeNewsModalBtn');
        const closeX = document.getElementById('closeNewsModalX');
        const modal = document.getElementById('newsDetailModal');

        if (closeBtn) closeBtn.addEventListener('click', () => closeNewsDetailModal(false));
        if (closeX) closeX.addEventListener('click', () => closeNewsDetailModal(false));
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeNewsDetailModal(false);
            });
        }

        const trackWrap = document.getElementById('newsTickerTrackWrap');
        const track = document.getElementById('newsTickerTrack');
        if (trackWrap && track) {
            trackWrap.addEventListener('touchstart', () => track.classList.add('paused'), { passive: true });
            trackWrap.addEventListener('touchend', () => track.classList.remove('paused'), { passive: true });
        }
    };

    // تهيئة مبدئية لأحداث الأخبار
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNewsModalEvents);
    } else {
        initNewsModalEvents();
    }

    // مزامنة أولية لشريط الخيارات
    syncNavSummaryChips();

    // الربط والتصدير الخارجي
    window.loadMatches = loadMatches;
    window.renderMatchesList = renderMatchesList;
    window.updateMatchesDOMInPlace = updateMatchesDOMInPlace;
    window.toggleFavoriteMatch = toggleFavoriteMatch;
    window.getTeamRedCardCount = getTeamRedCardCount;
    window.buildMatchCardHTML = buildMatchCardHTML;
    window.MAJOR_LEAGUES = MAJOR_LEAGUES;
    window.getSelectedDate = () => selectedDate;
    window.parseMinuteDetail = parseMinuteDetail;
    window.initLiveMinuteTicker = initLiveMinuteTicker;
    window.initLiveAutoFetch = initLiveAutoFetch;
    window.formatMatchTime = formatMatchTime;
    window.getTeamLogoUrl = getTeamLogoUrl;
    window.syncNavSummaryChips = syncNavSummaryChips;
    window.openNewsDetailModal = openNewsDetailModal;
    window.closeNewsDetailModal = closeNewsDetailModal;
    window.fetchAndRenderNewsTicker = fetchAndRenderNewsTicker;
    window.fetchLeagueNews = fetchLeagueNews;
})();
