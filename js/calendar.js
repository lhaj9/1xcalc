// ==================== نافذة التقويم الذكي وتحديد الفترة (Interactive Calendar & Date Picker) ====================
(function() {
    'use strict';

    const toESPNDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
    };
    window.toESPNDate = toESPNDate;

    let customPeriodStart = new Date();
    let customPeriodEnd = new Date(Date.now() + 86400000);
    let activeSelectingBound = 'start';
    let calViewingMonth = new Date().getMonth();
    let calViewingYear = new Date().getFullYear();

    const setPeriodModalEl = document.getElementById('setPeriodModal');

    const formatShortDate = (d) => {
        try {
            return d.toLocaleDateString('ar-MA', { day: 'numeric', month: 'short' });
        } catch {
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }
    };

    const updatePeriodDisplayBoxes = () => {
        const startLabel = document.getElementById('periodStartDateLabel');
        const endLabel = document.getElementById('periodEndDateLabel');
        const startBox = document.getElementById('periodBoxStart');
        const endBox = document.getElementById('periodBoxEnd');

        if (startLabel && customPeriodStart) startLabel.textContent = formatShortDate(customPeriodStart);
        if (endLabel && customPeriodEnd) endLabel.textContent = formatShortDate(customPeriodEnd);

        if (startBox) startBox.classList.toggle('active', activeSelectingBound === 'start');
        if (endBox) endBox.classList.toggle('active', activeSelectingBound === 'end');
    };

    const renderInteractiveCalendar = () => {
        const monthTitleEl = document.getElementById('calendarMonthTitle');
        const daysGridEl = document.getElementById('calendarDaysGrid');
        if (!daysGridEl) return;

        const monthDate = new Date(calViewingYear, calViewingMonth, 1);
        if (monthTitleEl) {
            monthTitleEl.textContent = monthDate.toLocaleDateString('ar-MA', { month: 'long', year: 'numeric' });
        }

        const firstDayIndex = (monthDate.getDay() + 6) % 7; // الإثنين هو اليوم 0 في التقويم الرياضي
        const totalDaysInMonth = new Date(calViewingYear, calViewingMonth + 1, 0).getDate();

        const today = new Date();
        const todayStr = toESPNDate(today);
        const isRange = window.calendarMode === 'range';

        let targetDateStr = '';
        if (!isRange) {
            const curDate = (typeof window.getSelectedDate === 'function') ? window.getSelectedDate() : new Date();
            targetDateStr = toESPNDate(curDate);
        }

        const startStr = customPeriodStart ? toESPNDate(customPeriodStart) : '';
        const endStr = customPeriodEnd ? toESPNDate(customPeriodEnd) : '';

        let html = '';

        for (let i = 0; i < firstDayIndex; i++) {
            html += '<div class="cal-day-cell disabled"></div>';
        }

        for (let d = 1; d <= totalDaysInMonth; d++) {
            const cellDate = new Date(calViewingYear, calViewingMonth, d);
            const cellStr = toESPNDate(cellDate);

            const isToday = cellStr === todayStr;
            let isSelected = false;
            let inRange = false;

            if (isRange) {
                isSelected = cellStr === startStr || cellStr === endStr;
                inRange = Boolean(startStr && endStr && (cellStr > startStr && cellStr < endStr));
            } else {
                isSelected = cellStr === targetDateStr;
            }

            let classes = ['cal-day-cell'];
            if (isToday) classes.push('is-today');
            if (isSelected) classes.push('selected');
            if (inRange) classes.push('in-range');

            html += `<div class="${classes.join(' ')}" data-cal-date="${cellStr}" role="button" tabindex="0">${d}</div>`;
        }

        daysGridEl.innerHTML = html;

        daysGridEl.querySelectorAll('.cal-day-cell:not(.disabled)').forEach(cell => {
            cell.addEventListener('click', () => {
                const dateStr = cell.dataset.calDate;
                const y = parseInt(dateStr.substring(0, 4), 10);
                const m = parseInt(dateStr.substring(4, 6), 10) - 1;
                const d = parseInt(dateStr.substring(6, 8), 10);
                const pickedDate = new Date(y, m, d);

                if (window.calendarMode === 'single') {
                    // في وضع اليوم الواحد: يتم الانتقال المباشر لليوم المحدد وإغلاق النافذة
                    if (typeof window.selectDayDate === 'function') {
                        window.selectDayDate(pickedDate);
                    }
                    closeSetPeriodModal(false);
                    if (typeof showToast === 'function') {
                        showToast(`📅 تم اختيار: ${formatShortDate(pickedDate)}`);
                    }
                    return;
                }

                // في وضع تحديد الفترة (Range Mode)
                if (activeSelectingBound === 'start') {
                    customPeriodStart = pickedDate;
                    if (customPeriodEnd && customPeriodEnd < customPeriodStart) {
                        customPeriodEnd = new Date(customPeriodStart);
                    }
                    activeSelectingBound = 'end';
                } else {
                    if (pickedDate < customPeriodStart) {
                        customPeriodEnd = new Date(customPeriodStart);
                        customPeriodStart = pickedDate;
                    } else {
                        customPeriodEnd = pickedDate;
                    }
                    activeSelectingBound = 'start';
                }

                updatePeriodDisplayBoxes();
                renderInteractiveCalendar();
            });
        });
    };

    const openSetPeriodModal = () => {
        if (!setPeriodModalEl) return;

        const isRange = window.calendarMode === 'range';
        const titleEl = setPeriodModalEl.querySelector('.period-modal-title');
        const rangeDisplay = setPeriodModalEl.querySelector('.period-range-display');
        const applyBtn = document.getElementById('btnPeriodApply');

        if (titleEl) {
            titleEl.textContent = isRange ? 'تحديد فترة مخصصة (Custom Period)' : 'اختر يوماً من التقويم (Select Day)';
        }

        if (rangeDisplay) {
            rangeDisplay.style.display = isRange ? 'flex' : 'none';
        }

        if (applyBtn) {
            applyBtn.style.display = isRange ? 'inline-block' : 'none';
        }

        if (isRange) {
            if (!customPeriodStart) customPeriodStart = new Date();
            if (!customPeriodEnd) {
                customPeriodEnd = new Date(customPeriodStart);
                customPeriodEnd.setDate(customPeriodEnd.getDate() + 1);
            }
            activeSelectingBound = 'start';
            updatePeriodDisplayBoxes();
            calViewingMonth = customPeriodStart.getMonth();
            calViewingYear = customPeriodStart.getFullYear();
        } else {
            const curDate = (typeof window.getSelectedDate === 'function') ? window.getSelectedDate() : new Date();
            calViewingMonth = curDate.getMonth();
            calViewingYear = curDate.getFullYear();
        }

        renderInteractiveCalendar();

        setPeriodModalEl.classList.add('open');
        setPeriodModalEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (typeof window.pushModalHistory === 'function') {
            window.pushModalHistory('setPeriodModal', () => closeSetPeriodModal(true));
        }
    };

    const closeSetPeriodModal = (fromPopState = false) => {
        if (!setPeriodModalEl) return;
        setPeriodModalEl.classList.remove('open');
        setPeriodModalEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (!fromPopState && typeof window.popModalHistory === 'function') {
            window.popModalHistory('setPeriodModal');
        }
    };

    // التنقل بين الشهور
    document.getElementById('calPrevMonthBtn')?.addEventListener('click', () => {
        calViewingMonth--;
        if (calViewingMonth < 0) {
            calViewingMonth = 11;
            calViewingYear--;
        }
        renderInteractiveCalendar();
    });

    document.getElementById('calNextMonthBtn')?.addEventListener('click', () => {
        calViewingMonth++;
        if (calViewingMonth > 11) {
            calViewingMonth = 0;
            calViewingYear++;
        }
        renderInteractiveCalendar();
    });

    // أحداث مربعات البداية والنهاية
    document.getElementById('periodBoxStart')?.addEventListener('click', () => {
        activeSelectingBound = 'start';
        updatePeriodDisplayBoxes();
    });
    document.getElementById('periodBoxEnd')?.addEventListener('click', () => {
        activeSelectingBound = 'end';
        updatePeriodDisplayBoxes();
    });

    // الفترات السريعة الجاهزة والتفاعل الفوري معها (Quick Presets Engine)
    document.querySelectorAll('.preset-pill, .cal-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            const now = new Date();

            document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');

            const notify = (msg) => {
                if (typeof window.showToast === 'function') {
                    window.showToast(msg);
                } else if (typeof showToast === 'function') {
                    showToast(msg);
                }
            };

            if (preset === 'today') {
                if (typeof window.jumpToToday === 'function') window.jumpToToday();
                notify('📅 تم الانتقال إلى مباريات اليوم');
                closeSetPeriodModal(false);
                return;
            } else if (preset === 'tomorrow') {
                const tmr = new Date(now);
                tmr.setDate(now.getDate() + 1);
                if (typeof window.selectDayDate === 'function') window.selectDayDate(tmr);
                notify(`📅 تم اختيار: غداً (${formatShortDate(tmr)})`);
                closeSetPeriodModal(false);
                return;
            } else if (preset === 'weekend') {
                const day = now.getDay();
                let friOffset = 0;
                if (day === 5) {
                    friOffset = 0; // اليوم هو الجمعة
                } else if (day === 6) {
                    friOffset = -1; // أمس كان الجمعة
                } else if (day === 0) {
                    friOffset = -2; // الجمعة كان قبل يومين
                } else {
                    friOffset = 5 - day; // الجمعة القادم
                }
                const fri = new Date(now);
                fri.setDate(now.getDate() + friOffset);
                const sun = new Date(fri);
                sun.setDate(fri.getDate() + 2);

                if (typeof window.applyCustomPeriod === 'function') {
                    window.applyCustomPeriod(fri, sun);
                }
                notify(`📅 تم تحديد فترة نهاية الأسبوع (${formatShortDate(fri)} - ${formatShortDate(sun)})`);
                closeSetPeriodModal(false);
                return;
            } else if (preset === 'next7') {
                const start7 = new Date(now);
                const end7 = new Date(now);
                end7.setDate(now.getDate() + 6);

                if (typeof window.applyCustomPeriod === 'function') {
                    window.applyCustomPeriod(start7, end7);
                }
                notify(`📅 تم تحديد فترة الـ 7 أيام القادمة (${formatShortDate(start7)} - ${formatShortDate(end7)})`);
                closeSetPeriodModal(false);
                return;
            }

            calViewingMonth = customPeriodStart.getMonth();
            calViewingYear = customPeriodStart.getFullYear();
            activeSelectingBound = 'start';
            updatePeriodDisplayBoxes();
            renderInteractiveCalendar();
        });
    });

    // أزرار الإغلاق والتطبيق
    document.getElementById('btnPeriodCancel')?.addEventListener('click', () => closeSetPeriodModal(false));
    document.getElementById('closeSetPeriodModalX')?.addEventListener('click', () => closeSetPeriodModal(false));
    if (setPeriodModalEl) {
        setPeriodModalEl.addEventListener('click', (e) => {
            if (e.target === setPeriodModalEl) closeSetPeriodModal(false);
        });
    }

    document.getElementById('btnCalendarJumpToday')?.addEventListener('click', () => {
        if (typeof window.jumpToToday === 'function') {
            window.jumpToToday();
        }
        closeSetPeriodModal(false);
    });

    document.getElementById('btnPeriodApply')?.addEventListener('click', () => {
        if (typeof window.applyCustomPeriod === 'function') {
            window.applyCustomPeriod(customPeriodStart, customPeriodEnd);
        }
        closeSetPeriodModal(false);
    });

    // تصدير الواجهات العامة
    window.openSetPeriodModal = openSetPeriodModal;
    window.closeSetPeriodModal = closeSetPeriodModal;
    window.customPeriodStart = customPeriodStart;
    window.customPeriodEnd = customPeriodEnd;
})();
