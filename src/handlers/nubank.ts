import type {Transaction} from '../types/transaction.js';
import {Handler} from './handler.js';

export class NubankHandler extends Handler {
	public name = 'Nubank';

	public canHandle(firstLine: string): boolean {
		return firstLine === 'date,category,title,amount';
	}

	public parseCsv(fileName: string, lines: string[]): Transaction[] {
		const headers = lines[0].toLocaleLowerCase().split(',');
		const rows: Transaction[] = [];

		for (const line of lines.slice(1)) {
			if (!line.includes(',') || line.includes('Pagamento recebido')) {
				continue;
			}

			const cells = line.split(',');
			const row: Partial<Transaction> = {
				fatura: /nubank-(?<yearMonth>\d{4}-\d{2}).csv/.exec(fileName)?.groups?.yearMonth ?? '',
			};

			for (const [index, header] of headers.entries()) {
				if (header === 'category') {
					continue;
				}

				switch (header) {
					case 'date': {
						row.data = new Date(cells[index]);
						break;
					}

					case 'amount': {
						row.valor = Number.parseFloat(cells[index]);
						break;
					}

					case 'title': {
						row.descricao = cells[index].trim();
						break;
					}

					default: {
						throw new Error(`Unknown header: ${header}`);
					}
				}
			}

			rows.push(row as Transaction);
		}

		return rows;
	}
}
