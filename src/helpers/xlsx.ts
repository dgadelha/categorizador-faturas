import fs from 'node:fs/promises';
import type Buffer from 'node:buffer';
import xlsx from 'xlsx';
import type {Transaction} from '../types/transaction.js';

export async function exportToXlsx(transactions: Transaction[]) {
	const wb = xlsx.utils.book_new();
	const ws = xlsx.utils.json_to_sheet(transactions);

	xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

	const xlsf = xlsx.write(wb, {type: 'buffer', bookType: 'xlsx'}) as Buffer;
	await fs.writeFile('out/transactions.xlsx', xlsf);
}
