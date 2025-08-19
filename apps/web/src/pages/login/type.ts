export interface PostUsernameLoginParams {
	username: string;
	password: string;
}

export interface PostPhoneLoginParams {
	phone: string;
	captcha: string;
}

export type GetCaptchaParams = {
	phone: string;
};

export type LoginResult = {
	token: string;
};

export type CaptchaResult = {
	code: string;
};
