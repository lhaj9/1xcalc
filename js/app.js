const htmlEl = document.documentElement;

        // ==================== محتوى دليل الاستخدام المدمج (README.md) ومحلل المارك داون ====================
        const FALLBACK_README_MD = `
# ⚡ مدير وحاسبة الصفقات الرياضية الاحترافية

تطبيق ويب تقدمي (PWA) متكامل ومصمم خصيصاً للهواتف الذكية (Mobile-First)، يساعدك على حساب صفقات التغطية الرياضية بدقة لحظية، والتخطيط لاستراتيجيات التغطية المتأخرة أثناء المباريات المباشرة، مع محاكي فوري للاحتمالات ولوحة احترافية لإدارة القسائم.

## 🎯 الغاية والمميزات العامة

* **السرعة والدقة اللحظية:** استخراج المبالغ المطلوبة ونسب الربح الصافية بمجرد كتابة الأرقام دون الحاجة للنقر على أزرار حساب تقليدية.
* **التخطيط والمحاكاة المباشرة:** معرفة الاحتمال المستهدف للرهان المعاكس، أو إدخال أي احتمال وصل إليه السوق حالياً لمعرفة ما إذا كان رابحاً أم خاسراً ومقارنته مع الهدف.
* **تطبيق هاتف متكامل (PWA):** قابل للتثبيت على الشاشة الرئيسية، يعمل بملء الشاشة وبدون إنترنت مع حفظ تلقائي آمن عبر الذاكرة المحلية.

---

## 1️⃣ التغطية الثنائية الآنية (Arbitrage / Dutching)

يُستخدم هذا القسم عندما يكون لديك خياران متعاكسان متاحان في نفس اللحظة، وترغب في توزيع رأس مال محدد بينهما بحيث تحصل على نفس العائد المالي مهما كان الخيار الفائز.

### المدخلات والمخرجات

* **المدخلات:** رأس المال الإجمالي المراد توزيعه، واحتمال الخيار الأول (الأزرق) واحتمال الخيار الثاني (الأخضر).
* **شريط الحالة الذكي:** يوضح نسبة الربح أو الخسارة وصافي المبلغ، ويتحول إلى اللون الأخضر إذا كانت المعادلة رابحة، وإلى الأحمر مع شطب النتائج إذا كانت النسب لا تحقق ربحاً.
* **توزيع المبالغ:** يعرض المبلغ الدقيق الواجب وضعه في كل خيار مع زر نسخ سريع، وإمكانية حفظ المعادلة مباشرة كقسيمة مباراة مؤمّنة.

### طريقة الحساب

* **مبلغ الخيار الأول:** رأس المال × احتمال الخيار الثاني ÷ (احتمال الخيار الأول + احتمال الخيار الثاني).
* **مبلغ الخيار الثاني:** رأس المال × احتمال الخيار الأول ÷ (احتمال الخيار الأول + احتمال الخيار الثاني).
* **العائد المضمون:** مبلغ الخيار الأول × احتماله = مبلغ الخيار الثاني × احتماله.
* **صافي الربح:** العائد المضمون − رأس المال.

---

## 2️⃣ التغطية المتأخرة أثناء المباشر (In-Play Delayed Hedge)

صُمم هذا القسم للاستراتيجيات التي تعتمد على عامل الوقت في المباريات المباشرة: تدخل في بداية المباراة على خيار، ثم تنتظر حتى يرتفع احتمال الخيار المعاكس للدخول فيه وتأمين ربح مضمون.

### طرق الإدخال المتاحة

1. **إدخال مبلغ الرهان الأول فقط:** تدخل المبلغ الذي لعبته فعلياً في الرهان الأول، ويحسب لك التطبيق المبلغ الإضافي المطلوب للرهان الثاني.
2. **تحديد رأس المال الكلي للرهانين:** تحدد سقف ميزانيتك الكاملة للصفقة، فيقوم التطبيق بتقسيمها ليخبرك بكم تدخل في الرهان الأول وكم تترك للرهان الثاني.

### 🎯 استهداف نسبة ربح محددة

* اختر نسبة الربح المطلوبة من الشرائح السريعة (0% لتأمين رأس المال، 5%، 10%، 15%، 20%، 25%، 30%، 50%) أو أدخل أي نسبة مخصصة.
* يعرض لك التطبيق الاحتمال المطلوب انتظاره للرهان الثاني، والمبلغ الدقيق للدخول فيه.

### 🔍 محاكي وفاحص الاحتمال الفعلي (O2)

* يتيح لك إدخال **الاحتمال الفعلي الذي وصل إليه الخيار الثاني حالياً في المباراة** دون انتظار وصوله للنسبة المستهدفة.
* يعرض لك المحاكي فوراً:
  * هل الدخول عند هذا الاحتمال **رابح أم خاسر**.
  * المبلغ المطلوب للدخول به (S2) وصافي الربح والنسبة المئوية.
  * **مقارنة مباشرة مع هدفك الأساسي:** بكم يزيد أو ينقص عن ربحك المستهدف.
* زر **اعتماد هذا الاحتمال كخطة حالية** لتطبيقه على الجدول والخلاصة.

### 📋 جدول خطط التغطية

جدول يعرض كل نسب الأرباح وما يقابلها من احتمالات ومبالغ. عند النقر على أي سطر يتم اختياره فوراً وتحديث الحسابات.

---

## 3️⃣ إدارة القسائم والصفقات (Slips Manager)

لوحة تحكم احترافية لإدارة صفقاتك الجارية والمنتهية بتصميم بطاقات مدمجة قابلة للتوسيع.

### 📊 لوحة إحصائيات المحفظة

* **صافي الأرباح المحققة (Realized P&L):** مع تفصيل صريح لإجمالي الأرباح الخضراء وإجمالي الخسائر الحمراء.
* **العائد على الاستثمار (ROI%) ونسبة النجاح (Win Rate%):** نسبة الأرباح إلى إجمالي رأس المال المستثمر، ونسبة الصفقات الرابحة مقارنة بالخاسرة.
* **المبالغ المستثمرة النشطة:** مجموع المبالغ المحجوزة حالياً في القسائم قيد اللعب.
* **عدادات الصفقات:** إحصاء مباشر لعدد الصفقات قيد الانتظار، المؤمّنة، الرابحة، والخاسرة.

### 🎟️ البطاقات التفاعلية وحاسبة القسيمة

* عند إنشاء قسيمة من التبويب الثاني، تُحفظ بالرهان الأول فقط تحت حالة **"⏳ بانتظار التغطية"** وتظهر بتصميم مدمج وأنيق.
* **عند النقر على أي قسيمة** تتوسع لتكشف عن تفاصيل الرهانين و**محاكي مباشر داخل القسيمة** يمكّنك من إدخال احتمال الرهان الثاني (O2) لتحديث الحسابات لحظياً.
* يمكنك بضغطة زر اختيار:
  * **اعتماد الرهان الثاني وإغلاق القسيمة فوراً.**
  * **تأمين القسيمة وإبقاء المباراة جارية.**
  * **تسجيل ربح الرهان الأول فقط.**
  * **تسجيل خسارة الرهان الأول مبكراً.**
  * **إغلاق يدوي (Cashout)** بإدخال المبلغ المستلم فعلياً.
* يمكنك أيضاً **إعادة فتح القسيمة** أو **تعديل اسمها** أو **حذفها**.

### 🔎 الفلاتر والبحث

* شريط بحث نصي للوصول السريع لأي مباراة أو سوق بالاسم.
* تصنيف الصفقات حسب الحالة: الكل، ⏳ انتظار التغطية، 🛡️ مؤمّنة، ✅ رابحة، ❌ خاسرة.

---

## ⚙️ الإعدادات والنسخ الاحتياطي والتثبيت

من خلال أيقونة الإعدادات (⚙️) في أعلى التطبيق يمكنك:

* **تبديل المظهر** بين الوضع المظلم (Dark) والوضع الفاتح (Light).
* **اختيار رمز العملة المفضل** (\`$\`، \`USDT\`، \`MAD\`، \`€\`)، وتحديد الفواصل العشرية للمبالغ.
* **تحديد رأس المال الافتراضي** الذي تبدأ به شاشة الحسابات.
* **تصدير واستعادة نسخة احتياطية (\`JSON\`):** لحفظ كافة قسائمك وسجلاتك أو نقلها لجهاز آخر بأمان.
* **مسح الذاكرة:** مسح السجلات اللحظية أو تصفير القسائم بشكل مستقل.
* **تثبيت التطبيق على الهاتف:** عبر زر التثبيت المباشر في الإعدادات أو من خلال "إضافة إلى الشاشة الرئيسية" في متصفح Chrome أو Safari.
        `;

        const formatInlineMd = (text) => {
            return text
                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                .replace(/`([^`]+)`/g, '<code>$1</code>');
        };

        const renderMarkdownToHtml = (mdText) => {
            const sections = mdText.replace(/\r\n/g, '\n').split(/\n\s*---+\s*\n/);
            return sections.map((sec, idx) => {
                const lines = sec.trim().split('\n');
                let html = `<div class="md-sec-card" id="sec-${idx}">`;
                const listStack = [];

                const closeLists = () => {
                    while (listStack.length) {
                        const item = listStack.pop();
                        html += `</li></${item.type}>`;
                    }
                };

                const openList = (type, indent) => {
                    html += `<${type}>`;
                    listStack.push({ type, indent });
                    html += '<li>';
                };

                const addListItem = (type, indent, content) => {
                    if (!listStack.length) {
                        openList(type, indent);
                        html += content;
                        return;
                    }

                    let top = listStack[listStack.length - 1];
                    if (indent > top.indent) {
                        openList(type, indent);
                        html += content;
                        return;
                    }

                    while (listStack.length && indent < listStack[listStack.length - 1].indent) {
                        const item = listStack.pop();
                        html += `</li></${item.type}>`;
                    }

                    if (!listStack.length) {
                        openList(type, indent);
                        html += content;
                        return;
                    }

                    top = listStack[listStack.length - 1];
                    if (indent === top.indent && type === top.type) {
                        html += '</li><li>' + content;
                        return;
                    }

                    if (indent === top.indent) {
                        const item = listStack.pop();
                        html += `</li></${item.type}>`;
                        openList(type, indent);
                        html += content;
                        return;
                    }

                    openList(type, indent);
                    html += content;
                };

                lines.forEach(rawLine => {
                    const line = rawLine.replace(/\s+$/, '');
                    const trimmed = line.trim();
                    if (!trimmed) {
                        closeLists();
                        return;
                    }
                    const indent = line.length - line.trimStart().length;
                    let match;

                    if ((match = trimmed.match(/^(#{1,6})\s+(.*)$/))) {
                        closeLists();
                        const level = Math.min(match[1].length, 4);
                        html += `<h${level}>${formatInlineMd(match[2])}</h${level}>`;
                        return;
                    }

                    if (/^([-*_])\1{2,}$/.test(trimmed)) {
                        closeLists();
                        html += '<hr>';
                        return;
                    }

                    if ((match = trimmed.match(/^[*\-]\s+(.*)$/))) {
                        addListItem('ul', indent, formatInlineMd(match[1]));
                        return;
                    }

                    if ((match = trimmed.match(/^\d+\.\s+(.*)$/))) {
                        addListItem('ol', indent, formatInlineMd(match[1]));
                        return;
                    }

                    if ((match = trimmed.match(/^>\s+(.*)$/))) {
                        closeLists();
                        html += `<blockquote>${formatInlineMd(match[1])}</blockquote>`;
                        return;
                    }

                    closeLists();
                    html += `<p>${formatInlineMd(trimmed)}</p>`;
                });

                closeLists();
                html += '</div>';
                return html;
            }).join('');
        };

        const loadAndRenderGuide = async () => {
            const container = document.getElementById('markdownViewerContainer');
            // عرض الشرح المدمج فوراً بدون أي تأخير
            container.innerHTML = renderMarkdownToHtml(FALLBACK_README_MD);

            // محاولة جلب نسخة محدّثة من ملف README.md المحلي (إن وُجد)
            try {
                const res = await fetch('./README.md', { cache: 'no-cache' });
                if (res.ok) {
                    const text = await res.text();
                    if (text && text.trim().length > 100 && !text.includes('الجديد في هذا التحديث')) {
                        container.innerHTML = renderMarkdownToHtml(text);
                    }
                }
            } catch (_) { }
        };

        // فتح وإغلاق نافذة دليل الاستخدام (علامة الاستفهام)
        const helpGuideModal = document.getElementById('helpGuideModal');
        document.getElementById('openHelpBtn').addEventListener('click', () => {
            helpGuideModal.classList.add('open');
            loadAndRenderGuide();
        });
        document.getElementById('closeHelpBtn').addEventListener('click', () => {
            helpGuideModal.classList.remove('open');
        });
        helpGuideModal.addEventListener('click', (e) => {
            if (e.target === helpGuideModal) helpGuideModal.classList.remove('open');
        });

        // أزرار التنقل السريع داخل نافذة الشرح
        document.querySelectorAll('.help-nav-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.help-nav-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const targetEl = document.getElementById(pill.dataset.scrollSec);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // ==================== نظام التثبيت الذكي (PWA + iOS) ====================
        let deferredPrompt = null;
        const firstVisitBanner = document.getElementById('firstVisitInstallBanner');
        const settingsInstallBtn = document.getElementById('settingsInstallBtn');
        const iosInstallModal = document.getElementById('iosInstallModal');

        const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
        const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(() => { });
            });
        }

        const updateInstallUI = () => {
            const isAlreadyInstalled = isStandalone() || localStorage.getItem('arb_pwa_installed') === 'true';
            const isBannerDismissed = localStorage.getItem('arb_pwa_banner_dismissed') === 'true';

            if (isAlreadyInstalled) {
                firstVisitBanner.classList.remove('show');
                settingsInstallBtn.classList.add('installed');
                settingsInstallBtn.innerHTML = '<span>✅ التطبيق مثبّت بالفعل على جهازك</span>';
                return;
            }
            if (!isBannerDismissed && (deferredPrompt || isIos())) {
                firstVisitBanner.classList.add('show');
            }
        };

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            updateInstallUI();
        });

        window.addEventListener('appinstalled', () => {
            localStorage.setItem('arb_pwa_installed', 'true');
            deferredPrompt = null;
            updateInstallUI();
            showToast('🎉 تم تثبيت التطبيق بنجاح على جهازك!');
        });

        const triggerAppInstall = async () => {
            if (isStandalone() || localStorage.getItem('arb_pwa_installed') === 'true') {
                showToast('التطبيق مثبّت بالفعل على جهازك!');
                return;
            }
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    localStorage.setItem('arb_pwa_installed', 'true');
                    firstVisitBanner.classList.remove('show');
                }
                deferredPrompt = null;
                updateInstallUI();
            } else if (isIos()) {
                document.getElementById('settingsModal').classList.remove('open');
                iosInstallModal.classList.add('open');
            } else {
                showToast('للتثبيت: افتح قائمة المتصفح (⋮) واختر "تثبيت التطبيق"');
            }
        };

        document.getElementById('bannerInstallTrigger').addEventListener('click', triggerAppInstall);
        settingsInstallBtn.addEventListener('click', triggerAppInstall);

        document.getElementById('bannerDismissBtn').addEventListener('click', () => {
            localStorage.setItem('arb_pwa_banner_dismissed', 'true');
            firstVisitBanner.classList.remove('show');
        });

        document.getElementById('closeIosModalBtn').addEventListener('click', () => iosInstallModal.classList.remove('open'));
        document.getElementById('iosGotItBtn').addEventListener('click', () => {
            localStorage.setItem('arb_pwa_banner_dismissed', 'true');
            firstVisitBanner.classList.remove('show');
            iosInstallModal.classList.remove('open');
        });


        // ==================== نظام التنقل الشامل (Tabs & Navigation System) ====================
        const availableTabs = ['tabHome', 'tabCalc', 'tab3', 'tab4', 'tabMenu'];

        const switchTab = (tabId) => {
            if (!availableTabs.includes(tabId)) return;

            // 1. تفعيل اللوح المستهدف
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) targetPanel.classList.add('active');

            // 2. تحديث الشريط السفلي 1xBet
            document.querySelectorAll('.bottom-nav-item').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabId);
            });

            // 3. تحديث شريط الحبوب العلوي
            document.querySelectorAll('.cat-pill').forEach(pill => {
                const isActive = pill.dataset.tab === tabId;
                pill.classList.toggle('active', isActive);
                if (isActive) {
                    pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });

            // 4. تحديث الأزرار العلوية السريعة
            document.querySelectorAll('.tab-trigger').forEach(trg => {
                trg.classList.toggle('active', trg.dataset.targetTab === tabId);
            });

            // إعادة ضبط وضع تركيز القسائم عند مغادرة قسم القسائم
            if (tabId !== 'tab3') {
                expandedSlipIds.clear();
                const tab3El = document.getElementById('tab3');
                if (tab3El) tab3El.classList.remove('has-focused-slip');
                document.querySelectorAll('.slip-ticket.expanded').forEach(el => el.classList.remove('expanded'));
            }

            // 5. استدعاء ريندر التبويب المحدد
            if (tabId === 'tabHome') {
                if (loadedMatchesEvents.length === 0) {
                    loadMatches();
                }
            } else if (tabId === 'tabCalc') {
                // تفعيل التحديث للحسابات
            } else if (tabId === 'tab3') {
                renderSlips();
            } else if (tabId === 'tab4') {
                renderFullHistory();
            } else if (tabId === 'tabMenu') {
                updateMenuStats();
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // ربط أزرار الشريط السفلي
        document.querySelectorAll('.bottom-nav-item').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // ربط حبوب الفلترة العلوية
        document.querySelectorAll('.cat-pill').forEach(pill => {
            pill.addEventListener('click', () => switchTab(pill.dataset.tab));
        });

        // ربط الأزرار السريعة بالأعلى (Arbitrage / Delayed)
        document.querySelectorAll('.tab-trigger').forEach(trg => {
            trg.addEventListener('click', () => switchTab(trg.dataset.targetTab));
        });




        // ==================== ربط أزرار التحكم والتبديل ====================
        // 1. مفتاح التبديل المزدوج للحالة (Status Switcher: All / LIVE / Pre-match)
        document.querySelectorAll('.status-switch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.status-switch-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentStatusMode = btn.dataset.status;
                renderMatchesList(loadedMatchesEvents);
            });
        });

        // 2. شريط التبديل بين الرياضات (Sports Switcher: Soccer / Basketball)
        document.querySelectorAll('.sport-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.sport-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentSport = chip.dataset.sport;
                currentLeague = 'all';

                const titleEl = document.getElementById('homeMatchesTitle');
                if (titleEl) {
                    titleEl.textContent = currentSport === 'basketball'
                        ? '🏀 مركز مباريات كرة السلة (NBA)'
                        : '⚽ مركز مباريات الدوريات والبطولات';
                }

                loadMatches(true);
            });
        });

        // 3. شريط الفلاتر السريعة بالأزرار الأفقية (Time Chips)
        document.querySelectorAll('.time-chip:not(.chip-select-period)').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const selectPeriodChip = document.getElementById('btnOpenSetPeriodModal');
                if (selectPeriodChip) {
                    selectPeriodChip.innerHTML = '<i class="fa-regular fa-calendar-days"></i> <span>تحديد الفترة ▾</span>';
                }

                currentTimeFilter = chip.dataset.time;
                loadMatches(false);
            });
        });

        // 4. زر التحديث الفوري
        document.getElementById('refreshMatchesBtn')?.addEventListener('click', () => {
            loadMatches(true);
            showToast('🔄 جاري تحديث النتائج والمباريات...');
        });

        // 5. شريط البحث السريع في المباريات
        const searchInput = document.getElementById('matchSearchInput');
        const clearSearchBtn = document.getElementById('matchSearchClearBtn');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = searchInput.value ? 'inline-block' : 'none';
                }
                renderMatchesList(loadedMatchesEvents);
            });
        }
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                renderMatchesList(loadedMatchesEvents);
            });
        }

        // تشغيل التحميل الأولي
        renderTournamentsBar();
        loadMatches(false);


        // ==================== مؤقت شاشة البداية الرياضية (Splash Screen Timer ~1.3s) ====================
        window.addEventListener('DOMContentLoaded', () => {
            const splashEl = document.getElementById('appSplashScreen');
            if (splashEl) {
                setTimeout(() => {
                    splashEl.classList.add('splash-fade-out');
                    setTimeout(() => {
                        splashEl.remove();
                    }, 450);
                }, 1300);
            }
        });


window.switchTab = switchTab;
