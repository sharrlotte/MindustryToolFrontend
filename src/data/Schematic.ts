export default interface Schematic {
	id: string;
	name: string;
	data: string;
	authorId: string;
	description: string;
	requirement: Array<ItemRequirement>;
	tags: Array<string>;
	like: number;
	height: number;
	width: number;
	verifyAdmin: string;
}

export interface ItemRequirement {
	name: string;
	color: string;
	amount: number;
}
