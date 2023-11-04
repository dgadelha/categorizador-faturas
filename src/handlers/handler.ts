import type {Transaction} from '../types/transaction.js';

export abstract class Handler {
	public abstract readonly name: string;

	public abstract canHandle(firstLine: string): boolean;
	public abstract parseCsv(fileName: string, lines: string[]): Transaction[];
}
