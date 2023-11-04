export type Transaction = {
	cartao: string;
	data: Date;
	valor: number;
	descricao: string;
	normalizado: string;
	categoria: string;
	fatura: string;
	parcela?: string;
};
