export interface CalendarEvent {
	id: string;
	title: string;
	start: string; // ISO date string
	end?: string; // ISO date string (exclusive)
	url: string;
	type:
		| 'mountain'
		| 'mountain-martxa'
		| 'ski-alpino'
		| 'event'
		| 'course'
		| 'speleology';
	isPast: boolean;
}
