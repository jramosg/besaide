import { useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { navigate } from 'astro:transitions/client';
import 'react-day-picker/style.css';

// Monday-first weekday abbreviations
const WEEKDAYS_EU = ['al.', 'ar.', 'az.', 'og.', 'or.', 'lr.', 'ig.'];
const WEEKDAYS_ES = ['lu.', 'ma.', 'mi.', 'ju.', 'vi.', 'sá.', 'do.'];

const MONTHS_EU = [
	'urtarrila',
	'otsaila',
	'martxoa',
	'apirila',
	'maiatza',
	'ekaina',
	'uztaila',
	'abuztua',
	'iraila',
	'urria',
	'azaroa',
	'abendua'
];
const MONTHS_ES = [
	'enero',
	'febrero',
	'marzo',
	'abril',
	'mayo',
	'junio',
	'julio',
	'agosto',
	'septiembre',
	'octubre',
	'noviembre',
	'diciembre'
];

/** Basque year suffix: "eko" when year ends in 5 or is a multiple of 10, "ko" otherwise */
function basqueYearSuffix(year: number): string {
	const lastDigit = year % 10;
	return lastDigit === 5 || lastDigit === 0 ? 'eko' : 'ko';
}

function formatCaption(date: Date, lang: 'eu' | 'es'): string {
	const year = date.getFullYear();
	const monthIdx = date.getMonth();
	if (lang === 'eu') {
		return `${year}${basqueYearSuffix(year)} ${MONTHS_EU[monthIdx]}`;
	}
	const month = MONTHS_ES[monthIdx];
	return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
}

interface CalendarEvent {
	date: string; // YYYY-MM-DD (local date)
	endDate?: string; // YYYY-MM-DD (local date, for multi-day events)
	type: string;
	slug: string;
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
	const weekdays = lang === 'eu' ? WEEKDAYS_EU : WEEKDAYS_ES;

	// Build modifier day sets for range highlighting + day→URL map
	const { rangeStart, rangeMiddle, rangeEnd, singleEvent, urlByDay } =
		useMemo(() => {
			const starts: Date[] = [];
			const middles: Date[] = [];
			const ends: Date[] = [];
			const singles: Date[] = [];
			// day key → { single?: slug, range?: slug } — single events take priority
			const dayLinks = new Map<string, { single?: string; range?: string }>();

			const toKey = (d: Date) =>
				`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

			for (const evt of events) {
				if (evt.endDate && evt.endDate !== evt.date) {
					const allDates = getDateRange(evt.date, evt.endDate);
					if (allDates.length >= 2) {
						starts.push(allDates[0]);
						ends.push(allDates[allDates.length - 1]);
						for (let i = 1; i < allDates.length - 1; i++) {
							middles.push(allDates[i]);
						}
					}
					for (const d of allDates) {
						const k = toKey(d);
						const entry = dayLinks.get(k) || {};
						if (!entry.range) entry.range = evt.slug;
						dayLinks.set(k, entry);
					}
				} else {
					singles.push(parseLocalDate(evt.date));
					const k = evt.date;
					const entry = dayLinks.get(k) || {};
					entry.single = evt.slug;
					dayLinks.set(k, entry);
				}
			}

			// Resolve: single wins over range
			const resolved = new Map<string, string>();
			for (const [k, v] of dayLinks) {
				resolved.set(k, v.single || v.range!);
			}

			return {
				rangeStart: starts,
				rangeMiddle: middles,
				rangeEnd: ends,
				singleEvent: singles,
				urlByDay: resolved
			};
		}, [events]);

	const handleDayClick = (day: Date) => {
		const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
		const url = urlByDay.get(key);
		if (url) navigate(url);
	};

	const handleMonthChange = (newMonth: Date) => {
		const prvMonth = month;
		setMonth(newMonth);
		if (
			prvMonth.getMonth() !== newMonth.getMonth() ||
			prvMonth.getFullYear() !== newMonth.getFullYear()
		) {
			const monthKey = `${newMonth.getFullYear()}-${newMonth.getMonth()}`;
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
		}
	};

	return (
		<div className="home-cal-wrapper">
			<DayPicker
				key={lang}
				mode="single"
				month={month}
				onMonthChange={handleMonthChange}
				onDayClick={handleDayClick}
				weekStartsOn={1}
				showOutsideDays
				fixedWeeks
				formatters={{
					formatCaption: date => formatCaption(date, lang),
					formatWeekdayName: date => {
						const dow = (date.getDay() + 6) % 7;
						return weekdays[dow];
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
