# Product requirements: VPS-hosted collaborative workspace

Version: 1.0 · 2026-10-28 · Reference revision: `b5e0278b4ea884687ed5d5b57b27f062934d16e1`

Implementation companion: [Neutral specification](specs.md).

## 1. Product decision

Build an independently implemented collaborative workspace that preserves the reference application's functionality and UI/UX while running on operator-controlled virtual private servers. Users should retain the same work patterns across documents, files, tasks, projects, messaging, email, calendar, booking, calls, CRM, structured data and AI. Operators should install, upgrade, back up and restore it without an AWS or Cloudflare account.

The requested deliverable here is the product and behavioral definition, not a port, deployment or working replacement. The analysis used source and repository documentation, plus selected existing screenshots. It did not independently exercise an authenticated running application. The documents are suitable inputs to independent implementation, but are not evidence of a source-blind analysis process or completed pixel-perfect parity.

## 2. Problem and opportunity

The reference combines work that otherwise spans a file editor, task tracker, team messenger, email client, calendar, CRM and AI workspace. Its value comes from the relationships between those surfaces: an email can become a task; a meeting can have shared notes; a document can contain a live database; a search result can open an exact message; an agent can work on the same permission-controlled entities as a person.

The current deployment assumes cloud-specific execution, queues, storage, routing and collaborative state. Running its development containers on a VPS would not establish an independent production deployment. The replacement must preserve the connected experience while providing an operator-controlled data and runtime foundation.

## 3. Goals

| ID | Goal | Success condition |
| --- | --- | --- |
| G1 | Preserve product breadth | Every F01–F30 area in `specs.md` has a disposition, implementation and passing acceptance evidence; gated features remain in scope. |
| G2 | Preserve interaction familiarity | Navigation, split ownership, list/detail behavior, keyboard workflow, mobile sheets and editor conventions match approved reference captures. |
| G3 | Run without managed AWS/Cloudflare infrastructure | A fresh operator can install and use the core profile without either provider's credentials, SDK-backed runtime requirements or managed state. |
| G4 | Preserve trust in shared work | Permissions apply consistently to UI, APIs, search, agents, files and live subscriptions; acknowledged work survives restarts. |
| G5 | Make operation practical | Documented installation, diagnostics, upgrades, backups and fresh-host recovery are exercised on a declared VPS profile. |
| G6 | Support independent implementation | Requirements are behavior-based and newly written; original code, prompts, schemas and branded assets are not implementation templates. |

## 4. Users and jobs

| User | Primary jobs |
| --- | --- |
| Individual contributor | Capture information, find work, manage tasks/email/calendar, edit files, communicate and ask AI for help without losing context. |
| Team member/project lead | Coordinate projects and conversations, collaborate on documents, share meeting notes, follow notifications and inspect changes. |
| Customer-facing team member | Maintain companies/contacts, associate communications and work, manage pipeline records and book meetings. |
| Analyst or process owner | Build tables/forms, collect responses, inspect live answers, work in spreadsheets and export information. |
| Developer/agent user | Connect repositories, run coding sessions, inspect changes/previews and review pull requests with explicit permissions. |
| Guest/respondent | Join an authorized call, book a meeting or answer an allowed form without gaining access to unrelated workspace data. |
| Team administrator | Manage members, invitations, connections, defaults, entitlements and shared resources. |
| VPS operator | Install and configure the system, observe failures, rotate credentials, upgrade safely and restore data. |

Team membership, resource ownership and infrastructure administration are separate roles. No role should receive extra content access merely because the interface is convenient to implement that way.

## 5. Scope and parity policy

### 5.1 What “same functionality and UI/UX” means

Preserve the capability set, the available actions and their conditions, navigation paths and focus behavior, content formats within documented limits, collaboration semantics, permissions, failure recovery, and desktop/touch/native differences. Preserve the compact visual hierarchy and measurable control geometry. Recreate branding, artwork and copy independently.

Current source, feature gates and runtime evidence outrank historical examples in guides. Do not reproduce an acknowledged bug merely because it exists in a screenshot or troubleshooting note. Do preserve intentional constraints such as databases without public share links, member-versus-anonymous form behavior and provider-specific capability limits.

Feature-gated or pilot functionality is part of the full-parity backlog. A disabled flag is not evidence that a feature can be dropped. Conversely, a directory or tool name alone does not prove a deployed working feature. Until it is verified, label it accordingly.

### 5.2 Complete feature groups

| Product area | Requirements | Specification IDs |
| --- | --- | --- |
| Workspace foundation | Authentication, onboarding, teams, sharing/access requests, shell/splits, quick creation, command navigation, feature tours, Home, notifications, activity, search/favorites and settings | F01–F04, F27 |
| Content and editors | Files/folders, uploads/conversion, rich documents/tasks/skills/snippets, PDF, canvas, spreadsheets, Word files, presentations and design files, discussions/history/versions and export | F05–F12 |
| Coordinated work | Tasks/subtasks, projects, list/board/Gantt, saved views, companies/contacts/pipelines, properties/tags, databases/relations/formulas/live answers and forms/polls | F13, F19–F21 |
| Communication | Channels/DMs/threads, email and multiple inboxes, send later and email snoozes, calendars/recurrence/notes, booking/availability, calls/guests/recordings/transcripts | F14–F18 |
| Assisted work | Chat/contextual AI, personal memory/context compaction, models/effort/tools/reviews, coding sessions/repositories/previews, pull requests, skills/bots/routines, connectors/imports and linked external messaging | F22–F26 |
| Platform delivery | Desktop and mobile web, native desktop/iOS/Android capabilities, public guest pages, developer API/SDK/MCP, install/update/help surfaces | F28–F29 |
| Independent hosting | Install/configure, durable data and jobs, realtime sync, media/runners, secrets, telemetry, backup/restore, upgrade and recovery | F30 |

### 5.3 Explicit boundaries

- Full parity does not require copying the original internal architecture, database schema, CRDT protocol or service count.
- Hosting independence does not remove integrations with users' email/calendar/repository accounts. A feature that inherently uses an external provider still needs valid consent and credentials.
- Offline use covers supported cached content and local drafts, not all provider-dependent operations. No air-gapped full-feature claim is made.
- File-format support must retain documented limitations; this is not a commitment to every feature of the originating professional editor.
- Reference prices, promotions, named model versions and deployment-specific targeting are configurable policy, not permanent requirements.
- A reduced early release is permitted as a delivery milestone, but must not be described as the completed full-parity product.
- Existing-account/data migration, exact public SDK compatibility and branded public-site/staff-tool replication need explicit compatibility decisions. They are tracked work, not silently assumed complete.

## 6. Primary end-to-end experiences

### J1. Establish a workspace

A new user signs in, resumes setup if interrupted, connects optional accounts, joins or creates a team and lands at the intended work item or Home. Missing providers do not prevent local documents/tasks/messaging. An administrator can invite more members without an arbitrary free-team size cap. Operator-assigned entitlements support a private installation; commercial billing remains a configurable integration.

Acceptance: P01 and P26, including expired codes, canceled OAuth, pending invitations, role changes, logout/account switch and unavailable billing/connector services.

### J2. Work across related items

A user opens a task, a linked supporting document and a conversation in separate splits. Navigation inside one split preserves the others. Following a mention already open elsewhere focuses that existing item and targets the relevant location. Returning to a list retains its filters and scroll. The same work on a phone uses full-screen details and back navigation, with reachable controls above the keyboard.

Acceptance: P02–P03 and the visual matrix; test duplicate ownership, concurrent opens, narrow panes, history and unsent drafts.

### J3. Collaborate on content

Two users edit a document, add mentions/comments, embed a database and inspect history. The database retains its independent access rules. A disconnected participant reconnects without losing edits. Another participant with view-only access cannot mutate the source through an editor, export endpoint or AI tool. Users can upload and edit supported specialist files with clear warnings for incompatible constructs.

Acceptance: P04–P11 and P30, including original-download preservation, two-user conflicts and format round trips.

### J4. Turn communication into action

A user reads a mail thread or channel discussion, creates a contextual task, assigns it and associates it with a project or customer. The source reference remains navigable. They reply or schedule an email, snooze a conversation and receive a notification when it returns. Provider failures preserve drafts and distinguish uncertain delivery from a definitive failure.

Acceptance: P12–P14; retries cannot duplicate tasks/messages/sends, and privacy changes propagate to associations.

### J5. Arrange and hold a meeting

A host configures availability and a personal or team booking link. A guest selects a valid slot in their timezone. The booking reserves hosts atomically, creates the provider event and supplies a private management receipt. Participants join the call, chat and access permitted notes/recordings afterward. Notes link to the correct occurrence and can optionally be shared with a team.

Acceptance: P15–P17; test daylight-saving changes, simultaneous bookings, reschedule after configuration changes, restricted networks, media permission denial and guest access revocation.

### J6. Run a structured workflow

A process owner creates a database and form, configures types/choices/relations, arranges sections and qualification gates, and previews without creating real responses. Members or anonymous visitors respond according to the audience. Authorized editors inspect results, use a board/timeline or live answer, and export data. CRM pipelines reuse structured editing without duplicating companies or creating phantom standalone databases.

Acceptance: P18–P20; data conversion preserves originals, response privacy holds, and concurrent edits/undo behave predictably.

### J7. Delegate to an agent

A user opens an unsent contextual prompt, chooses a supported model/runtime and sends it. They can observe tool progress, answer questions, approve applicable account-sensitive work, stop or queue follow-ups, and inspect the actual outcome. Coding mode adds repository changes, previews and linked pull requests. Routines repeat authorized work with durable run history and deduplicated triggers.

Acceptance: P21–P24; unauthorized tools fail, ambiguous work is not reported complete, and restart does not repeat an external effect.

### J8. Operate and recover the service

An operator installs a pinned release on a clean Linux VPS, configures a domain and secrets, creates the first account, and enables optional services. After a simulated host loss, they restore onto another host and verify documents, file hashes, sharing, collaborative edits and pending work. They can identify queue/provider failures and upgrade without erasing state.

Acceptance: P29–P30 and Q07/Q10. No AWS/Cloudflare account or mandatory hosted analytics is used in the core test.

## 7. Experience requirements

The interface must preserve the reference's narrow global rail, contextual navigation, dense lists and focused editors. Desktop uses independent resizable splits, single-row collection headers, compact rounded controls and floating information panels. Touch uses a bottom dock, full-screen details, safe-area-aware sheets and keyboard-aware composers. Do not replace these with a generic dashboard or a desktop layout squeezed onto a phone.

Preserve keyboard-first interaction while letting text fields own typing and text-edit shortcuts. Common controls need clear names, focus handling, keyboard alternatives and visible state. Menus and drawers return focus appropriately. Loading/refetch/paging must not erase the current list or disrupt an active draft. Optimistic changes reconcile or roll back precisely. Empty, denied, unavailable, offline, pending, partial and failed states require distinct presentation.

Use the measurable anchors in `specs.md` section 4, then complete controlled reference captures. A visual match on one desktop screen is insufficient: test light/dark themes, narrow splits, phone/tablet sizes, software keyboards, reduced motion and platform-specific navigation. Native media/share/notification behavior needs real-device evidence.

## 8. Deployment and business constraints

The core installation must own its relational data, files, collaboration history, job state, identity and TLS configuration. It must start without optional model, calendar, payment or repository credentials. Missing integrations show setup guidance and fail only dependent operations.

Use a modular application and a small number of separately managed runtime roles. An acceptable full deployment consists of HTTPS/web, API, realtime sync, durable workers, database, persistent file storage, optional cache/search, media/recording/transcription and isolated coding runners. Resource-heavy and untrusted jobs need isolation and limits; they must not starve interactive editing or share production secrets with arbitrary code.

Single-VPS hosting is a supported topology for a qualified workload, not a high-availability promise. The full feature set may require a separate runner/media VPS as demand grows. No hardware size, monthly price or concurrency ceiling is proven by this analysis. Measure the proposed small-team workload before procurement or capacity claims.

A private installation can assign plans/quotas directly. If billing is enabled, preserve eligibility, subscription-management, quota/usage and reliable payment-reconciliation behavior. Model/catalog/pricing and external provider policies remain configurable. Disabling commercial billing must not remove workspace administration or create unlimited uncontrolled job execution.

## 9. Delivery sequence

Sequence controls dependencies; it does not rank later features out of the final product. Do not assign dates until the editor corpus, integration scope and capacity profile have been qualified.

| Stage | Deliverables | Exit gate |
| --- | --- | --- |
| 0. Freeze evidence | Runnable isolated reference, flag/role matrix, current routes/shortcuts, screenshot set, editor corpus, API/migration decisions | All U01–U10 have an owner and concrete resolution; no claimed live evidence from static analysis |
| 1. Foundation | VPS install, auth/team/access, shell/splits/mobile navigation, entities/files, durable jobs, realtime foundation, backup/restore | P01/P02/P04/P29/P30 foundation checks pass; restore works before valuable user data |
| 2. Daily collaboration | Markdown/PDF/canvas, tasks/projects, messaging, notifications/search, settings, common sharing/history | P03/P05–P07/P12/P13 and applicable P26 pass across roles and devices |
| 3. Connected communication | Mail, calendar/notes, booking, calls/recording/transcripts, provider sync/recovery | P14–P17 pass with controlled provider accounts and failure injection |
| 4. Structured and assisted work | CRM, databases/forms, AI/tool reviews, connectors/imports, skills/bots/routines, coding/reviews/previews | P18–P24 pass, including cross-account access and repeated trigger recovery |
| 5. Specialist and platform parity | Spreadsheet/DOCX/PPTX/design corpora, external messaging qualification, native clients, developer compatibility and public surfaces | P08–P11/P25/P27/P28 pass; unresolved format/provider exceptions explicitly approved |
| 6. Operational release | Full workload tests, security/access matrix, monitoring/runbooks, upgrade/rollback and fresh-host restore | All applicable P01–P30 and Q01–Q10 have recorded results; no hidden scope reduction |

Specialist editors and native clients may need development to start earlier because of their size. Stage order is an integration order, not a direction to postpone their technical qualification.

## 10. Success metrics and release gates

| Metric | Proposed target |
| --- | --- |
| Functional coverage | Every mandatory area F01–F30 mapped to an implementation and acceptance result; 100% of required scenarios passing for the declared release scope |
| Permission safety | Zero unresolved cross-account/team/private-data exposure findings in A01–A12 tests |
| Data integrity | No lost acknowledged edits or duplicated logical external effects in the defined crash/retry matrix |
| UI/UX fidelity | Approved reference/replacement comparisons for each primary surface and interaction state; no unexplained navigation/focus/layout differences |
| Responsiveness | Q01–Q03 targets under the declared small-team workload; publish measured results and exclusions |
| Provider recovery | Ambiguous sends/bookings/charges reconcile without blind retry; failed connections preserve drafts and prior links |
| Restore | Proposed RPO ≤15 minutes and RTO ≤4 hours, demonstrated on an independent fresh host |
| Hosting independence | Core profile passes fresh-install/restart/restore with no AWS/Cloudflare credentials or managed runtime |
| Operability | A second operator can follow the release runbook for installation, diagnostics, backup/restore and upgrade without undocumented steps |

Targets are proposals, not facts about the reference or a guarantee that any VPS will meet them. Product engagement/adoption metrics should be defined during a pilot; no customer counts, usage baseline or financial forecast was supplied.

## 11. Risks and product responses

| Risk | Product response |
| --- | --- |
| Scope is substantially larger than a document app | Keep the complete feature register; release in named stages without relabeling an MVP as parity. |
| Advanced editors dominate effort and fidelity risk | Qualify representative imports, operations, collaboration and exports early; retain originals and clear limitations. |
| Existing guides contain stale routes or conflicting controls | Prefer current registration/shared UI rules; resolve with controlled live observations and record the final decision. |
| Source analysis cannot establish production availability | Keep S/D/V/G/U evidence distinctions; qualify gated/provider features explicitly. |
| Collaboration/queues lose work during a simplified VPS port | Make durable acknowledgements, outbox/replay, idempotency and crash testing release gates. |
| Provider side effects are ambiguous | Persist intent and reconciliation identifiers; distinguish pending/uncertain/failed from confirmed success. |
| Calls fail behind real networks or overwhelm the host | Qualify TURN/media routing and recording separately; isolate workloads and measure resource use. |
| AI/coding expands credential and tenant risk | Apply the same authorization contracts, explicit acting identities, bounded isolated runners and authenticated previews. |
| Single host is a failure domain | Independent backups, tested restore and a documented path to separate database/media/runner hosts. |
| Native features are mistaken for responsive web parity | Maintain platform-specific gates for sharing, notifications, calls, downloads, background/process death and updates. |
| Migration is assumed to be a database copy | Decide supported exports/imports and preserve identity/access/version semantics through independent adapters. |

## 12. Decisions still required

The following decisions do not block this specification, but must be resolved before their implementation/release gates:

1. **Deployment envelope:** intended users, document/mail volume, concurrent calls/agents, backup destination, availability and VPS budget. Until then, use the explicitly proposed small-team test workload.
2. **Initial release scope:** select stages for early releases while retaining F01–F30 as the full-parity destination.
3. **Identity and integration configuration:** signup policy, email delivery, provider accounts/consent, model/runtime access and native push credentials.
4. **Compatibility and migration:** fresh installation versus migration of existing accounts/content; public link and API/SDK compatibility commitments; treatment of historical collaborative versions.
5. **Specialist formats:** frozen operation/corpus coverage and acceptable warnings for unsupported file constructs.
6. **Native distribution:** target desktop/mobile platforms, independent signing/update distribution and supported OS versions.
7. **Auxiliary surfaces:** desired public marketing/help site depth, internal invite/promotion tools and operator-facing diagnostics.

The default assumptions are a private small-team deployment, web plus eventual native parity, configurable provider integrations, original branding, no existing-data migration until specified, and no requirement to retain private implementation protocols.

## 13. Handoff and completion definition

Implementation handoff consists of this PRD, the neutral specification, a completed parity/evidence register, controlled visual captures and synthetic behavior/file fixtures. Developers should build against behavioral contracts and acceptance scenarios, with access to source evidence restricted according to the chosen independent-implementation process.

Full product completion requires all mandatory feature areas, provider/native qualification, visual comparisons and operational gates to pass. Any exception must name the missing behavior and its user impact. A feature flag left off, a mock screenshot, successful type checking, or a working Docker startup alone does not prove parity.

For this documentation task, the delivered analysis establishes the feature inventory, target behavior, VPS architecture and verification plan. Runtime validation, implementation, deployment and migration remain subsequent work and are not represented as already completed.
