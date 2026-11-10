// ==================== نافذة تحديد الفترة والتقويم المخصص (Interactive Calendar) ====================
        // ==================== نافذة تحديد الفترة والتقويم الشهري (Set Period Modal) ====================
        const setPeriodModalEl = document.getElementById('setPeriodModal');

        const openSetPeriodModal = () => {
            if (!setPeriodModalEl) return;

            if (!customPeriodStart) customPeriodStart = new Date();
            if (!customPeriodEnd) {
                customPeriodEnd = new Date(customPeriodStart);
                customPeriodEnd.setDate(customPeriodEnd.getDate() + 1);
            }

            activeSelectingBound = 'start';
            updatePeriodDisplayBoxes();

            calViewingMonth = customPeriodStart.getMonth();
            calViewingYear = customPeriodStart.getFullYear();
            renderInteractiveCalendar();

            setPeriodModalEl.classList.add('open');
            setPeriodModalEl.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeSetPeriodModal = () => {
            if (!setPeriodModalEl) return;
            setPeriodModalEl.classList.remove('open');
            setPeriodModalEl.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const formatShortDate = (d) => {
            try {
                return d.toLocaleDateString('ar-MA', { day: 'numeric', month: 'long' });
            } catch {
                return '';
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

            const firstDayIndex = (monthDate.getDay() + 6) % 7; // الإثنين هو اليوم 0
            const totalDaysInMonth = new Date(calViewingYear, calViewingMonth + 1, 0).getDate();

            const today = new Date();
            const todayStr = toESPNDate(today);
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
                const isSelected = cellStr === startStr || cellStr === endStr;
                const inRange = startStr && endStr && (cellStr > startStr && cellStr < endStr);

                let classes = ['cal-day-cell'];
                if (isToday) classes.push('is-today');
                if (isSelected) classes.push('selected');
                if (inRange) classes.push('in-range');

                html += `<div class="${classes.join(' ')}" data-cal-date="${cellStr}">${d}</div>`;
            }

            daysGridEl.innerHTML = html;

            daysGridEl.querySelectorAll('.cal-day-cell:not(.disabled)').forEach(cell => {
                cell.addEventListener('click', () => {
                    const dateStr = cell.dataset.calDate;
                    const y = parseInt(dateStr.substring(0, 4), 10);
                    const m = parseInt(dateStr.substring(4, 6), 10) - 1;
                    const d = parseInt(dateStr.substring(6, 8), 10);
                    const pickedDate = new Date(y, m, d);

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

        // أحداث أزرار نافذة التقويم المخصص
        document.getElementById('periodBoxStart')?.addEventListener('click', () => {
            activeSelectingBound = 'start';
            updatePeriodDisplayBoxes();
        });
        document.getElementById('periodBoxEnd')?.addEventListener('click', () => {
            activeSelectingBound = 'end';
            updatePeriodDisplayBoxes();
        });

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

        // اختصارات التقويم السريعة
        document.querySelectorAll('.cal-preset-chip, .preset-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                const now = new Date();

                if (preset === 'today') {
                    customPeriodStart = new Date(now);
                    customPeriodEnd = new Date(now);
                } else if (preset === 'tomorrow') {
                    const tmr = new Date(now); tmr.setDate(now.getDate() + 1);
                    customPeriodStart = tmr;
                    customPeriodEnd = tmr;
                } else if (preset === 'weekend') {
                    const day = now.getDay();
                    const friOffset = (5 - day + 7) % 7;
                    const fri = new Date(now); fri.setDate(now.getDate() + friOffset);
                    const sun = new Date(fri); sun.setDate(fri.getDate() + 2);
                    customPeriodStart = fri;
                    customPeriodEnd = sun;
                } else if (preset === 'next7') {
                    customPeriodStart = new Date(now);
                    const end7 = new Date(now); end7.setDate(now.getDate() + 6);
                    customPeriodEnd = end7;
                }

                calViewingMonth = customPeriodStart.getMonth();
                calViewingYear = customPeriodStart.getFullYear();
                activeSelectingBound = 'start';
                updatePeriodDisplayBoxes();
                renderInteractiveCalendar();
            });
        });

        document.getElementById('btnPeriodCancel')?.addEventListener('click', closeSetPeriodModal);
        document.getElementById('closeSetPeriodModalX')?.addEventListener('click', closeSetPeriodModal);
        if (setPeriodModalEl) {
            setPeriodModalEl.addEventListener('click', (e) => {
                if (e.target === setPeriodModalEl) closeSetPeriodModal();
            });
        }

        document.getElementById('btnPeriodApply')?.addEventListener('click', () => {
            currentTimeFilter = 'custom';
            document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
            const customChip = document.getElementById('btnOpenSetPeriodModal');
            if (customChip) {
                customChip.classList.add('active');
                customChip.innerHTML = `<i class="fa-regular fa-calendar-check"></i> <span>${formatShortDate(customPeriodStart)} - ${formatShortDate(customPeriodEnd)}</span>`;
            }
            closeSetPeriodModal();
            loadMatches(true);
            showToast('📅 تم تطبيق الفترة الزمنية المحددة');
        });

        document.getElementById('btnOpenSetPeriodModal')?.addEventListener('click', openSetPeriodModal);


document.getElementById('btnCalendarJumpToday')?.addEventListener('click', () => {
    if (typeof window.jumpToToday === 'function') {
        window.jumpToToday();
    }
    closeSetPeriodModal();
    showToast('📅 تم الانتقال إلى مباريات اليوم');
});

window.openSetPeriodModal = openSetPeriodModal;
window.closeSetPeriodModal = closeSetPeriodModal;
