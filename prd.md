# Product Requirements Document: Unified Team Workspace (clean-room re-implementation)

## 1. Document control

| Field | Value |
|---|---|
| Document | Product Requirements Document (PRD) for the Product |
| Version | 0.1 |
| Status | Draft |
| Owner | TBD (product lead) |
| Date | 2026-10-28 |
| Companion document | `specs.md`, the functional and technical specification. This PRD says what to build and why; the specification says how it must behave. References take the form "see Spec §N". |
| Audience | Product, design, engineering, operations, legal and the clean-room review board |
| Classification | Clean-room deliverable. Written in the authors' own words from behavioural research. Contains no source code, schema, prompts or copy from the reference product. |

### 1.1 Naming conventions in this document

- "The Product" is the workspace being built. "The Assistant" is its built-in AI agent, @-mentionable by a configurable handle (default `@assistant`).
- "The local agent daemon" is the optional helper a user runs on their own computer so agents can execute there.
- "Operator" is whoever installs and runs an instance: a company running its own single-organisation install, or a provider running multi-tenant SaaS.
- "Workspace" and "team" mean the tenant that shares channels, items, memory and billing (see Spec §2).
- Story identifiers take the form `PRD-<AREA>-NN`. Priorities are P0 (must ship in the named phase), P1 (should ship in the named phase, may slip one phase) and P2 (could ship; schedule by demand).
- Phases are defined in section 10.

### 1.2 Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-28 | W-PRD | First complete draft for review |

### 1.3 Approvals required

| Role | Name | Decision | Date |
|---|---|---|---|
| Product owner | TBD | Pending | |
| Engineering lead | TBD | Pending | |
| Design lead | TBD | Pending | |
| Legal (clean-room and licensing) | TBD | Pending | |
| Operations lead | TBD | Pending | |

## 2. Summary and problem statement

### 2.1 Summary

The Product is one workspace for a company's day-to-day work: email, team chat, tasks and projects, collaborative documents, canvas, file storage, databases, spreadsheets, forms, calendar and booking pages, a customer CRM, calls with recording and transcription, pull-request review, unified search, and AI agents that share the workspace's memory and permissions.

Every item is an addressable entity in one graph. Any item can be @-mentioned from any rich-text surface, and the reference is stored in both directions, so each item knows everywhere it is mentioned. One permission model governs people, channels, teams, public links and agents. The same graph, search index and tool surface are available to the Assistant, to custom agents, to routines and to external AI clients over MCP.

This PRD covers a clean-room re-implementation that reaches feature and UX parity with a reference product and runs on one virtual private server (VPS) or a small group of VPSs, with no dependency on Amazon Web Services or Cloudflare.

### 2.2 Problem statement

Small and mid-sized teams run their work across eight to fifteen tools: a mail client, a chat tool, an issue tracker, a document wiki, a CRM, a meeting recorder, a scheduling tool, a file drive and several AI assistants. This causes four problems.

1. **Fragmented context.** A customer request arrives by email, is discussed in chat, becomes a ticket, is decided in a call and is documented in a wiki. No tool holds the whole story, and links between tools are one-directional and break.
2. **Fragmented permissions.** Each tool has its own sharing model. People over-share to avoid friction or under-share and block colleagues. Access does not follow the conversation in which an item was shared.
3. **AI without memory.** Assistants bolted onto single tools see a slice of the work. Cross-tool agents need many integrations, each with its own credentials, rate limits and token costs, and they still lack a shared notion of who can see what.
4. **Cost and control.** Per-seat subscriptions to many tools add up, and data sits with many vendors. Teams that must keep data on their own infrastructure have few integrated options.

### 2.3 Proposed solution

A single computable workspace:

- **One entity graph.** Every email thread, message, task, document, file, record, event, call and agent session is an entity with typed properties, tags and a stable link.
- **Bidirectional references.** @-mentions create stored edges. Every entity shows its references, and mentions render as live chips that show current state.
- **Shared permissions.** One share model (owner, editor, commenter, viewer, team access, public link, channel grant) applies to every entity. Sharing an item into a channel grants that channel's members access.
- **Agent-ready memory.** One search index, one tool catalog and one memory layer serve people and agents alike. Agents act as the person who invoked them and can never exceed that person's access.
- **Keyboard-first speed.** Every action has a shortcut, lists triage like a fast mail client, and several items open side by side in splits.
- **Own your infrastructure.** One install command on one VPS for a small team; horizontal scale across a few VPSs for larger ones.

### 2.4 Why a re-implementation

The reference product is published under a strong copyleft licence. Organisations want an equivalent product they can host on commodity VPS infrastructure, license on their own terms and extend, without inheriting the reference's code, cloud dependencies or brand. A clean-room process (Spec §1.4) keeps the new code independent.

## 3. Goals, non-goals and guiding principles

### 3.1 Goals

| ID | Goal | Measure (see section 11) |
|---|---|---|
| G1 | **Feature parity** with the reference product across all areas in section 6, including behaviour the reference advertises but does not fully implement (marked as target behaviour). | 100% of P0 and P1 stories accepted by the end of Phase 3 |
| G2 | **UX parity**: the same shell, navigation, keyboard model, list conventions, entity pages, splits and per-surface behaviour, so a user of the reference is productive within minutes. | Task-completion parity in moderated usability tests; keyboard coverage |
| G3 | **First-class VPS self-hosting**: a single VPS serves a small team; a few VPSs serve hundreds of users; no AWS or Cloudflare dependency. | Install success rate; time to first login; tier load tests |
| G4 | **Speed**: name search and list navigation feel instant; collaborative edits appear for other users within a fraction of a second. | Performance budgets in section 7.10 and section 8.1 |
| G5 | **Agents as first-class users**: agents can read, create and change workspace items through the same tools and permissions as people, from inside the Product and from external MCP clients. | Agent tool success rate; MCP adoption |
| G6 | **Graceful degradation**: optional subsystems (calls, AI, transcription, full-text search, office conversion) can be absent without breaking the rest. | Feature-matrix tests per component combination |
| G7 | **Two tenancy modes**: single-organisation self-host with billing off, and multi-tenant SaaS on VPS with billing on. | Both modes pass the same acceptance suite |
| G8 | **Data ownership**: full export, deletion, retention controls, and no model training on customer content. | Export and deletion tests; provider configuration audit |

### 3.2 Non-goals

- Depending on AWS, Cloudflare or any other single cloud provider's proprietary services. Hosted APIs (LLM providers, Google, Microsoft, GitHub, Stripe) are optional integrations, never infrastructure.
- Copying the reference product's source code, database schema, prompts, internal architecture, brand, logo, illustrations, marketing copy or documentation text.
- Wire compatibility with the reference's private APIs, or migrating data directly from a reference instance (an importer may be considered later, see section 13).
- Being an email server. The Product is a mail client over connected accounts; mail hosting stays with the provider.
- Replacing a full ERP, accounting, HR or helpdesk ticketing suite.
- Shipping native apps under the reference product's store identity. Operators who want native apps build and sign their own.
- Certifying compliance (SOC 2, ISO 27001) for operators. The Product provides controls; certification is the operator's responsibility.

### 3.3 Guiding principles

| ID | Principle | Implication |
|---|---|---|
| P1 | **Everything is an entity.** | Every new object gets an id, a kind, properties, tags, references, sharing, search indexing, activity and an MCP tool surface. No second-class objects. |
| P2 | **One way to share.** | The share dialog, access levels and access requests are identical on every entity. A channel mention is a share. |
| P3 | **Keyboard first, mouse friendly, touch capable.** | Every command is reachable by keyboard on desktop; every list supports `j`/`k`/`e`; touch gets swipe and long-press equivalents. |
| P4 | **Agents are users, bounded by people.** | Agents act as a requester or owner, inherit that person's access, are attributed in activity, and ask before sending anything outward. |
| P5 | **Draft, don't send.** | AI-initiated outward actions (email, calendar invites, booking links, external messages) show a review step unless the user has explicitly allowed them. |
| P6 | **Optimistic and undoable.** | Mutations apply instantly in the UI, persist through a durable queue, and offer undo where the action is reversible. |
| P7 | **Degrade, don't break.** | A missing optional component hides or disables its features with an explanation; it never causes errors elsewhere. |
| P8 | **Boring infrastructure.** | Prefer PostgreSQL, a Redis-compatible cache, S3-compatible storage and containers. Each additional stateful service must justify itself. |
| P9 | **Own your data.** | Exports in open formats (Markdown, CSV, XLSX, ICS, MP4, JSON); no lock-in through proprietary formats. |
| P10 | **Parity before invention.** | Until Phase 3 exit, new features beyond the reference require product-owner approval. |

## 4. Target users and personas

### 4.1 Persona summary

| ID | Persona | Primary surfaces | Top need |
|---|---|---|---|
| PER-1 | Startup founder / operator | Home, Email, Chat, Calendar, CRM, Agents | Triage everything in one place and delegate to agents |
| PER-2 | Engineer | Tasks, Pull requests, Docs, Chat, Coding agents, MCP | Keep code review, tasks and specs connected; hand work to coding agents |
| PER-3 | Sales / business development | CRM, Email, Calendar, Booking links, Calls | A pipeline built from real email and meetings with little data entry |
| PER-4 | Support / customer success | Email (shared inboxes), Chat, Tasks, CRM, Snippets | Fast, consistent replies and clean hand-offs |
| PER-5 | Operations / workspace admin | Settings, Teams, Drive, Databases, Forms, Routines | Control access, onboarding, automation and cost |
| PER-6 | Self-hosting sysadmin | Installer, operator console, backups, upgrades, telemetry | Predictable install, upgrades and recovery on modest hardware |
| PER-7 | External guest | Shared docs, booking pages, call links, forms, channel invites | Take part without creating an account or learning the tool |
| PER-8 | AI agent (first-class user) | Tool catalog, MCP, channels, tasks, documents | Unambiguous tools, clear permissions, durable context and attribution |

### 4.2 Persona details

**PER-1 Startup founder / operator.** Runs a 5 to 50 person company. Lives in email and chat, joins many calls, owns fundraising and key customer relationships. Pains: context switching, forgotten follow-ups, too many tools to pay for. Success: clears Home and Signal mail twice a day by keyboard, asks the Assistant for status across projects, gets daily briefs from routines, books meetings by sharing a booking link.

**PER-2 Engineer.** Works from tasks and pull requests. Wants tasks to move automatically as branches and PRs progress, specs in Markdown beside the code review, and the option to hand a task to a coding agent (hosted or on their own machine). Uses external AI coding tools that connect to the workspace through MCP. Success: never updates task status by hand for PR-linked work; reviews and merges PRs from the Product.

**PER-3 Sales / BD.** Needs a CRM that fills itself from sent mail, shows every email, call, file and task per company, and moves deals across pipeline stages on a board. Uses booking links for demos and call transcripts for notes. Success: no manual contact entry; pipeline reviews run from a shared board.

**PER-4 Support / customer success.** Works shared and delegated inboxes, uses snippets for standard replies, turns emails into tasks, escalates in channels. Success: consistent response times, no lost threads, history visible to the whole team.

**PER-5 Operations / workspace admin.** Sets up the team, roles, invite policy, domain auto-join, CRM enablement, tags, integrations, routines, and databases or forms for internal processes. Watches AI usage and seat plans. Success: new hires productive on day one; permissions correct by default.

**PER-6 Self-hosting sysadmin.** Installs and runs the Product for an organisation on one or more VPSs. Needs one-command install, clear sizing, automatic TLS, scheduled backups with tested restore, safe upgrades, health and metrics, and clear registration steps for Google, Microsoft, GitHub and Slack apps. Success: install to first login in under 30 minutes on a fresh VPS; the quarterly restore drill passes.

**PER-7 External guest.** A customer, candidate, contractor or investor. Opens a public document link, books a meeting, joins a call link, fills a form or replies to a channel invitation by email. Must not need an account for read-only, booking, call-link and public-form flows. Success: completes the task in one visit with no sign-up wall.

**PER-8 AI agent.** The Assistant, custom agents, routine runs, coding agents and external MCP clients. Requires a typed, documented tool catalog; deterministic permission errors; bounded results with paging; idempotent writes; attribution to the acting person; and notifications or system events it can react to. Success: high tool-call success rate, no permission escalations, a clear audit trail.

## 5. Deployment and tenancy requirements

See Spec §3 (architecture and topology), §4 (component mapping), §5 (operations) and §38 (observability and security).

### 5.1 Tenancy modes

| Mode | Description | Billing | Sign-up | Plan limits |
|---|---|---|---|---|
| Single-organisation self-host | One organisation runs its own instance. One primary workspace; optional additional workspaces created by the instance admin. | Off (no payment provider needed) | Closed by default: invite-only or allowed email domains | Operator-defined; default "Unlimited" plan with all features |
| Multi-tenant SaaS on VPS | A provider hosts many independent workspaces on its own VPS fleet. | On (Stripe or a replaceable billing adapter) | Open or allowlisted | Free / Pro / Max defaults (section 9), all configurable |

**PRD-DEPLOY-01** · P0 · Phase 0 — As a sysadmin, I want to choose the tenancy mode at install time, so that billing and sign-up behave correctly for my organisation.
- Given a fresh install, when I select single-organisation mode, then no billing screens, paywalls, upgrade prompts or plan badges appear anywhere and all features are enabled by default.
- Given multi-tenant mode, when billing credentials are missing, then the installer refuses to finish and names the missing settings.
- Given either mode, when I change the mode later through the operator console, then existing data is preserved and plan assignment is recalculated without downtime.

**PRD-DEPLOY-02** · P0 · Phase 0 — As a sysadmin, I want strict tenant isolation in multi-tenant mode, so that no workspace can read another's data.
- Every API, search, realtime, export and agent-tool request is scoped to the caller's accessible entities; automated cross-tenant tests that request another tenant's ids receive "not found".
- Search results, mention autocomplete, people search and MCP results never include entities from another workspace, except items explicitly shared with the caller as a guest.

### 5.2 Sizing tiers

Reference hardware assumes a current-generation x86-64 or ARM64 VPS, NVMe SSD and a 1 Gbit/s network. LLMs are hosted externally unless stated.

| Tier | Active users | Nodes | Per-node size | Included components | Notes |
|---|---|---|---|---|---|
| Starter | up to 10 | 1 | 4 vCPU, 8 GB RAM, 160 GB SSD | Core, email sync, collaboration, PostgreSQL full-text search, AI via external APIs | Search Index optional; no self-hosted calls or local transcription |
| Team | up to 50 | 1 | 4-8 vCPU, 16 GB RAM, 320 GB SSD | Starter plus OpenSearch single node, calls (Media Server), Office Converter, Render Service | Calls need open UDP ports and TURN; 10 concurrent call participants |
| Growth | up to 250 | 3 | App node 8 vCPU / 32 GB; data node 8 vCPU / 32 GB with 1 TB NVMe; media node 4-8 vCPU / 8-16 GB | Team plus dedicated media node; optional fourth node as Code Sandbox host | PostgreSQL streaming replica recommended |
| Scale | up to 1,000 | 4-6 | 2 stateless app nodes (8 vCPU / 32 GB), 1-2 data nodes, 1 search node (8 vCPU / 32 GB), 1+ media nodes | All components; horizontal app and worker scaling; Collab Server sharded by document id | Larger deployments are out of scope for v1 but must not be blocked by design |
| Local model add-on | any | +1 GPU node | e.g. one 24-48 GB GPU, 16 vCPU, 64 GB RAM | OpenAI-compatible inference server (vLLM, Ollama) and/or self-hosted Whisper | Local model quality and context size limit some agent features |

**PRD-DEPLOY-03** · P0 · Phase 0 — As a sysadmin, I want published sizing tiers with load-test evidence, so that I can buy the right VPS.
- Each release publishes load-test results for the Starter and Team tiers showing the targets in section 8 are met at the tier's user count; Growth results are published from Phase 3.
- The installer checks CPU, RAM, disk and open ports, warns when below the chosen tier's minimum, and refuses to install below 2 vCPU / 4 GB RAM.

### 5.3 Installation

**PRD-DEPLOY-04** · P0 · Phase 0 — As a sysadmin, I want a one-command install with Docker Compose, so that I can run the Product without platform engineering.
- Given a supported Linux VPS with Docker Engine and the Compose plugin, when I run the single documented install command and answer the prompts (domain, admin email, tenancy mode, optional components), then the stack starts, TLS is issued, and I receive a first-admin sign-in code by email, all within 30 minutes.
- The installer writes one environment file and one secrets file with generated random secrets (database passwords, signing keys, encryption master key), readable only by the owner.
- Re-running the installer is idempotent: it never regenerates existing secrets or wipes volumes.
- Every container defines a health check and restart policy; `status` and `logs` helper commands show component health.
- An offline (air-gapped) install path with a pre-downloaded image bundle is documented (P1).

**PRD-DEPLOY-05** · P1 · Phase 2 — As a sysadmin running several VPSs, I want a documented multi-node deployment, so that I can scale horizontally.
- A reference multi-node layout (Compose per node, or Nomad or k3s manifests) is published for the Growth and Scale tiers.
- Stateless services (API Server, Realtime Hub, Worker Pool) scale by changing a replica count only.
- The Collab Server routes each document to exactly one owning replica; losing a node reassigns its documents within 30 seconds, losing at most unacknowledged edits.
- The Scheduler runs on exactly one leader; a failed leader is replaced within 60 seconds.

### 5.4 TLS and networking

**PRD-DEPLOY-06** · P0 · Phase 0 — As a sysadmin, I want automatic TLS, so that I never handle certificates by hand.
- The Edge Proxy obtains and renews certificates through ACME (HTTP-01 by default; DNS-01 for wildcard preview subdomains).
- Operators can supply their own certificate and key instead.
- HTTP redirects to HTTPS; HSTS is on with a one-year max-age; TLS 1.2 is the minimum.
- WebSocket and server-sent-event connections survive at least one hour of idle time through the proxy.
- The install guide lists every inbound port: 443/TCP and 80/TCP (ACME), the call media UDP range and TURN ports when calls are enabled, and an optional SSH port for coding-agent preview tunnels.

### 5.5 Backups and restore

**PRD-DEPLOY-07** · P0 · Phase 0 — As a sysadmin, I want scheduled, encrypted backups of all state, so that I can recover from loss of the VPS.
- Backups cover the Primary Database (daily base backup plus continuous write-ahead-log archiving), the Object Store, Collab Server state not held in the database, the encryption master key (separately, see PRD-NFR-19) and configuration.
- Backups go to an S3-compatible or SSH/rsync target of the operator's choice and are encrypted client-side.
- Default retention: 7 daily, 4 weekly and 6 monthly snapshots, configurable.
- A `restore` command restores a complete instance onto a fresh VPS; the documented restore drill completes within the RTO in section 8.3 for a 200 GB Team-tier dataset.
- A backup failure raises an operator alert and a console banner within one hour.
- The Search Index and caches are rebuildable and excluded from backups by default; a `reindex` command rebuilds search from the database.

### 5.6 Upgrades

**PRD-DEPLOY-08** · P0 · Phase 1 — As a sysadmin, I want safe, predictable upgrades, so that I can stay current without fear.
- Releases use semantic versioning; release notes list database migrations, breaking configuration changes and manual steps.
- `upgrade` takes a pre-upgrade backup, pulls images, runs migrations and restarts services; on a single VPS user-facing downtime is under 5 minutes; multi-node deployments roll stateless services with zero planned downtime.
- Migrations are forward-only and tested on production-size data; a failed migration aborts the upgrade and leaves the previous version running.
- Upgrades may skip at most two minor versions; larger jumps are refused with instructions.
- Clients detect a newer server version and prompt the user to reload; native clients below the minimum compatible build are told to update.

### 5.7 Optional components and graceful degradation

**PRD-DEPLOY-09** · P0 · Phase 0 — As a sysadmin, I want to enable optional components independently, so that small installs stay light.

| Optional component | When absent | Visible behaviour |
|---|---|---|
| LLM providers (any AI) | No provider configured | Agents, the Assistant, AI editing, routines, call summaries, memory, Auto mode and AI filters are hidden; the MCP server still works because it needs no LLM |
| Media Server (calls) | Calls disabled | Calls area, call buttons and `c c` hidden; calendar conferencing offers only external providers |
| Transcription | Disabled | Calls record but show that no transcript is available; no transcript-based summaries; dictation buttons hidden |
| Search Index | Small install | Full-text search falls back to PostgreSQL full-text search with simpler ranking; name search unaffected |
| Office Converter | Disabled | DOCX and PPTX use the native viewers; legacy `.doc`, `.ppt` and `.xls` show a download card |
| Render Service | Disabled | Canvas PNG render and page screenshots unavailable; agents receive a clear tool error |
| Code Sandbox | Disabled | Hosted coding agents and agent code execution hidden; the local agent daemon remains available |
| Push Gateway | No APNs or FCM keys | Native push off; in-app, browser notifications and email digests still work |
| Mailer | Required | Install refuses to complete without SMTP, because sign-in codes need it |
| Analytics | Off by default in self-host | No product analytics leave the instance |
| Billing | Off in single-organisation mode | See 5.1 |

- Each feature checks component availability through one capability endpoint; the client hides unavailable features without a reload when a component comes online or goes offline.
- An automated test matrix covers at least three profiles: minimal (no optional components), Team default and all components.

### 5.8 AI providers: bring your own keys and local models

**PRD-DEPLOY-10** · P0 · Phase 1 — As a sysadmin, I want to configure AI providers with my own keys, so that I control cost, data handling and model choice.
- The operator console accepts keys for Anthropic, OpenAI, Google and any OpenAI-compatible endpoint (base URL, key, model list), stored encrypted with the instance master key.
- The model catalog (display name, provider, context window, image support, effort levels, speed tiers, price per token for metering, plan availability) is operator-editable; defaults ship for each supported provider.
- The operator assigns model roles: default chat model, free-plan model, fast classifier model (yes/no decisions, routing, implicit-trigger detection), background model (memory, summaries) and embedding model. A missing role falls back to the default chat model or disables the dependent feature.
- Pro and Max users (or all users in single-organisation mode, if the operator allows) can attach a personal or per-agent provider key; usage on that key does not count against plan allowance (see PRD-AI-16).
- A local model endpoint works for chat, summaries and classification; models flagged in the catalog as weak at tool calling show a warning when picked for agents.
- The operator can publish a data-handling note per provider (for example that a zero-retention agreement is in place), shown in Settings.

### 5.9 Third-party OAuth app registration responsibilities

Self-hosters must register their own OAuth applications with each provider. Approvals held by the hosted reference product do not transfer.

| Provider | Needed for | Operator must register | Verification burden | Fallback if not done |
|---|---|---|---|---|
| Google | Gmail sync and send, Google Calendar, contacts, Google sign-in | OAuth web client, consent screen, Gmail push topic or polling | Gmail read/modify scopes are **restricted**. A public app needs Google verification plus a recurring third-party security assessment, costing money and weeks to months of lead time. A Google Workspace organisation can mark the app **Internal** to skip verification for its own users. Unverified external apps are limited to listed test users, show warning screens, and test-mode tokens expire after seven days. | Email and calendar unavailable; IMAP/SMTP connector (P2, PRD-MAIL-22) |
| Microsoft | Outlook mail, calendar, contacts; Microsoft sign-in | Entra ID app registration, redirect URIs, client secret or certificate | Publisher verification recommended; some tenants require admin consent | Outlook unavailable |
| GitHub | Account linking, PR sync, task automation, coding-agent repository access | A GitHub App (metadata, contents read, pull requests read/write, checks read, issues read; webhook secret; private key) plus OAuth credentials for user linking | None for private use | GitHub features hidden |
| Slack | Channel import, Slack tools for agents | Slack app with OAuth scopes for channel listing | Review only if distributed publicly | Archive-file import still works |
| Apple | Sign in with Apple (needed on iOS when other social logins exist), APNs, iOS app | Apple Developer account, Services ID, APNs key | App Store review for any native app the operator ships | Email-code sign-in; no iOS push |
| Firebase | Android push | FCM project and service account | None | No Android push |
| Connector broker (optional, e.g. Pipedream Connect) | One-click connections to many SaaS apps for agents | Broker project and credentials | Per broker terms | Native MCP servers with their own OAuth only |
| Stripe | SaaS billing | Account, products, prices, webhook endpoint | Standard | Billing off |

**PRD-DEPLOY-11** · P0 · Phase 1 — As a sysadmin, I want step-by-step registration guides and a validation check per provider, so that integrations work the first time.
- The operator console shows each provider's status (not configured, configured, verified working) and runs a live test (token exchange, webhook reachability) on demand.
- The redirect URIs and webhook URLs to paste into each provider console are generated and shown with copy buttons.
- When a provider is not configured, its user-facing entry points say that an administrator must enable it, instead of failing at consent time.

### 5.10 Transactional email deliverability

**PRD-DEPLOY-12** · P0 · Phase 0 — As a sysadmin, I want sign-in codes, invites and digests to reach inboxes, so that people can log in and collaborate.
- The Mailer sends through an operator-configured SMTP relay with TLS and authentication; direct-to-MX sending is not the default because many VPS providers block port 25.
- The operator console checks SPF, DKIM and DMARC for the sending domain and shows the records to add.
- Bounces and complaints (from relay webhooks or delivery status notifications) add the address to a suppression list, which is shown in the console.
- Transactional mail and user mailbox traffic are fully separate: user mail always goes through the user's connected provider account.
- A test-send button verifies configuration end to end.

### 5.11 Operator console and observability

**PRD-DEPLOY-13** · P0 · Phase 1 — As a sysadmin, I want an operator console, so that I can manage the instance without shell access for routine tasks.
- Shows component health, versions, queue depths and dead-letter counts, storage used per workspace, backup status, and provider configuration status.
- Manages feature flags (including the experimental features listed in Spec Appendix A), plan definitions and limits, sign-up policy (open, allowlisted domains, invite-only), blocked addresses and the AI model catalog.
- Lists workspaces and users with search; can suspend a user or workspace, transfer workspace ownership and trigger a data export.
- Every console action is written to an append-only audit log with actor, time, target and before/after values.

**PRD-DEPLOY-14** · P1 · Phase 2 — As a sysadmin, I want observability out of the box, so that I can diagnose problems.
- All services emit OpenTelemetry traces, metrics and structured JSON logs; an optional bundled telemetry stack with dashboards is included.
- Default dashboards cover API latency, error rate, WebSocket connections, queue age, open collaboration rooms, email sync lag, search indexing lag and AI token spend.
- Default alerts: oldest queued job older than 5 minutes, dead-letter growth, disk over 80%, backup failure, certificate expiry within 14 days, email sync errors on more than 5% of inboxes.
- AI prompt and response content is never written to telemetry unless the operator explicitly enables content capture.

## 6. Product scope by area

Each area below gives a short description, then user stories with priority, phase and acceptance criteria. Acceptance criteria are written to be testable; numbers are defaults that operators may configure unless stated. Detailed behaviour, data shapes and limits are in the referenced Spec sections.

### 6.0 Area index

| § | Area | Story code | Spec reference | First phase |
|---|---|---|---|---|
| 6.1 | Home and inbox | HOME | §10, §11, §12, §36 | 1 |
| 6.2 | Search and command menu | SRCH | §29, §35, §36 | 1 |
| 6.3 | Email | MAIL | §20 | 1 |
| 6.4 | Chat and channels | CHAN | §16 | 1 |
| 6.5 | Tasks and projects | TASK | §17 | 1 |
| 6.6 | Properties, tags, favourites and activity | PROP | §9, §10, §11 | 1 |
| 6.7 | Documents | DOC | §24 | 1 |
| 6.8 | Canvas | CANV | §27 | 2 |
| 6.9 | Drive, files and viewers | FILE | §25, §26 | 1 |
| 6.10 | Databases | DB | §28 | 3 |
| 6.11 | Spreadsheets | SHEET | §28 | 2 |
| 6.12 | Forms | FORM | §28 | 3 |
| 6.13 | Calendar and booking links | CAL | §21 | 2 |
| 6.14 | CRM | CRM | §22 | 2 |
| 6.15 | Calls and recordings | CALL | §18 | 2 |
| 6.16 | GitHub and pull requests | GH | §19 | 2 |
| 6.17 | AI chat and agents | AI | §30 | 1 |
| 6.18 | Coding agents | CODE | §30 | 3 |
| 6.19 | Memory | MEM | §31 | 2 |
| 6.20 | Routines and automations | RTN | §31 | 2 |
| 6.21 | Skills | SKILL | §31 | 2 |
| 6.22 | Snippets | SNIP | §24, §29 | 2 |
| 6.23 | MCP, API and SDK | MCP | §15, §32 | 2 |
| 6.24 | Bots and webhooks | BOT | §15, §32 | 2 |
| 6.25 | Integrations and importers | INTG | §17, §32 | 2 |
| 6.26 | External messaging (WhatsApp) | WA | §23 | 4 |
| 6.27 | Notifications | NOTIF | §12 | 1 |
| 6.28 | Sharing and permissions | SHARE | §7 | 0 |
| 6.29 | Teams and administration | TEAM | §6, §7 | 1 |
| 6.30 | Settings | SET | §34, §36 | 1 |
| 6.31 | Sign-in and onboarding | ONB | §6, §36 | 1 |
| 6.32 | Mobile and desktop apps | APP | §37 | 3 |
| 6.33 | Offline and local cache | OFF | §37 | 3 |
| 6.34 | Billing and plans | BILL | §33 | 3 |

### 6.1 Home and inbox

Home is the default landing view: one feed of everything that needs the user's attention (Signal email from all inboxes, channel and thread activity, DMs, mentions in comments, assigned tasks, files shared with the user, finished or waiting agent sessions, pull requests involving the user) merged with the user's own recent work. The selected item previews beside the feed. When nothing is selected, the preview pane shows an Assistant composer. See Spec §12 and §36.

**PRD-HOME-01** · P0 · Phase 1 — As a founder, I want one feed of everything that needs my attention, so that I can triage without visiting each tool.
- Given unread items exist in email (Signal), channels, threads, DMs, comment mentions, task assignments, shares and agent sessions, when I open Home (`g h`), then each appears as a row with type icon, title, sender or actor, preview and relative time.
- Rows are grouped by time: Last few minutes (under 5 minutes), Last hour, This morning (06:00-12:00), This afternoon (12:00-18:00), This evening (from 18:00), Earlier today, Yesterday, then by date. Group membership refreshes at least every 30 seconds.
- New items appear in real time without reload, within 2 seconds of the event (p95).

**PRD-HOME-02** · P0 · Phase 1 — As a founder, I want to triage Home by keyboard, so that I can clear it quickly.
- `j`/`k` (and arrow keys) move selection; the selected item previews in the right pane; `enter` opens it; `shift+enter` opens it in a new split.
- `e` marks the selected row done and moves selection to the next row; `cmd/ctrl+z` restores it in place; `shift+down` or `shift+j` extends a multi-selection and `e` applies to all selected.
- Marking done in one session removes the row from my other open sessions within 2 seconds.
- A row I also worked on (for example an email I sent) stays visible but marked read after done; a pure notification row disappears.

**PRD-HOME-03** · P0 · Phase 1 — As a user, I want related notifications stacked, so that a busy channel does not flood my feed.
- Channel notifications collapse to one channel row plus one row per thread; replies, mentions and reactions attach to their thread's row.
- A stack shows a summary such as a message count and the first sender plus "and N others", and expands inline ("Show N more").
- A mention supersedes the plain message notification for the same message.
- Right-clicking a stack offers mark done, mark read, mute and snooze.

**PRD-HOME-04** · P0 · Phase 1 — As a user, I want to filter Home, so that I can focus on one kind of work.
- `f` or the Filter button opens Filter Home with Status (Unread, Read, All) and Type (Email, Channels including threads, Chats, Agents, and other kinds) checkboxes, plus Reset filters.
- Filters persist across reloads per user and device.

**PRD-HOME-05** · P0 · Phase 1 — As a user, I want Signal and Noise separated, so that important items are not buried.
- Home shows Signal by default; email classified as Noise appears only in Email's Noise view.
- On touch devices Home is labelled Notifications and offers Signal and Noise pills, pull-to-refresh, swipe left to mark done and swipe right to set a reminder.
- The Signal view of Home covers a rolling two-week window by default; older unfinished items remain reachable through filters.

**PRD-HOME-06** · P1 · Phase 1 — As a user, I want to ask the Assistant from Home, so that I can start work without choosing a tool first.
- When no row is selected, the preview pane shows an Assistant composer with up to 3 suggested prompts generated from my recent activity (generated within 45 seconds or omitted).
- `enter` starts an agent session in the preview pane; `@` mentions items as context; `/` attaches a skill; a New chat button clears the pane.

**PRD-HOME-07** · P1 · Phase 1 — As a user, I want unread indicators in the navigation and the browser tab, so that I notice new work in other views.
- The rail shows an accent dot (presence, not a count) on Home, Email and Chat when they hold unread items; the browser favicon shows a badge when Home has unread items.
- Opening the view does not clear the dot; reading or completing items does.

**PRD-HOME-08** · P2 · Phase 3 — As a team lead, I want an activity view of my own and my team's recent work, so that I can see what changed. (Maturity: experimental)
- A view (`g y`) has You and Team tabs, a trailing-year heatmap, "most active" item chips and a day-grouped feed.
- Consecutive same-actor, same-item, same-action events within a day fold into one row with a count; property changes show the net change.
- Team scope shows teammates' activity only on items I can access.

### 6.2 Search and command menu

Two complementary tools: the command menu (`cmd/ctrl+k`) for jumping to any item, person or command by name, and unified search (`/`) for full-text search across email, messages, documents, tasks, call transcripts, files and agent sessions. Agents use the same index. See Spec §29.

**PRD-SRCH-01** · P0 · Phase 1 — As a user, I want to jump to anything by name, so that I never browse folders to find an item.
- `cmd/ctrl+k` opens the command menu with category filters All, Commands, Agents, Files, Tasks, Projects, Channels and People; `tab`/`shift+tab` cycle categories.
- With an empty query the menu lists recent items by last viewed time; typing ranks results by fuzzy match, recency and frecency, with a boost for DMs and people in my own email domain.
- Name search returns results within 50 ms p50 and 150 ms p95 on the Team tier (section 8.1).
- `enter` opens the top hit; `shift+enter` opens it in a new split; `backspace` on an empty query leaves a nested scope; empty categories show "No results found".

**PRD-SRCH-02** · P0 · Phase 1 — As a user, I want commands in the command menu, so that I can act without hunting for buttons.
- The menu includes Create (each entity type), Change theme (arrow keys live-preview themes; `esc` restores; `enter` commits), go-to destinations, Upload files or folders, Favorites, Show keyboard shortcuts, MCP setup, Account, Log out, Copy ID, and actions for the currently open entity (including document formatting commands).
- Command recency is remembered per user and device.

**PRD-SRCH-03** · P0 · Phase 1 — As a user, I want full-text search across all my content, so that I can find a fact wherever it lives.
- `/` opens Search; results cover email (excluding spam and trash), channel messages, documents, tasks, call transcripts, extracted file text, CRM companies and agent sessions, limited to items I can access.
- Quoted phrases match exactly; unquoted terms match independently (all terms required in channel messages).
- Results show matched snippets with highlighted terms and, for long items, multiple hits; selecting a hit opens the item at the matching location (message, transcript time, document position).
- `enter` selects the first result; `l` expands the preview; `h` closes it.

**PRD-SRCH-04** · P0 · Phase 1 — As a user, I want to filter search, so that I can narrow large result sets.
- `f` opens filters as chips: result type, people (by @-mention in the search bar), inbox, date range, tags (with Any or All match mode when two or more tags are selected).
- Query text and filters persist and survive back/forward navigation within a split.

**PRD-SRCH-05** · P1 · Phase 2 — As a user, I want pasted links to unfurl, so that shared URLs are readable in messages and documents.
- A pasted URL to an internal item becomes a live mention chip; a GitHub PR URL becomes a PR mention once the PR is synced.
- External URLs show title, description, image and site icon; known video hosts embed a player.
- Fetching is protected against server-side request forgery (private address ranges blocked, at most 5 redirects, size limits).

**PRD-SRCH-06** · P2 · Phase 4 — As a power user, I want a universal input that understands intent, so that one box can create an email, task, event, note or message. (Maturity: experimental)
- Typing three or more words (or 24 or more characters) in the command menu switches to a rich composer that classifies the intent (ask AI, search, email, note, task, event, message) and shows editable extracted fields.
- `cmd/ctrl+shift+left/right` changes the detected type; `cmd/ctrl+enter` performs the displayed action; email mode offers Save as draft and Send.

### 6.3 Email

The Product is an email client over connected accounts. It syncs Gmail and Google Workspace (Outlook as experimental, IMAP/SMTP as later scope), shows all inboxes in one list, triages mail into Signal and Noise, supports scheduled send, undo send, reminders, labels, shared and delegated inboxes, and lets agents draft replies for review. See Spec §20.

**PRD-MAIL-01** · P0 · Phase 1 — As a founder, I want to connect several mail accounts and see them in one inbox, so that I stop switching accounts.
- Given I connect two Google accounts through OAuth, when I open Email (`g e`) with All inboxes selected, then threads from both appear in one list ordered by latest message, each showing its owning inbox.
- An inbox selector scopes the list to one inbox or alias; per-inbox search is supported.
- Initial sync shows progress and makes the latest 30 days usable within 10 minutes for a mailbox of 50,000 messages; older mail backfills in the background.
- New mail appears within 60 seconds of provider delivery (push-based where the provider supports it).
- Free plan users can connect at most 2 inboxes in total (section 9); reconnecting an existing inbox does not count.

**PRD-MAIL-02** · P0 · Phase 1 — As a user, I want important mail separated from noise, so that I only read what matters.
- Email has Signal and Noise tabs. A thread is Signal when the sender has a user rule marking it important, or when no rule marks it unimportant and the provider classifies it as primary (not promotions, updates, social or forums).
- Right-click → Sender → Signal or Sender → Noise sets a rule for that address (or domain) in that inbox, applies to existing and future mail, and overrides provider classification; address rules beat domain rules.
- Block Sender moves all future mail from that sender to trash; Signal or Noise unblocks.

**PRD-MAIL-03** · P0 · Phase 1 — As a user, I want keyboard triage, so that I process mail as fast as with a dedicated mail client.
- `j`/`k` move, `enter` opens, `e` archives (done), `shift+e` un-archives, `#` moves to trash, `u` marks unread, `shift+u` marks read, `opt+f` toggles favourite (starred), `t` tags, `cmd/ctrl+z` undoes the last action.
- After archive from an open thread, the next thread opens automatically.
- Email sidebar views: Favorites, Sent, Scheduled, Drafts, Shared, Archived, All, Reminders, plus provider labels.

**PRD-MAIL-04** · P0 · Phase 1 — As a user, I want to compose, reply and forward with full control, so that I never need the provider's web client.
- `c e` opens compose; reply, reply-all and forward are available on each message; a reply-type dropdown switches between them.
- Compose supports rich text, inline images, attachments (upload, drag-drop, forward originals), drag-and-drop recipients between To/Cc/Bcc, @-mention of a person to add them as a recipient, a From picker grouping inboxes and verified send-as aliases, and per-inbox HTML signatures (with "add to replies and forwards" and import from the provider).
- Drafts autosave within 500 ms of the last keystroke and sync across devices; a save failure shows an inline Retry.
- `cmd/ctrl+enter` sends; `enter` inserts a new line.
- Replies default to the address that received the original; reply-all excludes my own addresses.
- Files above the provider's attachment limit are offered as view-only links to Drive copies.

**PRD-MAIL-05** · P0 · Phase 1 — As a user, I want undo send and scheduled send, so that I can fix mistakes and send at the right time.
- After Send, a toast shows Undo for 10 seconds (configurable 5-30 seconds); Undo restores the draft even after I navigate away.
- Schedule send offers presets and a custom date-time; scheduled messages appear in Scheduled, can be updated or cancelled until submission, and survive device restarts.
- Send outcomes are tracked as accepted, sending, sent, failed, delivery unconfirmed or cancelled; an uncertain outcome is never resent automatically; the user can Check status.
- Offline sends queue and send on reconnect, with a visible "queued" state.

**PRD-MAIL-06** · P0 · Phase 1 — As a user, I want threads rendered safely and readably, so that mail looks right and cannot attack me.
- HTML mail is sanitized (no scripts, forms, event handlers, dangerous URL schemes or external fonts), rendered in an isolated container, adapted to dark themes, and wide content scrolls horizontally.
- Quoted history and signatures collapse behind an expander; remote images load through a privacy proxy, with an allow/block policy.
- Older messages in a thread collapse to one line; the latest is expanded; a hover card on any sender or recipient shows contact details and actions.

**PRD-MAIL-07** · P0 · Phase 1 — As a user, I want email attachments in Drive, so that I can find and reuse them.
- Attachments of document and media types on threads that matter (sent by me, provider-important, from my domain or from people I have emailed) are copied to Drive as files linked to the thread.
- Opening an attachment opens its Drive copy in a split; `.ics` attachments open an event card.
- Drive can filter to email attachments only.

**PRD-MAIL-08** · P0 · Phase 1 — As a support lead, I want shared and delegated inboxes, so that my team can work one mailbox together.
- When a mailbox already connected by another user is connected again, the user is told who connected it and can confirm to make it a shared inbox visible to both.
- A delegate can read, archive and send from the delegated inbox; actions are attributed to the delegate.
- When the last delegate removes access, the shared mailbox is disconnected and its synced copy is deleted.

**PRD-MAIL-09** · P0 · Phase 1 — As a user, I want to share an email thread into a channel, so that colleagues can see the context without forwarding.
- The Share button shares a thread to a person, the team or a new or existing channel; recipients see the whole thread, including future messages, but cannot reply from my mailbox.
- Shared threads appear in recipients' Shared view; to let someone reply, I forward instead.
- Mentioning a document in an email inserts a link and, after confirmation, sets the document to view-only for anyone with the link; if I cannot change sharing, I am warned.

**PRD-MAIL-10** · P0 · Phase 1 — As a user, I want email reminders, so that threads come back when I need them.
- `h`, a Remind me menu or a bell icon sets a reminder: In 30 minutes, Later today, Tomorrow, Next week, or natural language ("in 2 hours", "tomorrow 9am").
- A condition toggle offers If no reply (default; a new inbound reply cancels the reminder) or Regardless.
- Setting a reminder archives the thread; at the due time the thread returns to the top of the inbox with a reminder notification and push.
- One active reminder exists per user per thread; reminders are listed in a Reminders view ordered by return time; undo is supported.

**PRD-MAIL-11** · P1 · Phase 1 — As a user, I want provider labels synced, so that my existing organisation keeps working.
- Provider labels (or categories) sync both ways; labels can be created, applied, removed and searched.
- Labels are distinct from workspace tags; both can be applied to a thread.

**PRD-MAIL-12** · P1 · Phase 2 — As a user, I want calendar invitations handled in the thread, so that I can respond without opening the calendar.
- An invitation in a message shows an event card with Yes, Maybe and No (series or single occurrence), Join, Open in calendar and a view of my day showing conflicts.
- A published (non-RSVP) event shows an Add to calendar action that copies it to my writable calendar.
- Email has a Calendar view that lists only invitation threads.

**PRD-MAIL-13** · P1 · Phase 1 — As a user, I want to turn an email into a task, so that requests become tracked work.
- Hovering a thread or message shows a Task action that opens the task composer with the subject as title and a link to the thread.
- The task shows the source thread inline; the thread lists the task in its references.

**PRD-MAIL-14** · P1 · Phase 2 — As a user, I want the Assistant to draft replies, so that I answer faster.
- From a thread or the agent composer I can ask for a reply; the Assistant drafts it using thread context, my writing style and relevant workspace items.
- The draft appears in an editable composer card; nothing is sent until I press Send (or explicitly confirm in a channel or MCP flow, PRD-AI-09).
- When I did not specify a sending inbox, the draft uses the inbox that received the original.

**PRD-MAIL-15** · P1 · Phase 1 — As a user, I want email threads in projects, so that customer conversations sit with related work.
- A thread can be added to a project or folder; folder membership grants view to the folder's members.

**PRD-MAIL-16** · P1 · Phase 1 — As a free-plan user, I understand outgoing mail carries a short footer, so that the plan difference is clear.
- In multi-tenant mode with billing on, outgoing mail from Free users ends with a one-line footer naming the Product; paid plans and single-organisation installs have no footer.
- The footer is visible in the composer with a tooltip explaining how to remove it.

**PRD-MAIL-17** · P1 · Phase 2 — As a user, I want new-mail notifications only for Signal, so that noise does not interrupt me.
- Signal mail creates an in-app notification and push (if enabled); Noise creates none.
- New-mail notifications are never batched into email digests.

**PRD-MAIL-18** · P1 · Phase 1 — As a user, I want my contacts available, so that recipient autocomplete works.
- Provider contacts and other contacts sync and combine with addresses from mail history and workspace members for recipient autocomplete; contact photos show in avatars.

**PRD-MAIL-19** · P0 · Phase 1 — As a user, I want to disconnect an inbox, so that I control what the Product holds.
- Disconnecting stops sync, revokes stored tokens and deletes the Product's copy of that inbox's mail and calendar events within 24 hours; shared copies of threads granted to others are removed.
- When a provider token stops working, a notification and a reconnect prompt appear; the inbox shows "needs reauthentication".

**PRD-MAIL-20** · P1 · Phase 3 — As an Outlook user, I want to connect Microsoft 365 or Outlook.com mail and calendar, so that I can use the Product without Google. (Maturity: experimental)
- Outlook mail, folders/categories, focused-inbox classification, send, drafts and calendar sync work at parity with Gmail for the features above.
- Tenants requiring admin consent show an "Admin approval required" state with a link the tenant admin can use.

**PRD-MAIL-21** · P1 · Phase 1 — As a user, I want replying to finish a thread, so that answered mail leaves my inbox without an extra keystroke.
- Sending a reply from the inbox marks the thread done by default (configurable); a Send and done action opens the next thread.
- Unsent drafts appear in Home's Signal feed so they are not forgotten.
- Signing out warns when drafts or queued sends have not synced.

**PRD-MAIL-22** · P2 · Phase 4 — As a user of another provider, I want IMAP/SMTP (or JMAP) accounts, so that any mailbox works. (Maturity: advertised; specified here as target behaviour)
- Generic IMAP/SMTP accounts support read, archive (move to configured folder), flags, send and drafts; Signal/Noise uses rules only (no provider classification).

### 6.4 Chat and channels

Team chat with channels, DMs, group DMs, threads, reactions, attachments and @-mentions, where mentioning an item shares it with the channel. The Assistant and other agents and bots take part. See Spec §16.

**PRD-CHAN-01** · P0 · Phase 1 — As a team member, I want team and private channels, so that conversations have the right audience.
- `c g` creates a channel with a name and optional invitees (workspace users or any email address).
- Team channels are discoverable and joinable by all teammates (non-members can read and must join to post); an Automatically add teammates option adds current and future members.
- Private channels are visible only to participants and never appear in search or discovery for others; a private channel can have a join link.
- New members see the full history.

**PRD-CHAN-02** · P0 · Phase 1 — As a user, I want direct and group messages, so that I can talk to one or a few people quickly.
- `c m` opens a quick message: choosing recipients reuses the existing conversation with exactly those people or creates one.
- A DM cannot be renamed, joined, left or extended; reopening returns the same conversation.
- A user can message themselves (an empty self-only conversation is allowed).

**PRD-CHAN-03** · P0 · Phase 1 — As a user, I want rich messages, so that I can communicate clearly.
- The composer supports bold, italic, code, code blocks, lists, links, markdown shortcuts, emoji, @-mentions, `;` snippets, attachments (drag-drop, picker, paste), GIFs and dictation.
- Emoji-only messages render large; URLs, domains and email addresses auto-link.
- Drafts persist per conversation across reloads; a failed send shows the message with a retry option.
- Consecutive messages from one sender collapse under one header.

**PRD-CHAN-04** · P0 · Phase 1 — As a user, I want threads, so that side discussions stay organised.
- Clicking a message opens or starts its thread; up to the first 3 replies show inline under the parent with a "N more replies" chip; new live replies do not grow a collapsed preview.
- New replies are indicated; quote-reply to a thread message is supported.
- Thread replies notify thread participants; they do not light the channel's unread badge.

**PRD-CHAN-05** · P0 · Phase 1 — As a user, I want to edit, delete and react, so that conversations stay accurate.
- Authors can edit (shows "edited", keeps history, sends no new notifications) and delete (tombstone; thread survives) their messages; channel admins and owners can moderate others' messages.
- Reactions add or remove an emoji (up to 32 characters, no control characters); repeating an existing reaction is a no-op; hovering shows who reacted.
- Message actions: Reply, React, Edit, Delete, Copy link, Copy text, Create task, Chat with agent, Mark as read. Touch uses a long-press drawer.

**PRD-CHAN-06** · P0 · Phase 1 — As a user, I want mentioning an item in a channel to share it, so that everyone in the conversation can open it.
- Mentioning or attaching a document, file, email thread, call, project, database, form, calendar event or agent session in a channel grants channel members access capped at my own access: View by default, Comment for PDFs (so members can annotate), View-to-respond for forms; never Edit.
- Agent sessions are shared only when I own them; calendar events only when the event is on my calendar.
- If I cannot share an item, the message posts and a notice says who lacks access.
- Removing a member revokes access granted through the channel.

**PRD-CHAN-07** · P0 · Phase 1 — As a user, I want unread state and live presence, so that I know what is new and who is around.
- Unread dots and the Chat badge reflect unread top-level messages; opening a conversation marks top-level messages seen; thread replies stay unread until seen in the thread.
- Typing indicators appear within 1 second and disappear 2 seconds after typing stops; agents show thinking, typing, working or waiting states.
- Channel headers show live viewers; an Unread chip jumps to off-screen unread threads.

**PRD-CHAN-08** · P0 · Phase 1 — As a user, I want channel tabs, so that I can find files, calls and members.
- Channel tabs: Messages, Attachments, Calls, Participants; header actions: Invite, Call, Ask the Assistant.
- Participants tab adds and removes people and bots; owners cannot be removed.
- Channel menu: open in new split, rename, set or remove picture (PNG, JPG, WebP or GIF up to 16 MB), favourite, snooze, mute, remind me, copy link, copy ID.

**PRD-CHAN-09** · P0 · Phase 1 — As a user, I want to navigate a channel by keyboard and find messages, so that long histories are usable.
- Up/down select previous/next message; `shift+g` jumps to latest; `enter` replies; `e` edits; `backspace` deletes (with confirmation); `esc` clears selection.
- `cmd/ctrl+f` opens a find bar with match count, highlighted matches and next/previous; multiple terms are ANDed and quoted phrases match exactly.
- History loads in pages of 50 messages and can open around a linked message.

**PRD-CHAN-10** · P0 · Phase 1 — As a user, I want to invite people who are not users yet, so that external collaborators can join.
- Adding an email address without an account sends a join email; each human DM to an unregistered address sends an email with a link to view and sign up.
- Notification emails go only to addresses without accounts; registered users get in-app and push notifications instead.

**PRD-CHAN-11** · P0 · Phase 1 — As a user, I want to turn a message into a task, so that requests in chat get tracked.
- A Task switch in the composer, a `/task` command, or the message's Task action creates a task from the message with a pre-filled title, linking back to the message.
- Users @-mentioned in the message become assignees.

**PRD-CHAN-12** · P0 · Phase 1 — As a user, I want to call the Assistant into a channel, so that it can summarise or answer with channel context.
- Mentioning the Assistant's handle in a message makes it reply in that message's thread, using the thread and channel context and my permissions.
- Follow-up replies in that thread continue the same conversation; replies in a thread the Assistant already answered may trigger it implicitly when a fast classifier judges a response is expected.
- Messages from bots never trigger agents.

**PRD-CHAN-13** · P1 · Phase 1 — As a user, I want to mute or snooze channels, so that I control interruptions.
- Mute stops notifications from a channel until unmuted; Snooze stops them until a chosen time (presets: 30 minutes, 1 hour, 3 hours, until tomorrow 09:00, until Monday 09:00, one week).
- Sidebar context menu offers mark as read and mark as done for a channel.

**PRD-CHAN-14** · P1 · Phase 2 — As a user, I want the channel list organised, so that I can find conversations.
- The Chat sidebar has All (Favorites, Channels, DMs, each sortable by last viewed, last updated or created) and Recent (activity cards with previews); a Live section shows active calls.
- Favourite channels pin to the top; on phones the first 6 favourites show as a grid.

**PRD-CHAN-15** · P2 · Phase 4 — As a workspace admin, I want channel labels, so that many channels stay grouped. (Maturity: experimental)
- Team members see the same labels in the same order, each containing only channels the viewer participates in; smart labels group channels whose names contain given text; dragging one channel onto another creates a label containing both.

**PRD-CHAN-16** · P1 · Phase 2 — As a user, I want a private conversation with an agent, so that I can delegate without posting in a channel. (Maturity: experimental)
- Create → Message → choose an agent opens an agent DM; replies post as messages per finished passage; follow-ups queue; each failed reply has Retry; the backing session stays private to me even when the agent is team-owned.

**PRD-CHAN-17** · P1 · Phase 2 — As a user, I want polls in channels, so that the team can decide quickly.
- `/poll` creates a poll (a form with options, single or multiple answers and a show-results setting) posted as a card; members vote in place.

### 6.5 Tasks and projects

Lightweight task management: tasks with status, priority, assignees (people or agents), due dates and optional extra properties, team-numbered, shared with the team by default, linked to GitHub, with list, board and Gantt layouts and saved views. Projects group tasks around a goal. See Spec §17.

**PRD-TASK-01** · P0 · Phase 1 — As a user, I want to create a task in seconds, so that capturing work never breaks my flow.
- `c t` opens the task composer: title, description (rich text with mentions), Status (default Not Started), Priority, Assignee (defaults to me), Due date, Project, Tags and attachments, plus a Share with team toggle (default on, remembered).
- `cmd/ctrl+enter` creates; a Create more toggle keeps the composer open; Clear draft discards; Continue editing in split moves to a full view.
- Drafts are saved durably before submit and can be recovered after a crash.
- A Similar tasks section lists likely duplicates as I type (semantic match), each openable.
- Each task gets a sequential team-scoped number shown with a configurable prefix.

**PRD-TASK-02** · P0 · Phase 1 — As a user, I want a small, fixed set of statuses and priorities, so that tasks are easy to read.
- Statuses: Not Started, In Progress, In Review, Completed, Canceled, each with a distinct icon and colour.
- Priorities: Urgent, High, Medium, Low, or none; urgent shows a distinct marker.
- Optional built-in properties: Effort (Small, Medium, Large), Story points, Parent task, Subtasks, Depends on, Relevant documents, Companies, Contacts, Source; custom properties can be added (PRD-PROP-01).
- `shift+cmd+s` status, `shift+cmd+p` priority, `shift+cmd+a` assignee, `shift+cmd+o` property editor, `shift+cmd+b` copy branch name.

**PRD-TASK-03** · P0 · Phase 1 — As a team member, I want tasks shared with my team by default, so that everyone sees the work.
- Tasks created with sharing on are visible to all team members, who can view and comment; the creator and assignees can change status and properties; others can request edit access.
- Joining a team grants access to its shared tasks; leaving removes it; users without a team keep tasks private.
- Assigning a person sends a notification; comment @-mentions notify; mentions in the description do not.
- Comments notify assignees.

**PRD-TASK-04** · P0 · Phase 1 — As a user, I want task lists with tabs, layouts, grouping, filters and sorting, so that I can see work my way.
- Tabs: My tasks, Created by me, All (team) tasks, Projects; completed tasks are hidden by default in My and Created.
- Layouts: List and Board (desktop), List only on phones; Gantt as P2 (PRD-TASK-11).
- Group by Status, Priority, Assignee, Project, Date created or None; sections collapse and expand by keyboard.
- Filters: Status, Priority, Assignee (including No assignee), Created by, Tags, Due date range; Filter with AI turns a natural-language request into filters.
- Sort by updated, created or viewed; clicking a column header sorts quickly.
- Board columns follow the grouping property; dragging a card sets that property (moving between assignee columns replaces only the source assignee).

**PRD-TASK-05** · P0 · Phase 1 — As a user, I want saved views, so that I can return to a configured list instantly.
- A saved view stores filters, layout, grouping and sort (not search text); "me" filters resolve to the viewer.
- Views can be shared with the team as definitions; only the owner edits a shared view; edits are revision-checked.
- A view containing a filter the client no longer supports shows a warning with an option to remove the filter and save.

**PRD-TASK-06** · P0 · Phase 1 — As a user, I want bulk actions, so that I can tidy many tasks at once.
- Multi-select with `x`, `shift+j`/`shift+k` or `cmd/ctrl+a`; Actions: delete, add to project, set any property; partial failures report real counts.

**PRD-TASK-07** · P0 · Phase 1 — As a user, I want subtasks and dependencies, so that larger work is broken down.
- New → Subtask picks a parent then opens the composer; the parent shows subtasks with progress; Depends on links tasks.
- A checklist item in a document can be converted to a task in place.

**PRD-TASK-08** · P0 · Phase 1 — As a user, I want a task page with discussion and context, so that everything about a task is in one place.
- The task page shows title, property chips, description (collaborative), the source item inline (for example the originating message thread), linked pull requests, Discussion (comments with threads, reactions, attachments) and a side panel with properties, tags, references and history.

**PRD-TASK-09** · P0 · Phase 1 — As a manager, I want projects, so that related tasks roll up to a goal.
- `c p` creates a project with name (up to 100 characters), optional description (up to 2,000 characters), Status (Not Started, In Progress, Completed), Priority, Assignees and Due date; shared with the team by default.
- Project page tabs: Overview (properties, collaborative description, discussion) and Tasks (list or board; New task; Add existing tasks).
- A task belongs to at most one project; adding it moves it; deleting a project keeps its tasks.
- Assigning a person to a project grants them edit access to the project.
- The Projects tab supports search, grouping (status, priority, assignee), sorting (updated, created) and filters (status, priority, due date, Assigned to me); right-click offers rename, status, priority, share and delete.
- Sharing a project to a channel posts a project card.

**PRD-TASK-10** · P0 · Phase 2 — As a user, I want to assign tasks and projects to agents, so that agents do work in the open.
- Assigning an agent to a task starts an agent session linked from the task; the task discussion gets a message linking to the session; removing and re-adding restarts it.
- Assigning an agent to a project makes it take on tasks created in or moved into the project after assignment; existing tasks are not started.
- From a task, Copy as prompt produces a prompt containing the task, branch name and discussion; Open in offers deep links to supported external coding tools.

**PRD-TASK-11** · P2 · Phase 4 — As a project manager, I want a Gantt layout, so that I can see schedule overlap. (Maturity: experimental)
- Bars run from created date to due date; dragging across empty space opens the composer with the due date prefilled; zoom ranges from 4 to 80 pixels per day.

**PRD-TASK-12** · P1 · Phase 1 — As a new user, I want sample tasks, so that I see how tasks work.
- New accounts start with three sample tasks explaining core features; they can be deleted.

### 6.6 Properties, tags, favourites and activity

One typed property system, one tag namespace and one favourites list apply to every entity kind, with shared editors. See Spec §9, §10 and §11.

**PRD-PROP-01** · P0 · Phase 1 — As an admin, I want custom properties on any entity, so that we can track what matters to us.
- Property types: text, number, boolean, date (with optional time), single or multi select of text or numbers (option colours and icons), entity reference (user, company, contact, document, project, channel, chat, task, thread) and link.
- System properties (for example task Status) cannot be removed; custom properties can be personal or team scoped and can be flagged as metadata (hidden from main views).
- Editors: inline (click in a list or chip), popover and modal (batch edit for a multi-selection); date pickers are keyboard-first, accept "yesterday"/"tomorrow" and times.
- Pinned properties show as chips under the title and as list columns.

**PRD-PROP-02** · P0 · Phase 1 — As a user, I want tags across all items, so that I can organise by topic.
- `#` in a document title or body, `t` on a selection, or the tag panel adds tags; a tag can be created inline with a colour from a fixed 12-colour palette.
- Tags are Personal (anyone) or Team (team members); renaming or recolouring keeps identity; deleting removes the tag from all items after confirmation and cannot be undone.
- Clicking a tag chip shows everything with that tag; lists and search filter by tags with Any or All.
- Settings → Tags manages personal and team tags.

**PRD-PROP-03** · P0 · Phase 1 — As a user, I want favourites, so that my most-used items are one click away.
- `opt+f` or the star toggles a favourite on documents, tasks, chats, agent sessions, projects, email threads, channels, calls, CRM records and PRs; favourites appear in a sidebar section, reorderable by drag.

**PRD-PROP-04** · P0 · Phase 1 — As a user, I want trash and restore, so that deletion is safe.
- Delete moves items to trash; trash keeps items 30 days, then purges them permanently; Restore returns them with sharing intact; owners can delete permanently earlier.
- Deleting an item I do not own only removes it from my lists.

### 6.7 Documents

Markdown-native collaborative documents edited in real time by people and AI agents, with mentions, embeds, comments, version history, tags and properties. Tasks, snippets and skills are documents with a subtype. See Spec §24.

**PRD-DOC-01** · P0 · Phase 1 — As a writer, I want a fast Markdown editor, so that I can write without fighting formatting.
- `c d` creates a document and focuses the title.
- Blocks: paragraph, headings 1-3, bullet, numbered and checklist (interactive), quote, code block with syntax highlighting for at least 15 languages and a copy button, table (default 5 columns by 3 rows), divider, image, video, link, inline and block math (LaTeX), embedded file previews.
- Inline marks: bold `cmd+b`, italic `cmd+i`, underline `cmd+u`, strikethrough `shift+cmd+x`, highlight `shift+cmd+h`, inline code `cmd+e`, superscript, subscript.
- Markdown shortcuts (`#`, `-`, `1.`, `[]`, `>`, `---`, backticks) and `:shortcode:` emoji autoformat; `tab`/`shift+tab` indent; blocks can be dragged to reorder.
- `/` opens the insert menu (text styles, lists, task, document, image, GIF, video, link, equation, table, divider, query, database).
- Find and replace (`cmd+f`) supports regular expressions, replace one and replace all, and matches text inside chips.

**PRD-DOC-02** · P0 · Phase 1 — As a team, we want real-time co-editing that works offline, so that we never overwrite each other.
- Several people edit simultaneously; edits appear for others within 200 ms p95 on the same tier (section 8.1); concurrent edits to the same line merge without loss.
- Collaborators' cursors and selections show with names and colours.
- Edits made offline merge on reconnect; the editor warns before closing with unsynced changes.

**PRD-DOC-03** · P0 · Phase 1 — As a writer, I want @-mentions and embeds, so that documents link the work they describe.
- `@` mentions users, documents, tasks, projects, channels, messages, emails, calls, agent sessions, companies, contacts, PRs, events, dates ("@tomorrow") and skills; mentions render as live chips with current metadata (for example task status and priority) and hover previews.
- A mention can be converted to a read-only embed (Convert to embed).
- Mentions in a document body never notify or share; they are recorded as references on the target.
- Pasting an internal link creates a mention.

**PRD-DOC-04** · P0 · Phase 1 — As a reviewer, I want comments, so that I can give feedback in context.
- Selecting text and choosing Comment creates an anchored thread shown as a margin card (desktop) or drawer (touch); a document-level Discussion sits below the content.
- Threads support replies, reactions, attachments, edit and delete own, resolve and reopen, and deep links that scroll to the anchor.
- Comment @-mentions notify; replies notify thread participants; new comments notify the owner.
- Commenters can comment but not change content.

**PRD-DOC-05** · P0 · Phase 2 — As a writer, I want version history, so that I can see and recover earlier states.
- History shows a timeline of edit sessions grouped by author (a 10-minute gap starts a new session), with a scrubber and a coloured diff by author.
- Any past version can be forked into a new document; restoring the current document to a past version is supported (P1).
- History is desktop only.

**PRD-DOC-06** · P0 · Phase 1 — As a reader, I want navigation aids, so that long documents are easy to move through.
- An outline appears at the left edge when the document has 3 or more headings and the window is wide enough; hovering expands heading names; clicking jumps.
- The side panel shows owner, folder, created and updated times, properties, tags, references, word and character counts; an optional front-matter display toggle exists.

**PRD-DOC-07** · P0 · Phase 1 — As an owner, I want to share and export documents, so that people inside and outside can read them.
- The standard share dialog applies (PRD-SHARE-01); a public link lets anyone read, and signed-out visitors see the document without signing in.
- `shift+cmd+c` copies the link; Export to Markdown downloads the document.

**PRD-DOC-08** · P0 · Phase 2 — As a writer, I want the Assistant to edit my document, so that I can rewrite or extend text quickly.
- Edit with AI (whole document or selection) lets an agent edit as a collaboration peer; its cursor is labelled with the agent's name and its edits stream in live.
- Selection edits enter my undo history so `cmd+z` reverts them.
- Ask the Assistant from a document opens an agent session with the document attached as context.

**PRD-DOC-09** · P1 · Phase 2 — As a writer, I want tasks inline, so that action items in notes become real tasks.
- `/task` inserts an inline task created in place; checklist items can be converted to tasks; checklists show a progress meter.

**PRD-DOC-10** · P1 · Phase 3 — As an analyst, I want live data in documents, so that reports stay current.
- `/database` embeds a live database editor; `/query` inserts a live answer to a saved question that runs with each reader's access and refreshes when the data changes.

**PRD-DOC-11** · P1 · Phase 1 — As a writer, I want media handled in the editor, so that I can drop anything in.
- Dropping or pasting images, videos and any file uploads it; images and videos render inline; other files render as file cards.
- Code, canvas and PDF embeds render previews with adjustable height.

### 6.8 Canvas

An infinite collaborative whiteboard with shapes, text, connectors, freehand drawing, media and live mentions of workspace items. See Spec §27.

**PRD-CANV-01** · P0 · Phase 2 — As a planner, I want to draw diagrams on an infinite canvas, so that I can think visually.
- `c n` creates a canvas. Tools: `v` select, `h` hand, `r` shape (rectangle, ellipse), `x` connector (straight, curved, stepped; arrowheads at either end), `p` pencil, `t` text.
- Shapes and text support fill, stroke, corner radius and opacity; zoom with `cmd+=`/`cmd+-`, pinch or wheel; fit selection with `.`.
- Box-select; align (left, centre, right, top, middle, bottom); group `cmd+g`, ungroup `shift+cmd+g`; `]` bring to front, `[` send to back; arrow keys nudge (shift for larger steps); copy, cut, paste (offset or in place), undo (at least 100 local steps), delete.
- Object snapping and an optional grid.

**PRD-CANV-02** · P0 · Phase 2 — As a team, we want to edit a canvas together, so that workshops run live.
- Concurrent edits merge (moves and style changes to the same object do not clobber each other); remote cursors, selections and in-progress drags appear within 100 ms on the same tier.
- Offline edits sync on reconnect; leaving with unsynced edits warns.

**PRD-CANV-03** · P0 · Phase 2 — As a planner, I want workspace items on the canvas, so that diagrams link to real work.
- Mentions of tasks, documents, emails, channels, calls and agent sessions appear as live chips or reference cards and are recorded as references.
- Images and videos can be pasted, dropped or picked from files; failed media shows a placeholder.

**PRD-CANV-04** · P1 · Phase 2 — As a user, I want to share and export canvases, so that others can see them.
- Standard sharing; a copied link preserves the current pan and zoom; download exports the canvas; canvases are searchable by text content.

**PRD-CANV-05** · P1 · Phase 3 — As a user, I want agents to read and edit canvases, so that I can ask for diagrams.
- Agents can read a canvas (bounded to 300 items per read with a revision id), render it to an image (up to 1600x1200), apply batched edits (revision-checked) and make natural-language edits.

### 6.9 Drive, files and viewers

Drive holds documents, spreadsheets, canvases, uploads (PDF, images, video, code, office and design files), channel and email attachments, organised in folders with inherited permissions. Viewers and editors open common formats in the Product. See Spec §25 and §26.

**PRD-FILE-01** · P0 · Phase 1 — As a user, I want one drive for all files, so that nothing is scattered.
- Drive (`g f`) has My Files, Recent, Shared with me, Favorites and a searchable folder tree; Databases appears when enabled.
- Search Drive searches the current tab or folder; Filter by type (multi-select), tag, creator and scope (Default, All files, Email attachments); Sort by modified, created or viewed.
- Channel attachments and qualifying email attachments land in Drive and are searchable by content.

**PRD-FILE-02** · P0 · Phase 1 — As a user, I want folders with inherited sharing, so that I can share a set of files at once.
- `c f` creates a folder (name, tags, initial uploads); `m` moves selected items to a folder; drag and drop moves items.
- Granting access to a folder grants the same access to everything inside, including later additions; moving an item out removes the inherited access.
- Folder sharing supports owner, editor, commenter, viewer and team access; folders with open notifications surface on Home.
- Documents cannot nest inside documents; every item lives at the root or in a folder.

**PRD-FILE-03** · P0 · Phase 1 — As a user, I want easy uploads, so that I can bring files in quickly.
- Drag files or whole folders from the desktop onto Drive or a folder; upload via New → Other file or the command menu.
- Single uploads up to 5 GB (operator-configurable) with resumable multipart transfer; progress and retry are shown; zipped folder import preserves structure.
- File menu: Duplicate, Rename, Move to folder, Download, Delete.

**PRD-FILE-04** · P0 · Phase 1 — As a user, I want to view common formats without downloading, so that I can review quickly.
- PDF: viewer with search, highlights, placeable comments and drawn signatures; saving annotations creates a new version.
- Images (PNG, JPEG, GIF, SVG, WebP) with lightbox; video (MP4, WebM, MOV and other common containers) with player; code files (about 290 extensions) with a syntax-highlighted editor for editors and read-only for viewers; unknown types show metadata and download.
- Images are resized on demand into cached variants (never upscaled; maximum 4096 pixels).

**PRD-FILE-05** · P1 · Phase 3 — As a user, I want to open and edit Word documents, so that I can work with partners' files. (Maturity: experimental)
- DOCX files render with page layout (pagination, tables, headers and footers, footnotes, comments, tracked changes); an editor (beta) supports collaborative editing, find and replace, tracked changes and download as DOCX.
- When the editor is disabled, DOCX converts to PDF for viewing through the Office Converter.

**PRD-FILE-06** · P2 · Phase 3 — As a designer or marketer, I want presentation and design files in the Product, so that reviews happen beside the discussion. (Maturity: experimental)
- PPTX: viewer and editor with present mode, preserving untouched parts of the file.
- PSD/PSB: tiled viewer and editor with undo and autosave; non-RGB colour modes open read-only with a convert option.
- Figma-format files: viewer and editor with export to PNG, JPEG, SVG and PDF; untouched data survives round trips.
- Illustrator files: read-only viewer.
- Agents can read all of these formats and edit DOCX (with tracked changes) and PPTX.

**PRD-FILE-07** · P1 · Phase 2 — As a user, I want file versions, so that replaced uploads are not lost.
- Each save of a binary file creates a version; previous versions can be opened and downloaded.

**PRD-FILE-08** · P1 · Phase 3 — As a user, I want storage usage visible, so that I know how much space remains.
- Settings shows storage used against the plan limit; uploads that would exceed the limit are refused with a clear message (see OQ-12 on enforcement). (Maturity: advertised; specified here as target behaviour)

### 6.10 Databases

User-built relational databases with typed columns, relations, views (table, board, timeline), a SQL subset, change history and incoming webhooks; they also back forms and CRM pipelines. See Spec §28. (Maturity: experimental)

**PRD-DB-01** · P0 · Phase 3 — As an ops lead, I want to build a database, so that I can track structured data without a separate tool.
- `c l` creates a database; tables have typed columns: text, number, boolean, date, date range, link, single or multi select (text or number), tag, person or entity reference, relation to another table, and formula columns.
- Columns can be required; changing a column's type previews which values convert and refuses the change if any value cannot convert.
- Rows are added, edited and deleted inline; all edits in one action apply atomically.

**PRD-DB-02** · P0 · Phase 3 — As a user, I want views, so that the same data serves different needs.
- View layouts: Table (column choice and order), Board (grouped by a single-select or single-person column, with lanes, card fields and an option to hide empty lanes) and Timeline (by a date-range column).
- Views store filters and sorts; board cards can be reordered manually unless a sort is active.

**PRD-DB-03** · P0 · Phase 3 — As an analyst, I want to query with SQL, so that I can answer questions across tables.
- A SQL console supports SELECT with joins, grouping and aggregates, INSERT, UPDATE, DELETE, CREATE and ALTER and DROP TABLE; writes compile to the same atomic operations as UI edits.
- Reads return up to 20,000 rows per table and report truncation; saved queries ("live questions") display as a scalar, table, bar, line, area, scatter or pie chart.

**PRD-DB-04** · P1 · Phase 3 — As a user, I want history and undo, so that mistakes are recoverable.
- Every change is journaled; a table's change history and each row's history are viewable; a change can be undone if later changes do not conflict.
- Concurrent editors see presence and live updates; stale writes are rejected with a refresh prompt.

**PRD-DB-05** · P1 · Phase 3 — As a developer, I want to push rows from other systems, so that the database fills itself.
- An incoming webhook with a secret URL inserts a row into one table from a JSON object naming cells by column; CSV import adds rows.

**PRD-DB-06** · P1 · Phase 3 — As a user, I want to share databases, so that my team can use them.
- Sharing to people, the team and channels (no public link); rows inherit database access; agents can list, describe, query and save views.

### 6.11 Spreadsheets

Native collaborative spreadsheets with formulas, formatting, charts, comments and Excel import and export. See Spec §28.

**PRD-SHEET-01** · P0 · Phase 2 — As an analyst, I want a real spreadsheet, so that I can model numbers with my team.
- `c b` creates a spreadsheet; sheets hold up to 100,000 rows by 16,384 columns.
- Formulas start with `=`, with function suggestions, argument hints and click-or-drag reference insertion; cross-sheet references work.
- Toolbar: number formats, fonts, colours, borders, alignment, wrapping; fill handle series, `cmd+d` fill down, `cmd+r` fill right; find and replace `cmd+f`.
- Format and data menu: dropdown validation, sort, trim whitespace, goal seek, conditional formatting, named tables, filters.
- Sheets can be added, renamed (double-click), reordered, duplicated, moved and deleted.

**PRD-SHEET-02** · P0 · Phase 2 — As a team, we want to edit sheets together, so that plans stay current.
- Edits from others appear within 300 ms p95; recalculation is consistent for all collaborators.
- `@` in a cell mentions people, documents, channels, emails, companies and dates.

**PRD-SHEET-03** · P0 · Phase 2 — As an analyst, I want Excel import and export, so that I can exchange files.
- Uploaded `.xlsx`, `.xlsm` and `.csv` open in a read-only preview with import notes; Edit creates an editable copy (original unchanged); Import adds sheets to or replaces sheets in an open spreadsheet.
- Import keeps formulas, formatting, conditional formatting, dropdowns, notes, charts, images and shapes; macros are removed.
- Download as Excel (all sheets, formulas, formatting) and Download as CSV (current sheet values).

**PRD-SHEET-04** · P1 · Phase 2 — As an analyst, I want charts, so that I can present data.
- Insert chart: column, bar, line, area, pie, doughnut, scatter, combo, radar, bubble, stock and contour; charts update live; double-click edits.

**PRD-SHEET-05** · P1 · Phase 2 — As a reviewer, I want cell comments, so that I can question numbers.
- `cmd+opt+m` comments on selected cells; commented cells show a marker; a Comments panel lists threads and a spreadsheet Discussion; resolve and reopen.

**PRD-SHEET-06** · P1 · Phase 2 — As an analyst, I want to ask the Assistant about selected cells, so that I can analyse quickly.
- Ask the Assistant opens a session with the selected range attached; it can answer, calculate scratch formulas (up to 20) without changing the sheet, or edit if I have edit access (up to 25 operations and 2,000 cells per batch; reads up to 500 cells per range).

### 6.12 Forms

Forms collect answers into a database table, with sections, required questions, conditional gates, an optional final booking step, member or public audiences, and polls. See Spec §28. (Maturity: experimental)

**PRD-FORM-01** · P0 · Phase 3 — As an ops lead, I want to build a form, so that I can collect structured input.
- `c q` creates a form; each question maps to a column of its response table (a new hidden database by default, or an existing table chosen by its owner, one form per table).
- Questions are grouped in ordered sections with titles, descriptions, help text and a required flag.
- Gates show or skip sections based on earlier answers combined with AND/OR conditions.
- Several editors can edit the form layout at once.

**PRD-FORM-02** · P0 · Phase 3 — As a form owner, I want to control who can respond, so that responses come from the right people.
- New forms start closed and private; the owner opens them, sets an optional closing time and chooses the audience: Members (signed-in users the form is shared with; one response each, editable while open) or Public (anyone with the link; anonymous responses allowed).
- Access levels: View = respond; Edit = edit questions and see responses; Owner = audience, close and trash.

**PRD-FORM-03** · P0 · Phase 3 — As a respondent, I want a simple form page, so that I can answer quickly on any device.
- The respond page works signed out for public forms, validates required answers, and shows a confirmation; members can view and edit their own response while the form is open.

**PRD-FORM-04** · P1 · Phase 3 — As an owner, I want to see results, so that I can act on them.
- Responses appear as rows in the backing table; a summary shows per-question tallies; responses export to CSV.

**PRD-FORM-05** · P1 · Phase 3 — As a sales lead, I want a form to end with a booking step, so that qualified leads book a meeting immediately.
- The last section can be a booking step bound to a booking link; the booking is linked to the response.

### 6.13 Calendar and booking links

Two-way sync with Google Calendar (Outlook experimental), with day, week and month views, event editing, availability sharing, team availability, and public booking pages with individual, collective and round-robin hosts. See Spec §21.

**PRD-CAL-01** · P0 · Phase 2 — As a user, I want my calendars in the Product, so that I can plan beside my work.
- Settings → Calendar connects the calendar of a linked email account or a new Google account; each account's calendars can be shown or hidden and coloured.
- Calendar (`g r`) offers Day, Week (desktop default) and Month (`d`, `w`, `m`; `t` for today); phones default to Day; a current-time line and today highlight are shown.
- Changes made in the provider appear within 60 seconds; a sync banner shows during initial backfill.

**PRD-CAL-02** · P0 · Phase 2 — As a user, I want to create and edit events directly, so that scheduling is fast.
- Click an empty slot or drag a range to create an event; drag to move; drag edges to resize; all changes sync to the provider.
- The event editor covers title, description, time (typed times), all-day, recurrence (presets plus a custom builder with a plain-language summary), guests (including optional), guest permissions, conferencing (a Product call, Google Meet, Microsoft Teams or none), location, notifications, calendar and kind (event or out of office; out-of-office events auto-decline conflicting invites).
- The details popover offers RSVP (with scope choice for recurring events), copy or email guests, add guests, copy as mention, download `.ics`, forward by email, edit and delete.
- Declined events show struck through; tentative events appear lighter.

**PRD-CAL-03** · P0 · Phase 2 — As a user, I want to share my availability as text, so that I can propose times in any message.
- Copy availability produces a pasteable list of free ranges in my time zone, honouring working hours (default 09:00-18:00, weekdays only, editable).

**PRD-CAL-04** · P1 · Phase 2 — As a user, I want events as workspace items, so that I can mention them and keep notes.
- Events can be @-mentioned, searched and given to agents; a channel member can request to join an event shared in a channel; meeting notes documents can be attached to events.
- The sidebar shows a mini calendar, the next 5 upcoming events (with Join for calls), team out-of-office and calendar toggles.

**PRD-CAL-05** · P1 · Phase 2 — As a team lead, I want team availability, so that I can find a slot for several people.
- Agents and the scheduling UI can query free/busy for teammates who share calendar availability; the Assistant proposes slots and shows a preview before creating an event.

**PRD-CAL-06** · P0 · Phase 2 — As a user, I want to disconnect a calendar, so that I control access.
- Disconnect removes the Product's copy of events and revokes access; mail sync for the same account continues.

**PRD-CAL-07** · P0 · Phase 2 — As a salesperson, I want booking links, so that outsiders can book time without email ping-pong.
- Settings → Booking links (or Copy booking link in the calendar header) creates a link with title, duration, availability schedule, location or conferencing, optional minimum notice, buffers, booking window, slot interval, daily limit and custom guest questions.
- New links start paused until Accept bookings is turned on; list actions: pause, duplicate, preview, copy.
- Availability schedules: named weekly schedules with several ranges per day, date overrides and a time zone; one default; busy times on all connected calendars are excluded.
- Rate limits protect hosts: at most 120 availability requests per minute and 30 booking attempts per hour per booking profile.

**PRD-CAL-08** · P0 · Phase 2 — As an external guest, I want a simple booking page, so that I can book in under a minute.
- The public page needs no account; the guest picks time zone, date and time, answers questions and confirms; all attendees receive a calendar invitation (with a conferencing link if configured).
- The guest receives a private link to reschedule or cancel.
- A slot can never be double-booked, even under concurrent attempts.

**PRD-CAL-09** · P1 · Phase 2 — As a team lead, I want team booking links, so that prospects meet whoever is free.
- Team-owned links support collective (all hosts must be free) and round-robin (one host, least-assigned first) modes; team owners and admins edit, members view.

**PRD-CAL-10** · P1 · Phase 2 — As a host, I want to manage bookings and see insights, so that I can run my calendar.
- Bookings view: upcoming, past and cancelled within a date range; search by guest, title or email; filter by link; reschedule or cancel; mark past bookings attended or no-show.
- Insights: bookings over time, meeting hours, no-shows and top links for the last 7, 30 or 90 days or a custom range (up to 366 days); download CSV.
- Agents can create and edit links only after I confirm the exact change.

### 6.14 CRM

Customers (companies and contacts) built automatically from the team's email, with stages, owners, revenue, interaction tracking, record pages showing all related work, a discussion per record, enrichment, and pipelines of deals. See Spec §22.

**PRD-CRM-01** · P0 · Phase 2 — As a team admin, I want to switch the CRM on for my team, so that it only appears when we want it.
- CRM is off by default per team; owners and admins enable it in team settings and configure who may edit stages, move closed deals and delete records (member, admin or owner; default admin).

**PRD-CRM-02** · P0 · Phase 2 — As a salesperson, I want companies and contacts created from email automatically, so that I do no data entry.
- When a team member's primary inbox sends mail to an external address, a contact is created and grouped under a company by domain; received mail updates existing records but never creates companies.
- Generic and free-mail domains, common tool and vendor domains, and contacts on the sender's own domain are skipped.
- First and last interaction times are tracked per company and contact; historical sent mail seeds the CRM when enabled.
- When a member leaves the team or disconnects the inbox, records sourced only from that inbox are removed, except companies with email sync turned off.

**PRD-CRM-03** · P0 · Phase 2 — As a salesperson, I want board and list views of companies, so that I can see the pipeline.
- Customers (`g o`) shows a Board by stage (default on desktop) with columns for each stage plus No stage; dragging a card changes its stage; new records start in No stage.
- Default stages: Lead, Demo, Customer, Churned (see OQ-04 for Qualified, Trial and Negotiation); admins edit the stage list.
- List view columns: Stage, Owner, Revenue, Last interaction (editable inline), with grouping, filtering, sort by last interaction and CSV export.
- `+ Company` creates a company manually; CSV import matches by domain (up to 10,000 rows or 5 MB).

**PRD-CRM-04** · P0 · Phase 2 — As a salesperson, I want a record page with everything about a customer, so that I prepare in one place.
- Company tabs: Overview (domains, last interaction, generated description, pipeline entries, Discussion), Team (contacts, Add contact), Emails (Signal or All; Team or Me), Files, Tasks, Calls; contacts have equivalent tabs.
- Items belong to a record when its Companies or Contacts property includes it or when they mention the company or one of its contacts.
- Discussion supports threads, reactions, attachments and @-mentions with notifications, and feeds team memory.

**PRD-CRM-05** · P0 · Phase 2 — As a team admin, I want to control what CRM shares, so that private mail stays private.
- Email sync per company makes teammates' threads with that company visible (comment access) to the team in the CRM; turning it off keeps the record but hides threads.
- Admins can hide companies or contacts from plain members.
- Mentioning a company in chat or documents records a reference but does not share or notify (see OQ-03).

**PRD-CRM-06** · P1 · Phase 2 — As a salesperson, I want company enrichment, so that records show public information.
- An optional enrichment provider and the company's website metadata add name, logo, description, industry, size, location and social links; failures retry with backoff and empty results are cached.

**PRD-CRM-07** · P1 · Phase 3 — As a sales lead, I want pipelines of deals, so that we can run sales, renewals, fundraising or hiring.
- A pipeline has a name, record type (companies or contacts) and sharing (private or team, plus people and channels with access levels); entries reference a record and carry Stage, Owner, Revenue and custom fields; a record can appear in several entries.
- Table and board views; Add deal creates a company or contact inline (a new contact's email must match the company domain).
- Duplicate, rename, trash, CSV export and idempotent CSV import (matching by domain or email, adding missing options).

**PRD-CRM-08** · P2 · Phase 4 — As a salesperson, I want personal company lists, so that I can group accounts my way. (Maturity: experimental)

### 6.15 Calls and recordings

Audio and video calls in channels and from meeting links, with ringing, guests, recording, transcription with speaker identification, AI summaries, in-call chat and team sharing. See Spec §18. Calls depend on the Media Server.

**PRD-CALL-01** · P0 · Phase 2 — As a team member, I want to call a channel, so that we can talk without scheduling.
- The Call button in a channel or DM starts a call; participants' devices ring for up to 30 seconds (push and native call UI on mobile); declining on one device stops ringing on all of that user's devices.
- Joining is enforced once per user (a second device takes over).
- A completed call posts a system row with its duration; missed calls are recorded as missed.

**PRD-CALL-02** · P0 · Phase 2 — As a user, I want standalone meeting links, so that I can meet people outside the workspace.
- `c c` creates a meeting; a share link admits guests without an account (name, microphone and camera choice); channel-call links admit only signed-in users.
- Guests get the room and its live chat only, never channel access or saved transcripts; links can be copied and revoked (revocation blocks new joins).
- Calendar events can attach a Product call as conferencing.

**PRD-CALL-03** · P0 · Phase 2 — As a participant, I want good call controls, so that calls run smoothly.
- Controls: microphone and camera with device selection, audio-only or video, screen share, background blur (light or strong) or image (up to 10 MB), noise suppression, copy meeting link, rename (owner).
- A recording and transcription notice is visible to all participants.

**PRD-CALL-04** · P0 · Phase 2 — As a team, we want calls recorded, transcribed and summarised, so that nobody needs to take notes.
- Calls record to video (with a preview image); after the call, a transcript with speaker labels and timestamps and an AI summary are available on the call page, generated within 10 minutes for a one-hour call.
- Speakers are matched to known users where possible; participants can override speaker names and edit the transcript.
- Clicking a transcript line seeks the recording; transcripts and summaries are searchable and mentionable.
- If there is nothing to summarise, no summary is produced.

**PRD-CALL-05** · P0 · Phase 2 — As a user, I want call sharing to follow clear rules, so that I know who sees recordings.
- Channel calls are shared with the team by default (recording, transcript, summary) when the call ends; any participant with edit access can untick Share with team during the call; afterwards only the creator can change it from the call's side panel.
- Standalone calls are shared only with their participants.

**PRD-CALL-06** · P0 · Phase 2 — As a user, I want a Calls view, so that I can find past calls.
- Calls (`g l`) lists calls with tabs All, Missed and Unattended (team calls I did not join), filters for internal or external, channel and tags, and search over names and transcripts; channel Calls tabs filter to the channel.
- Call pages offer Ask the Assistant, share, rename, delete and Call again.

**PRD-CALL-07** · P1 · Phase 2 — As a user, I want in-call chat, so that I can share links during the meeting.
- Each call has one message thread that guests can read and post to while connected (labelled as guests); after the call it appears read-only below the transcript.

**PRD-CALL-08** · P1 · Phase 3 — As a user of another meeting tool, I want its notes imported, so that all meetings live together.
- A connected meeting-notes service imports each meeting as a private call record (title, summary, attendees, transcript, no recording) within 1 minute of the notes being available; transcripts from other tools can also be imported as documents.

### 6.16 GitHub and pull requests

GitHub integration links accounts and repositories, syncs pull requests as workspace entities, automates task status, and offers a review board, PR pages with diffs and checks, and merging. See Spec §19.

**PRD-GH-01** · P0 · Phase 2 — As an engineer, I want to connect GitHub, so that PRs appear in the workspace.
- Settings → Integrations links my GitHub account; a team admin installs the GitHub App on chosen repositories; open PRs are backfilled on install; a reconnect prompt appears when authorisation lapses.

**PRD-GH-02** · P0 · Phase 2 — As an engineer, I want task status to follow my branch and PR, so that I never update it by hand.
- Copy branch name (`shift+cmd+b`) gives a readable branch name containing the task number; creating that branch sets the task to In Progress, opening a PR sets In Review, merging sets Completed, and closing unmerged sets Not Started.
- The task shows linked PRs (title, number, state, diff size) in a GitHub section.

**PRD-GH-03** · P0 · Phase 2 — As an engineer, I want PRs as workspace items, so that I can mention and discuss them.
- PRs can be @-mentioned (pasting a PR URL creates a mention), searched, favourited and read by agents; comments, reviews and check runs are stored.
- Notifications: status changed, review requested, comments, mentions, reviews on my PRs and check-run results.

**PRD-GH-04** · P1 · Phase 3 — As an engineer, I want a review board, so that I can see all PRs that involve me.
- Reviews view scopes: Involves me (default), Authored by me, Assigned to me, Review requests, All; status Open, Closed (including merged) or All; filters for repository, author, assignee, label, review state, linked work and origin.
- Board columns: Draft, In review, Checks failing, Conflicts, Ready to merge, Merged. Dragging to Merged merges, to Draft converts to draft, from Draft to In review marks ready.
- Rows show linked tasks and their priority, the tool or agent that started the PR, diff size, comment count and linked agent sessions.

**PRD-GH-05** · P1 · Phase 3 — As an engineer, I want to review and merge from the PR page, so that I stay in one tool.
- The PR page shows the timeline, a details and checks side panel, and a read-only Changes pane (file tree; unified or split diff).
- Merge is offered only when the PR is open, not a draft, and all checks are successful, skipped or neutral; it asks for confirmation and respects the repository's branch protection.

### 6.17 AI chat and agents

Agent conversations ("sessions") with the Assistant or custom agents that search and act across the workspace with the invoking person's permissions, using a shared tool catalog. Sessions start from Home, the Agents view, any entity, channels, DMs, tasks, routines and MCP. See Spec §30.

**PRD-AI-01** · P0 · Phase 1 — As a user, I want to start a conversation with the Assistant from anywhere, so that help is one keystroke away.
- `c a` starts a session; composers also exist on Home, in list views, in search and on every entity (Ask the Assistant, which attaches the entity as context, including a spreadsheet range or a channel message).
- Sessions are named automatically from the first message and can be renamed; any session can be resumed later.
- First streamed output appears within 2 seconds p95 of sending, excluding provider latency above that budget (section 8.1).

**PRD-AI-02** · P0 · Phase 1 — As a user, I want to pick the model and effort, so that I trade speed, quality and cost.
- The composer shows an agent and model picker (Suggested models, More models grouped by provider, Your agents); the choice is remembered per user and carried into new sessions.
- Where the model supports it, an effort control (for example low to max) and a speed control (standard, fast, ultrafast) are shown; unsupported controls are hidden.
- Models unavailable on my plan are shown locked and open the upgrade dialog; a saved model that becomes unavailable is replaced by the plan's default model with a notice.
- Models without image support block image attachments with an explanation.

**PRD-AI-03** · P0 · Phase 1 — As a user, I want to give the agent context precisely, so that it uses the right material.
- `@` in the composer pins items as context (documents, tasks, emails, channels, people, calls, sessions, dates); `+` adds files and photos (uploaded to the Object Store) or items from the library; `/` attaches a skill.
- An item the user cannot access gives the agent no access; the agent says so.
- The agent knows which items are open in the user's current splits.

**PRD-AI-04** · P0 · Phase 1 — As a user, I want the agent to work across the workspace, so that it can do real tasks.
- Tools cover: name and full-text search; reading any accessible item (documents, emails, channels, threads, calls, files including office and design formats, PRs, databases); creating and editing documents, spreadsheets and canvases; creating and updating tasks, projects, properties and tags; CRM records and pipelines; channel read, post, react and create; calendar read and event drafts; booking links; notifications; routines and skills; web search and fetch; image generation; sandboxed code execution; subagents for parallel work.
- Tool results above a size budget are truncated with paging; writes are idempotent on retry.
- Rich results (lists of items, timelines, message cards) render as interactive item views, never raw data.

**PRD-AI-05** · P0 · Phase 1 — As a user, I want to see what the agent is doing, so that I can trust and steer it.
- The transcript shows thinking (collapsible), each tool call as a labelled row with running, done, stopped or failed state, grouped as "called N tools" after a short buffer.
- Stop cancels the current turn; messages sent during a turn queue server-side (up to 50, surviving restarts) and can be steered (moved to the front, interrupting the current turn) or removed; several users with edit access can queue.
- Long sessions compact earlier context automatically before the model's window fills, with a visible "context compacted" marker.
- A session continues on the server when I close the app (send to background); I am notified when it finishes.

**PRD-AI-06** · P0 · Phase 1 — As a user, I want an Agents view, so that I can manage my conversations.
- Agents (`g a`) lists sessions with Work and Code switches, tabs Owned, Running, Shared and Automations, grouping by status or type, filters, search and sort.
- Status indicators: working (animated), waiting for my answer (amber), finished and unread (solid).
- Right-click: rename, favourite, share, archive, delete.

**PRD-AI-07** · P0 · Phase 1 — As a user, I want to be told when an agent needs me, so that it never stalls silently.
- Finished sessions and sessions waiting for input create Home notifications (and push if enabled) for the owner and anyone who prompted it.
- An agent can ask a structured question (choices, checkboxes, free text, numbers) rendered as a form card; answering resumes the turn.

**PRD-AI-08** · P0 · Phase 1 — As a user, I want agents bounded by my permissions, so that delegation is safe.
- Every tool call runs as the requesting person (or, for a shared agent using its owner's connected accounts, as the owner after approval); the agent can never access what that person cannot.
- When a tool would use another person's connected account, that person sees an approval card (Decline, Always allow for this session, Approve); others see that approval is pending.
- All agent actions appear in activity as performed by the agent on behalf of the person.

**PRD-AI-09** · P0 · Phase 1 — As a user, I want to review outward actions, so that agents never send on my behalf by surprise.
- Emails, calendar invitations with guests, booking-link changes and external messages are presented as editable review cards (Send / Send all / Create all) and are executed only on my confirmation.
- In channels and over MCP, outward actions need an explicit confirmation in a later turn that quotes the action.
- Users may set per-tool "always allow" rules per session; the default is to ask.

**PRD-AI-10** · P0 · Phase 2 — As a power user, I want custom agents, so that I can package instructions and tools for a purpose.
- Settings → Agents → New agent: name, handle, description, picture, instructions, default model, runtime (built-in, hosted coding sandbox, a connected third-party coding agent, or a paired local runtime), who can use it (private or team), channels it may join, tool connections it may use, mention style, permission-request policy, and kind (work agent or coding agent).
- Team agents are mentionable by teammates in channels; a built-in Configure Agent skill lets the Assistant create or edit agents conversationally.

**PRD-AI-11** · P0 · Phase 2 — As a user, I want to share an agent session, so that colleagues can follow or continue it.
- Sessions use the standard share dialog (people, channels, team, link); edit access means control (prompt, stop, approve).
- @-mentioning a person in a prompt grants them edit access (when I can edit) and notifies them.

**PRD-AI-12** · P0 · Phase 2 — As a team, we want agents in channels to work visibly, so that everyone sees progress.
- Mentioning an agent in a channel opens a session shown as a live card in the thread (status, model, open session, linked PR with merge when applicable); follow-up mentions in the thread steer the same session.
- A busy agent receiving a follow-up stops the current turn and continues with the new input.

**PRD-AI-13** · P1 · Phase 2 — As a user, I want agents to use my other tools, so that they can act beyond the workspace.
- Agents may use MCP connections I have authorised (PRD-INTG-01); mid-session the agent can suggest a missing connection, I connect it, and the session resumes with the new tools.
- Connected tools are namespaced by server so they never collide with built-in tools.

**PRD-AI-14** · P1 · Phase 2 — As a user, I want subagents and parallel tool calls, so that large requests finish faster.
- The agent may run independent tool calls concurrently and launch subagents with a reduced tool set; their progress is visible in the transcript.

**PRD-AI-15** · P2 · Phase 4 — As a user, I want the Product to choose between chat and coding agents automatically, so that I do not have to decide. (Maturity: experimental)
- An Auto mode classifies the first prompt (time budget 3 seconds) as chat or code; code routes to my most recently used coding agent; any failure falls back to chat.
- An Auto model option routes each turn to a stronger, cheaper or faster model by classifying difficulty within 1 second.

**PRD-AI-16** · P1 · Phase 3 — As a Pro or Max user, I want to use my own provider key for an agent, so that heavy use does not consume my plan allowance.
- A provider key can be attached to a custom agent (or personally, if the operator allows); it is validated, stored encrypted and never displayed again; usage on it is recorded but not charged against allowance; the model list narrows to that provider.

**PRD-AI-17** · P1 · Phase 2 — As a user, I want to dictate into any composer, so that I can speak instead of type.
- A microphone button in channel, agent and comment composers records up to 5 minutes (up to 8 MB), shows a live volume timeline with Cancel and Use, and inserts the transcription; audio is not stored; at most 60 dictations per user per hour.

**PRD-AI-18** · P2 · Phase 4 — As a power user, I want agents to batch operations as code, so that bulk tasks are fast and cheap. (Maturity: experimental)
- In code mode the agent writes a short program against a typed workspace SDK, executed in an isolated sandbox with bounded time, memory, network hosts and output; executions are journaled and outward actions go into a review stack.

### 6.18 Coding agents

Coding agents work in GitHub repositories on hosted sandboxes, in connected third-party cloud coding services, or on the user's own computer through the local agent daemon. Runtimes speak the Agent Client Protocol (ACP). See Spec §30.

**PRD-CODE-01** · P0 · Phase 3 — As an engineer, I want to start a coding session on a repository, so that an agent implements a change.
- From Agents (Code) or a task, I choose a repository (from repositories the workspace GitHub App can access, recent first, or Choose automatically), a branch and a coding agent, then describe the work.
- The hosted runtime runs in the Code Sandbox with only a short-lived session token; git and tool credentials are injected by an egress proxy per request and never stored in the sandbox; outbound network access follows an allowlist.

**PRD-CODE-02** · P0 · Phase 3 — As an engineer, I want to review the agent's changes, so that I stay in control.
- After each turn, the linked PR's diff is captured; a Changes pane shows a file tree and unified or split diff with added and removed counts.
- I can leave review notes on lines; notes queue and are sent to the agent together ("send to agent"); they are never posted to GitHub.
- The session lists its pull requests; the PR shows the originating session.

**PRD-CODE-03** · P0 · Phase 3 — As an engineer, I want to run agents on my own machine, so that they use my local tools and repositories.
- The local agent daemon installs with one command on macOS, Linux and Windows (or is bundled in the desktop app as "This computer"), detects installed ACP-compatible coding agents (for example Claude Code, Codex, OpenCode) or a custom command, and connects outbound only.
- Pairing: the daemon shows a device code; in Settings → Runtimes → New runtime I enter it, review name, access and permissions, and approve; the credential is stored locally in a private config file.
- Access is Private (only me) or Team (teammates may start sessions on my machine); Full access auto-approves the agent's permission prompts only if I consent.
- Agents bound to a paired runtime start sessions there when mentioned; offline runtimes show as offline and sessions wait or fail with a clear message.

**PRD-CODE-04** · P1 · Phase 3 — As an engineer, I want to answer agent permission prompts from the Product, so that I can supervise remotely.
- Prompts show Allow once, Deny and remembered rules; anyone with edit access to the session can answer; bot and service credentials cannot.

**PRD-CODE-05** · P1 · Phase 3 — As an engineer, I want to use third-party cloud coding agents, so that I can pick my preferred tool.
- Users connect a third-party coding service by API key or OAuth device login (encrypted at rest, per user); the service appears as a runtime; sessions stream into the same transcript UI; keyless mentions show a Connect prompt.

**PRD-CODE-06** · P1 · Phase 4 — As an engineer, I want to share a live preview of the app the agent is running, so that reviewers can try it. (Maturity: experimental)
- The agent can expose a port through a reverse tunnel as an isolated HTTPS preview origin with live reload; viewers are authorised by session access; leases last at most 1 hour and expire after 15 minutes idle; the owner can stop sharing.

**PRD-CODE-07** · P1 · Phase 3 — As a user, I want the Assistant to hand work to a coding agent, so that I can request code changes conversationally.
- The Assistant can list available coding agents and dispatch one with a prompt, showing the new session as a live card.

### 6.19 Memory

Agents receive a markdown memory about the user (and, as target behaviour, about the team) that is refreshed from activity. See Spec §31.

**PRD-MEM-01** · P0 · Phase 2 — As a user, I want agents to know who I am and what I work on, so that I do not repeat context.
- A personal memory (roughly 1,000-3,000 words covering role, team, projects, expertise, people and style) is generated in the background from items I can access and refreshed when older than 24 hours (configurable down to hourly).
- A second check rejects thin or speculative memories; the previous memory is kept as the baseline.
- Memory is injected into every session I start; memory generation is not charged to plan allowance.

**PRD-MEM-02** · P0 · Phase 2 — As a user, I want to see and control my memory, so that it is accurate and private.
- Settings shows my current memory, its last update, a Regenerate action, an edit field for corrections and an option to turn memory off; memory can be exported as Markdown and deleted.
- Memory never contains content from items I cannot access. (Viewing, editing and export: Maturity: advertised; specified here as target behaviour)

**PRD-MEM-03** · P1 · Phase 3 — As a user, I want to tell an agent to remember or forget something, so that memory improves immediately. (Maturity: advertised; specified here as target behaviour)
- "Remember that…" and "Forget that…" in any session update memory within one minute and are confirmed in the transcript.

**PRD-MEM-04** · P1 · Phase 3 — As a team, we want shared team memory, so that agents know our customers, projects and decisions. (Maturity: advertised; specified here as target behaviour)
- A team memory is synthesised at least nightly from team-shared content only: team tasks, team-shared calls (respecting per-call opt-out), CRM-shared email, team channels and team documents.
- Team memory is injected for team members' sessions; it never includes content from private channels, private documents or calls not shared with the team.
- All team members can view team memory and edit it unless admins restrict editing to admins (Spec MEM-015); team owners and admins can also regenerate, export and turn off team memory.

**PRD-MEM-05** · P2 · Phase 3 — As an external AI client user, I want memory over MCP, so that my other tools share the same context. (Maturity: advertised; specified here as target behaviour)
- The MCP server exposes read access to the caller's personal memory and, for team members, team memory.

### 6.20 Routines and automations

Routines are saved agent prompts that run on a schedule or when workspace activity happens. See Spec §31.

**PRD-RTN-01** · P0 · Phase 2 — As a founder, I want scheduled routines, so that recurring briefs and reports happen automatically.
- `c u` or Agents → Routines → Create routine: name, instructions (with @-mentions), agent or model, triggers, Start enabled (on by default).
- Schedule presets Hourly, Daily, Weekly, Monthly and Custom (cron), entered in plain language ("every weekday at 9am"); Run once at a time ("tomorrow 9am", "in 2 hours").
- Recurring schedules use the time zone at creation; one-time runs use my local time; runs start within 60 seconds of their scheduled time.

**PRD-RTN-02** · P0 · Phase 2 — As an operator of my own workflow, I want activity triggers, so that agents react to events.
- Triggers: channels (channel created, message posted, I am mentioned, message edited, attachment added), documents (created, updated, deleted), tasks (created, status changed, priority changed, any property changed), email (new email received, excluding spam, trash and drafts) and calls (started, ended).
- Each trigger can be scoped to specific items or everything I can access, and may carry a plain-language condition (up to 500 characters) checked by a fast classifier before running.
- Any trigger firing runs the routine; changes made by agents and bots never fire triggers.

**PRD-RTN-03** · P0 · Phase 2 — As a user, I want to manage routines and see their runs, so that I can trust them.
- The list shows creator, status, model and an Enabled toggle, with search by name, creator or model.
- The routine page shows instructions, model, triggers and next run, saves automatically, and offers Run now (even when disabled), enable or disable, copy prompt, duplicate and delete.
- Run history shows outcome, duration and start time; each run opens its agent session; each finished run notifies me on Home; runs can be hidden from session lists.

**PRD-RTN-04** · P0 · Phase 2 — As a user, I want routines private and bounded, so that automation is safe.
- Routines are visible only to their creator and run with the creator's current permissions.
- Routines that require tool connections check them on save and before every run; a missing connection fails the run with a clear reason.

**PRD-RTN-05** · P1 · Phase 2 — As a user, I want example routines, so that I can start quickly.
- A gallery offers starters (daily inbox brief, weekly team recap posted to a channel, call-to-tasks, project status on demand) that open prefilled in the editor.

### 6.21 Skills

Skills are reusable instruction documents that agents load on demand. See Spec §31.

**PRD-SKILL-01** · P0 · Phase 2 — As a user, I want to save instructions as a skill, so that agents follow my process consistently.
- `c k` (or New skill in the composer's `/` menu) creates a skill with a name and instructions; skills are documents stored in Drive and shared like documents; agents always use the current version.

**PRD-SKILL-02** · P0 · Phase 2 — As a user, I want to apply skills easily, so that I do not paste instructions.
- `/` in an agent composer lists skills (with edit and delete for my own); skills can be @-mentioned; agents search skills by name and apply a matching one automatically.

**PRD-SKILL-03** · P1 · Phase 2 — As a new user, I want built-in skills, so that useful workflows exist from day one.
- Built-in, non-editable skills: a catch-up summary since I was last active, a summary of what I did yesterday, and agent configuration.
- Agent tools list up to 100 recent skills plus built-ins.

### 6.22 Snippets

Reusable markdown blocks (templates, standard replies, checklists) inserted with `;`. See Spec §24 and §29.

**PRD-SNIP-01** · P0 · Phase 2 — As a support agent, I want snippets, so that I reuse standard text.
- `c s` creates a snippet as a full markdown document; it is personal by default.
- Typing `;` at the start of a line or after a space in any markdown surface (documents, tasks, messages, email, canvas text, agent instructions) opens a filterable list; arrows and `enter` insert; `esc` or space closes it and keeps the `;`.
- Edits to a snippet affect future insertions only.

**PRD-SNIP-02** · P0 · Phase 2 — As a team lead, I want team snippets, so that everyone uses approved wording.
- A Share with team toggle in the snippet's side panel adds it to teammates' `;` lists, and teammates can edit it.

### 6.23 MCP, API and SDK

External AI clients and programs use the same tools and data as the in-product agents. See Spec §15 and §32.

**PRD-MCP-01** · P0 · Phase 2 — As an engineer, I want to connect my AI coding tool to the workspace over MCP, so that it can read and update tasks and docs.
- The instance exposes a remote MCP endpoint (streamable HTTP) on its own domain, available on every plan.
- Authorisation uses OAuth 2.1 with dynamic client registration and PKCE; redirect URIs are limited to loopback addresses and an operator-configurable allowlist of hosts; refresh tokens rotate.
- Settings → MCP server shows the endpoint and copyable setup commands for common clients.

**PRD-MCP-02** · P0 · Phase 2 — As an MCP client, I want the full tool catalog, so that I can do everything an in-product agent can.
- The MCP tool catalog matches the in-product catalog (search, read, documents, comments, email threads and labels, channels and messages, notifications, tasks, projects, properties, tags, calendar, booking, CRM and pipelines, calls, routines, skills, agents and bots, forms, databases, imports, team members, uploads up to 25 MiB), excluding UI-only tools.
- Every tool carries annotations (read-only, destructive, idempotent, open-world) so clients can apply their confirmation policy; outward actions use the two-step confirmation of PRD-AI-09.
- Tool reference documentation is generated from the tool registry so it never drifts.

**PRD-MCP-03** · P0 · Phase 2 — As a developer, I want a documented API with personal keys, so that I can automate the workspace.
- REST and GraphQL APIs with an OpenAPI description and GraphQL schema; WebSocket subscriptions for live updates.
- Settings → API Keys creates keys shown once, stored hashed, revocable, with an optional expiry; requests with two different credential types are rejected.
- API and MCP requests are rate-limited per key and per user with operator-configurable limits (defaults per Spec §15.10, for example 600 requests per minute per API key and 600 MCP tool calls per minute per user), returning 429 with Retry-After.

**PRD-MCP-04** · P1 · Phase 3 — As a developer, I want a TypeScript SDK, so that integrations are quick to write.
- An SDK published under an open-source licence wraps the API with entity objects (documents, tasks, channels, messages, email, calendar, CRM, databases, forms, agents, routines, webhooks and so on) and an event receiver with signature verification; reference docs are published.

### 6.24 Bots and webhooks

Bots let programs post into channels and act as agents; outgoing webhooks notify external systems of workspace events. See Spec §15 and §32.

**PRD-BOT-01** · P0 · Phase 2 — As a developer, I want to create a bot, so that my service can post into channels.
- Settings → Bots → Create bot: name, handle (up to 64 characters of lowercase letters, digits, `-` and `_`), description, avatar and channels; the bot token is shown once and stored hashed; tokens can be reissued and revoked.
- Bots are personal or team-owned; team bots require an admin or owner.
- The Participants tab offers New bot, Invite bot, Copy webhook and Remove.

**PRD-BOT-02** · P0 · Phase 2 — As a developer, I want an incoming webhook per channel, so that alerts post with one HTTP call.
- Copy webhook gives a secret URL that posts a message to that channel as the bot; messages render with the bot's name and avatar and can mention users and items.

**PRD-BOT-03** · P1 · Phase 2 — As a developer, I want a bot to become an agent, so that it answers mentions.
- A bot can be marked as having an agent (and shown in the model selector); mentioning it opens an agent session on its runtime.

**PRD-BOT-04** · P0 · Phase 2 — As a developer, I want outgoing webhooks, so that external systems react to workspace events.
- Personal or team webhooks subscribe to events (document created, updated, deleted or copied; channel created, updated, deleted, participant added or removed; message posted, edited, deleted, attachment added or removed, mentioned; agent session lifecycle; webhook lifecycle), optionally filtered to specific item ids.
- Deliveries only include events on items the webhook owner can access, are ordered per webhook, POST with a 10-second total timeout (5-second connect) and no redirects, retry up to 5 attempts (after 30, 60, 120 and 300 seconds) on timeouts, 408, 429 and 5xx, and are signed with an HMAC-SHA256 signature over timestamp and body.
- A Validate action sends a test event (at most 10 per hour per webhook).

### 6.25 Integrations and importers

Connections let agents use external tools; importers bring existing work in once. See Spec §17 and §32.

**PRD-INTG-01** · P0 · Phase 2 — As a user, I want one place to manage integrations, so that I know what is connected.
- Settings → Integrations shows Core integrations (email, GitHub, meeting notes), the MCP server and local runtime setup rows, and Agent integrations: Installed, Featured and All apps (search and category filter), plus Add custom (any MCP server URL, with OAuth where supported).
- Each connection can be disabled, reconnected, disconnected or renamed; credentials are encrypted at rest.

**PRD-INTG-02** · P0 · Phase 2 — As a team migrating from a doc tool, I want to import pages and databases, so that we keep our knowledge.
- Through a connection or an agent request, the importer builds a plan (copy as document, convert to tasks, skip, or handle manually per page or database), shows it for review and runs only on approval.
- Page trees become folders and documents, databases become databases with rows and relations, task lists become tasks; sharing is chosen per import (team or personal).
- Imports are one-time copies, never ongoing sync; re-running skips already imported items.

**PRD-INTG-03** · P0 · Phase 2 — As a team migrating from an issue tracker, I want to import issues, so that tasks continue in the Product.
- Issues become tasks; teams, projects, epics and initiatives become projects; statuses map (backlog or unstarted to Not Started, started to In Progress, done to Completed, cancelled to Canceled); assignees map by email with a preview.
- A CSV task import with column mapping, preview and assignee mapping is also available.

**PRD-INTG-04** · P1 · Phase 2 — As a team migrating from another chat tool, I want to import channels, so that history is not lost.
- With history: an owner or admin uploads the chat tool's export archive; public channels become team channels (auto-join off), private and group conversations become private channels, 2-person DMs stay DMs; original timestamps are kept; no notifications, invites or agent triggers fire; unknown authors appear under their original name; files are excluded.
- Without history: a connection lists public channels and creates them with matching teammates.
- Re-import deduplicates; cancel keeps already imported history; mentions and replies are reconciled after import; progress is visible.

**PRD-INTG-05** · P1 · Phase 2 — As a new user, I want setup cards suggesting imports and connections, so that I bring my work in.
- Dismissable cards in relevant views (for example import tasks, connect more calendars, add repositories) start the matching flow; dismissal is remembered.

### 6.26 External messaging (WhatsApp)

Users may link a personal WhatsApp account as a companion device and bring chosen chats into the workspace. This depends on an unofficial client of the WhatsApp multi-device protocol and carries terms-of-service risk (section 12). See Spec §23. (Maturity: experimental)

**PRD-WA-01** · P2 · Phase 4 — As a user, I want to link my WhatsApp account, so that important chats live with my work.
- On desktop, the External view (`g x`) shows a Connect flow with an account-risk notice; pairing by rotating QR code (pairing expires after 5 minutes, auto-refreshes up to 3 times), phone-number code or passkey; one account per person; Disconnect at any time.

**PRD-WA-02** · P2 · Phase 4 — As a user, I want to choose which chats to sync, so that personal chats stay out.
- Only chats I explicitly add are synced; adding imports recent history from my phone in pages of 50, up to 500 messages or 90 days, with visible progress states.
- Synced chats render in the chat timeline with media, reactions, polls, locations, contacts, replies, edits and deletions; imported history does not notify.

**PRD-WA-03** · P2 · Phase 4 — As a user, I want to reply from the Product, so that I do not switch to my phone.
- I can send text, media, replies and reactions, and edit or delete my own messages within 10 minutes, only from my own linked account; at most 1 send request per second; an uncertain send is never retried automatically; agents and bots cannot send WhatsApp messages.

**PRD-WA-04** · P2 · Phase 4 — As a user, I want to share a synced chat with teammates, so that they can follow without WhatsApp.
- A synced chat uses the standard share dialog (view only for others); mentioning it in a channel shares it (owner only); shared viewers get notifications for new messages; stopping sync keeps the history.

### 6.27 Notifications

Notifications drive Home, unread indicators, push, browser and desktop notifications, and email digests. See Spec §12.

**PRD-NOTIF-01** · P0 · Phase 1 — As a user, I want notifications for things that need me, so that I do not miss work.
- Notification kinds include: channel mention, new top-level message, thread reply, reaction to my message, channel invite, document mentioned in a channel, comment mention, comment reply, new comment on my document, project and CRM discussion activity, task assignment, access requested and granted, team invite, call started, new Signal email, inbox needs reconnecting, reminder due, calendar event reminder and join request, PR events, agent finished, agent waiting for input, mentioned in an agent prompt, shared WhatsApp message.
- I never receive a notification for my own action; I only receive notifications about items I can access.
- Notification state moves from unseen to seen to done; undo of done returns it to seen; a late view never reopens a done notification.

**PRD-NOTIF-02** · P0 · Phase 1 — As a user, I want control over what notifies me, so that I am not overwhelmed.
- Settings → Notifications: desktop and mobile delivery switches; per-category toggles for blockable kinds (security and invite kinds cannot be disabled); lists of snoozed items (change time, resume) and muted items (snooze instead).
- Any item can be muted (permanently) or snoozed (30 minutes, 1 hour, 3 hours, until 09:00 tomorrow, until Monday 09:00, one week, or a custom future time).
- A global mute pauses all notifications.

**PRD-NOTIF-03** · P0 · Phase 1 — As a user, I want push and browser notifications, so that I am reached when the app is in the background.
- Browser notifications (after permission) and native push on iOS and Android, including call ringing, arrive within 5 seconds p95 of the event; tapping opens the exact item (message, thread, comment).
- Push notifications for the same conversation group together; desktop notifications show the sender's avatar.

**PRD-NOTIF-04** · P1 · Phase 2 — As a user who is away, I want an email digest, so that I catch up without opening the app.
- If I have no push delivery and have not been online for about 30 minutes, eligible notifications batch into a digest sent at most once per 24 hours; new email, invites and call notifications are never digested.
- Digests contain a signed one-click unsubscribe link; a per-kind disable link is included.

**PRD-NOTIF-05** · P1 · Phase 1 — As a user, I want notifications retained for a sensible period, so that the feed stays relevant.
- Notification records are kept for 30 days after creation (configurable), then deleted; the underlying items are unaffected.

### 6.28 Sharing and permissions

One permission model for every entity: owner, editor, commenter and viewer; team access; public or team links; channel grants; folder inheritance; access requests. See Spec §7.

**PRD-SHARE-01** · P0 · Phase 0 — As an owner, I want one share dialog on every item, so that sharing works the same everywhere.
- The Share dialog lists people with access and their level (Owner, Editor, Commenter, Viewer), invites people or email addresses, sets team access (Off, View, Comment, Edit; only the owner can change it), sets link access (Off, Team, Public) with a level (View, Comment, Edit where allowed), grants channels, and copies the link.
- Inviting an email address without an account sends an invitation; on sign-up they get the granted access.
- The effective access is the highest of all grants (direct, team, link, channel, folder, project, CRM, inbox ownership or delegation).

**PRD-SHARE-02** · P0 · Phase 0 — As a user without access, I want to request it, so that I am not blocked.
- Opening an item I cannot access shows a request form for View, Comment or Edit; the owner is notified and can grant or deny; requests are limited to one per minute per item, and a denial blocks new requests for 24 hours.
- Grants only upgrade access; owners can lower or remove direct grants without affecting inherited, channel or team access.

**PRD-SHARE-03** · P0 · Phase 1 — As an owner, I want public links that work signed out, so that anyone can read what I publish.
- Public view links show the item to signed-out visitors (with a sign-in prompt for interaction); public links are never indexed for search engines by default.

**PRD-SHARE-04** · P0 · Phase 1 — As a user, I want explainable access, so that I understand why someone can see something.
- For any item and person, an owner can see the reasons for access (for example "via channel #design", "via folder Contracts", "team link").

**PRD-SHARE-05** · P0 · Phase 1 — As a security-conscious admin, I want mentions to share only where intended, so that data does not leak.
- Mentions share only in channel messages (PRD-CHAN-06) and, after confirmation, in email bodies (PRD-MAIL-09); mentions in documents, tasks, comments, CRM notes and agent prompts never change access.
- Embeds and mentions in documents never grant access to the embedded item.

### 6.29 Teams and administration

A team is the workspace tenant: members, roles, invitations, domain auto-join, team defaults and seat plans. Sign-in methods are covered in 6.31. See Spec §6 and §7.

**PRD-TEAM-01** · P0 · Phase 1 — As a founder, I want to create a team and invite colleagues, so that we work in one workspace.
- Settings → Team → Create team sets name and an editable team slug; I become Owner.
- Invite by email or by invite link (create, copy, reset, turn off); pending invites can be resent after 1 hour, copied or cancelled; invitees see pending invites at sign-in and can accept or decline.
- Invitation reminder emails go out after 3 days and again 4 days later; invites older than 14 days get no reminders.
- A user belongs to at most one team; joining another requires leaving the current one (see OQ-15).

**PRD-TEAM-02** · P0 · Phase 1 — As an admin, I want roles, so that the right people manage the team.
- Roles: Member (team-shared content), Admin (remove members, manage seat plans, invite settings, CRM visibility and email sync, hide CRM records, team bots and agents), Owner (everything, including changing roles and deleting the team).
- Removing a member immediately revokes team-shared and channel-shared access; their owned items transfer to an owner-chosen member or remain accessible to admins (see Spec §7).

**PRD-TEAM-03** · P0 · Phase 1 — As an admin, I want invite policy controls, so that membership is governed.
- Members can invite (default on; admins and owners can turn it off).
- Auto-join on domain: people signing up with the owner's verified email domain join automatically.
- In single-organisation mode, the operator's allowed domains apply instance-wide.

**PRD-TEAM-04** · P0 · Phase 1 — As a team, we want sensible sharing defaults, so that collaboration needs no setup.
- Defaults: tasks and projects shared with the team; channel calls shared with the team; CRM email shared per company email sync; snippets and routines personal until shared; default link sharing for new documents configurable in team settings.

**PRD-TEAM-05** · P1 · Phase 2 — As a team, we want new members to be connected immediately, so that onboarding is smooth.
- When someone joins, DMs with each teammate are available, team channels with auto-join add them, and team tasks become visible.

**PRD-TEAM-06** · P1 · Phase 3 — As an admin, I want a team language and teammate visibility, so that the workspace fits our organisation.
- Team default interface language; members list shows each member's email, role and seat plan.

**PRD-TEAM-07** · P2 · Phase 4 — As an enterprise admin, I want SAML single sign-on and SCIM provisioning, so that identity is centrally managed. (Maturity: advertised; specified here as target behaviour)
- SAML 2.0 or OIDC enterprise login per team domain, with enforced SSO; SCIM 2.0 creates, updates and deactivates members.

**PRD-TEAM-08** · P1 · Phase 3 — As an admin, I want data-retention policies, so that we keep data only as long as needed.
- A team retention window deletes documents and AI chats not accessed within N days (off by default), with a preview of affected items before enabling.

### 6.30 Settings

Settings is a split-view page with searchable sections. See Spec §34 and §36.

**PRD-SET-01** · P0 · Phase 1 — As a user, I want all settings in one searchable place, so that I find options fast.
- `cmd/ctrl+;` or the rail gear opens Settings in the current split (shift-click for a new split); a typo-tolerant search finds individual settings, scrolls to them and highlights them briefly.
- Groups: Team (General, Members, Connections), Blocks (Email, Calendar, Agents, Routines on touch, CRM), Personal (Account, Appearance, Notifications, Keyboard shortcuts, Usage, Billing, Desktop app, Mobile app), Workspace (Tags, Integrations), Developer (Runtimes, MCP server, API Keys, Bots), Admin (operator-only diagnostics).
- Sections unavailable in the current mode or platform are hidden (for example Billing and Usage in single-organisation mode, API Keys on mobile).
- A section that fails to load shows an error with Try again.

**PRD-SET-02** · P0 · Phase 1 — As a user, I want appearance settings, so that the Product looks the way I like.
- Mode: System, Light or Dark, with separate preferred light and dark themes; at least 12 built-in themes (dark and light), a token-based theme editor, and import or export of a theme as JSON.
- The default dark and light themes use a muted blue accent.
- Interface language per user and per team.

**PRD-SET-03** · P0 · Phase 1 — As a user, I want account controls, so that I manage my identity and data.
- Account shows profile (name, photo), plan card, log out, and Delete account (two-step confirmation with a 5-second hold, optional feedback, log-out alternative); deletion completes within 7 days, removes personal data and connected-account data, and transfers or deletes owned items per team policy.
- Export my data downloads a ZIP of my documents (Markdown), files, tasks (CSV and Markdown), messages I sent (JSON), calendar events (ICS) and call recordings and transcripts I own.

**PRD-SET-04** · P1 · Phase 1 — As a user, I want a keyboard shortcuts page, so that I can learn them.
- A categorised list with a visual keyboard preview, also opened by the Show keyboard shortcuts command.

### 6.31 Sign-in and onboarding

Passwordless sign-in, guided onboarding and an interactive tutorial. See Spec §6 and §36.

**PRD-ONB-01** · P0 · Phase 0 — As a user, I want to sign in without a password, so that access is simple and safe.
- Continue with Google, Continue with Microsoft (when configured), Continue with Apple (iOS and when configured) and Continue with email (a 6-digit one-time code, valid for 10 minutes).
- Code sending is limited to one per 30 seconds and 20 per day per address; verification attempts to 5 per minute and 100 per day; errors explain when to retry.
- Sessions use HttpOnly cookies with a short-lived access token (15 minutes) and a rotating refresh token (30 days sliding idle, 90 days absolute); native apps receive a one-time hand-off code exchanged for a session.
- Signing out clears local caches, drafts and notification state on that device.

**PRD-ONB-02** · P0 · Phase 1 — As a new user, I want guided onboarding, so that the workspace is useful in 15 minutes.
- Steps (resumable): choose a workspace accent colour; pick features to try; read the security summary; connect a work account (mail and calendar); optionally add a personal account; connect tools (featured integrations and a searchable directory, GitHub linking); create or join a team with suggested invitees; choose a plan (multi-tenant mode only); finish.
- Every optional step can be skipped; in single-organisation mode the plan step is absent.
- On first sign-in, a support conversation, a getting-started document (favourited), three sample tasks and a starter tag are created.

**PRD-ONB-03** · P1 · Phase 2 — As a new user, I want an interactive tutorial, so that I learn the keyboard model.
- A modal tutorial with lessons on the command menu, creating items with `c`, Markdown and mentions, and navigation; progress is shown; `cmd/ctrl+enter` continues.
- Optional in-app feature tours on desktop highlight controls per view without stealing focus, with Back, Next, Dismiss and progress, remembered per user.

**PRD-ONB-04** · P1 · Phase 2 — As a mobile visitor, I want sign-up to be handled gracefully, so that I can continue later on desktop.
- Phone-width web sign-up offers to email a desktop link; native apps offer Create new account and Log into existing account.

**PRD-ONB-05** · P1 · Phase 1 — As a team, we want empty states that teach, so that blank views are not dead ends.
- Every list and view has an illustrated empty state with a one-line explanation and a primary action or documentation link.

### 6.32 Mobile and desktop apps

The same application runs in desktop browsers, as desktop apps (macOS, Windows, Linux) and as mobile apps (iOS, Android) with touch layouts. See Spec §37.

**PRD-APP-01** · P0 · Phase 1 — As a user, I want the full product in a desktop browser, so that no install is needed.
- Current versions of Chrome, Edge, Firefox and Safari are supported; the desktop browser has the full keyboard model and splits.

**PRD-APP-02** · P1 · Phase 3 — As a user, I want a desktop app, so that the Product behaves like a native tool.
- Desktop apps for macOS (signed and notarised), Windows and Linux with native title bar integration, back/forward controls, zoom, window-state persistence, system notifications, deep links, external links opening in the system browser, and an auto-updater (checks at start and every 6 hours; downloads on unmetered networks; "restart to update" prompt).
- The desktop app can host the local agent daemon ("This computer", PRD-CODE-03).

**PRD-APP-03** · P1 · Phase 3 — As a mobile user, I want native iOS and Android apps, so that I can triage on the go.
- Mobile apps cover Notifications (Home), Email (read, triage, compose), Chat, Tasks, Drive, Calendar, Agents, Calls, CRM and Settings; desktop-only features (splits, keyboard shortcuts, managing inbox connections and agent connections, version history) are hidden with an explanation.
- A bottom dock shows as many destinations as fit plus More; the dock is customisable per device; each view has a floating primary action (+ Task, + Email, + Message, + Document, + Event).
- Gestures: swipe back, swipe rows (left done, right remind), pull to refresh, long-press action drawers; dialogs become bottom sheets.
- Native integrations: push (including calls through the platform call UI and picture-in-picture), share sheet into the Product, photo library and camera attachments, file export, network status.
- Web bundle updates can ship over the air within a native build's compatibility range; builds below the minimum show an update-required screen.
- Operators build and sign the apps under their own developer accounts (section 5.9).

**PRD-APP-04** · P0 · Phase 2 — As a mobile web user, I want touch layouts, so that I can use the Product without installing an app.
- Below 640 px width on touch devices the touch layout is used in the browser, with the same dock and gestures where the browser allows.

### 6.33 Offline and local cache

The client keeps a local cache for instant loads and limited offline use, with a durable mutation queue. See Spec §37.

**PRD-OFF-01** · P0 · Phase 3 — As a traveller, I want recent content available offline, so that I can keep working on a plane.
- Previously loaded lists, email (90 days of Signal and 30 days of Noise after backfill on native apps), channels and opened documents are readable offline; a notice shows when content is cached.
- Document and canvas edits made offline merge on reconnect (PRD-DOC-02).

**PRD-OFF-02** · P0 · Phase 2 — As a user, I want actions to apply instantly and survive connection loss, so that the app never feels slow.
- Property edits, mark done or read, archive, favourites, renames, tags and task status apply optimistically and enter a durable ordered queue; only a failed action rolls back, with a toast giving the reason and Retry.
- An outcome that cannot be confirmed is reported as uncertain and never silently retried.
- Undo and redo (`cmd/ctrl+z`, `shift+cmd/ctrl+z`) apply to queued mutations.

**PRD-OFF-03** · P1 · Phase 3 — As a user with several tabs, I want one consistent cache, so that tabs do not conflict.
- One visible tab owns the local cache; others use it through a shared channel; hidden tabs release storage; back/forward navigation restores state without reload.

### 6.34 Billing and plans

Plans, seats, AI usage allowance, credits and overage in multi-tenant mode. See Spec §33 and section 9 of this PRD.

**PRD-BILL-01** · P0 · Phase 3 — As a customer, I want to choose and change plans, so that I pay for what I need.
- Settings → Billing shows the current plan, Manage (billing portal for payment methods, invoices and cancellation effective at period end), and upgrade or switch buttons for Pro and Max.
- New customers are offered a 30-day Pro trial once (only if they have never subscribed); Max has no trial; upgrading a trialling Pro to Max ends the trial.
- Plan changes are prorated.

**PRD-BILL-02** · P0 · Phase 3 — As a team owner, I want per-seat plans, so that each member has the right tier.
- Each member holds a seat on Pro or Max; owners and admins set the seat plan per member; paid teams require a paid seat for each member (see OQ-02 for free teams).
- Billing buttons on a team change only the clicking member's own seat, and only when that member is an admin; other members see who pays.

**PRD-BILL-03** · P0 · Phase 3 — As a user, I want to see and extend my AI usage, so that work is not interrupted.
- Settings → Usage shows the monthly allowance used as a percentage; usage resets each billing period (calendar month in UTC for Free); allowance does not roll over.
- Credits can be bought in packs (default $25, $50, $100 or a custom amount); credits roll over and are used after the allowance.
- Automatic reload buys credits when the balance falls below a minimum (default $10) up to a target (default $100), within a maximum monthly spend.
- When allowance and credits are exhausted, Free users see the upgrade dialog; paid users see add-credits; the composer keeps their text; agents already queued are rejected with a clear message.
- On a team, the paying account buys credits and controls reload; others can view.

**PRD-BILL-04** · P0 · Phase 3 — As an operator, I want metering that is exact, so that customers are billed correctly.
- Every model call is metered by model, tokens (or audio seconds), feature and payer; billable usage is recorded before results are returned, and settlement is exactly-once.
- Non-billable features (memory, call summaries, dictation, chat titles, routing classifiers) are recorded but not charged.
- A failed payment moves the subscription to past due and restricts paid features after the grace period (default 7 days).

**PRD-BILL-05** · P1 · Phase 3 — As an operator, I want referral and promotion codes, so that I can run growth programmes. (P2 for single-organisation mode, where it is hidden)
- Promotion codes apply discounts at checkout; referral links give the referrer a configurable reward.

## 7. Cross-cutting UX requirements

These requirements apply to every area. Detailed specifications are in Spec §34 (shell and design system), §35 (keyboard model), §36 (surfaces) and §37 (mobile, desktop and offline).

### 7.1 Application shell and navigation

**PRD-UX-01** · P0 · Phase 1 — As a user, I want a consistent shell, so that every area feels like one product.
- Desktop: an icon rail (Create, Search, then Home, Drive, Email, Chat, Tasks, Calendar, Agents, Customers, Calls, Reviews, with Activity, Scheduling and External available under More; Settings at the bottom with the profile photo) and, inside each split, a resizable workspace sidebar (default 256 px) with a title, view switcher, search, a full-width New button and sections.
- Customize sidebar shows, hides and reorders rail items (Home always first); the sidebar can be hidden per view with `cmd/ctrl+.` and appears as an overlay in narrow splits.
- Each split has a 48 px header with title or breadcrumbs, view tabs and right-aligned control groups (filters, view options, New, Search; or entity actions, Share, previous/next, side-panel toggle) whose labels collapse as the split narrows.
- Returning to an app resumes its last location and filters within the session.

### 7.2 Keyboard first

**PRD-UX-02** · P0 · Phase 1 — As a power user, I want every action on the keyboard, so that I never need the mouse.
- Global: `c` create launcher, `cmd/ctrl+k` command menu, `/` search, `\` or `cmd/ctrl+\` new split, `cmd/ctrl+;` settings, `cmd/ctrl+.` toggle navigation, `]` toggle side panel, `cmd/ctrl+z` and `shift+cmd/ctrl+z` undo and redo, `opt+[`/`opt+]` split history.
- Go-to sequences: `g h` Home, `g f` Drive, `g e` Email, `g c` Chat, `g t` Tasks, `g r` Calendar, `g a` Agents, `g o` Customers, `g l` Calls, `g v` Reviews, `g y` Activity, `g x` External.
- Lists: `j`/`k`, `h`/`l` collapse and expand, `shift+j`/`shift+k` extend selection, `x` toggle select, `cmd/ctrl+a` select all, `gg` top, `shift+g` bottom, `tab`/`shift+tab` and `1`-`9` switch tabs, `cmd/ctrl+f` search in list, `f` filter, `esc` clear selection.
- Entity actions: `e` done, `shift+e` not done, `delete` delete (not on Home), `u`/`shift+u` unread/read, `t` tag, `opt+f` favourite, `r` rename, `cmd/ctrl+d` duplicate, `m` move to folder, `shift+cmd/ctrl+c` copy link.
- Multi-key sequences show a which-key style hint after a short pause; every shortcut appears in its tooltip and in the shortcuts page; shortcuts are rebindable (P2).
- Shortcuts never fire while typing in a text field, except those documented as working in inputs (`\`, `cmd/ctrl+.`, `cmd/ctrl+k`).

**PRD-UX-03** · P0 · Phase 1 — As a user, I want a create launcher, so that I can create any item type with two keys.
- `c` opens a launcher listing up to 3 recent types, then groups (Docs, Organization, Design, Data, Comms, Tasks, AI, Other) with descriptions; a search mode filters by name and a shortcut mode shows the second key for each type (`d` document, `t` task, `e` email, `m` message, `g` channel, `a` agent, `u` routine, `k` skill, `p` project, `b` spreadsheet, `c` call, `n` canvas, `f` folder, `o` code file, `s` snippet, `l` database, `q` form, `h` Photoshop file, `i` design, `v` Illustrator file).
- Holding `shift` with the second key (or `shift+enter`) creates in a new split.
- Composers for tasks, projects, channels, events, routines, skills and agents open as dialogs on desktop and bottom sheets on touch, each with Continue editing in split.

### 7.3 Splits

**PRD-UX-04** · P0 · Phase 1 — As a desktop user, I want several items side by side, so that I can work across context.
- A new split opens when at least 400 px of width remains for every pane; otherwise the action is disabled; there is no numeric cap.
- `shift+click` or `shift+enter` opens any link, row, mention or command-menu result in a new split; entities can be dragged into a split header.
- `shift+h`/`shift+l` move focus; the active split is outlined; `shift+esc` spotlights the active split over the others until pressed again; `cmd/ctrl+esc` closes a split (a lone content split offers Return to list).
- Each split keeps its own back/forward history, selection and scroll; split layout persists across reloads.
- Splits and the keyboard model are desktop only; touch shows one stacked pane with swipe navigation.

### 7.4 @mentions everywhere

**PRD-UX-05** · P0 · Phase 1 — As a user, I want the same @-mention behaviour in every editor, so that linking is second nature.
- `@` works in documents, task descriptions, comments, channel messages, email bodies, agent prompts, routine instructions, spreadsheet cells, canvas text and search.
- Targets: people, agents, channels, threads and messages, documents, tasks, projects, files, emails, calendar events, calls, agent sessions, companies, contacts, pipelines, PRs, skills, routines, dates (`@tomorrow`, `@next week`) and groups (`@here`).
- Results rank by frecency and match quality and appear within 100 ms for cached items; deleted or inaccessible targets render as "Deleted" or "No access" chips.
- Chips show live metadata (task status and priority, PR state, event time) and hover previews; the behaviour matrix of notify and share per surface is followed exactly (Spec §11).

### 7.5 Bidirectional references

**PRD-UX-06** · P0 · Phase 1 — As a user, I want to see everywhere an item is referenced, so that context is discoverable.
- Every entity's side panel has a References section listing items that mention or embed it, with the location of each mention, filtered to items the viewer can access.
- References update in real time; removing a mention removes the reference.
- Agents can query references through tools.

### 7.6 Lists, entity pages and interaction model

**PRD-UX-07** · P0 · Phase 1 — As a user, I want every list to work the same way, so that skills transfer between areas.
- List headers offer, in the same order: view tabs, Sort, Group, Filter, view options, New, Search (`cmd/ctrl+f`) and a Preview toggle; active filters show as removable chips with counts.
- Multi-select filter menus: checkbox toggles stay open, row click selects and closes, Only selects just that option.
- Rows show an unread dot, type icon, primary text, secondary preview and relative time; grouped lists have collapsible headers with counts; infinite scroll loads more and shows Retry on failure, never stopping silently.
- Every row: click opens (inline preview or detail per area), shift-click opens a split, cmd/ctrl-click opens a browser tab, right-click (or `shift+F10`) opens the shared context menu (open in new split, rename, favourite, copy link, copy ID, share, move to folder, duplicate, delete, mark done or read, snooze, mute, remind me, tags, properties); long-press on touch opens an action drawer.
- Rows are draggable onto folders, projects, channels, splits and composers.

**PRD-UX-08** · P0 · Phase 1 — As a user, I want entity pages with a consistent structure, so that I always know where things are.
- Entity pages show a large title, property chips beneath it, the main content, a Discussion where applicable, and a floating information side panel (about 320 px) with Tags, Properties, Activity and History, References, GitHub and Notifications sections and a footer with owner, created and updated times and statistics.
- Header actions: Ask the Assistant, entity-specific actions, Share, copy link, previous and next item, side-panel toggle.

**PRD-UX-09** · P0 · Phase 1 — As a user, I want clear feedback, so that I always know what happened.
- Toasts stack at the bottom right on desktop (up to 3 visible, 4.5-second default, hover pauses, actions such as Undo or Open), one at a time above the dock on mobile.
- Skeletons appear only after a short delay so fast loads do not flash; background refresh errors never blank loaded content; errors show Retry.
- Destructive actions confirm (or offer undo); bulk dialogs show selected items as chips and report partial failures with counts.
- User cards on hover (or a sheet on touch) show name, email, copy actions, open contact, DM and assign task.

### 7.7 Themes and visual design

**PRD-UX-10** · P0 · Phase 1 — As a user, I want a polished, themeable interface, so that the Product is pleasant for all-day use.
- The visual system is token-based: surface, content, edge and accent tokens plus a 12-colour palette; all other colours are derived, so a theme is a small set of input colours.
- Default look: dark-first near-black surfaces with slightly lighter panels and subtle borders, rounded corners (about 8 px for panels and cards; fully rounded pills), a muted blue accent, a sans-serif UI face and a display serif for marketing and sign-in headings. The Product uses its own brand, logo, icons and illustrations (Spec §34).
- Entity types have consistent icons and colours across lists, chips and menus.
- Reduced-motion preferences disable non-essential animation.

### 7.8 Accessibility

**PRD-UX-11** · P0 · Phase 1 — As a user with a disability, I want an accessible product, so that I can work independently.
- The web and desktop apps meet WCAG 2.2 level AA; mobile apps follow platform accessibility guidelines.
- Every control has an accessible name; tabs and segmented controls expose correct roles; toasts use a live region; focus returns to the opener after dialogs; all functionality works with keyboard only; focus is always visible.
- Colour is never the only carrier of meaning (status icons differ in shape); text contrast meets AA in all built-in themes.
- An accessibility audit by an external tester passes before Phase 3 exit.

### 7.9 Internationalisation

**PRD-UX-12** · P1 · Phase 2 — As a non-English speaker, I want the interface in my language, so that I work comfortably.
- All user-visible strings are externalised; the interface ships in English at Phase 1 and in at least 20 languages by Phase 3 exit, selectable per user and per team.
- Dates, times, numbers and currencies follow the user's locale; time zones are respected everywhere (events, reminders, routines, booking pages).
- Content search and sorting are Unicode-aware; right-to-left text renders correctly in documents and messages.

### 7.10 Performance budgets (client)

**PRD-UX-13** · P0 · Phase 1 — As a user, I want the Product to feel instant, so that I stay in flow.

| Interaction | Budget (p75 on a mid-range laptop, Team tier server) |
|---|---|
| Cold load to interactive (empty cache) | 3.0 s |
| Warm load to interactive (cached shell and data) | 1.5 s |
| Open the command menu | 50 ms |
| Keyboard navigation between list rows, including preview update from cache | 50 ms |
| Open an item already in cache | 100 ms |
| Optimistic UI update after an action | 50 ms |
| List scroll | 60 frames per second for 10,000-row virtualised lists |
| Typing latency in documents and composers | 16 ms per keystroke |

- Budgets are tracked in continuous integration and in production client telemetry (opt-in in self-host mode).

## 8. Non-functional requirements

Targets apply at the tier's rated user count (section 5.2) unless stated. Spec §39 defines the acceptance test methods.

### 8.1 Performance

| ID | Requirement | Target |
|---|---|---|
| PRD-NFR-01 | API read latency (GraphQL and REST, excluding search and AI) | p95 under 200 ms; p99 under 500 ms |
| PRD-NFR-02 | API write latency (single-entity mutations) | p95 under 300 ms |
| PRD-NFR-03 | Name search (command menu, mentions) | p50 under 50 ms, p95 under 150 ms server time |
| PRD-NFR-04 | Full-text search | p95 under 400 ms (Search Index); under 1 s (PostgreSQL fallback) for 1 million indexed items |
| PRD-NFR-05 | Collaborative edit propagation between two clients on the same instance | p95 under 200 ms (documents), 300 ms (spreadsheets), 100 ms (canvas presence) |
| PRD-NFR-06 | Realtime delivery of messages, notifications and list updates to connected clients | p95 under 1 s from commit |
| PRD-NFR-07 | Push notification delivery (gateway to device, excluding provider delay) | p95 under 5 s |
| PRD-NFR-08 | Search indexing lag (commit to searchable) | p95 under 10 s; email backfill excluded |
| PRD-NFR-09 | Email sync lag for push-enabled providers | p95 under 60 s |
| PRD-NFR-10 | Agent first streamed token | p95 under 2 s plus the provider's own time to first token |
| PRD-NFR-11 | Call join time (click to media) | p95 under 3 s on broadband |
| PRD-NFR-12 | Background job pickup | p95 under 5 s for interactive jobs; scheduled jobs within 60 s of due time |

### 8.2 Availability and reliability

| ID | Requirement | Target |
|---|---|---|
| PRD-NFR-13 | Availability, single-VPS tiers | 99.5% monthly, excluding announced maintenance (best effort; no redundancy) |
| PRD-NFR-14 | Availability, multi-node tiers | 99.9% monthly for core web, API and realtime |
| PRD-NFR-15 | Job delivery | At-least-once with idempotent handlers; failed jobs retry with exponential backoff and move to a dead-letter queue after 5 attempts (default), retained 14 days |
| PRD-NFR-16 | Degradation | Failure of an optional component (section 5.7) or an external provider never makes core features (documents, chat, tasks, Drive, search) unavailable |
| PRD-NFR-17 | Client resilience | Clients reconnect realtime connections automatically with backoff (max 30 s) and resynchronise missed updates without user action |

### 8.3 Durability, RPO and RTO

| ID | Requirement | Target |
|---|---|---|
| PRD-NFR-18 | Recovery point objective (RPO) | Single VPS: 15 minutes or less with continuous WAL archiving and object-store sync (24 hours if only nightly backups are configured; the console warns). Multi-node with streaming replica: 1 minute or less |
| PRD-NFR-19 | Encryption master key durability | The master key is exported once at install for offline safekeeping; restore refuses to proceed without it; loss of the key is documented as loss of encrypted secrets (connected-account tokens, provider keys) but not of content |
| PRD-NFR-20 | Recovery time objective (RTO) | Single VPS: 4 hours to a fresh VPS for 200 GB of data. Multi-node: 1 hour, or 15 minutes for database failover to a replica |
| PRD-NFR-21 | Collaborative content durability | An acknowledged document edit is persisted (snapshot or operation log) before acknowledgement or within 1 second; a Collab Server crash loses no acknowledged edit |
| PRD-NFR-22 | Deletion guarantees | Trash retention 30 days; permanent deletion removes content from the database, Object Store and Search Index within 7 days; backups age out per retention |

### 8.4 Security

| ID | Requirement |
|---|---|
| PRD-NFR-23 | The application meets OWASP ASVS level 2; an external penetration test is completed before general availability and annually after. |
| PRD-NFR-24 | All traffic uses TLS 1.2 or later; internal service traffic on multi-node deployments is encrypted or confined to a private network. |
| PRD-NFR-25 | Secrets of users and third parties (OAuth refresh tokens, provider API keys, connection credentials, WhatsApp device keys) are envelope-encrypted with AES-256-GCM, bound to their owner so one user's ciphertext cannot be decrypted in another's context; API keys, bot tokens and runtime tokens are stored as hashes only. |
| PRD-NFR-26 | Sessions use asymmetric signed tokens verifiable with a published key set; services cannot mint user sessions; session hand-off codes are single use and expire within 2 minutes. |
| PRD-NFR-27 | Authorisation is checked server-side on every request, search result, realtime event, export and tool call; automated tests cover each entity kind's access paths (Spec §7). |
| PRD-NFR-28 | Untrusted content (email HTML, link previews, uploaded SVG and office files) is sanitised or rendered in isolated origins; server-side fetchers block private address ranges and re-check after redirects. |
| PRD-NFR-29 | A strict Content Security Policy restricts scripts to first-party origins; framing is limited to the Product's own origin. |
| PRD-NFR-30 | Code Sandbox workloads run in gVisor or microVM isolation with no host credentials, bounded CPU, memory, time and disk, and an egress allowlist. |
| PRD-NFR-31 | Agents treat content from email, web pages, documents and external tools as data; outward actions follow PRD-AI-09 regardless of instructions found in content (prompt-injection defence). |
| PRD-NFR-32 | Rate limits protect sign-in, sign-up (default 50 new accounts per hour per instance), code verification, invitations, access requests, booking pages, dictation, webhooks and API use. |
| PRD-NFR-33 | Security-relevant events (sign-in, role changes, sharing changes, API key creation, connection changes, data export, deletion, operator actions) are written to an audit log retained for 1 year (configurable) and exportable. |
| PRD-NFR-34 | Dependencies are scanned for known vulnerabilities in CI; critical issues are patched within 7 days of a fix being available. |
| PRD-NFR-35 | A documented vulnerability disclosure process exists for the project and for operators. |

### 8.5 Privacy

| ID | Requirement |
|---|---|
| PRD-NFR-36 | Customer content is never used to train models. Provider configuration supports zero-retention settings where the provider offers them, and Settings discloses which providers process prompts. |
| PRD-NFR-37 | Product analytics are off by default in self-host mode; when on, events exclude content, prompts and tool arguments and use pseudonymous ids. |
| PRD-NFR-38 | Users can export their data (PRD-SET-03) and delete their account (completed within 7 days); workspace owners can export the whole workspace. |
| PRD-NFR-39 | Retention controls exist for trash, notifications, AI chats and documents (PRD-TEAM-08), call recordings (default keep; configurable per team) and audit logs. |
| PRD-NFR-40 | Call participants always see a recording and transcription notice; guests are told what is retained. |
| PRD-NFR-41 | Mail, calendar and contact data from connected accounts is used only to provide features the user enabled; disconnecting deletes the synced copy (PRD-MAIL-19). |

### 8.6 Compliance posture

- The Product provides the controls a GDPR data controller needs: data export, deletion, retention, processor disclosure, a data-processing addendum template for SaaS operators, and data residency by choosing where the VPS runs.
- Controls are designed to map to SOC 2 and ISO 27001 criteria (access control, audit logging, encryption, change management, backup and recovery). The Product does not claim certification; operators certify their own deployments.
- Google user-data policy compliance (limited use of Gmail data) is required for any operator distributing a public Google OAuth app; the Product's data handling is designed to meet it (no human access to mail content without consent, no transfer for advertising).
- Licence compliance: the re-implementation's own licence is decided in OQ-18; third-party components are inventoried with licences in a software bill of materials published per release.

### 8.7 Scalability targets per tier

| Metric | Starter | Team | Growth | Scale |
|---|---|---|---|---|
| Active users | 10 | 50 | 250 | 1,000 |
| Concurrent realtime connections | 50 | 250 | 1,500 | 6,000 |
| Concurrently open collaborative documents | 50 | 250 | 1,500 | 5,000 |
| Channel messages per day | 5,000 | 25,000 | 150,000 | 600,000 |
| Connected mailboxes | 20 | 100 | 500 | 2,000 |
| Indexed items (email, messages, docs) | 2 million | 10 million | 50 million | 200 million |
| Object storage | 200 GB | 1 TB | 5 TB | 20 TB (external S3-compatible recommended) |
| Concurrent call participants | 0 (calls off) | 10 | 50 | 200 |
| Concurrent agent sessions (external LLM) | 5 | 25 | 100 | 400 |
| Concurrent hosted coding sandboxes | 0 | 2 | 10 | 40 |

Load tests (PRD-DEPLOY-03) must show section 8.1 targets are met at these figures.

### 8.8 Maintainability and portability

- PRD-NFR-42: All infrastructure dependencies are open-source software runnable on Linux x86-64 and ARM64; no component requires a specific cloud provider.
- PRD-NFR-43: Each optional external service sits behind an adapter interface with at least one self-hostable implementation or a documented disable path.
- PRD-NFR-44: Automated test coverage includes unit, integration, end-to-end browser tests for every P0 story, load tests per tier, and the component-combination matrix (PRD-DEPLOY-09).

## 9. Plans and packaging

Plans exist only in multi-tenant mode with billing on. Every value below is a default that the operator can change in the operator console (PRD-DEPLOY-13). See Spec §33.

### 9.1 Default plans (multi-tenant mode)

| Capability | Free | Pro | Max |
|---|---|---|---|
| Default list price | $0 | $40 per seat per month | $200 per seat per month |
| Trial | None | 30 days, first subscription only | None |
| Product areas | All areas included on every plan; plans differ by limits and team features, not feature gates, except where listed | Same | Same |
| AI models | The operator's designated free-plan model only (a fast, low-cost model) | All catalog models and agents | All catalog models and agents |
| Included AI usage per seat per month | Small hard cap; AI pauses until the next calendar month or an upgrade | Standard allowance | 10 times the Pro allowance |
| Beyond included usage | Upgrade only | Credits, then optional overage | Credits, then optional overage |
| Personal or per-agent provider keys | No | Yes | Yes |
| Connected email accounts | 2 | Unlimited | Unlimited |
| Storage | 5 GB | 100 GB per seat | 1 TB per seat |
| Calls, recording and transcription | Not included (see OQ-01) | Included | Included |
| Footer on outgoing email | Added | Removed | Removed |
| Team-level memory (target behaviour, see OQ-09) | Included | Included | Included |
| MCP server and API access | Included | Included | Included |
| Priority support | No | No | Yes |

- Allowances are measured in money at provider cost (the operator sets the amount per plan); overage is charged at provider cost plus an operator-set markup (0-99%).
- Funding order for AI usage: seat allowance, then shared prepaid credits, then opt-in overage invoiced to the payer (the subscriber, or the team owner).
- Teams can mix Pro and Max seats; seat changes are prorated.
- The pricing page and paywall copy name capabilities, not specific model names, so that catalog changes do not require copy changes (OQ-10).

### 9.2 Single-organisation self-host packaging

- Billing is off. Every workspace receives the installation default plan (by default Pro with AI, storage and mailbox limits set to unlimited; Spec §33.14): all models in the catalog, no footer, no paywalls, no trial or upgrade prompts.
- The operator may still set per-user or per-workspace AI spending caps, storage quotas, and mailbox limits for cost control; reaching a cap shows "contact your administrator" instead of an upgrade dialog.
- Usage reporting (Settings → Usage, operator console) remains available for cost visibility.

### 9.3 Packaging rules

- No feature is withheld from the self-host edition that exists in the multi-tenant edition.
- Plan limits are enforced server-side at the point of use (admission before AI calls, connection time for inboxes, upload time for storage); client checks are advisory only.
- Downgrades never delete data: items above a new limit become read-only until usage falls under the limit (for example extra inboxes stop syncing but keep synced mail).

## 10. Release plan

Phases are sequential with overlap allowed for independent workstreams. A phase exits only when its exit criteria are met. Story phase assignments are in section 6.

### 10.1 Phase 0: Platform foundation

Scope: installer and Compose stack (PRD-DEPLOY-01 to 04, 06, 07, 09, 12); identity and passwordless sign-in (PRD-ONB-01); entity model, ids, soft delete and trash; properties and tags core; permission model, share dialog and access requests (PRD-SHARE-01, 02); Realtime Hub; Job Queue, Scheduler and Event Bus with outbox; Object Store uploads; Search Index pipeline with PostgreSQL fallback; Collab Server with one owner per document; telemetry baseline; web app shell skeleton with splits and keyboard framework.

Exit criteria:
- A fresh Starter-tier VPS installs with one command and reaches first sign-in in under 30 minutes in 9 of 10 scripted trials.
- Backup and restore drill succeeds onto a fresh VPS.
- Authorisation test suite passes for every entity kind implemented so far.
- Two clients co-edit a test document with p95 propagation under 200 ms and zero lost acknowledged edits across a forced Collab Server restart.
- Component-matrix tests pass for the minimal profile.

### 10.2 Phase 1: Core MVP

Scope: Home and notifications (6.1, 6.27); command menu and search (PRD-SRCH-01 to 04); Gmail email client (6.3 Phase 1 stories); chat and channels (6.4 Phase 1 stories); tasks and projects (6.5 Phase 1 stories); properties, tags, favourites, trash (6.6); documents (6.7 Phase 1 stories); Drive and basic viewers (PRD-FILE-01 to 04); the Assistant with core tools and review cards (PRD-AI-01 to 09); teams, settings and onboarding (6.29 to 6.31 Phase 1 stories); cross-cutting UX (section 7 P0 items); operator console (PRD-DEPLOY-13); BYO AI keys (PRD-DEPLOY-10); upgrades (PRD-DEPLOY-08); desktop web (PRD-APP-01).

Exit criteria:
- All Phase 1 P0 stories accepted; at least 80% of Phase 1 P1 stories accepted.
- Internal dogfood: a team of at least 10 people uses the Product as its primary mail, chat, task and document tool for four consecutive weeks with no data-loss incident.
- Starter and Team load tests meet section 8.1 targets for the shipped features.
- Accessibility smoke audit has no critical issues.
- Google OAuth registration guide validated end to end with an Internal Workspace app and an external test-mode app.

### 10.3 Phase 2: Collaboration and AI breadth

Scope: calendar and booking links (6.13); CRM companies and contacts (6.14 Phase 2 stories); calls, recording and transcription (6.15 Phase 2 stories); GitHub integration (PRD-GH-01 to 03); canvas (6.8); spreadsheets (6.11); custom agents, agents in channels, connections, subagents, dictation (PRD-AI-10 to 14, 17); personal memory (PRD-MEM-01, 02); routines (6.20); skills (6.21); snippets (6.22); MCP server, API and keys (PRD-MCP-01 to 03); bots and webhooks (6.24); integrations and importers (6.25); document AI editing and history (PRD-DOC-05, 08, 09); email AI drafting, invitations, digests (PRD-MAIL-12, 14, 17, PRD-NOTIF-04); mobile web touch layouts (PRD-APP-04); optimistic queue (PRD-OFF-02); internationalisation framework (PRD-UX-12); multi-node layout and observability (PRD-DEPLOY-05, 14).

Exit criteria:
- All Phase 2 P0 stories accepted; at least 80% of Phase 2 P1 stories accepted.
- Team-tier load test with calls enabled (10 participants) meets section 8 targets.
- External MCP clients from at least three vendors complete OAuth and call 20 representative tools successfully.
- AI tool-call success rate at least 95% on the internal evaluation suite; zero permission-escalation findings in an agent red-team exercise.
- Penetration test of Phase 0-2 scope completed with no open critical or high findings.

### 10.4 Phase 3: Parity

Scope: databases (6.10) and forms (6.12); CRM pipelines (PRD-CRM-07); review board and PR merge (PRD-GH-04, 05); coding agents, local agent daemon and third-party runtimes (6.18 Phase 3 stories); team memory and remember/forget (PRD-MEM-03 to 05); DOCX and other office and design viewers and editors (PRD-FILE-05, 06); Outlook (PRD-MAIL-20); native desktop and mobile apps (PRD-APP-02, 03); offline (6.33); billing and plans (6.34); activity view (PRD-HOME-08); live data in documents (PRD-DOC-10); meeting-notes import (PRD-CALL-08); provider keys for agents (PRD-AI-16); retention policies (PRD-TEAM-08); full localisation; Growth-tier certification.

Exit criteria:
- 100% of P0 and P1 stories from Phases 0-3 accepted (goal G1).
- UX parity study: users experienced with the reference complete 20 scripted tasks in the Product with a completion rate and time within 10% of the reference.
- External WCAG 2.2 AA audit passed.
- Growth-tier (3-node) load test meets section 8 targets; RTO and RPO drills pass for single and multi-node.
- Legal sign-off on clean-room evidence, trade dress review and licence (OQ-18, OQ-19).
- Multi-tenant billing end-to-end tests pass (trial, upgrade, seats, credits, auto-reload, failed payment).

### 10.5 Phase 4: Advanced

Scope: Auto mode and Auto model routing (PRD-AI-15); code mode (PRD-AI-18); coding preview tunnels (PRD-CODE-06); universal input (PRD-SRCH-06); Gantt (PRD-TASK-11); channel labels (PRD-CHAN-15); CRM lists (PRD-CRM-08); WhatsApp (6.26); IMAP/SMTP or JMAP accounts (PRD-MAIL-22); SAML and SCIM (PRD-TEAM-07); rebindable shortcuts; Scale-tier certification; remaining P2 stories by demand.

Exit criteria:
- Each shipped Phase 4 feature passes its acceptance criteria and has moved from experimental to generally available, or remains behind a flag with a documented reason.
- Scale-tier load test meets section 8 targets.

## 11. Success metrics

| Category | Metric | Target |
|---|---|---|
| Parity | Share of P0/P1 stories accepted | 100% by Phase 3 exit |
| Parity | Scripted task completion versus the reference (rate and time) | Within 10% |
| Self-hosting | Install success rate (fresh VPS, scripted) | 90% or higher |
| Self-hosting | Median time from install command to first sign-in | Under 30 minutes |
| Self-hosting | Upgrade success without manual intervention | 98% or higher |
| Self-hosting | Successful quarterly restore drills reported by operators | 95% or higher |
| Activation | New users who connect an email account in their first session | 60% or higher |
| Activation | New users who create or open 3 item types in week one | 50% or higher |
| Activation | Teams inviting at least 3 members in week one | 40% or higher |
| Engagement | Weekly active / monthly active users | 60% or higher |
| Engagement | Share of Home and Email triage actions done by keyboard (desktop) | 50% or higher |
| Engagement | Median time to clear Home to zero on active days | Trending down release over release |
| Engagement | Items reached through mentions, references or command menu rather than browsing | 50% or higher of item opens |
| Retention | Week-4 retention of activated teams | 70% or higher |
| AI | Weekly active users who run at least one agent session or routine | 50% or higher |
| AI | Agent tool-call success rate | 95% or higher |
| AI | Outward actions confirmed versus discarded (draft quality signal) | 70% or higher confirmed |
| AI | Median AI cost per weekly active user | Within the plan allowance design (operator-set) |
| AI | MCP: workspaces with at least one external client connected | 30% or higher of active teams |
| Quality | Crash-free sessions (web, desktop, mobile) | 99.5% or higher |
| Quality | Collaborative sync incidents with lost acknowledged edits | Zero |
| Performance | Share of days meeting all section 8.1 p95 targets | 95% or higher |
| Security | Open critical or high vulnerabilities older than 7 days | Zero |

Self-host installs report metrics only if the operator opts in; otherwise metrics come from internal dogfood and SaaS deployments.

## 12. Dependencies, risks and mitigations

### 12.1 Key dependencies

| Dependency | Used for | Licence or terms consideration | Fallback |
|---|---|---|---|
| PostgreSQL 16+ with pgvector | Primary Database, queues, vectors | Open source | None (core) |
| Redis 7 or Valkey | Cache, presence, rate limits, pub/sub | Valkey is BSD; Redis licence terms vary by version | Valkey |
| NATS JetStream (or PostgreSQL queue) | Event Bus and jobs | Open source | PostgreSQL-only mode for Starter |
| Garage or SeaweedFS (or filesystem driver) | Object Store | Open source | Local filesystem driver |
| OpenSearch | Search Index | Open source | PostgreSQL full-text search |
| CRDT library (Loro or Yjs) | Collaborative documents, sheets, canvas | Open source; version must match on client and server | Pin versions; migration tooling |
| Rich-text editor framework (for example Lexical) | Documents and composers | Open source | None practical; abstract behind editor layer |
| LiveKit server and egress | Calls and recording | Open source | Calls disabled |
| Whisper-family model or hosted speech-to-text | Transcription, dictation | Model licence or provider terms | Transcription disabled |
| LibreOffice headless | Legacy office conversion | Open source (copyleft; run as a separate process) | Download cards |
| Spreadsheet formula engine (for example IronCalc) | Spreadsheets | Open source | None practical |
| pdf.js | PDF viewer | Open source | Download |
| Chromium | Render Service | Open source | Feature disabled |
| gVisor or Firecracker | Code Sandbox | Open source | Hosted coding disabled; local daemon only |
| LLM providers (Anthropic, OpenAI, Google, OpenAI-compatible) | AI | Commercial terms; data-handling agreements | Local models |
| Google, Microsoft, GitHub, Slack, Apple APIs | Mail, calendar, PRs, imports, sign-in, push | Platform policies and verification (section 5.9) | Feature disabled |
| Stripe | SaaS billing | Commercial | Billing adapter interface; billing off |

### 12.2 Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | **Clean-room process failure**: implementers are exposed to the reference's source, making the new code a derivative work. | Medium | Critical | Separate research and implementation teams; implementers sign attestations; specification is the only channel; written Q&A log (Spec §1.4); periodic code-similarity scans against the reference; legal review before release. | Legal |
| R-02 | **Copyleft proximity**: the reference is under a strong network copyleft licence; copied fragments, prompts, schemas or assets would impose its terms. | Medium | Critical | No copying of code, schema, prompts, copy or assets; independent naming; software bill of materials; similarity scanning; choose and document the re-implementation's licence early (OQ-18). | Legal |
| R-03 | **Trade-dress risk from an identical UI**: matching layout, colours, iconography and naming closely may be claimed to cause confusion. | Medium | High | Own brand, logo, icons, illustrations, fonts where distinctive, and default theme; reproduce interaction patterns and short functional labels only; trade-dress review at Phase 3 exit (OQ-19). | Legal, Design |
| R-04 | **Gmail restricted-scope verification cost and lead time** for public SaaS deployments. | High | High | Plan verification and security assessment budget early; support Internal apps for Workspace customers; ship IMAP/JMAP as an alternative (PRD-MAIL-22); document test-mode limits. | Operations |
| R-05 | **WhatsApp terms of service**: unofficial multi-device clients may breach terms; linked accounts can be banned; protocol changes break sync. | High | Medium | Experimental, off by default, explicit user risk notice, isolated component that can be removed; never sends on behalf of agents; consider the official business API as an alternative (OQ-22). | Product, Legal |
| R-06 | **LLM cost overrun** from agents, routines, memory and background classification. | High | High | Server-side admission and metering (PRD-BILL-04); per-user and per-workspace caps; cheap model roles for background work; prompt caching; context compaction; dashboards and alerts on spend. | Engineering |
| R-07 | **CRDT complexity**: merge bugs, document corruption, version skew between clients and server, memory pressure in the Collab Server. | Medium | Critical | Use a mature CRDT library; one owner per document; snapshot plus operation log; fuzz and convergence tests; pinned versions with migration tooling; corruption detection with automatic snapshot rollback. | Engineering |
| R-08 | **Scope size**: parity across more than 30 areas is very large. | High | High | Phased plan with strict P0/P1/P2; parity-before-invention rule (principle P10); shared platform primitives (entity, properties, sharing, lists, tools) to make each area cheap; cut P2 items first. | Product |
| R-09 | **Small-VPS resource limits**: OpenSearch, LibreOffice, Chromium and media services exceed Starter-tier memory. | High | Medium | Optional components with fallbacks (section 5.7); memory limits per container; PostgreSQL search fallback; tiered profiles. | Engineering |
| R-10 | **Calls on VPS networks**: NAT, UDP blocking and bandwidth limit call quality. | Medium | Medium | Bundled TURN; port checks in the installer; dedicated media node for Growth+; quality telemetry. | Engineering |
| R-11 | **Prompt injection through email, web or documents** leads agents to leak data or act. | High | High | Draft-don't-send review (PRD-AI-09); tools bounded by permissions; content marked as untrusted in prompts; red-team suite in exit criteria. | Engineering, Security |
| R-12 | **Code Sandbox escape or abuse** (crypto-mining, attacks from the instance). | Medium | High | gVisor or microVM isolation, egress allowlist, quotas, short-lived credentials, abuse monitoring; disabled by default on Starter. | Security |
| R-13 | **Third-party API policy changes** (Google, Microsoft, GitHub, Slack, connector brokers). | Medium | Medium | Adapter interfaces; contract tests; monitored deprecation notices. | Engineering |
| R-14 | **Mobile app distribution** requires each operator to build, sign and publish apps; push requires their own keys. | High | Medium | Build tooling and documentation for white-label builds; mobile web as fallback; push optional. | Product |
| R-15 | **Data loss on single-VPS deployments** through disk failure without off-site backups. | Medium | Critical | Installer requires a backup target or explicit acknowledgement; console warnings; restore drills. | Operations |
| R-16 | **Search relevance and latency** below expectations on the PostgreSQL fallback. | Medium | Medium | Clear tier guidance; name search kept fast via dedicated index; upgrade path to OpenSearch without downtime. | Engineering |
| R-17 | **Advertised-but-unimplemented behaviour** in the reference (team memory, storage quotas) leads to ambiguous specifications. | Medium | Medium | Specified as target behaviour with explicit acceptance criteria; decisions logged in section 13. | Product |
| R-18 | **Email deliverability** of transactional mail from new VPS IPs. | Medium | High | Relay by default; SPF/DKIM/DMARC checks; suppression list (PRD-DEPLOY-12). | Operations |

## 13. Open questions and decisions needed

Each item lists the question, the evidence, options and a recommended default. Decisions are recorded here and mirrored in Spec Appendix A.

| ID | Question | Evidence and options | Recommended default | Decision owner |
|---|---|---|---|---|
| OQ-01 | Are calls available on the Free plan? | Marketing and pricing say calls, recording and transcription are paid-only; the reference's billing documentation is silent. | Paid-only in multi-tenant mode (configurable); always on in self-host. | Product |
| OQ-02 | Can a free team include unpaid members? | Billing documentation says free teams may include unpaid members; later product behaviour blocks non-paying teams from inviting or admitting members. | Free teams allowed up to an operator-set member limit (default 3); paid teams require a paid seat per member. | Product |
| OQ-03 | Does @-mentioning a CRM company in chat share its information? | One CRM page implies yes; the mentions behaviour table and a CRM note say no (CRM visibility is team-determined). | No: a mention records a reference only (PRD-CRM-05). | Product |
| OQ-04 | Which CRM stages are current? | One page lists Lead, Demo, Customer, Churned with Qualified, Trial and Negotiation retired but filterable; another lists all seven as current. | Default four stages, editable by admins; the three retired stages available as optional presets. | Product |
| OQ-05 | Does the doc-tool importer convert databases? | Marketing says databases are excluded; the agent import tool converts databases to databases with rows and relations. | Convert databases (PRD-INTG-02). | Product |
| OQ-06 | Which navigation names to use? | Older screenshots show Inbox, Documents, Files, Folders, Channels, MCPs, Team; current documentation uses Home, Drive, Chat, Customers, Agents. | Use the current set: Home, Drive, Email, Chat, Tasks, Calendar, Agents, Customers, Calls, Reviews. | Design |
| OQ-07 | Which native platforms ship, and when? | The reference documentation says Android is not available while later product work includes Android builds; the desktop download lists macOS and Linux only, while Windows builds are referenced elsewhere. | iOS, Android, macOS, Windows and Linux all in Phase 3, behind the same web bundle. | Product |
| OQ-08 | How often is memory refreshed? | Documentation says nightly; later behaviour regenerates when older than 24 hours and mentions "increased frequency". | Personal memory: on demand when older than 24 hours, configurable down to hourly; team memory nightly (PRD-MEM-01, 04). | Product |
| OQ-09 | Team memory is advertised (and listed on every plan) but only per-user memory exists in the reference. | Advertised target. | Build team memory as specified in PRD-MEM-04 (Phase 3); until then, do not advertise it. | Product |
| OQ-10 | Free model naming: plan copy names one model while the backend grants a different one. | Mismatch between paywall copy and server configuration. | Plan copy names a capability ("fast model") not a model; the operator maps the role in the catalog (PRD-DEPLOY-10). | Product |
| OQ-11 | What exactly is Max's "10x usage"? | Allowance values are operator configuration, not product facts. | Max allowance defaults to 10 times Pro's money allowance; documented in the console. | Product |
| OQ-12 | Storage quotas (5 GB / 100 GB / 1 TB) are advertised but not enforced in the reference. | Advertised target. | Enforce at upload time per payer; over quota, new uploads are blocked while existing content stays readable and editable; warnings at 80% and 95% (PRD-FILE-08, Spec BILL-040). | Product, Engineering |
| OQ-13 | Should the legacy free quota (10 documents and 10 AI messages) be carried over? | Present in the reference as legacy, superseded by usage allowances. | Drop it. | Product |
| OQ-14 | Outlook support level and IMAP priority. | Outlook is implemented but flag-gated and unverified; IMAP and generic providers are "planned". | Outlook experimental in Phase 3; IMAP/SMTP (or JMAP) in Phase 4, earlier if self-host demand requires. | Product |
| OQ-15 | Can a user belong to more than one team? | The reference allows one team per user; joining another requires leaving. | Keep one team per user for parity; design data model to allow several later. | Product, Engineering |
| OQ-16 | Should Auto mode (chat or code routing) be generally available? | Employee-only experiment in the reference. | Experimental flag, Phase 4. | Product |
| OQ-17 | Rate limits on MCP and API. | The reference has none on MCP tool calls. | Add configurable limits (PRD-MCP-03). | Engineering |
| OQ-18 | Licence for the re-implementation. | The reference uses a strong network copyleft licence; the re-implementation is independent and may choose. | Decide before Phase 1 code freeze with legal; options: permissive (Apache 2.0), weak copyleft, or the same network copyleft for community alignment. | Legal |
| OQ-19 | How close may the UI be to the reference? | Goal G2 requires UX parity; trade dress risk R-03. | Match interaction model, layout logic, keyboard model and short labels; differ in brand, logo, icon set, illustrations, default theme details and marketing. | Legal, Design |
| OQ-20 | Default accent colour. | Older screenshots show orange; the reference default theme uses a muted blue accent and orange appears in optional themes and accents. | Muted blue default (PRD-SET-02) with orange-family themes available, subject to OQ-19. | Design |
| OQ-21 | Product name, Assistant handle and domain conventions. | Must not use the reference brand. | Choose a new name; Assistant handle configurable, default `@assistant`. | Product, Legal |
| OQ-22 | Include WhatsApp linked devices at all? | Terms-of-service risk (R-05); disabled in the reference's production. | Phase 4 experimental, off by default; evaluate the official business messaging API instead. | Product, Legal |
| OQ-23 | Timing of SAML and SCIM. | Not supported by the reference. | Phase 4 unless enterprise demand pulls it into Phase 3. | Product |
| OQ-24 | Which reference experiments count toward parity? | Gantt, channel labels, universal input, activity feed, agent DMs, DOCX/PPTX/PSD/design editors, databases and forms are flag-gated in the reference. | Databases, forms, DOCX viewer and activity feed count for Phase 3 parity; others are Phase 4 or P2. | Product |
| OQ-25 | Offer an importer from a reference instance? | Customers may want to migrate. | Not in scope for v1; revisit after Phase 3 using only public export formats. | Product, Legal |
| OQ-26 | Default identity approach: built-in auth module or an external identity provider? | Spec §6 allows both. | Built-in module by default; documented integration with an external OIDC provider for enterprises. | Engineering |
| OQ-27 | Default search backend for the Team tier. | OpenSearch adds memory pressure on a single 16 GB VPS. | OpenSearch on Team and above; PostgreSQL full-text on Starter; switchable without data loss. | Engineering |
| OQ-28 | Keep the legacy "public" channel type? | The reference keeps it for compatibility only. | Drop; team and private channels cover the use cases. | Product |
| OQ-29 | Account deletion window. | The reference states a 7-day cleanup target. | 7 days (PRD-SET-03); configurable shorter. | Legal |
| OQ-30 | Free-plan email footer wording and opt-out. | The reference adds a branded footer to Free mail. | Keep the behaviour with the new brand; operators may disable it. | Product |

## 14. Glossary

| Term | Meaning in this PRD |
|---|---|
| The Product | The unified team workspace specified here. |
| The Assistant | The built-in default AI agent, @-mentionable with a configurable handle (default `@assistant`). |
| Agent | Any AI actor (the Assistant, a custom agent, a routine run, a coding agent, or an external MCP client acting through tools). Agents are first-class users bounded by the permissions of the person they act for. |
| Agent session | One conversation or run of an agent with a durable transcript. |
| Runtime | Where an agent executes: in-process, a hosted Code Sandbox, a third-party cloud coding service, or the local agent daemon. |
| Local agent daemon | A helper the user runs on their own computer that connects outbound to the Product and runs ACP-compatible coding agents locally. |
| ACP | Agent Client Protocol, a public protocol between agent clients and coding agents. |
| MCP | Model Context Protocol, used by the Product both as a server (external AI clients act in the workspace) and as a client (agents call external tools). |
| Entity (item) | Any addressable object in the workspace: document, task, message, email thread, file, event, call, record, session and so on. |
| Block / area | A product area with its own surface (Email, Chat, Tasks, Docs and so on). |
| Mention | An inline @-reference to a person or entity that is stored as a reference edge and rendered as a live chip. |
| References | The list of places that mention or embed an entity (backlinks). |
| Split | One of several side-by-side panes on desktop, each with its own history. |
| Home | The unified attention feed (called Notifications on mobile). |
| Signal / Noise | Two-way triage of incoming items; Signal holds what matters, Noise the rest. |
| Discussion | A message thread attached to a non-channel entity (document, task, project, CRM record, call). |
| Project | A user-facing grouping of tasks around a goal; distinct from a Drive folder. |
| Folder | A Drive container whose permissions inherit to its contents. |
| Property | A typed attribute on an entity; system, custom personal, custom team or database column. |
| Tag | A coloured label in one namespace across all entity kinds, personal or team scoped. |
| Routine | A saved agent prompt run on a schedule or on workspace activity. |
| Skill | A saved instruction document that agents load on demand. |
| Snippet | A reusable markdown block inserted with `;`. |
| Memory | Markdown context about a user (and, as target behaviour, a team) given to agents. |
| Booking link | A public page where outside people book time with one or more hosts. |
| Pipeline | A board or table of CRM deals moving through stages. |
| Operator | Whoever installs and runs an instance. |
| Instance admin | A user with operator console access. |
| Single-organisation mode | Self-host tenancy with billing off and operator-defined limits. |
| Multi-tenant mode | SaaS tenancy with many workspaces and billing on. |
| Tier (Starter, Team, Growth, Scale) | Reference deployment sizes in section 5.2. |
| BYO key | A provider API key supplied by the operator, a user or an agent owner instead of the operator's default. |
| Optional component | A platform component that can be absent with graceful degradation (section 5.7). |
| Target behaviour | Behaviour the reference advertises but does not fully implement, specified here to be built. |
| Experimental | Behaviour that exists in the reference only behind a flag or without verification; built behind a flag here. |
| P0 / P1 / P2 | Must / should / could priority within a phase (section 1.1). |
| RPO / RTO | Recovery point objective (maximum data loss) and recovery time objective (maximum time to restore). |
| p50 / p95 / p99 | Latency percentiles: the value below which 50%, 95% or 99% of measurements fall. |
