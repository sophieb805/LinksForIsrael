export interface CategoryData {
	name: string;
	displayName: string;
	description: string;
	image: string;
	subCategories: string[];
}

export interface SubCategoryData {
	name: string;
	displayName: string;
	links: Array<Link>;
}

export interface Link {
	name: string;
	displayName: string;
	shortDescription: string;
	description: string;
	url: string;
	whatsapp: string;
	telegram: string;
	drive: string;
	forms: string;
	docs: string;
	website: string;
	discord: string;
	instagram: string;
	tiktok: string;
	twitter: string;
	portal: string;
	tags?: string[];
}

import categories from "@/_data/categories.json";

export async function getCategories() {
	const data = await Promise.all(categories.map(getCategory));
	return data;
}

export type Category = Awaited<ReturnType<typeof getCategory>>;

export async function getCategory(category: string) {
	const categoryData = (await import(
		`@/_data/links/${category}/links.json`
	)) as CategoryData;

	const subCategories = await Promise.all(
		categoryData.subCategories.map(async (subCategory) => {
			return (await import(
				`@/_data/links/${category}/${subCategory}/links.json`
			)) as SubCategoryData;
		}),
	);

	return {
		...categoryData,
		id: category,
		subCategories,
	};
}