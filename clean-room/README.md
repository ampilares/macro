# Clean-room implementation pack

Requirements and original visual studies for an independently implemented collaborative workspace hosted on operator-controlled VPS infrastructure.

## Start here

| Artifact | Purpose |
| --- | --- |
| [specs.md](specs.md) | Behavioral contracts, data/integration boundaries, UI conventions, VPS requirements, acceptance criteria, and evidence |
| [prd.md](prd.md) | Product goals, parity scope, workflows, delivery sequence, and release gates |
| [Visual catalog](visuals/index.html) | Browse 32 screens in annotated wireframe, light mockup, or dark mockup modes |
| [Visual overview](visuals/overview.html) / [PNG](visuals/exports/overview.png) | Contact sheet of selected desktop and phone layouts |
| [Export manifest](visuals/manifest.json) | All 96 base images with dimensions, mode, theme, and reference evidence labels |
| [Rendering report](visuals/validation.json) | Browser capture counts and exercised local interactions |

Open `visuals/index.html` in a browser. It needs no installation, server, account, or internet connection. Choose a screen in the left catalog, then use the controls above it to change presentation, theme, or example state. PNGs are available for static review.

## Interpretation and limits

These are **new source-informed mockups**, not screenshots of the running reference application. They translate inspected code, design rules, guides, and checked-in screenshots into visual references. The analyst has seen source; this is not a claim of source-blind analysis. The intended handoff is to an implementation team that works from the neutral requirements and creates its own code and assets.

The functional specification remains authoritative. A control omitted from a representative frame is not removed from parity scope. The catalog covers the primary compositions, not every format operation, ribbon, integration, permission combination, onboarding step, native OS state, or administration screen. Calls/media, collaboration, authentication, OAuth, file conversion, AI execution, routine scheduling, keyboards, and VPS operations are not executed by this gallery.

All sample people, organizations, messages, records, document text, artwork, and icon geometry are synthetic/original. No original screenshot is redistributed in this folder. The neutral “Workspace” mark is a placeholder. System fonts are used locally; exact metrics depend on the operating system.

## Evidence and reconciliation

Labels describe the **reference surface**, not proof of pixel parity: **S** = inspected source/design tokens; **D** = repository guides/contracts; **V** = visually inspected checked-in screenshot. Requirements marked **T** propose target behavior rather than measured reference behavior.

The initial analysis inspected three images; the visual follow-up additionally inspected six README screenshots. Paths below are relative to the repository root, outside this folder.

| Reference image | Applied evidence |
| --- | --- |
| `docs/agent-guide/images/joined-view-tabs.png` | Shared tab grouping and header treatment |
| `docs/agent-guide/media/command/create-menu-polished-light.png` | Creation launcher and light controls |
| `docs/agent-guide/media/mobile-insets/crm-phone.png` | Phone framing, content inset, navigation conventions |
| `.github/readme/tasks-list.png` | Task list density, properties, list/detail composition |
| `.github/readme/email-thread.png` | Mailbox context and stacked message cards |
| `.github/readme/messages-channel.png` | Timeline, reactions/replies, persistent composer |
| `.github/readme/docs-prd.png` | Reading column, document hierarchy, task properties, discussion |
| `.github/readme/crm-board.png` | Stage lanes, deal cards, counts, contextual records |
| `.github/readme/agents-task-handoff.png` | Assistant/task handoff context, not an exact agent layout |

Some older screenshots use orange accents, separate view buttons, or fixed information panels. Where those conflict, mockups follow newer inspected rules: blue accent tokens, grouped pill tabs, 32px header controls with 8px spacing, a 56px rail, and details that start closed and open as a floating panel. Palettes follow the token families in `specs.md` section 4.2. Content lengths, editor object positions, video placeholders, and welcome artwork are illustrative.

## Screen coverage

Every numbered screen has a file in [dark mockups](visuals/exports/mockups-dark/), [light mockups](visuals/exports/mockups-light/), and [wireframes](visuals/exports/wireframes/). Desktop exports are 1440 × 900; phone exports are 390 × 844. The gallery adapts to available width; exports provide fixed-size comparison.

| Screens | Surface | Requirements |
| --- | --- | --- |
| 01 | Home, notification feed, AI entry | F02–F04 |
| 02–03 | Task list/board entry and detail | F06, F13 |
| 04 | Collaborative document | F06 |
| 05–06 | Mail inbox/thread and compose | F15 |
| 07 | Chat channel, replies, composer | F14 |
| 08–09 | Drive and workspace search | F04–F05 |
| 10–12 | Calendar, booking links, active call | F16–F18 |
| 13–15 | Customer pipeline, database table, form builder | F19–F21 |
| 16–18 | Agent conversation, pull request review, routine | F22–F24 |
| 19–25 | Spreadsheet, PDF, canvas, presentation, vector/raster design, word processing | F07–F12 |
| 26–27 | Appearance settings and sign-in entry | F01, F27 |
| 28–32 | Phone notifications, task, chat, public form, compose | F03, F13–F15, F21, F28 |

[Interaction studies](visuals/exports/interactions/) additionally show Create, Share, Search, floating details, task board, chat thread, phone details/Create sheets, and empty/loading/error/read-only treatments. State treatments are generalized studies, not captured reference states. Editor-specific failures and actual view-only capabilities must follow the specification.

### Wireframe key

Wireframes retain mockup geometry with grayscale surfaces, simplified controls, dashed boundaries, and numbered regions:

1. Global rail or phone safe area.
2. Context navigation, pages/layers, or phone header.
3. Desktop view header.
4. Main work area.
5. Composer or editor toolbar.
6. Canvas, page, grid, or state treatment.
7. Inspector/comments where applicable.

Numbers describe structural roles, not tab order or prescribed DOM architecture. Long content scrolls within the work area. Phone layouts replace desktop sidebars with full-width content, compact headers, and a dock or composer. Status-bar graphics are illustrative. Keyboard resizing, gestures, and real device safe areas need runtime verification during implementation.

## Local demonstration interactions

Everything stays in memory; reload restores fixtures. The gallery has no persistence, network requests, analytics, clipboard writes, or real send/merge/publish operations.

| Control | Demonstration |
| --- | --- |
| Rail, catalog, linked items | Switch sample screens |
| Tasks List / Board | Switch layout; open task detail |
| Create / phone plus | Open launcher/sheet; select an item type |
| Share | Show people, roles, and link entry |
| Details | Floating desktop panel or phone sheet, initially closed |
| Search / Ctrl+K or Cmd+K | Search dialog and sample results |
| Chat replies / email Reply | Thread dialog or reply composer |
| Appearance | Change local theme/preferences |
| Review / Merge | Confirmation without external action |
| Phone form | Required-field validation and preview completion |
| Sample database names / spreadsheet cells | Display editing; no formula recalculation |
| Other controls | Local selection or visual-reference notice |

Escape dismisses dialogs. Dialogs trap focus and return it to the prior control when possible. Reduced-motion and visible keyboard-focus support do not constitute a completed accessibility audit. The generic read-only study disables fixture text inputs; it is not an authorization implementation.

Phone-to-desktop links open a desktop study when no phone fixture exists. This is a catalog shortcut, not specified product behavior. Providers, native features, and gated editors follow the requirements, regardless of illustrative buttons.

## Rebuilding exports

The gallery has no build step. Regenerate screenshots with Node.js and an independently installed Playwright or Playwright Core package:

```powershell
# Optional when the package is outside normal Node module resolution:
$env:PLAYWRIGHT_MODULE = '<absolute path to playwright or playwright-core>'
# Optional when using existing Chrome instead of Playwright-managed Chromium:
$env:CHROME_PATH = '<absolute path to Chrome executable>'
node clean-room/visuals/render.cjs
```

The script launches an isolated headless browser, loads local files, exports three variants per screen and selected interactions, exercises core local flows, and writes the manifest/report/overview. It does not open the reference app, read a personal browser profile, or contact production services. The browser must already be available; no packages or browsers are installed by the script.

The rendering report validates these studies only. It is not evidence that the reference application or future reimplementation passes the parity acceptance suite in `specs.md`.
