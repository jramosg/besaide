import { useState, useMemo, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { eu } from 'date-fns/locale/eu';
import { es } from 'date-fns/locale/es';
import 'react-day-picker/style.css';

interface CalendarEvent {
	date: string; // YYYY-MM-DD (local date)
	endDate?: string; // YYYY-MM-DD (local date, for multi-day events)
	type: string;
}

interface HomeCalendarProps {
	events: CalendarEvent[];
	lang: 'eu' | 'es';
}

/** Parse "YYYY-MM-DD" into a local Date */
function parseLocalDate(str: string): Date {
	const [y, m, d] = str.split('-').map(Number);
	return new Date(y, m - 1, d);
}

/** Get all dates between start and end (inclusive) as Date objects */
function getDateRange(startStr: string, endStr: string): Date[] {
	const dates: Date[] = [];
	const start = parseLocalDate(startStr);
	const end = parseLocalDate(endStr);
	const current = new Date(start);
	while (current <= end) {
		dates.push(new Date(current));
		current.setDate(current.getDate() + 1);
	}
	return dates;
}

export default function HomeCalendar({ events, lang }: HomeCalendarProps) {
	const [month, setMonth] = useState(new Date());
	const locale = lang === 'eu' ? eu : es;

	// Build modifier day sets for range highlighting
	const { rangeStart, rangeMiddle, rangeEnd, singleEvent } = useMemo(() => {
		const starts: Date[] = [];
		const middles: Date[] = [];
		const ends: Date[] = [];
		const singles: Date[] = [];

		for (const evt of events) {
			if (evt.endDate && evt.endDate !== evt.date) {
				// Multi-day event
				const allDates = getDateRange(evt.date, evt.endDate);
				if (allDates.length >= 2) {
					starts.push(allDates[0]);
					ends.push(allDates[allDates.length - 1]);
					for (let i = 1; i < allDates.length - 1; i++) {
						middles.push(allDates[i]);
					}
				}
			} else {
				// Single-day event
				singles.push(parseLocalDate(evt.date));
			}
		}

		return {
			rangeStart: starts,
			rangeMiddle: middles,
			rangeEnd: ends,
			singleEvent: singles
		};
	}, [events]);

	// Dispatch custom event so Astro can show/hide the correct month group
	useEffect(() => {
		const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
		const groups = document.querySelectorAll('.home-agenda-month-group');
		const emptyState = document.getElementById('home-agenda-empty');
		let hasEvents = false;

		groups.forEach(group => {
			const el = group as HTMLElement;
			if (el.dataset.monthKey === monthKey) {
				el.style.display = '';
				hasEvents = true;
			} else {
				el.style.display = 'none';
			}
		});

		if (emptyState) {
			emptyState.style.display = hasEvents ? 'none' : '';
		}
	}, [month]);

	const handleMonthChange = (newMonth: Date) => {
		setMonth(newMonth);
	};

	return (
		<div className="home-cal-wrapper">
			<DayPicker
				key={lang}
				mode="single"
				month={month}
				onMonthChange={handleMonthChange}
				locale={locale}
				weekStartsOn={1}
				showOutsideDays
				fixedWeeks
				formatters={{
					formatCaption: date => {
						const monthStr = format(date, 'MMMM yyyy', {
							locale: locale
						});
						return monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
					}
				}}
				modifiers={{
					eventRangeStart: rangeStart,
					eventRangeMiddle: rangeMiddle,
					eventRangeEnd: rangeEnd,
					eventSingle: singleEvent
				}}
				modifiersClassNames={{
					eventRangeStart: 'cal-range-start',
					eventRangeMiddle: 'cal-range-middle',
					eventRangeEnd: 'cal-range-end',
					eventSingle: 'cal-single-event'
				}}
			/>
		</div>
	);
}
