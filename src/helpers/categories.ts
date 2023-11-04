import fs from 'node:fs/promises';
import {existsSync} from 'node:fs';
import yaml from 'js-yaml';
import type {Category} from '../types/category.js';
import type {Transaction} from '../types/transaction.js';

export async function loadCategories(): Promise<Category[]> {
	if (existsSync('categorias.yml')) {
		return yaml.load(await fs.readFile('categorias.yml', 'utf8')) as Category[];
	}

	throw new Error('Nenhuma categoria encontrada, crie um arquivo categorias.yml com as categorias desejadas.');
}

export function categorize(transactions: Transaction[], categories: Category[]) {
	const categorized = [];

	for (const transaction of transactions) {
		const category = categories.find(category =>
			category.keywords.some(keyword => {
				const desc = transaction.descricao.trim().toLowerCase().normalize('NFD').replaceAll(/[\u0300-\u036F]/g, '');

				if (keyword.startsWith('/')) {
					const regex = new RegExp(keyword.slice(1, keyword.lastIndexOf('/')), keyword.slice(keyword.lastIndexOf('/') + 1) + 'i');

					return regex.test(desc);
				}

				return desc.includes(keyword.toLowerCase()) || desc.includes(keyword.replaceAll(' ', '').toLowerCase());
			}),
		);

		if (category) {
			categorized.push({
				...transaction,
				categoria: category.name,
			});
		} else {
			categorized.push(transaction);
		}
	}

	return categorized;
}
