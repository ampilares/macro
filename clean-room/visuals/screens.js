/* Independent presentation fixtures. No application code or data is imported. */
const screens = [
  ['home','01','Home','Foundation','F02–F04','D','Mixed work feed and contextual AI composer.'],
  ['tasks','02','Tasks · list','Work','F13','S + D + V','Compact grouping and current single-row controls; older screenshot uses different tabs.'],
  ['task','03','Task · detail','Work','F06/F13','D + V','Title properties and discussion; contemporary floating information panel.'],
  ['document','04','Document · collaboration','Content','F06','D + V','Centered reading column, mentions and presence; original document content.'],
  ['mail','05','Email · inbox','Communication','F15','D + V','Mailbox navigation and a selected thread; message-card composition from reference.'],
  ['compose','06','Email · compose','Communication','F15','D','Recipients, draft body, attachments and send-later entry.'],
  ['chat','07','Chat · thread','Communication','F14','D + V','Message timeline, reply rails, reactions and persistent composer.'],
  ['drive','08','Drive · files','Content','F05','D','Folder tree, file rows and creation entry.'],
  ['search','09','Search · results','Foundation','F04','D','Type facets and content hits with explicit target context.'],
  ['calendar','10','Calendar · week','Communication','F16','D','Calendar sources, time grid and event blocks; sample week is illustrative.'],
  ['scheduling','11','Scheduling · booking links','Communication','F17','D','Booking management and availability summary.'],
  ['calls','12','Call · active','Communication','F18','D','Participant stage, call chat, media controls and recording entry.'],
  ['crm','13','Customers · pipeline','Work','F19','D + V','Pipeline board geometry from screenshot; current pipeline semantics.'],
  ['database','14','Database · table','Work','F20','D','Typed columns, view controls and sample name-cell editing.'],
  ['form','15','Form · builder','Work','F21','D','Centered question canvas, required fields and response tabs.'],
  ['agents','16','Agent · conversation','Assisted work','F22','D','Tool timeline and a review waiting for the current user.'],
  ['reviews','17','Reviews · changes','Assisted work','F23','D','Pull request metadata, checks and file diff.'],
  ['routines','18','Routine · overview','Assisted work','F24','D','Trigger summary, instructions, delivery and run history.'],
  ['spreadsheet','19','Spreadsheet','Editors','F09','D','Formula/ribbon/grid/sheet structure with chart and range selection.'],
  ['pdf','20','PDF · annotation','Editors','F07','D','Page navigation, markup toolbar and signature placement.'],
  ['canvas','21','Canvas','Editors','F08','D','Spatial nodes, connectors and viewport tools.'],
  ['presentation','22','Presentation','Editors','F11','D','Slide rail, toolbar, slide stage and object inspector.'],
  ['design','23','Design · vector canvas','Editors','F12','D','Layer tree, canvas and inspector; illustrative object geometry.'],
  ['raster','24','Design · raster layers','Editors','F12','D','Tools, layer list, composition and appearance inspector.'],
  ['word','25','Word-processing document','Editors','F10','D','Paginated document and formatting ribbon.'],
  ['settings','26','Settings · appearance','Foundation','F27','S + D','Grouped navigation, theme choices, language and preference controls.'],
  ['welcome','27','Sign-in & setup','Foundation','F01','D','Focused passwordless entry; setup continuation is illustrative.'],
  ['mobile-home','28','Phone · notifications','Mobile','F03/F28','D','Notification-only feed, Signal/Noise and bottom navigation.'],
  ['mobile-task','29','Phone · task','Mobile','F13/F28','D','Full-screen task, wrapping properties and a details sheet; keyboard behavior is not simulated.'],
  ['mobile-chat','30','Phone · conversation','Mobile','F14/F28','D','Full-screen thread and bottom composer; no desktop sidebar.'],
  ['mobile-form','31','Phone · respondent','Mobile','F21/F28','D','Focused public section-by-section response flow.'],
  ['mobile-compose','32','Phone · compose','Mobile','F15/F28','D','Full-screen draft, recipients, attachment and send entry.'],
].map(([id,number,title,group,features,evidence,note])=>({id,number,title,group,features,evidence,note,mobile:id.startsWith('mobile-')}));

const iconPaths = {
  home:'M3 10 12 3l9 7v10H6V10m3 10v-7h6v7',
  file:'M6 3h8l4 4v14H6zM14 3v5h5M9 12h6m-6 4h6',
  folder:'M3 6h7l2 3h9v11H3z',
  mail:'M3 5h18v14H3zM3 6l9 7 9-7',
  chat:'M4 4h16v12H9l-5 4zM8 8h8m-8 4h5',
  tasks:'M3 6l2 2 3-4M11 6h10M3 13l2 2 3-4m3 2h10M4 20h3m4 0h10',
  calendar:'M4 5h16v16H4zM8 2v6m8-6v6M4 10h16m-12 4h2m4 0h2m-8 4h2',
  agent:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  people:'M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M2 21v-3a5 5 0 0 1 10 0v3m4-17a4 4 0 0 1 0 8m0 3a5 5 0 0 1 5 5v1',
  phone:'M5 3h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 2-2 3-4 2C8 19 5 16 3 7c0-2 0-4 2-4z',
  search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
  plus:'M12 4v16M4 12h16',
  settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2',
  filter:'M3 6h18M6 12h12m-9 6h6',
  more:'M4 12h1m6 0h1m6 0h1',
  chevron:'m9 5 7 7-7 7',
  back:'m15 5-7 7 7 7',
  info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 7v7m0-11v1',
  share:'M12 16V3m-5 5 5-5 5 5M5 12v9h14v-9',
  split:'M3 3h18v18H3zM12 3v18',
  check:'m5 12 4 4L20 5',
  clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v6l4 2',
  link:'m9 15 6-6M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
  clip:'m8 12 7-7a4 4 0 0 1 6 6L10 22a6 6 0 0 1-8-8L13 3m-7 13 9-9',
  arrow:'M12 20V4m-6 6 6-6 6 6',
  board:'M3 4h5v16H3zm7 0h5v10h-5zm7 0h4v13h-4z',
  grid:'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18m6-18v18',
  mic:'M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0zM5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8',
  video:'M3 6h12v12H3zm12 5 6-4v10l-6-4',
  monitor:'M3 3h18v14H3zm9 14v4m-5 0h10',
  branch:'M6 4v14m0-9h8a4 4 0 0 0 4-4M4 2h4v4H4zm0 16h4v4H4zm12-17h4v4h-4z',
  lock:'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4',
  close:'m5 5 14 14M5 19 19 5',
  text:'M3 4h18M12 4v17m-4 0h8',
  image:'M3 3h18v18H3zM3 18l6-7 4 4 3-3 5 6M16 6h1',
  cursor:'M5 3v17l5-5 4 7 3-2-4-7h8z',
};
function ic(name,cls=''){return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[name]||iconPaths.file}"/></svg>`;}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function button(label,action='',icon='',cls=''){return `<button type="button" class="btn ${cls}" ${action?`data-action="${action}"`:''} ${!label?`aria-label="${esc(action||icon)}" title="${esc(action||icon)}"`:''}>${icon?ic(icon):''}${label}</button>`;}
function pill(text,cls=''){return `<span class="pill ${cls}">${text}</span>`;}
function avatar(name='TM',cls=''){return `<span class="avatar ${cls}">${name}</span>`;}
function tabs(labels,active=0){return `<div class="tabs" role="tablist">${labels.map((l,i)=>`<button role="tab" aria-selected="${i===active}" data-tab="${esc(l)}" class="${i===active?'active':''}">${l}</button>`).join('')}</div>`;}
function header(title,options={}){return `<header class="app-header" data-region="3 · Header"><div class="header-title">${options.back?button('','back','back','icon-btn'):''}${options.icon?ic(options.icon):''}<strong>${title}</strong>${options.tabs?tabs(options.tabs):''}</div><div class="header-actions">${options.actions||button('Filter','filter','filter')+button('New','create','plus')+button('','search','search','icon-btn')}</div></header>`;}
function composer(placeholder='Message the team…',action='send'){return `<div class="composer" data-region="5 · Composer"><textarea aria-label="${placeholder}" placeholder="${placeholder}" rows="2"></textarea><div class="composer-bar"><span>${button('','attach','clip','icon-btn')}${button('Aa','format','','flat')}</span><span>${button('','dictate','mic','icon-btn')}${button('',action,'arrow','icon-btn primary')}</span></div></div>`;}
function nav(items,current=0){return items.map((item,i)=>`<button class="nav-row ${i===current?'selected':''}" data-nav="${esc(item)}">${ic(['folder','file','tasks'][i%3])}<span>${item}</span>${i===current?'<span class="small">✓</span>':''}</button>`).join('');}
function sidebar(title,items,extras=''){return `<aside class="view-sidebar" data-region="2 · Navigation"><div class="side-heading"><strong>${title}</strong>${button('','search','search','icon-btn flat')}</div>${button('New','create','plus','wide')}${nav(items)}${extras}</aside>`;}
function rail(active){const items=[['home','home','Home'],['drive','folder','Drive'],['mail','mail','Email'],['chat','chat','Chat'],['tasks','tasks','Tasks'],['calendar','calendar','Calendar'],['agents','agent','Agents'],['crm','people','Customers'],['calls','phone','Calls'],['reviews','branch','Reviews']];return `<nav class="rail" aria-label="Workspaces" data-region="1 · Rail">${button('','create','plus','rail-btn')}${button('','search','search','rail-btn')}<div class="rail-gap"></div>${items.map(([id,icon,label])=>`<button title="${label}" aria-label="${label}" class="rail-btn ${active===id?'active':''}" data-screen="${id}">${ic(icon)}</button>`).join('')}<div class="grow"></div>${button('','settings','settings','rail-btn')}${avatar('YO')}</nav>`;}
function shell(active,side,content,extra=''){return `<div class="workspace">${rail(active)}${side}<main class="work-main" data-region="4 · Work area">${content}</main>${extra}</div>`;}
function docActions(){return button('Ask AI','ask','agent')+button('Share','share','share')+button('','details','info','icon-btn');}
function chips(items){return `<div class="chips">${items.map(x=>pill(x)).join('')}</div>`;}
function discussion(){return `<section class="discussion"><h3>Discussion <span class="muted">2</span></h3><div class="message">${avatar('T1')}<div><strong>Teammate 1</strong><span class="timestamp">10:24</span><p>The outline is ready for review. The linked task has the next steps.</p>${pill('✓ 2')}</div></div>${composer('Leave a comment…')}</section>`;}
function taskRows(){return [['Prepare launch checklist','In progress','High','T1','Today'],['Review the onboarding draft','Not started','Medium','T2','Tomorrow'],['Connect calendar accounts','In progress','Medium','YO','Thu'],['Validate offline recovery','Not started','High','T3','Fri'],['Publish the team guide','Done','Low','T2','Oct 30']].map((r,i)=>`<button class="task-row data-row" data-screen="task"><span class="status-ring ${i===4?'done':i%2?'':'progress'}">${i===4?'✓':''}</span><span class="row-title">${r[0]}</span><span class="muted secondary-col">${r[1]}</span><span class="priority secondary-col">${r[2]}</span>${avatar(r[3])}<span class="muted due">${r[4]}</span></button>`).join('');}
function recordTable(){return `<table class="data-table"><thead><tr><th class="rownum"></th><th>Aa &nbsp; Name</th><th>◉ &nbsp; Stage</th><th>♙ &nbsp; Owner</th><th># &nbsp; Value</th><th>▦ &nbsp; Next review</th><th>＋</th></tr></thead><tbody>${[['Company A','Discovery','T1','12,000','Oct 29'],['Company B','Proposal','T2','24,000','Oct 30'],['Company C','Review','YO','8,500','Nov 02'],['Company D','Discovery','T3','16,000','Nov 04'],['Company E','Won','T1','32,000','Nov 06']].map((r,i)=>`<tr class="data-row"><td>${i+1}</td><td contenteditable="true" aria-label="Record name ${i+1}">${r[0]}</td><td>${pill(r[1],i===4?'green':'blue')}</td><td>${avatar(r[2])} ${r[2]==='YO'?'You':'Teammate '+r[2][1]}</td><td class="num">${r[3]}</td><td>${r[4]}</td><td></td></tr>`).join('')}<tr><td>＋</td><td colspan="6">New record</td></tr></tbody></table>`;}
