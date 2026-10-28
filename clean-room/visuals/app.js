/* Local-only preview interactions. Nothing is saved or sent to a service. */
const query = new URLSearchParams(location.search);
let currentScreen = screens.find(s=>s.id===query.get('screen')) || screens[0];
let currentMode = query.get('mode')==='wireframe'?'wireframe':'mockup';
let currentTheme = query.get('theme')==='light'?'light':'dark';
let currentState = query.get('state')||'populated';
const app = document.getElementById('app');
document.body.classList.toggle('capture',query.get('capture')==='1');

function render() {
  app.className = `${currentTheme} ${currentMode==='wireframe'?'wire':''} ${currentScreen.mobile?'mobile-frame':''}`;
  app.innerHTML = renderView(currentScreen.id);
  if(currentMode==='wireframe') app.insertAdjacentHTML('beforeend','<div class="wire-note">STRUCTURE STUDY · numbered regions</div>');
  document.getElementById('screen-title').textContent=`${currentScreen.number} / ${currentScreen.title}`;
  document.getElementById('screen-evidence').textContent=`${currentScreen.features} · Reference evidence: ${currentScreen.evidence}`;
  document.getElementById('review-note').textContent=currentScreen.note+' Original mockup, not an application screenshot. Interactions are local demonstrations.';
  document.getElementById('mode').value=currentMode;
  document.getElementById('theme').value=currentTheme;
  document.getElementById('state').value=currentState;
  document.querySelectorAll('.catalog-item').forEach(b=>{b.classList.toggle('active',b.dataset.screen===currentScreen.id);b.setAttribute('aria-current',b.dataset.screen===currentScreen.id?'page':'false');});
  renderState();
}
function go(id) {
  const next=screens.find(s=>s.id===id);
  if(!next) return;
  currentScreen=next; currentState='populated';
  const url=new URL(location.href);url.searchParams.set('screen',id);url.searchParams.delete('state');history.replaceState(null,'',url);
  render();
}
let group='';
document.getElementById('screen-list').innerHTML=screens.map(s=>{const h=s.group!==group?`<h3>${s.group}</h3>`:'';group=s.group;return `${h}<button class="catalog-item" data-screen="${s.id}"><span>${s.number}</span>${s.title}</button>`;}).join('');
for(const control of ['mode','theme','state']) document.getElementById(control).addEventListener('change',e=>{
  if(control==='mode')currentMode=e.target.value;
  if(control==='theme')currentTheme=e.target.value;
  if(control==='state')currentState=e.target.value;
  const url=new URL(location.href);url.searchParams.set(control,e.target.value);history.replaceState(null,'',url);render();
});
function renderState() {
  if(currentState==='populated')return;
  if(currentState==='readonly') {
    app.querySelector('.work-main,.device,.welcome-form')?.insertAdjacentHTML('afterbegin','<div class="readonly-banner">'+ic('lock')+' You have view-only access. '+button('Request access','request-access','','flat')+'</div>');
    app.querySelectorAll('[contenteditable]').forEach(el=>el.setAttribute('contenteditable','false'));
    app.querySelectorAll('textarea,input,.composer button').forEach(el=>el.disabled=true);
    return;
  }
  const content=currentState==='loading'?`<div class="loading-state"><span class="section-label">Loading workspace</span>${Array.from({length:4},()=>'<div class="skeleton"></div>').join('')}</div>`:currentState==='error'?`<div class="empty-state">${ic('info')}<h2>We couldn’t load this view</h2><p>Your work is safe. Check your connection and try again.</p>${button('Try again','retry','arrow','primary')}</div>`:`<div class="empty-state">${ic('file')}<h2>Nothing here yet</h2><p>Create an item or change your filters to get started.</p>${button('Create something','create','plus','primary')}</div>`;
  app.querySelector('.work-main,.mobile-content,.welcome-form')?.insertAdjacentHTML('beforeend',`<div class="state-layer" data-region="6 · State">${content}</div>`);
}
let lastFocus;
function closeOverlay() {app.querySelectorAll('.overlay,.details-panel').forEach(x=>x.remove());lastFocus?.focus();}
function modal(title,body,footer='',sheet=false) {
  closeOverlay();lastFocus=document.activeElement;
  app.insertAdjacentHTML('beforeend',`<div class="overlay ${sheet?'sheet-overlay':''}"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">${sheet?'<div class="sheet-handle"></div>':''}<div class="modal-head"><strong>${title}</strong>${button('','close','close','icon-btn flat')}</div>${body}${footer?`<div class="modal-footer">${footer}</div>`:''}</section></div>`);
  app.querySelector('.modal input,.modal button')?.focus();
}
function toast(text) {app.querySelector('.toast')?.remove();app.insertAdjacentHTML('beforeend',`<div class="toast" role="status">${ic('check')}${esc(text)}${button('','dismiss-toast','close','icon-btn flat')}</div>`);}
function details(sheet=false) {
  const content=`<div class="content-pad"><span class="section-label">Properties</span><div class="setting-row"><span>Owner</span><span>${avatar('YO')} You</span></div><div class="setting-row"><span>Project</span><span>Launch project</span></div><div class="setting-row"><span>Access</span>${pill('Team','blue')}</div><div class="setting-row"><span>Updated</span><span>Today, 10:24</span></div><h3>Links</h3>${button('Onboarding guide','document','file','wide')}<h3>Activity</h3><p class="muted small">Teammate 1 updated this item.<br><br>You added a comment.</p></div>`;
  if(sheet)return modal('Details',content,'',true);
  closeOverlay();lastFocus=document.activeElement;app.insertAdjacentHTML('beforeend',`<aside class="details-panel" aria-label="Details"><div class="modal-head"><strong>Details</strong>${button('','close','close','icon-btn flat')}</div>${content}</aside>`);
}
function createMenu(sheet=false) {
  modal('Create',`<div class="create-layout"><div>${nav(['Items','Communication','Design'],0)}</div><div>${[['document','file','Document','Write and collaborate'],['task','tasks','Task','Track the next step'],['spreadsheet','grid','Spreadsheet','Work with structured data'],['canvas','board','Canvas','Connect ideas visually'],['presentation','monitor','Presentation','Bring your story together'],['database','grid','Database','Organize records'],['form','file','Form','Collect responses']].map(([s,i,t,c])=>`<button class="modal-row" data-screen="${s}">${ic(i)}<span><strong>${t}</strong><small>${c}</small></span>${ic('chevron')}</button>`).join('')}</div></div>`,'',sheet);
}
document.addEventListener('click',e=>{
  const target=e.target.closest('button,[data-action]');
  if(!target)return;
  if(target.dataset.screen){closeOverlay();go(target.dataset.screen);return;}
  if(target.dataset.themeChoice){currentTheme=target.dataset.themeChoice==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):target.dataset.themeChoice;render();return;}
  if(target.classList.contains('switch')){const on=target.getAttribute('aria-checked')!=='true';target.setAttribute('aria-checked',String(on));target.classList.toggle('on',on);return;}
  if(target.dataset.mail){app.querySelectorAll('.mail-row').forEach(x=>x.classList.toggle('selected',x===target));toast('Conversation selection preview. The detail fixture stays the same.');return;}
  if(target.dataset.nav){app.querySelectorAll('.nav-row').forEach(x=>x.classList.toggle('selected',x===target));toast('Navigation selection preview');return;}
  if(target.dataset.tab){
    target.closest('.tabs').querySelectorAll('[data-tab]').forEach(x=>{x.classList.toggle('active',x===target);x.setAttribute('aria-selected',String(x===target));});
    if(currentScreen.id==='tasks')app.querySelector('#task-content').innerHTML=target.dataset.tab==='Board'?`<div class="board">${['Not started','In progress','Done'].map((s,i)=>`<section class="lane"><div class="lane-title">${s}</div><button class="deal" data-screen="task"><h3>${['Review onboarding','Prepare launch checklist','Publish team guide'][i]}</h3><p class="muted">Launch project</p><div class="deal-footer">${pill('Today')}${avatar('T1')}</div></button></section>`).join('')}</div>`:`<div class="group-title">Launch project</div>${taskRows()}`;
    else toast('Tab selection preview');return;
  }
  const action=target.dataset.action;
  if(!action){toast('This control is a visual reference.');return;}
  if(action!=='search'&&screens.some(s=>s.id===action)){go(action);return;}
  if(action==='close'){closeOverlay();return;}
  if(action==='dismiss-toast'){target.closest('.toast').remove();return;}
  if(action==='back'||action==='mobile-back'){go(currentScreen.mobile?'mobile-home':'home');return;}
  if(action==='retry'){currentState='populated';render();return;}
  if(action==='create'||action==='mobile-create'){createMenu(currentScreen.mobile);return;}
  if(action==='details'||action==='mobile-details'||action==='record-detail'){details(currentScreen.mobile);return;}
  if(action==='search'){modal('Search workspace',`<div class="modal-search">${ic('search')}<input aria-label="Search" placeholder="Search documents, tasks, people…" autofocus></div><div class="content-pad"><span class="section-label">Recent</span>${button('Onboarding guide','document','file','wide')}${button('Launch checklist','task','tasks','wide')}</div>`,button('See all results','search-results','search','primary'));return;}
  if(action==='search-results'){go('search');return;}
  if(action==='share'){modal('Share this item',`<div class="content-pad"><div class="modal-search"><input aria-label="Invite people" placeholder="Add people or email addresses">${button('Invite','invite','','primary')}</div><div class="setting-row">${avatar('YO')}<span class="grow">You</span>${pill('Owner')}</div><div class="setting-row">${avatar('T1')}<span class="grow">Teammate 1</span>${button('Can edit','permission')}</div><div class="setting-row">${ic('people')}<span class="grow">Team workspace</span>${button('Can view','permission')}</div></div>`,button('Copy link','copy-link','link')+button('Done','close','','primary'),currentScreen.mobile);return;}
  if(action==='filter'){modal('Filter',`<div class="content-pad"><label class="setting-row">Status <select><option>Active</option><option>All</option><option>Completed</option></select></label><label class="setting-row">Assignee <select><option>Everyone</option><option>You</option><option>Teammate 1</option></select></label><label class="setting-row">Due date <select><option>Any time</option><option>Today</option><option>This week</option></select></label></div>`,button('Reset','reset-filter')+button('Apply','apply-filter','','primary'));return;}
  if(action==='apply-filter'){closeOverlay();toast('Filters applied to this local preview');return;}
  if(action==='reply'){app.querySelector('#mail-reply').innerHTML=composer('Write your reply…','send-mail');app.querySelector('#mail-reply textarea').focus();return;}
  if(action==='thread'){modal('Thread',`<div class="content-pad"><div class="message">${avatar('T2')}<div><strong>Teammate 2</strong><p>The flow feels much clearer.</p></div></div><div class="message">${avatar('YO')}<div><strong>You</strong><p>Thanks! I’ll check the last section.</p></div></div>${composer('Reply in thread…')}</div>`,'',currentScreen.mobile);return;}
  if(action==='ask'){go('agents');return;}
  if(action==='form-preview'){go('mobile-form');return;}
  if(action==='form-next'){
    const input=app.querySelector('#team-name');if(!input.value.trim()){input.reportValidity();return;}
    app.querySelector('.mobile-content').innerHTML=`<div class="section-label" style="margin-top:70px">Preview complete</div><h1>Thanks, ${esc(input.value.trim())}.</h1><p class="muted">The remaining questions follow the same full-width flow. No response was submitted.</p>`;target.disabled=true;target.textContent='Preview complete';return;
  }
  if(action==='approve'||action==='decline'){modal(action==='approve'?'Approve this change?':'Decline this change?',`<div class="content-pad"><p>This demonstrates the review decision. No document or external system will be changed.</p></div>`,button('Cancel','close')+button(action==='approve'?'Approve':'Decline','confirm-review','','primary'));return;}
  if(action==='merge'){modal('Merge pull request?',`<div class="content-pad"><p>All checks have passed in this sample. Confirm merging the proposed changes.</p><p class="muted">This is a local preview; no repository will be changed.</p></div>`,button('Cancel','close')+button('Merge','confirm-review','branch','primary'));return;}
  if(action==='confirm-review'){closeOverlay();toast('Review decision recorded for this preview only');return;}
  if(action==='send'||action==='send-mail'||action==='agent-send'){toast('Preview only — nothing was sent');return;}
  if(action==='copy-link'){toast('Link action preview — no live sharing link exists');return;}
  if(action==='toggle-mic'||action==='toggle-camera'){target.classList.toggle('primary');target.setAttribute('aria-pressed',String(target.classList.contains('primary')));return;}
  if(action==='settings'){go('settings');return;}
  toast('Visual reference only — no changes were saved');
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeOverlay();return;}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();app.querySelector('[data-action="search"]')?.click();}
  const dialog=app.querySelector('.modal');
  if(e.key==='Tab'&&dialog){const controls=[...dialog.querySelectorAll('button,input,select,textarea')].filter(x=>!x.disabled);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
});
render();
