Você é um analista UML sênior. Gere um diagrama de caso de uso UML para o projeto "menu-restaurante".

Objetivo:
Criar o arquivo: diagrama-caso-de-uso-listagem.mmd

Contexto do sistema:
- Sistema público de cardápio digital (index.html + app.js)
- Dados vindos de data/menu.json
- Usuários principais: Cliente e Garçom/Host

Regras UML obrigatórias:
1) Ator é externo ao sistema (fora do retângulo).
2) Caso de uso é interno ao sistema e nomeado com verbo no infinitivo.
3) Associação (linha reta) somente entre ator e caso de uso.
4) <<include>>: obrigatório, seta tracejada do caso base para o caso incluído.
5) <<extend>>: opcional/condicional, seta tracejada do caso de extensão para o caso base.
6) Não misture fluxo técnico detalhado com meta de usuário; foco em objetivo funcional.

Casos de uso mínimos esperados:
- Acessar Cardápio
- Listar Categorias
- Listar Itens do Menu
- Buscar Itens
- Filtrar Itens por Categoria
- Ordenar Itens
- Visualizar Detalhes do Prato
- Exibir Quantidade de Resultados
- Carregar Dados do JSON

Relacionamentos obrigatórios:
- Cliente associado a: acessar, listar itens, buscar, filtrar, ordenar, visualizar detalhes
- Garçom/Host associado a: acessar, listar itens, visualizar detalhes
- Acessar Cardápio <<include>> Carregar Dados do JSON
- Carregar Dados do JSON <<include>> Listar Categorias
- Carregar Dados do JSON <<include>> Listar Itens do Menu
- Buscar/Filtrar/Ordenar/Visualizar Detalhes <<extend>> Listar Itens do Menu
- Listar Itens do Menu <<include>> Exibir Quantidade de Resultados

Procedimento:
1) Defina fronteira do sistema com nome: "Sistema Cardápio Digital (menu-restaurante)".
2) Posicione atores fora da fronteira.
3) Coloque casos de uso em elipse dentro da fronteira.
4) Adicione associações ator-caso.
5) Adicione include/extend com direção correta.
6) Revise se todos os nomes iniciam com verbo no infinitivo.
7) Valide que não há associação entre casos de uso (exceto include/extend).

Saída:
- Retorne apenas código Mermaid válido para salvar em diagrama-caso-de-uso-listagem.mmd.
- Sem explicações extras.
