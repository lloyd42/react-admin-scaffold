export interface GetTablesParams {
	pageSize?: number;
	current?: number;
	keyword?: string;
	[key: string]: any;
}

export type Table = {
	url: string;
	id: number;
	number: number;
	title: string;
	labels: {
		name: string;
		color: string;
	}[];
	state: string;
	comments: number;
	created_at: string;
	updated_at: string;
	closed_at?: string;
};
