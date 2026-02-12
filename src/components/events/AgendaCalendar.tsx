import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { CalendarEvent } from '@/types/CalendarEvent';

// Import base locales
import euLocale from '@fullcalendar/core/locales/eu';
import esLocale from '@fullcalendar/core/locales/es';

// Basque month and day names for custom formatting
const euMonthNames = [
	'Urtarrila',
	'Otsaila',
	'Martxoa',
	'Apirila',
	'Maiatza',
	'Ekaina',
	'Uztaila',
	'Abuztua',
	'Iraila',
	'Urria',
	'Azaroa',
	'Abendua'
];

const euDayNamesShort = ['Ig.', 'Al.', 'Ar.', 'Az.', 'Og.', 'Ol.', 'Lr.'];

interface AgendaCalendarProps {
	events: CalendarEvent[];
	lang: 'eu' | 'es';
	initialYear: number;
}

export default function AgendaCalendar({
	events,
	lang,
	initialYear
}: AgendaCalendarProps) {
	const [filteredEvents, setFilteredEvents] = useState(events);
	const calendarRef = useRef<FullCalendar>(null);

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

	return (
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
							const month = euMonthNames[date.month];
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
			eventTimeFormat={{
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			}}
			displayEventTime={true}
			displayEventEnd={false}
			events={filteredEvents.map(event => ({
				id: event.id,
				title: event.title,
				start: event.start,
				end: event.end,
				url: event.url,
				classNames: [
					`fc-event--${event.type}`,
					event.isPast ? 'fc-event--past' : ''
				],
				display: event.end && event.start !== event.end ? 'block' : 'auto'
			}))}
			eventClick={info => {
				info.jsEvent.preventDefault();
				if (info.event.url) {
					window.location.href = info.event.url;
				}
			}}
			headerToolbar={{
				left: 'prev,next today',
				center: 'title',
				right: 'dayGridMonth,dayGridWeek'
			}}
		/>
	);
}
