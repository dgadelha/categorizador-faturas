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
		table.string('cartao').comment('Cartão da transação');
		table.string('fatura').comment('Fatura da transação');
		table.date('data').comment('Data da transação');
		table.string('descricao').comment('Descrição da transação');
		table.string('normalizado').comment('Descrição normalizada da transação');
		table.decimal('valor').comment('Valor da transação');
		table.string('parcela').comment('Parcela da transação');
		table.string('categoria').comment('Categoria da transação');
	});

	const batchSize = 100;

	for (let i = 0; i < transactions.length; i += batchSize) {
		const batch = transactions.slice(i, i + batchSize);

		await knex('transactions').insert(batch);
	}

	await knex.destroy();
}
