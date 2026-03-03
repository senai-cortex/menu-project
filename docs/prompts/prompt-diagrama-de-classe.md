Você é um arquiteto de software. Gere um diagrama de classes UML para o projeto "menu-restaurante".

Objetivo:
Criar o arquivo: diagrama-de-classe.mmd

Contexto técnico:
- Projeto estático com HTML/CSS/JS
- Fonte de dados: data/menu.json com meta, categories, items
- Módulos JS principais: app.js, admin.js, utils.js

Regras UML para classe:
1) Cada classe deve ter nome claro, atributos tipados e operações principais.
2) Mostrar multiplicidade nas relações (1, *, 0..1 quando aplicável).
3) Separar classes de domínio (dados) e classes de controle (lógica).
4) Evitar métodos irrelevantes; foco no comportamento central.
5) Relacionamentos devem refletir o domínio real.

Classes mínimas obrigatórias:
- MenuMeta
  atributos: restaurantName:string, currency:string, locale:string, lastUpdated:string
- Category
  atributos: id:string, name:string, order:number
- MenuItem
  atributos: id:string, categoryId:string, name:string, price:number, image:string, rating:number, description:string
- MenuData
  atributos: meta:MenuMeta, categories:Category[], items:MenuItem[]
- AppController
  operações: loadMenu(), applyFilters(), renderItems(), openItemModal()
- AdminController
  operações: loadMenu(), renderList(), saveItem(), deleteItem(), importJson(), exportJson()
- MenuUtils
  operações: formatPrice(), createMenuCard(), debounce(), sanitizeText()

Relacionamentos obrigatórios:
- MenuData 1 *-- 1 MenuMeta
- MenuData 1 *-- * Category
- MenuData 1 *-- * MenuItem
- Category 1 <-- * MenuItem (via categoryId)
- AppController ..> MenuData
- AdminController ..> MenuData
- AppController ..> MenuUtils
- AdminController ..> MenuUtils

Procedimento:
1) Modele primeiro as classes de domínio.
2) Adicione classes de controle/utilitárias.
3) Defina atributos e operações com tipos.
4) Aplique multiplicidades e dependências.
5) Revise consistência com o JSON e com os módulos JS.
6) Retire qualquer classe sem utilidade direta ao escopo.

Saída:
- Retorne apenas código Mermaid classDiagram válido para salvar em diagrama-de-classe.mmd.
- Sem explicações fora do bloco.
