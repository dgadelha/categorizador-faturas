import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import knexClient from 'knex';
import type {Transaction} from '../types/transaction.js';

export async function exportToSqlite(transactions: Transaction[]) {
	if (existsSync('out/transactions.db')) {
		await fs.rm('out/transactions.db');
	}

	const knex = knexClient({
		client: 'sqlite3',
		connection: {
			filename: 'out/transactions.db',
		},
		useNullAsDefault: true,
	});

	await knex.schema.createTable('transactions', table => {
		table.increments('id');
		table.text('cartao').comment('Cartão da transação');
		table.text('fatura').comment('Fatura da transação');
		table.text('data').comment('Data da transação');
		table.text('descricao').comment('Descrição da transação');
		table.text('normalizado').comment('Descrição normalizada da transação');
		table.decimal('valor').comment('Valor da transação');
		table.text('parcela').comment('Parcela da transação');
		table.text('categoria').comment('Categoria da transação');
	});

	const batchSize = 100;

	for (let i = 0; i < transactions.length; i += batchSize) {
		const batch = transactions.slice(i, i + batchSize);

		await knex('transactions').insert(
			batch.map(transaction => ({
				...transaction,
				data: transaction.data.toJSON().slice(0, 10),
			})),
		);
	}

	await knex.destroy();
}
