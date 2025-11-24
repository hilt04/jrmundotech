# Como Relacionar Produtos e Categorias no Banco de Dados

Agora que seu banco de dados tem a tabela `categories` e a coluna `category_id` na tabela `products`, você precisa popular esses dados para que o relacionamento funcione.

O objetivo é que cada produto na tabela `products` tenha sua coluna `category_id` preenchida com o `id` da categoria correspondente na tabela `categories`.

Aqui estão os passos e duas maneiras de fazer isso:

## Passo 1: Adicionar as Categorias

Primeiro, você precisa adicionar suas categorias à tabela `categories`. Cada categoria terá um `id` único.

Usando uma ferramenta de banco de dados (como phpMyAdmin, DBeaver, TablePlus), sua tabela `categories` pode ficar assim:

| id  | name              | created_at          | updated_at          |
| --- | ----------------- | ------------------- | ------------------- |
| 1   | Carregadores      | 2024-05-21 10:00:00 | 2024-05-21 10:00:00 |
| 2   | Fones de Ouvido   | 2024-05-21 10:00:00 | 2024-05-21 10:00:00 |
| 3   | Caixas de Som     | 2024-05-21 10:00:00 | 2024-05-21 10:00:00 |
| 4   | Informática       | 2024-05-21 10:00:00 | 2024-05-21 10:00:00 |
| 5   | Copos Térmicos    | 2024-05-21 10:00:00 | 2024-05-21 10:00:00 |

## Passo 2: Relacionar os Produtos

Com as categorias criadas, agora você pode atualizar seus produtos existentes para vinculá-los a uma categoria.

### Método 1: Manualmente (Via Ferramenta de Banco de Dados)

Esta é a forma mais direta se você tiver poucos produtos.

1.  Abra a tabela `products` em sua ferramenta de banco de dados.
2.  Encontre a coluna `category_id`.
3.  Para cada produto, edite a linha e insira o `id` da categoria correta. Por exemplo, para um produto chamado "Fone de ouvido Basike", você colocaria `2` na coluna `category_id`.

Sua tabela `products` ficaria mais ou menos assim:

| id  | name                  | price  | ... | category_id |
| --- | --------------------- | ------ | --- | ----------- |
| 1   | Fone de ouvido Basike | 79.90  | ... | 2           |
| 2   | Carregador Turbo 30W  | 99.90  | ... | 1           |

### Método 2: Programaticamente (Via `php artisan tinker`)

Esta é uma maneira poderosa de fazer isso pela linha de comando, útil para scripts ou atualizações rápidas sem uma interface gráfica.

1.  Abra o terminal na raiz do seu projeto (`c:\jrmundotech`).
2.  Execute o comando `php artisan tinker`. Isso abrirá um console interativo.
3.  Dentro do tinker, você pode executar código PHP/Laravel para interagir com seus modelos.

**Exemplo para atualizar um produto existente:**

```php
// Primeiro, encontre a categoria desejada.
$category = App\Models\Category::where('name', 'Fones de Ouvido')->first();

// Depois, encontre o produto que você quer atualizar.
$product = App\Models\Product::where('name', 'Fone de ouvido Basike')->first();

// Agora, associe o produto à categoria e salve.
if ($product && $category) {
    $product->category_id = $category->id;
    $product->save();
}

// Para sair do tinker, digite 'exit' ou pressione Ctrl+C.
```

Você pode repetir esses comandos para cada produto que deseja atualizar, apenas mudando os nomes da categoria e do produto.

Depois de fazer essas associações, sua página da loja já deve conseguir filtrar os produtos por categoria corretamente.
