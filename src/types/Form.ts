import type { Langs } from '@/i18n/ui';

export type FormData = Record<string, any>;
export type Errors = Record<string, string>;

export type FormProps = {
	errors: Errors;
	formData: FormData;
};

export type MembershipFormData = {
	dni: string;
	name: string;
	surnames: string;
	birthdate: string;
	address: string;
	town: string;
	postalCode: string;
	province: string;
	phone1: string;
	phone2?: string;
	email: string;
	infoSpanish?: boolean;
	membership?: boolean;
	federation?: boolean;
	language?: Langs;
};
