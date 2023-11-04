import fs from 'node:fs/promises';
import path from 'node:path';
import {categorize, loadCategories} from './helpers/categories.js';
import {exportToSqlite} from './helpers/sqlite.js';
import {exportToXlsx} from './helpers/xlsx.js';
import handlers from './handlers/index.js';

const segmenter = new Intl.Segmenter('pt-BR', {granularity: 'word'});
const files = await fs.readdir('data');
const transactions = [];

for (const file of files) {
	const fileData = await fs.readFile(path.join('data', file), 'utf8');

	const lines = fileData.replace(/^\uFEFF/, '')
		.replace(/^\u00EF?\u00BB\u00BF/, '')
		.replaceAll('\r\n', '\n')
		.split('\n');

	for (const handler of handlers) {
		if (handler.canHandle(lines[0])) {
			transactions.push(...handler.parseCsv(file, lines).map(t => {
				t.cartao = handler.name;

				let normalizado = t.descricao
					.trim()
					.toLocaleLowerCase()
					.normalize('NFD')
					.replaceAll(/[\u0300-\u036F]/g, '')
					.replaceAll(/\s+/g, ' ');

				normalizado = [...segmenter.segment(normalizado)].filter(s => s.isWordLike).map(w => w.segment.charAt(0).toLocaleUpperCase() + w.segment.slice(1)).join(' ');
				t.normalizado = normalizado;
				return t;
			}));

			break;
		} else {
			continue;
		}
	}
}

transactions.sort((a, b) => a.data.getTime() - b.data.getTime());

const categories = await loadCategories();
const categorized = categorize(transactions.filter(t => t.valor > 0), categories);

await fs.writeFile('out/transactions.json', JSON.stringify(categorized, null, '\t'));
await exportToSqlite(categorized);
await exportToXlsx(categorized);
