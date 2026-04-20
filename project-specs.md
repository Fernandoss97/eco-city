# Eco City — Especificação do Projeto

Plataforma web de apoio à gestão de Resíduos Sólidos Urbanos (RSU) para o cidadão, com consulta de coletas, mapa de pontos, cadastro de usuários, lembretes via WhatsApp e conteúdo educativo.

---

## 1. Visão geral

- **Objetivo:** facilitar ao cidadão o descarte correto de resíduos, oferecendo informação sobre dias de coleta, pontos de reciclagem/especiais e educação ambiental.
- **Cidade-piloto:** Cornélio Procópio / PR (CEPs **86300-000 a 86399-999**).
- **Natureza:** aplicação web pública + área logada + painel administrativo. **Sem PWA** no MVP.
- **Modelo de dados:** relacional puro (PostgreSQL sem extensões geoespaciais). Coordenadas armazenadas como `DECIMAL`; cálculos de distância via Haversine em SQL.

## 2. Atores

| Ator | Acesso | Descrição |
|---|---|---|
| **Visitante** | público | Consulta coletas por CEP/endereço, mapa, blog, pontos de coleta. Sem login. |
| **Cidadão** | autenticado (Sanctum) | Visitante + endereços salvos, preferências, calendário pessoal e lembretes WhatsApp. |
| **Administrador** | Filament `/admin` | CRUD de bairros, prefixos de CEP, cronogramas, pontos de coleta, artigos, templates de notificação e usuários. |
| **Autor** *(futuro)* | Filament `/admin` restrito | Publica artigos do blog. Fora do MVP — por ora, admin faz tudo. |

## 3. Requisitos Funcionais

### Cidadão

- **RF01** — **Consulta de coleta por região.** Listar os dias e janelas de coleta (recicláveis e não-recicláveis) para um bairro ou CEP informado.
- **RF02** — **Mapa interativo.** Exibir mapa (Mapbox GL) com pontos de coleta da cidade, clusterizados, com popup de detalhes ao clicar.
- **RF03** — **Cadastro e autenticação.** Cidadão cria conta com nome, e-mail, senha e **telefone (obrigatório, com opt-in WhatsApp)**. Login por e-mail + senha. Recuperação de senha por e-mail.
- **RF04** — **Notificações WhatsApp.** Enviar lembretes via Meta Cloud API para cidadãos opt-in, conforme cronograma do bairro e preferências (véspera da coleta às HH:MM; tipos de resíduo).
- **RF05** — **Pontos de coleta especial.** Listar e mapear pontos que recebem eletrônicos, pilhas, óleo, lâmpadas, etc., com endereço, horários e materiais aceitos.
- **RF06** — **Pontos de reciclagem.** Listar e mapear cooperativas e ecopontos com materiais aceitos.
- **RF07** — **Blog educativo.** Índice e páginas de artigos sobre descarte correto, com tags e busca por palavra-chave.
- **RF08** — **Busca por localização.** Input de CEP ou endereço livre. CEP resolve via ViaCEP → bairro via tabela `neighborhood_cep_prefixes`. Endereço livre é geocodificado via Mapbox Geocoding.
- **RF09** — **Preferências de notificação.** Cidadão configura: horário do lembrete, antecedência (véspera/mesmo dia), tipos de resíduo desejados, pausar/reativar.
- **RF10** — **Calendário de coletas.** Visualização mensal com as datas e tipos de coleta para o bairro/endereço do cidadão; visitante pode ver o calendário informando CEP.
- **RF11** — **Contato / suporte.** Formulário para envio de mensagens à administração municipal. Mensagens ficam no Filament para o admin responder por e-mail fora do app.

### Administrador (novos, derivados dos originais)

- **RF12** — **Gestão de bairros e prefixos de CEP.** Admin cadastra bairros da cidade-piloto e associa prefixos de CEP (ex.: `86300`, `86301-0`). Resolução de CEP escolhe o prefixo mais específico.
- **RF13** — **Gestão de cronogramas.** Admin define, por bairro, os dias da semana e janelas de horário de cada tipo de resíduo (reciclável, rejeito, orgânico, especial).
- **RF14** — **Gestão de pontos de coleta.** CRUD de pontos (tipo, nome, endereço, lat/lng, horários, materiais aceitos).
- **RF15** — **Gestão de conteúdo.** CRUD de artigos do blog com editor Markdown e upload de imagem de capa.
- **RF16** — **Gestão de templates de notificação.** Admin cadastra os templates aprovados na Meta (nome, idioma, variáveis) e associa a eventos (ex.: lembrete de coleta).

## 4. Requisitos Não-Funcionais

### Qualidade

- **RNF01** — **Responsivo mobile-first.** Layouts funcionais de 360 px até 1440 px. Sem PWA.
- **RNF02** — **Acessibilidade WCAG 2.1 AA** nas páginas públicas (contraste, navegação por teclado, `aria-*`, foco visível, textos alternativos).
- **RNF03** — **i18n pt-BR.** Textos em pt-BR; arquitetura preparada para i18n, mas sem outros idiomas no MVP.
- **RNF04** — **Performance.** LCP < 2,5 s em 4G; SSR nas páginas públicas chave (home, mapa shell, blog, artigo, coletas/[cep]).

### Segurança & Conformidade

- **RNF05** — **Autenticação via Laravel Sanctum** (cookies HttpOnly para o Next, token para mobile futuro).
- **RNF06** — **Rate limiting** nas rotas de busca por CEP e envio de formulários (throttle do Laravel).
- **RNF07** — **LGPD:**
  - consentimento explícito (checkbox) no cadastro, registrado em `users.lgpd_consent_at`;
  - opt-in do WhatsApp separado do consentimento LGPD;
  - rota autenticada para **exportar dados pessoais** em JSON;
  - rota autenticada para **excluir conta** (soft delete + anonimização de histórico).
- **RNF08** — **Validação server-side** em toda entrada; sanitização de HTML em artigos; CSRF ativo (SameSite=Lax).

### Operacional

- **RNF09** — **Queue em driver `database`**. Worker único (`queue:work --tries=3 --backoff=60`) gerenciado por supervisor/systemd.
- **RNF10** — **Scheduler** (`schedule:run` via cron minutal) enfileira `DispatchCollectionReminders` diariamente.
- **RNF11** — **Logs estruturados** (Monolog JSON) para envios de WhatsApp, com status de entrega.
- **RNF12** — **Versionamento de API:** prefixo `/api/v1/`. Quebras de contrato exigem `/api/v2/`.

## 5. Stack tecnológica

### Frontend — `eco-city-web`

- **Next.js 16.2.4** (App Router — checar `node_modules/next/dist/docs/` antes de codar, vide `AGENTS.md`).
- **React 19.2.4**, **TypeScript**, **Tailwind CSS v4**, **ESLint**.
- **Mapbox GL JS** (`mapbox-gl`) — token público restrito por URL.
- Cliente HTTP tipado pra API Laravel (fetch + Zod).

### Backend — `eco-city-api`

- **Laravel 13.x** + **PHP 8.5** (via **Laravel Herd** no ambiente local).
- **PostgreSQL 16** (sem PostGIS).
- **Laravel Sanctum** — autenticação SPA.
- **Laravel Filament 3** — painel admin em `/admin`.
- **Queue driver `database`** + tabela `jobs` + worker supervisor.
- **Scheduler** via cron (`* * * * * php artisan schedule:run`).

### Integrações externas

| Serviço | Uso | Notas |
|---|---|---|
| **Meta Cloud API (WhatsApp Business)** | RF04 — lembretes | Número comercial verificado; templates aprovados; free tier ≤ 1k conversas/mês. |
| **Mapbox GL JS + Geocoding** | RF02, RF08 | Token público URL-restricted. |
| **ViaCEP** | RF08 — CEP → endereço | Grátis, sem autenticação. |
| **SMTP (a definir)** | recuperação de senha, contato | Mailgun / Resend / SES — decidir no deploy. |

## 6. Modelo de dados (alto nível)

```
users(id, name, email, password, phone, whatsapp_opt_in,
      notif_prefs_json, lgpd_consent_at, deleted_at)
addresses(id, user_id, cep, street, number, neighborhood_id, lat, lng, label)

neighborhoods(id, city, name)
neighborhood_cep_prefixes(id, neighborhood_id, prefix)  -- ex.: '86300', '86301-0'

collection_schedules(id, neighborhood_id, waste_type, weekday, start_time, end_time)
  waste_type ∈ {reciclavel, rejeito, organico, especial}

collection_points(id, type, name, address, lat, lng,
                  neighborhood_id, hours_json, accepted_materials[], description)
  type ∈ {reciclagem, especial}

articles(id, slug, title, body_md, cover_path, published_at, tags[])

notification_templates(id, event, meta_name, locale, variables_json)
  event ∈ {collection_reminder}

notifications(id, user_id, template_id, payload_json,
              scheduled_for, sent_at, status, provider_message_id)

contact_messages(id, name, email, phone, subject, body, status, created_at)
```

**Resolução de CEP → bairro:** `SELECT * FROM neighborhood_cep_prefixes WHERE :cep LIKE prefix || '%' ORDER BY LENGTH(prefix) DESC LIMIT 1`.

**Distância entre cidadão e ponto:** Haversine em SQL (`6371 * acos(...)`) — aceitável pro volume da cidade-piloto.

## 7. Seeds da cidade-piloto

- 1 registro de cidade (Cornélio Procópio / PR).
- Bairros principais (a levantar: Centro, Jardim Panorama, Jardim Itamaraty, Vila Nova, etc.).
- Prefixos de CEP dentro da faixa **86300–86399** mapeados aos bairros.
- Cronograma semanal fictício/plausível por bairro (ajustável depois com dados reais da prefeitura).
- 5–10 pontos de coleta (reciclagem + especial) para popular o mapa inicial.
- 3–5 artigos iniciais do blog.

## 8. Fora do escopo (MVP)

- Push web / PWA.
- App nativo iOS/Android.
- Gamificação (pontos por descarte correto).
- Integração com transportadoras/coletoras (API própria da prefeitura).
- Denúncia de descarte irregular com foto (candidato a v2).
- Múltiplas cidades (arquitetura multi-tenant).
- Pagamentos / coleta agendada paga.

## 9. Roadmap

| Sprint | Escopo | Entregáveis |
|---|---|---|
| **S1 — Fundação** | Infra e design base | Projeto Laravel + Filament + Sanctum + Postgres + queue `database` + CI básico. Design system Next (tokens, tipografia, componentes base) a partir dos mockups em `screens-reference/`. |
| **S2 — Consulta pública** | RF01, RF08, RF10, RF12, RF13 | Home, busca por CEP, calendário mensal, admin de bairros + cronogramas. |
| **S3 — Mapa e pontos** | RF02, RF05, RF06, RF14 | Mapa Mapbox com pontos, filtros por tipo/material, admin de pontos. |
| **S4 — Conta do cidadão** | RF03, RF09 | Cadastro/login, endereços salvos, preferências de notificação, LGPD (RNF07). |
| **S5 — Notificações WhatsApp** | RF04, RF16 | Integração Meta Cloud, templates, scheduler + worker, opt-in, logs. |
| **S6 — Conteúdo e contato** | RF07, RF11, RF15 | Blog, artigo, busca, formulário de contato, admin de artigos. |
| **S7 — Hardening** | LGPD completo, a11y, performance | Exportação/exclusão de dados, auditoria WCAG AA, otimização LCP, deploy produção. |
