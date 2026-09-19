# SOLID — Diretrizes

> Fonte: https://pt.wikipedia.org/wiki/SOLID
> Resumo em texto próprio dos princípios descritos na página.

## O que é

**SOLID** é um acrônimo para **cinco postulados de design** da programação orientada a objetos, criados para facilitar a **compreensão, o desenvolvimento e a manutenção** de software.

- Foram apresentados por **Robert C. Martin** em um artigo do ano 2000 sobre princípios e padrões de projeto.
- O acrônimo em si teria sido cunhado depois por **Michael Feathers**.
- Não devem ser confundidos com as orientações **GRASP**.

---

## Os cinco princípios

| Letra | Princípio | Ideia central |
|-------|-----------|---------------|
| **S** | Single Responsibility (Responsabilidade Única) | Uma classe deve ter apenas uma responsabilidade |
| **O** | Open/Closed (Aberto/Fechado) | Aberto para extensão, fechado para modificação |
| **L** | Liskov Substitution (Substituição de Liskov) | Subtipos devem poder substituir seus tipos base |
| **I** | Interface Segregation (Segregação de Interface) | Várias interfaces específicas superam uma genérica |
| **D** | Dependency Inversion (Inversão de Dependência) | Dependa de abstrações, não de implementações concretas |

---

## Detalhamento

### S — Princípio da Responsabilidade Única
- Uma classe deve ter **uma única responsabilidade**.
- Uma mudança em apenas uma parte da especificação do software deve afetar apenas a classe correspondente a essa parte.
- **Na prática:** se uma classe muda por motivos diferentes (regra de negócio, formatação, persistência), divida-a.

### O — Princípio Aberto/Fechado
- Entidades de software (classes, módulos, funções) devem ser **abertas para extensão**, mas **fechadas para modificação**.
- **Na prática:** adicione comportamento novo criando código novo (herança, composição, polimorfismo), sem reescrever código já testado.

### L — Princípio da Substituição de Liskov
- Objetos de um programa devem poder ser **substituídos por instâncias de seus subtipos** sem alterar o funcionamento correto do programa.
- **Na prática:** uma subclasse não deve quebrar as expectativas (contratos) definidas pela classe base.

### I — Princípio da Segregação de Interface
- **Muitas interfaces específicas para clientes** são melhores do que uma única interface de propósito geral.
- **Na prática:** nenhum cliente deve ser obrigado a depender de métodos que não usa.

### D — Princípio da Inversão de Dependência
- Deve-se **depender de abstrações**, e não de objetos concretos.
- **Na prática:** módulos de alto nível não devem depender diretamente de módulos de baixo nível; ambos dependem de interfaces/abstrações (por exemplo, via injeção de dependência).

---

## Benefícios esperados

- Código mais fácil de entender e manter
- Menor acoplamento entre componentes
- Maior facilidade de teste e de reutilização
- Evolução do sistema com menos risco de regressões

## Checklist rápido

- [ ] Cada classe tem um só motivo para mudar?
- [ ] Novas funcionalidades entram por extensão, sem modificar código estável?
- [ ] Subclasses podem ser usadas no lugar das classes base sem surpresas?
- [ ] Interfaces são enxutas e específicas para cada cliente?
- [ ] O código depende de abstrações em vez de implementações concretas?
