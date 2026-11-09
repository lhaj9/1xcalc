// ==================== نظام التدويل واللغات (i18n Localization Engine) ====================
const I18N_TRANSLATIONS = {
    ar: {
        app_title: '1XCALC PRO',
        live_now: 'مباشر الآن',
        upcoming_matches: 'المباريات القادمة والجدول',
        all_matches: 'جميع المباريات',
        arbitrage: 'التغطية الآنية (Arbitrage)',
        delayed: 'المتأخرة والمباشر (Live)',
        slips: 'القسائم',
        history: 'السجل',
        settings: 'الإعدادات',
        football: 'كرة القدم',
        basketball: 'كرة السلة',
        save: 'حفظ',
        cancel: 'إلغاء',
        apply: 'تطبيق',
        close: 'إغلاق',
        reset: 'تصفير'
    },
    en: {
        app_title: '1XCALC PRO',
        live_now: 'LIVE Now',
        upcoming_matches: 'Pre-match & Schedule',
        all_matches: 'All Matches',
        arbitrage: 'Arbitrage (Dutching)',
        delayed: 'In-Play Delayed Hedge',
        slips: 'Betslips',
        history: 'History',
        settings: 'Settings',
        football: 'Football',
        basketball: 'Basketball',
        save: 'Save',
        cancel: 'Cancel',
        apply: 'Apply',
        close: 'Close',
        reset: 'Reset'
    },
    fr: {
        app_title: '1XCALC PRO',
        live_now: 'En direct (LIVE)',
        upcoming_matches: 'Matchs à venir & Calendrier',
        all_matches: 'Tous les matchs',
        arbitrage: 'Arbitrage (Dutching)',
        delayed: 'Couverture différée (Live)',
        slips: 'Coupons',
        history: 'Historique',
        settings: 'Paramètres',
        football: 'Football',
        basketball: 'Basket-ball',
        save: 'Enregistrer',
        cancel: 'Annuler',
        apply: 'Appliquer',
        close: 'Fermer',
        reset: 'Réinitialiser'
    }
};

let currentLang = localStorage.getItem('arb_app_lang') || 'ar';

function t(key, defaultVal = '') {
    return (I18N_TRANSLATIONS[currentLang] && I18N_TRANSLATIONS[currentLang][key]) || defaultVal || key;
}

function setAppLanguage(lang) {
    if (I18N_TRANSLATIONS[lang]) {
        currentLang = lang;
        localStorage.setItem('arb_app_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
}
