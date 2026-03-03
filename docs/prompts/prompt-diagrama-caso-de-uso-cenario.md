Você é um analista UML sênior. Gere um diagrama de caso de uso UML para o cenário administrativo do projeto "menu-restaurante".

Objetivo:
Criar o arquivo: diagrama-caso-de-uso-cenario.mmd

Contexto do sistema:
- Painel admin local (admin.html + admin.js)
- CRUD de itens do cardápio
- Importação e exportação de JSON
- Ator principal: Admin

Regras UML obrigatórias:
1) Ator fora do retângulo do sistema.
2) Casos de uso em elipses dentro do sistema.
3) Nome dos casos sempre com verbo no infinitivo.
4) Associação apenas entre ator e caso de uso.
5) <<include>> para passos obrigatórios.
6) <<extend>> para comportamento opcional/condicional.
7) Foco em metas de usuário (não em detalhes de implementação).

Casos de uso mínimos esperados:
- Abrir Painel Administrativo
- Carregar JSON Atual
- Listar Itens no Painel
- Buscar Item
- Filtrar por Categoria
- Criar Item do Cardápio
- Editar Item do Cardápio
- Validar Campos Obrigatórios
- Visualizar Preview do Item
- Remover Item do Cardápio
- Importar Arquivo JSON
- Exportar Arquivo JSON Atualizado
- Desfazer Alterações Locais

Relacionamentos obrigatórios:
- Admin associado a todos os casos principais (abrir, listar, buscar, filtrar, criar, editar, remover, importar, exportar, desfazer)
- Abrir Painel Administrativo <<include>> Carregar JSON Atual
- Carregar JSON Atual <<include>> Listar Itens no Painel
- Criar Item do Cardápio <<include>> Validar Campos Obrigatórios
- Editar Item do Cardápio <<include>> Validar Campos Obrigatórios
- Criar/Editar <<include>> Visualizar Preview do Item
- Buscar Item <<extend>> Listar Itens no Painel
- Filtrar por Categoria <<extend>> Listar Itens no Painel
- Remover Item do Cardápio <<extend>> Editar Item do Cardápio
- Importar Arquivo JSON <<extend>> Carregar JSON Atual
- Exportar Arquivo JSON Atualizado <<extend>> Listar Itens no Painel
- Desfazer Alterações Locais <<extend>> Listar Itens no Painel

Procedimento:
1) Crie a fronteira: "Sistema de Administração Local (admin.html)".
2) Posicione ator Admin fora da fronteira.
3) Crie os casos de uso em elipse.
4) Conecte associações ator-caso.
5) Conecte include/extend com direção correta.
6) Revise verbos no infinitivo e sem ambiguidades.
7) Faça validação final das regras de ouro UML.

Saída:
- Retorne apenas código Mermaid válido para salvar em diagrama-caso-de-uso-cenario.mmd.
- Sem texto adicional.
