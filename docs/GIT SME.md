# Spassu - Code Challenge

## Objetivo

Este repositório contém um problema usado para avaliar as habilidades dos candidatos no desenvolvimento do backend, usando Python e Django e do frontend, usando JavaScript e React.

É importante notar que a resolução satisfatória do problema é apenas uma parte do que será avaliado. Também consideramos outras disciplinas de programação, como documentação, testes, histórico de commits, design e boas práticas de engenharia de software.

Pontos que serão avaliados:

* Habilidade de criar uma API Rest utilizando Python/django.
* Habilidade de utilizar React/Javascript ao interagir com APIs.
* Conhecimentos em criar e implementar um serviço básico e uma interface básica, utilizando boas práticas para oferecer uma boa experiência aos usuários.
* Experiência para criar um codigo limpo, legível e performático.

**Palavras-chave**
Funcionalidade | Formatação | Estrutura do Projeto | Escalabilidade | Manutenção | Boas práticas de mercado

## Recomendações

* Leia atentamente a especificação para entender todo o problema e os requisitos antes de começar e, caso não entenda algo, nos pergunte;
* Apreciamos a simplicidade;
* Por favor, escreva testes;
* Aplique boas prácticas de programação
* Ponha em prática os conceitos do [The Twelve-Factor App](https://12factor.net/pt_br/);
* Use os princípios do [SOLID](https://pt.wikipedia.org/wiki/SOLID)
* Use [boas práticas de git](https://www.git-tower.com/learn/git/ebook/en/command-line/appendix/best-practices), com mensagem claras;



# Especificação

## Contextualização

1. O nosso cliente é uma papelaria hipotética que gostaria de registrar suas vendas e calcular a comissão de seus vendedores com base nas vendas feitas em dado período e nos percentuais de comissão cadastrados nos produtos vendidos.
2. Um produto deve ter as seguintes informações: código, descrição, valor unitário e percentual de comissão, que pode variar entre 0 e 10%.
3. Uma venda tem número da nota fiscal, data/hora, cliente, vendedor e uma lista de um ou mais produtos e suas quantidades vendidas.
4. Clientes e vendedores têm nome, e-mail e telefone.
5. O cálculo da comissão é feito aplicando-se o percentual cadastrado no produto ao valor total da venda do produto (qtd \* valor unitário).
6. Em alguns dias da semana, o percentual de comissão tem limites mínimos e máximos. Isso pode mudar com alguma frequência, por isso esses parâmetros devem ser configuráveis.
* Exemplo: Segundas-Feiras Min: 3% Max: 5%. Nesse caso uma venda nesse dia, de um produto de comissão 10% pagaria uma comissão de 5%. Já a venda de um produto de comissão 2% pagaria 3%.
7. O total de comissão da venda é o total das somas das comissões dos itens da venda.

## Importante

O uso de bibliotecas externas (Axios, Redux, etc) ou de interface (Bootstrap, Material, etc) é liberado.
Apenas faça bom uso delas, a dica é não esquecer que esse espaço é para mostrar **o que você sabe fazer**.



## Suas tarefas

### A. Desenvolver uma aplicação Python/Django que atenda os critérios a seguir

* \[ ] Permitir, via Django admin, cadastrar produtos, clientes e vendedores
* \[ ] Permitir, via Django admin, configurar os dias da semana e os mínimos e máximos de comissão.
* \[ ] Expor uma API que possibilite CRUD de produtos, clientes, vendedores e vendas.
* \[ ] Expor uma API que permita obter a lista de vendedores com o valor total de comissões a ser pago a cada um pelas vendas de dado período.
* \[ ] Criar testes unitários



### B. Desenvolver uma aplicação em React.js que atenda os critérios a seguir:

* \[ ] Usar a API desenvolvida na tarefa A
* \[ ] Apresentar um menu com duas funcionalidades: Vendas e Comissões
* A funcionalidade de vendas deve:

  * \[ ] Apresentar a lista de vendas registradas exibindo data/hora, cliente, vendedor e valor total
  * \[ ] Permitir incluir/editar/excluir vendas
* A funcionalidade de comissões deve:

  * \[ ] Pedir uma faixa de datas
  * \[ ] Apresentar a lista de vendedores e o valor total de comissões a pagar para cada vendedor, com base nas vendas do período
  * \[ ] Apresentar total geral de comissões
* \[ ] Atender os protótipos criados pela equipe de UX, disponíveis nos links abaixo:

  * [Protótipo navegável](https://www.figma.com/proto/LrQFIRtrRJq1GVzofm07qU/Teste-Python-DEV?page-id=69%253A5896&node-id=830%253A2&viewport=1335%252C779%252C0.5&scaling=min-zoom&starting-point-node-id=830%253A124) - Dá uma visão de como seria a App funcionando.
  * [Protótipo aberto](https://www.figma.com/file/LrQFIRtrRJq1GVzofm07qU/Teste-Python-DEV?node-id=69%253A5896) - Apresenta as páginas da App como idealizadas pelo UX.

## O que vamos avaliar?

* Uso correto do gerenciamento de state
* Boa navegação entre as funcionalidades
* Componentização
* Boas práticas nas chamadas de API e tratamento de dados
* Separação de responsabilidades das lógicas das regras de negócio e interface

## Ponto extras

* Testes unitários no frontend
* Uso de Typescript
* Disponibilizar a aplicação rodando em algum servidor remoto.
* Filtros, ordenação e paginação são sempre bem-vindos.
* Um resumo de como foi feito o desenvolvimento, bem como um plano para as implementações que gostaria de ter feito.

## Como entregar

O seu projeto deve estar acessível para download em algum repositório git remoto, e deve conter no README instruções detalhadas para instalação e execução, incluindo pré-requisitos (ex: as versões utilizadas do Python no Backend e do NodeJS no Frontend).

