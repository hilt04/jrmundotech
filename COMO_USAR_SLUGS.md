# O que é o Slug e Como Usá-lo

## 1. O que é um Slug?

Pense no slug como um "apelido" para a sua categoria, criado especialmente para ser usado em URLs (links). Ele resolve o problema de nomes com espaços ou acentos, que quebram os links.

-   **Nome da Categoria:** `Fones de Ouvido`
-   **Slug correspondente:** `fones-de-ouvido`

O slug **NÃO** serve para conectar o produto à categoria. Quem faz isso é a coluna `category_id` na tabela `products`. O slug é usado **APENAS** para criar o link no menu de navegação do seu site.

## 2. Como preencher o Slug no Banco de Dados

Você precisa preencher a coluna `slug` na sua tabela `categories` manualmente, usando uma ferramenta como o phpMyAdmin.

**Regras para criar um bom slug:**
- Use apenas letras minúsculas.
- Substitua espaços por hífens (`-`).
- Não use acentos ou caracteres especiais (ç, ~, ^, etc.).

**Exemplo de como sua tabela `categories` deve ficar:**

| id  | name              | slug              |
| --- | ----------------- | ----------------- |
| 1   | Carregadores      | `carregadores`      |
| 2   | Fones de Ouvido   | `fones-de-ouvido`   |
| 3   | Caixas de Som     | `caixas-de-som`     |
| 4   | Informática       | `informatica`       |
| 5   | Copos Térmicos    | `copos-termicos`    |

Depois de preencher a coluna `slug` e aplicar a correção no arquivo `Loja.vue`, os links das suas categorias funcionarão perfeitamente.
