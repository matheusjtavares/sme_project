# The Twelve-Factor App — Diretrizes

> Fonte: https://12factor.net/pt_br/
> Resumo em texto próprio das diretrizes da página. Consulte a fonte para o conteúdo completo de cada fator.

## Objetivo

A metodologia doze-fatores é um conjunto de práticas para construir **software como serviço (SaaS / web apps)**. Ela vale para aplicações escritas em **qualquer linguagem** e que usem **qualquer combinação de serviços de apoio** (banco de dados, filas, cache em memória etc.).

Ela foi escrita a partir da experiência com centenas de aplicações (plataforma Heroku) e busca:

- Aumentar a consciência sobre problemas sistêmicos do desenvolvimento moderno de aplicações.
- Oferecer um vocabulário comum para discuti-los.
- Propor soluções conceituais, com terminologia própria.
- Evitar a erosão de software e favorecer a colaboração entre desenvolvedores.

**Público:** desenvolvedores que constroem aplicações rodando como serviço e engenheiros de operações que as implantam ou administram.

---

## Os Doze Fatores

| # | Fator | Diretriz |
|---|-------|----------|
| I | Base de código | Uma base de código rastreada por controle de revisão, com muitos deploys |
| II | Dependências | Declare e isole as dependências |
| III | Configurações | Armazene as configurações no ambiente |
| IV | Serviços de apoio | Trate serviços de apoio como recursos ligados |
| V | Construa, lance, execute | Separe estritamente os estágios de build e de execução |
| VI | Processos | Execute a aplicação como um ou mais processos que não armazenam estado |
| VII | Vínculo de porta | Exporte serviços por vínculo de porta |
| VIII | Concorrência | Escale através do modelo de processos |
| IX | Descartabilidade | Maximize a robustez com inicialização rápida e desligamento gracioso |
| X | Dev/prod semelhantes | Mantenha desenvolvimento, teste e produção o mais parecidos possível |
| XI | Logs | Trate logs como fluxos de eventos |
| XII | Processos de admin | Execute tarefas administrativas como processos pontuais |

---

## Detalhamento

### I. Base de código
- Cada aplicação tem **um único repositório** (ou conjunto de repositórios com raiz compartilhada) no controle de versão.
- Vários **deploys** (produção, staging, máquinas de desenvolvedores) partem da mesma base de código, ainda que em versões/commits diferentes.
- Código compartilhado entre aplicações deve virar **biblioteca**, declarada como dependência.

### II. Dependências
- **Declare** todas as dependências explicitamente em um manifesto.
- **Isole** as dependências durante a execução, para que nada dependa de pacotes "que já estão instalados" no sistema.
- Não presuma a existência de ferramentas do sistema; se necessárias, inclua-as na aplicação.

### III. Configurações
- Tudo que varia entre deploys (credenciais, URLs de serviços, hosts) fica **fora do código**.
- Guarde a configuração em **variáveis de ambiente**.
- Não agrupe configurações por "ambientes nomeados"; cada variável é independente e controlada por deploy.

### IV. Serviços de apoio
- Bancos, filas, SMTP, caches e APIs externas são **recursos ligados**, acessados via URL ou credenciais na configuração.
- Trocar um recurso local por um de terceiros (ou vice-versa) deve exigir **apenas mudança de configuração**, sem alterar código.

### V. Construa, lance, execute
- **Build:** transforma o código em um pacote executável.
- **Release:** combina o build com a configuração do deploy.
- **Run:** executa a release no ambiente.
- Os estágios são estritamente separados; não se altera código em execução. Cada release tem um identificador único e pode ser revertida.

### VI. Processos
- A aplicação roda como **processos sem estado e sem compartilhamento** (stateless / share-nothing).
- Qualquer dado que precise persistir vai para um **serviço de apoio** (por exemplo, um banco de dados).
- Não confie em memória ou disco local como armazenamento duradouro, nem em sessões "grudadas" (sticky sessions).

### VII. Vínculo de porta
- A aplicação é **autocontida**: ela própria embute o servidor web e expõe o serviço ao se vincular a uma **porta**.
- Não depende de injeção de um servidor externo em tempo de execução.
- Uma aplicação pode virar serviço de apoio de outra.

### VIII. Concorrência
- Escale **horizontalmente**, executando **mais processos**.
- Diferentes cargas de trabalho são atribuídas a **tipos de processo** distintos (web, worker etc.).
- Deixe o gerenciamento de processos ao sistema operacional ou ao gerenciador da plataforma.

### IX. Descartabilidade
- Processos podem ser **iniciados e parados a qualquer momento**.
- Minimize o tempo de inicialização.
- Desligue de forma **graciosa** ao receber o sinal de término (SIGTERM), terminando ou devolvendo o trabalho em andamento.
- Seja robusto contra encerramentos inesperados.

### X. Dev/prod semelhantes
- Reduza as lacunas entre desenvolvimento e produção em **tempo** (deploy contínuo), **pessoas** (quem desenvolve também acompanha o deploy) e **ferramentas** (mesmos tipos e versões de serviços de apoio).
- Evite usar serviços "leves" em desenvolvimento e diferentes em produção.

### XI. Logs
- A aplicação **não gerencia** arquivos de log nem roteamento.
- Cada processo escreve seu **fluxo de eventos**, sem buffer, na saída padrão (stdout).
- O ambiente captura, agrega e encaminha os logs para análise e armazenamento.

### XII. Processos de admin
- Migrações, consoles e scripts pontuais rodam como **processos únicos**.
- Usam a **mesma base de código, configuração e ambiente** de isolamento dos processos regulares.
- O código de administração é distribuído junto com a aplicação, evitando dessincronização.

---

## Checklist rápido

- [ ] Um repositório por aplicação, vários deploys
- [ ] Dependências declaradas em manifesto e isoladas
- [ ] Configuração em variáveis de ambiente, sem segredos no código
- [ ] Serviços de apoio intercambiáveis por configuração
- [ ] Build, release e run separados; releases versionadas
- [ ] Processos stateless; estado em serviços de apoio
- [ ] Aplicação exporta seu serviço por uma porta
- [ ] Escala por número de processos
- [ ] Início rápido e desligamento gracioso
- [ ] Ambientes dev/staging/prod o mais próximos possível
- [ ] Logs em stdout como fluxo de eventos
- [ ] Tarefas de admin como processos pontuais
