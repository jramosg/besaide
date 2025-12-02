import { membershipFormAction } from './membership-form';
import { contactFormAction } from './contact-form';

export const server = {
	submitMembership: membershipFormAction,
	submitContact: contactFormAction
};
