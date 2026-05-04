import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { CalendarEvent } from '@/types/CalendarEvent';
import type { EventContentArg } from '@fullcalendar/core';

// Import base locales
import euLocale from '@fullcalendar/core/locales/eu';
import esLocale from '@fullcalendar/core/locales/es';

const euMonthNamesShort = [
	'Urt.',
	'Ots.',
	'Mar.',
	'Api.',
	'Mai.',
	'Eka.',
	'Uzt.',
	'Abu.',
	'Ira.',
	'Urr.',
	'Aza.',
	'Abe.'
];

const euDayNamesShort = ['Ig.', 'Al.', 'Ar.', 'Az.', 'Og.', 'Ol.', 'Lr.'];

interface AgendaCalendarProps {
	events: CalendarEvent[];
	lang: 'eu' | 'es';
}

const monthNavigationLabels = {
	eu: {
		prev: 'Aurreko hilabetea',
		next: 'Hurrengo hilabetea'
	},
	es: {
		prev: 'Mes anterior',
		next: 'Mes siguiente'
	}
} as const;

type EventType = CalendarEvent['type'];

const EventTypeIcon = ({ type }: { type: EventType }) => {
	const base = {
		className: 'fc-event-content-icon',
		'aria-hidden': true as const
	};
	switch (type) {
		case 'mountain':
			return (
				<svg
					{...base}
					viewBox="0 0 29 28"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M0 27.7125L9.675 14.2125H17.25L28.425 1.1625V27.7125H0ZM2.625 18.975L0.225 17.25L6.675 8.2125H14.25L21.3 0L23.55 1.95L15.6 11.2125H8.175L2.625 18.975ZM5.85 24.7125H25.425V9.2625L18.6 17.2125H11.175L5.85 24.7125Z" />
				</svg>
			);
		case 'mountain-martxa':
			return (
				<svg
					{...base}
					viewBox="0 -960 960 960"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M340-40q-18 0-43.5-19T255-98l-95-122 47-38 46 59 115-81 64-325-72 28v137h-80v-189l165-69q32-14 47-18t28-4q21 0 38.5 11t29.5 29l40 63q26 41 70.5 69T800-520v80q-66 0-123.5-28T580-541l-24 120 84 80v241q15-1 28.5-5t25.5-11q4-2 7.5-3t7.5-1q14 0 22.5 9.5T740-90q0 8-3.5 14.5T725-64q-20 12-42.5 18T635-40H480v-60h80v-181l-84-80-36 129-137 97 3 4q9 12 20.5 20T352-98q9 5 14 10.5t5 16.5q0 13-9 22t-22 9Zm240-700q-33 0-56.5-23.5T500-820q0-33 23.5-56.5T580-900q33 0 56.5 23.5T660-820q0 33-23.5 56.5T580-740Z" />
				</svg>
			);
		case 'ski-alpino':
			return (
				<svg
					{...base}
					viewBox="0 0 30 31"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M24.75 30.75C24.1 30.75 23.4688 30.7 22.8563 30.6C22.2437 30.5 21.65 30.35 21.075 30.15L0 22.4625L0.75 20.325L11.1 24.1125L13.6875 17.4375L8.325 11.85C7.65 11.15 7.38125 10.3188 7.51875 9.35625C7.65625 8.39375 8.15 7.6625 9 7.1625L14.2125 4.1625C14.6375 3.9125 15.0688 3.76875 15.5063 3.73125C15.9438 3.69375 16.375 3.7625 16.8 3.9375C17.225 4.0875 17.5938 4.325 17.9062 4.65C18.2188 4.975 18.45 5.3625 18.6 5.8125L19.0875 7.425C19.4125 8.5 19.9438 9.45 20.6813 10.275C21.4188 11.1 22.3 11.725 23.325 12.15L24.1125 9.75L26.25 10.425L24.5625 15.6C22.7125 15.3 21.075 14.575 19.65 13.425C18.225 12.275 17.175 10.85 16.5 9.15L12.7125 11.325L17.25 16.5L13.9125 25.125L18.5625 26.8125L21.7125 17.175C22.0625 17.3 22.4125 17.4125 22.7625 17.5125C23.1125 17.6125 23.475 17.7 23.85 17.775L20.6625 27.6L21.825 28.0125C22.275 28.1625 22.7437 28.2812 23.2313 28.3688C23.7188 28.4563 24.225 28.5 24.75 28.5C25.4 28.5 26.0188 28.4375 26.6063 28.3125C27.1938 28.1875 27.7625 28 28.3125 27.75L30 29.4375C29.2 29.8625 28.3625 30.1875 27.4875 30.4125C26.6125 30.6375 25.7 30.75 24.75 30.75ZM21.75 6C20.925 6 20.2188 5.70625 19.6313 5.11875C19.0438 4.53125 18.75 3.825 18.75 3C18.75 2.175 19.0438 1.46875 19.6313 0.88125C20.2188 0.29375 20.925 0 21.75 0C22.575 0 23.2812 0.29375 23.8688 0.88125C24.4563 1.46875 24.75 2.175 24.75 3C24.75 3.825 24.4563 4.53125 23.8688 5.11875C23.2812 5.70625 22.575 6 21.75 6Z" />
				</svg>
			);
		case 'event':
			return (
				<svg
					{...base}
					viewBox="0 0 36 36"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M25.5 33V28.5H21V25.5H25.5V21H28.5V25.5H33V28.5H28.5V33H25.5ZM7.5 30C6.675 30 5.96875 29.7063 5.38125 29.1188C4.79375 28.5312 4.5 27.825 4.5 27V9C4.5 8.175 4.79375 7.46875 5.38125 6.88125C5.96875 6.29375 6.675 6 7.5 6H9V3H12V6H21V3H24V6H25.5C26.325 6 27.0312 6.29375 27.6188 6.88125C28.2063 7.46875 28.5 8.175 28.5 9V18.15C28 18.075 27.5 18.0375 27 18.0375C26.5 18.0375 26 18.075 25.5 18.15V15H7.5V27H18C18 27.5 18.0375 28 18.1125 28.5C18.1875 29 18.325 29.5 18.525 30H7.5ZM7.5 12H25.5V9H7.5V12Z" />
				</svg>
			);
		case 'course':
			return (
				<svg
					{...base}
					viewBox="0 0 36 36"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M18 30C16.8 29.05 15.5 28.3125 14.1 27.7875C12.7 27.2625 11.25 27 9.75 27C8.7 27 7.66875 27.1375 6.65625 27.4125C5.64375 27.6875 4.675 28.075 3.75 28.575C3.225 28.85 2.71875 28.8375 2.23125 28.5375C1.74375 28.2375 1.5 27.8 1.5 27.225V9.15C1.5 8.875 1.56875 8.6125 1.70625 8.3625C1.84375 8.1125 2.05 7.925 2.325 7.8C3.475 7.2 4.675 6.75 5.925 6.45C7.175 6.15 8.45 6 9.75 6C11.2 6 12.6188 6.1875 14.0063 6.5625C15.3938 6.9375 16.725 7.5 18 8.25V26.4C19.275 25.6 20.6125 25 22.0125 24.6C23.4125 24.2 24.825 24 26.25 24C27.15 24 28.0313 24.075 28.8938 24.225C29.7563 24.375 30.625 24.6 31.5 24.9V6.9C31.875 7.025 32.2438 7.15625 32.6063 7.29375C32.9688 7.43125 33.325 7.6 33.675 7.8C33.95 7.925 34.1562 8.1125 34.2938 8.3625C34.4313 8.6125 34.5 8.875 34.5 9.15V27.225C34.5 27.8 34.2563 28.2375 33.7688 28.5375C33.2813 28.8375 32.775 28.85 32.25 28.575C31.325 28.075 30.3563 27.6875 29.3438 27.4125C28.3312 27.1375 27.3 27 26.25 27C24.75 27 23.3 27.2625 21.9 27.7875C20.5 28.3125 19.2 29.05 18 30ZM21 22.5V8.25L28.5 0.75V15.75L21 22.5ZM15 24.9375V10.0875C14.175 9.7375 13.3187 9.46875 12.4312 9.28125C11.5437 9.09375 10.65 9 9.75 9C8.825 9 7.925 9.0875 7.05 9.2625C6.175 9.4375 5.325 9.7 4.5 10.05V24.9375C5.375 24.6125 6.24375 24.375 7.10625 24.225C7.96875 24.075 8.85 24 9.75 24C10.65 24 11.5312 24.075 12.3938 24.225C13.2563 24.375 14.125 24.6125 15 24.9375Z" />
				</svg>
			);
		case 'speleology':
			return (
				<svg
					{...base}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M1 14.0776H22.5" />
					<path d="M23 14.0776V1C20.7759 1 11.1658 3.07853 11.1658 14.0776M6.87708 14.0776V5.53866H4.42627L4.42627 14.0776" />
					<path d="M1 14.0776V17.4107H3.74999M22.9999 14.0776V17.4107H5.91392M3.74999 17.4107L5.05736 22.9997L5.91392 17.4107M3.74999 17.4107H5.91392M10.9631 17.4107L12.2705 22.9997L13.127 17.4107H10.9631ZM18.1762 17.4107L19.4836 22.9997L20.3401 17.4107H18.1762Z" />
				</svg>
			);
	}
};

const EVENT_DAY_PRIORITY: EventType[] = [
	'event',
	'ski-alpino',
	'mountain-martxa',
	'mountain',
	'course',
	'speleology'
];

const pad2 = (num: number) => String(num).padStart(2, '0');

const toDateKey = (date: Date) =>
	`${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const addDays = (date: Date, days: number) => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

const isDateOnly = (value?: string) => Boolean(value && !value.includes('T'));

const datesCoveredByEvent = (event: CalendarEvent): string[] => {
	const start = new Date(event.start);
	if (Number.isNaN(start.getTime())) return [];

	if (!event.end) {
		return [toDateKey(start)];
	}

	const end = new Date(event.end);
	if (Number.isNaN(end.getTime())) {
		return [toDateKey(start)];
	}

	const coveredDates: string[] = [];
	const allDayRange = isDateOnly(event.start) || isDateOnly(event.end);

	if (allDayRange) {
		let current = new Date(
			start.getFullYear(),
			start.getMonth(),
			start.getDate()
		);
		const endExclusive = new Date(
			end.getFullYear(),
			end.getMonth(),
			end.getDate()
		);

		while (current < endExclusive) {
			coveredDates.push(toDateKey(current));
			current = addDays(current, 1);
		}

		if (coveredDates.length === 0) {
			coveredDates.push(toDateKey(start));
		}

		return coveredDates;
	}

	return [toDateKey(start)];
};

const getPriorityScore = (type: EventType) => {
	const score = EVENT_DAY_PRIORITY.indexOf(type);
	return score >= 0 ? score : EVENT_DAY_PRIORITY.length;
};

const EVENT_TYPE_CSS_COLOR: Record<EventType, string> = {
	mountain: '#2FD36F',
	'mountain-martxa': '#246DFF',
	'ski-alpino': '#B11CAB',
	event: '#FF8800',
	course: '#92949C',
	speleology: '#8F4918'
};

const EVENT_TYPE_LABELS: Record<'eu' | 'es', Record<EventType, string>> = {
	eu: {
		mountain: 'Mendi irteera',
		'mountain-martxa': 'Mendi martxa',
		'ski-alpino': 'Eski irteera',
		event: 'Ekitaldia',
		course: 'Ikastaroa',
		speleology: 'Espeleologia irteera'
	},
	es: {
		mountain: 'Salida a la montaña',
		'mountain-martxa': 'Marcha montañera',
		'ski-alpino': 'Salida de esquí',
		event: 'Evento',
		course: 'Curso',
		speleology: 'Salida de espeleología'
	}
};

const LEGEND_ORDER: EventType[] = [
	'mountain',
	'mountain-martxa',
	'ski-alpino',
	'event',
	'course',
	'speleology'
];

const renderEventContent = (arg: EventContentArg) => {
	const type = arg.event.extendedProps.type as EventType | undefined;
	const secondaryTypes = arg.event.extendedProps.secondaryTypes as
		| EventType[]
		| undefined;
	return (
		<div className="fc-event-content-custom">
			{type ? <EventTypeIcon type={type} /> : null}
			<span className="fc-event-content-title">{arg.event.title}</span>
			{secondaryTypes && secondaryTypes.length > 0 && (
				<span className="fc-event-type-squares">
					{secondaryTypes.map(
						t =>
							type && (
								<span
									key={t}
									className="fc-event-type-square"
									style={{ backgroundColor: EVENT_TYPE_CSS_COLOR[type] }}
								/>
							)
					)}
				</span>
			)}
		</div>
	);
};

export default function AgendaCalendar({ events, lang }: AgendaCalendarProps) {
	const [filteredEvents, setFilteredEvents] = useState(events);
	const calendarRef = useRef<FullCalendar>(null);
	const navLabels = monthNavigationLabels[lang];

	const dayDataByDate = useMemo(() => {
		const map = new Map<string, Set<EventType>>();

		for (const event of filteredEvents) {
			for (const dateKey of datesCoveredByEvent(event)) {
				if (!map.has(dateKey)) map.set(dateKey, new Set());
				map.get(dateKey)!.add(event.type);
			}
		}

		const result = new Map<
			string,
			{ primary: EventType; secondary: EventType[] }
		>();
		for (const [dateKey, types] of map) {
			const sorted = Array.from(types).sort(
				(a, b) => getPriorityScore(a) - getPriorityScore(b)
			);
			result.set(dateKey, { primary: sorted[0], secondary: sorted.slice(1) });
		}

		return result;
	}, [filteredEvents]);

	const calendarDisplayEvents = useMemo(() => {
		return filteredEvents.flatMap(event => {
			const coveredDates = datesCoveredByEvent(event);

			if (coveredDates.length <= 1) {
				return [event];
			}

			return coveredDates.map((dateKey, index) => ({
				...event,
				id: `${event.id}-${index}-${dateKey}`,
				start: dateKey,
				end: undefined
			}));
		});
	}, [filteredEvents]);

	// Listen for calendar view becoming visible
	useEffect(() => {
		const handleCalendarVisible = () => {
			// Small delay to ensure the calendar is fully visible
			setTimeout(() => {
				const calendarApi = calendarRef.current?.getApi();
				if (calendarApi) {
					calendarApi.updateSize();
				}
			}, 100);
		};

		window.addEventListener('calendar-view-visible', handleCalendarVisible);

		return () => {
			window.removeEventListener(
				'calendar-view-visible',
				handleCalendarVisible
			);
		};
	}, []);

	// Listen for filter changes from the main page
	useEffect(() => {
		const handleFilterChange = (event: CustomEvent) => {
			const { searchTerm, selectedType } = event.detail;

			const filtered = events.filter(evt => {
				const matchesSearch =
					!searchTerm ||
					evt.title.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesType =
					!selectedType ||
					selectedType === 'every' ||
					evt.type === selectedType;

				return matchesSearch && matchesType;
			});

			setFilteredEvents(filtered);
		};

		window.addEventListener(
			'agenda-filter-change',
			handleFilterChange as EventListener
		);

		return () => {
			window.removeEventListener(
				'agenda-filter-change',
				handleFilterChange as EventListener
			);
		};
	}, [events]);

	const labels = EVENT_TYPE_LABELS[lang];

	return (
		<>
			<FullCalendar
				ref={calendarRef}
				key={lang}
				plugins={[dayGridPlugin]}
				initialView="dayGridMonth"
				initialDate={new Date()}
				locale={lang === 'eu' ? euLocale : esLocale}
				titleFormat={
					lang === 'eu'
						? ({ date }) => {
								const month = euMonthNamesShort[date.month];
								return `${month} ${date.year}`;
							}
						: undefined
				}
				dayHeaderContent={
					lang === 'eu'
						? arg => {
								return euDayNamesShort[arg.dow];
							}
						: undefined
				}
				height="auto"
				dayMaxEvents={3}
				dayCellClassNames={arg => {
					const data = dayDataByDate.get(toDateKey(arg.date));
					return data ? [`fc-day--type-${data.primary}`] : [];
				}}
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				}}
				displayEventTime={true}
				displayEventEnd={false}
				eventContent={renderEventContent}
				events={calendarDisplayEvents.map(event => ({
					id: event.id,
					title: event.title,
					start: event.start,
					end: event.end,
					url: event.url,
					extendedProps: (() => {
						const dateKey = !event.start.includes('T')
							? event.start
							: toDateKey(new Date(event.start));
						const dayData = dayDataByDate.get(dateKey);
						const allTypesOnDay = dayData
							? [dayData.primary, ...dayData.secondary]
							: [];
						return {
							type: event.type,
							secondaryTypes: allTypesOnDay.filter(t => t !== event.type)
						};
					})(),
					classNames: [
						`fc-event`,
						`fc-event--${event.type}`,
						...(event.isPast ? ['fc-event--past'] : [])
					],
					display: event.end && event.start !== event.end ? 'block' : 'auto'
				}))}
				eventClick={info => {
					info.jsEvent.preventDefault();
					if (info.event.url) {
						window.location.href = info.event.url;
					}
				}}
				defaultAllDay={true}
				buttonText={{
					prev: navLabels.prev,
					next: navLabels.next
				}}
				headerToolbar={{
					left: 'prev',
					center: 'title',
					right: 'next'
				}}
			/>
			<ul className="fc-legend">
				{LEGEND_ORDER.map(type => (
					<li key={type} className="fc-legend-item">
						<span
							className="fc-legend-swatch"
							style={{ backgroundColor: EVENT_TYPE_CSS_COLOR[type] }}
						/>
						<span className="fc-legend-label">{labels[type]}</span>
					</li>
				))}
			</ul>
		</>
	);
}
