# Categorizador Financeiro de Faturas de Cartão de Crédito

Este projeto recebe múltiplos arquivos de faturas de cartão de crédito e os categoriza de acordo com as categorias definidas pelo usuário, gerando um banco de dados em diversos formatos: JSON, XLSX e SQLite.

## Faturas suportadas

- Nubank
- XP

## Instalação

Para instalar o projeto, basta clonar o repositório e instalar as dependências:

```bash
git clone https://github.com/dgadelha/categorizador-faturas.git
cd categorizador-faturas
npm ci
```

É necessário ter o [Node.js](https://nodejs.org/) instalado.

## Utilização

1. Baixe as faturas de cartão de crédito no formato CSV e coloque-as na pasta `data`. O nome do arquivo deve ser o que o banco envia, sem alterações.

2. Monte o seu arquivo de categorias seguindo o modelo em categorias.yml.sample. O arquivo deve ser salvo como `categorias.yml`.

   Cada categoria deve conter múltiplas keywords que irão ser utilizadas para identificar a categoria da transação. As keywords são case insensitive.

   É permitido que categorias estejam no formato de expressões regulares. Para isso, basta usar o formato `/keyword da transacao/`.

3. Com as categorias definidas e as faturas salvas, basta rodar o comando:

```bash
npm start
```

Os arquivos de saída serão gerados na pasta `out`.
