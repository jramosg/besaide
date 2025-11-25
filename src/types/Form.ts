export type FormData = Record<string, any>;
export type Errors = Record<string, string>;

export type FormProps = {
	errors: Errors;
	formData: FormData;
};
