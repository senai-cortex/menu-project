# Kurohana Sushi House - Cardapio Digital

Site de cardapio digital com visual vintage, construido com HTML + CSS + JavaScript puro.

## Estrutura

- `index.html`: experiencia publica do cardapio
- `admin.html`: painel local para editar itens e exportar JSON
- `data/menu.json`: fonte unica de dados (categorias e itens)
- `assets/css/styles.css`: tema, layout, responsividade e acessibilidade
- `assets/js/app.js`: busca, filtros, ordenacao e modal da pagina publica
- `assets/js/admin.js`: CRUD local, validacao, import/export JSON
- `assets/js/utils.js`: utilitarios compartilhados

## Como executar localmente

`fetch("data/menu.json")` exige servidor local. Rode um dos comandos abaixo na raiz do projeto:

```bash
python3 -m http.server 8080
```

Depois acesse:

- `http://localhost:8080/index.html`
- `http://localhost:8080/admin.html`

## Contrato do JSON

`data/menu.json` usa:

- `meta.restaurantName`
- `meta.currency` (JPY)
- `meta.locale`
- `meta.lastUpdated`
- `categories[]` com `id`, `name`, `order`
- `items[]` com `id`, `categoryId`, `name`, `price`, `image`, `rating`, `description`

## Fluxo de administracao (MVP)

1. Abrir `admin.html`.
2. Criar/editar/remover itens localmente.
3. Exportar o JSON atualizado.
4. Substituir `data/menu.json` no deploy e publicar novamente.

## Deploy estatico

Pode ser publicado em hosts estaticos como GitHub Pages, Netlify ou Vercel static.
