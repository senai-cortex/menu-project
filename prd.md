Aqui vai o **PRD** direto, sem enfeite:

---

# Documento de Requisitos de Produto (PRD)

**Projeto:** Cardápio Digital Interativo – Restaurante Japonês (Sushi)
**Estilo visual:** Vintage bordô escuro, tipografia jornal antigo, valores em yen, UI/UX moderna e fluida

---

## 1. Contexto / Problema

Restaurante precisa de cardápio digital moderno e responsivo com experiência imersiva.
Cardápios físicos custam tempo de atualização, ocupam espaço e não engajam.
Usuários querem navegar rápido em qualquer dispositivo.

---

## 2. Objetivo do Produto

Produto que permita:

* Apresentar menu completo interativo.
* Navegação fluida em mobile / tablet / desktop.
* Estilo vintage alinhado à cultura japonesa com toque moderno.
* Otimização de performance e acessibilidade.

---

## 3. Público-alvo / Personas

**Persona 1:** Cliente local tech-savvy que quer pedido rápido no celular.
**Persona 2:** Turista que quer imersão cultural e visual.
**Persona 3:** Atendimento interno — garçom/host que usa tablet pra sugerir itens.

---

## 4. Escopo

**In-Scope**

* Interface de cardápio por categoria (sushi, sashimi, combos, bebidas).
* Visual vintage com bordô escuro e tipografia antiga.
* Interativo com descrições, fotos, preços em yen.
* Responsivo total.
* Persistência dos itens do menu em arquivo JSON.
* Busca e filtros (tipo, preço, popularidade).

**Out-of-Scope**

* Sistema de pagamento integrado no primeiro MVP.
* Gestão de mesas / pedidos interno completo.
* Integração com ERPs externos.

---

## 5. Requisitos Funcionais

* RF1: Listar categorias e itens.
* RF2: Detalhes do prato (foto, descrição, preço em yen).
* RF3: Busca e filtro em tempo real.
* RF4: Layout responsivo.
* RF5: Leitura dos itens a partir de arquivo JSON com dados fixos.
* RF6: Feedback visual ao adicionar itens (ex: destaque, animação leve).

---

## 6. Requisitos Não Funcionais

* **Performance:** TTFB < 200ms, interações < 100ms perceptíveis.
* **Segurança:** HTTPS obrigatório, proteção XSS/CSRF.
* **SLA:** Disponibilidade mínima 99,5%.
* **Acessibilidade:** Leitura compatível com leitores de tela.

---

## 7. Critérios de Aceitação

* Todos os módulos acessíveis em mobile e desktop sem scroll horizontal.
* Menu carrega em <= 2s com 4G.
* Itens são carregados corretamente a partir do arquivo JSON sem erro.
* Design respeita guias visuais pré-aprovados.

---

## 8. Métricas de Sucesso

* **Adesão:** > 70% dos clientes usam o digital no mês 1.
* **Performance real:** Page load medido < 2s.
* **Erros:** < 1% de falhas relatadas.
* **Satisfação UI:** NPS interno >= 8.

---

## 9. Stack Possível

Implementação: **HTML + CSS + JavaScript puro (vanilla), sem frameworks**
Persistência de dados: **arquivo JSON local** contendo, por item, apenas:
* nome
* preço
* imagem (link)
* avaliação (fictícia e hardcoded)
* descrição

---

## 10. Orçamento (estimado)

* Desenvolvimento: 160h
* UI/UX design: 40h
* Testes e QA: 30h
* Infra: $XX/mês
  (Valores a ajustar conforme time)

---

## 11. Riscos Conhecidos

* Entrega adiada por design vintage complexo.
* Performance degradada em dispositivos antigos.
* Tradução/locale pode confundir preço em yen.

---

## 12. Fluxos de Usuário / Jornadas

**Usuário cliente**

1. Abre cardápio pelo QR.
2. Visualiza categorias.
3. Filtra/Busca sushi favorito.
4. Vê detalhes e volta rapidamente.

**Admin**

1. Loga no painel.
2. Edita o arquivo JSON com os dados dos itens.
3. Salva as alterações no arquivo.
4. Publica alterações.

---

Se quiser template pronto pra entregar ao time (incluindo tabelas e wireframes), peço que diga o nível de detalhe.
