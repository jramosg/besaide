import { useState, useMemo, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DayButtonProps } from 'react-day-picker';
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

const TYPE_COLORS: Record<string, string> = {
	mountain: 'var(--theme-primary)',
	'mountain-martxa': 'var(--theme-primary-700)',
	'ski-alpino': 'var(--theme-secondary)',
	event: 'var(--theme-success)',
	course: 'var(--theme-primary-400)',
	speleology: 'var(--grey-600)'
};

/** Expand a single date or date range into all individual YYYY-MM-DD keys */
function expandDateRange(startStr: string, endStr?: string): string[] {
	const dates: string[] = [startStr];
	if (!endStr || endStr === startStr) return dates;

	const [sy, sm, sd] = startStr.split('-').map(Number);
	const [ey, em, ed] = endStr.split('-').map(Number);
	const start = new Date(sy, sm - 1, sd);
	const end = new Date(ey, em - 1, ed);

	const current = new Date(start);
	current.setDate(current.getDate() + 1); // skip the start (already added)

	while (current <= end) {
		const y = current.getFullYear();
		const m = String(current.getMonth() + 1).padStart(2, '0');
		const d = String(current.getDate()).padStart(2, '0');
		dates.push(`${y}-${m}-${d}`);
		current.setDate(current.getDate() + 1);
	}
	return dates;
}

export default function HomeCalendar({ events, lang }: HomeCalendarProps) {
	const [month, setMonth] = useState(new Date());
	const locale = lang === 'eu' ? eu : es;

	// Build a map: "YYYY-MM-DD" -> event types for that day (expanding multi-day)
	const eventsByDay = useMemo(() => {
		const map = new Map<string, string[]>();
		for (const evt of events) {
			const dateKeys = expandDateRange(evt.date, evt.endDate);
			for (const dateKey of dateKeys) {
				if (!map.has(dateKey)) map.set(dateKey, []);
				const types = map.get(dateKey)!;
				if (!types.includes(evt.type)) types.push(evt.type);
			}
		}
		return map;
	}, [events]);

	// Dispatch custom event so Astro can show/hide the correct month group
	useEffect(() => {
		const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
		// window.dispatchEvent(
		// 	new CustomEvent('home-calendar-month-change', {
		// 		detail: { monthKey }
		// 	})
		// );
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

	// Custom DayButton to render event dots
	const CustomDayButton = ({ day, modifiers, ...props }: DayButtonProps) => {
		const dateStr = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
		const types = eventsByDay.get(dateStr);
		return (
			<button {...props}>
				{day.date.getDate()}
				{types && types.length > 0 && (
					<span className="home-cal-dots">
						{types.slice(0, 3).map((type, i) => (
							<span
								key={i}
								className="home-cal-dot"
								style={{
									backgroundColor: TYPE_COLORS[type] || 'var(--theme-primary)'
								}}
							/>
						))}
					</span>
				)}
			</button>
		);
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
				components={{
					DayButton: CustomDayButton
				}}
			/>
		</div>
	);
}
