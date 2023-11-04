import type {Transaction} from '../types/transaction.js';
import {Handler} from './handler.js';

export class XpHandler extends Handler {
	public name = 'XP';

	public canHandle(firstLine: string): boolean {
		return firstLine === 'Data;Estabelecimento;Portador;Valor;Parcela';
	}

	public parseCsv(fileName: string, lines: string[]): Transaction[] {
		const headers = lines[0].toLocaleLowerCase().split(';');
		const rows: Transaction[] = [];

		for (const line of lines.slice(1)) {
			if (!line.includes(';') || line.includes('Pagamentos Validos Normais')) {
				continue;
			}

			const cells = line.split(';');
			const row: Partial<Transaction> = {
				fatura: /fatura-(?<yearMonth>\d{4}-\d{2})-\d{2}.csv/.exec(fileName)?.groups?.yearMonth ?? '',
			};

			for (const [index, header] of headers.entries()) {
				if (header === 'portador') {
					continue;
				}

				switch (header) {
					case 'data': {
						const date = cells[index].split('/');
						row.data = new Date(`${date[2]}-${date[1]}-${date[0]}`);
						break;
					}

					case 'valor': {
						const value = cells[index];
						row.valor = Number.parseFloat(
							value
								.slice(value.indexOf(' '))
								.replaceAll('.', '')
								.replace(',', '.'),
						);
						break;
					}

					case 'estabelecimento': {
						row.descricao = cells[index].trim();
						break;
					}

					case 'parcela': {
						if (cells[index] === '-' || cells[index] === ' de 1' /* Bug? */) {
							continue;
						}

						row.parcela = cells[index];
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
