# Sistema de Monitoramento da Dengue no Brasil

## Sobre o projeto

Este repositório apresenta o código-fonte de um sistema web desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do Bacharelado em Sistemas de Informação da Universidade Estadual de Mato Grosso do Sul (UEMS).

O projeto teve como objetivo desenvolver uma plataforma informativa para análise e monitoramento epidemiológico da dengue no Brasil, integrando dados oficiais e recursos de visualização para auxiliar na compreensão da distribuição da doença.

O período de análise compreendeu os anos de 2013 a 2023.

## Funcionalidades

O sistema contempla:

- Visualização de indicadores epidemiológicos de dengue.
- Dashboards interativos desenvolvidos no Power BI.
- Mapas para análise da distribuição geográfica dos casos.
- Filtros para exploração dos dados epidemiológicos.
- Interface de cadastro e login de usuários.
- Visualizações demonstrativas para visitantes.

## Tecnologias utilizadas

**Frontend:** React, JavaScript, Vite, HTML e CSS.

**Backend:** Node.js e Express.

**Banco de dados:** PostgreSQL.

**Tratamento e preparação dos dados:** linguagem R.

**Visualização de dados:** Microsoft Power BI.

**Versionamento:** Git e GitHub.

## Fontes dos dados

O desenvolvimento do trabalho utilizou dados provenientes de fontes oficiais, incluindo:

- Sistema de Informação de Agravos de Notificação (SINAN).
- Departamento de Informação e Informática do Sistema Único de Saúde (DATASUS).
- Instituto Brasileiro de Geografia e Estatística (IBGE).
- Instituto Nacional de Meteorologia (INMET).
- Sistema de Informações sobre Mortalidade (SIM).

## Estrutura do projeto

- `src/`: componentes, páginas e estilos da aplicação React.
- `public/`: imagens e recursos visuais utilizados no sistema.
- `backend/`: implementação do servidor e das rotas da API.
- `.env.example`: exemplo de configuração do frontend.
- `backend/.env.example`: exemplo de configuração do backend.

## Execução local

Para instalar as dependências do frontend:

```bash
npm install
```

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

O frontend utiliza a variável `VITE_API_URL` para configurar o endereço da API. O backend exige configuração própria das variáveis de ambiente e de uma base PostgreSQL autorizada.

As funcionalidades dependentes do banco de dados e da API podem não funcionar sem essas configurações.

## Observações sobre a versão pública

Este repositório foi preparado para fins acadêmicos e de apresentação do Trabalho de Conclusão de Curso.

Por motivos de segurança e privacidade, as credenciais de acesso, os arquivos de configuração privados e as bases de dados originais não fazem parte desta versão.

Os relatórios e mapas disponibilizados para visualização utilizam dados epidemiológicos públicos e agregados.

## Autoria

Gabriela Rabelo de Melo

Bacharelado em Sistemas de Informação — Universidade Estadual de Mato Grosso do Sul (UEMS).

Trabalho de Conclusão de Curso — 2026.