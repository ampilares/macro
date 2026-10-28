/* Run with Playwright installed separately; this file has no runtime dependencies in the gallery. */
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width:1440,height:900 }, deviceScaleFactor:1 });
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const base=pathToFileURL(path.join(__dirname,'index.html')).href;
  const load=async(screen,mode='mockup',theme='dark',extra='')=>{
    await page.goto(`${base}?screen=${screen}&mode=${mode}&theme=${theme}&capture=1${extra}`);
    await page.evaluate(()=>document.fonts.ready);
  };
  try {
    await load('home');
    const catalog=await page.evaluate(()=>screens);
    const manifest=[];
    for(const screen of catalog) {
      await page.setViewportSize(screen.mobile?{width:390,height:844}:{width:1440,height:900});
      for(const [folder,mode,theme] of [['mockups-dark','mockup','dark'],['mockups-light','mockup','light'],['wireframes','wireframe','light']]) {
        await load(screen.id,mode,theme);
        const filename=`exports/${folder}/${screen.number}-${screen.id}.png`;
        await fs.mkdir(path.join(__dirname,'exports',folder),{recursive:true});
        await page.screenshot({path:path.join(__dirname,filename)});
        const geometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,visible:document.querySelector('#app').innerText.length>20}));
        if(geometry.overflow||!geometry.visible)throw Error(`Invalid frame ${filename}: ${JSON.stringify(geometry)}`);
        manifest.push({screen:screen.id,title:screen.title,mode,theme,file:filename,width:geometry.width,height:geometry.height,referenceEvidence:screen.evidence});
      }
      process.stdout.write(`${screen.number} ${screen.id}\n`);
    }
    // Capture additional interaction and state references.
    await page.setViewportSize({width:1440,height:900});
    const extraFrames=[
      ['create','home','[data-action="create"]'],['share','document','[data-action="share"]'],
      ['details','task','[data-action="details"]'],['search-dialog','home','[data-action="search"]'],
      ['task-board','tasks','[data-tab="Board"]'],['thread','chat','[data-action="thread"]'],
      ['empty','tasks',null,'&state=empty'],['loading','tasks',null,'&state=loading'],
      ['error','tasks',null,'&state=error'],['readonly','document',null,'&state=readonly'],
      ['mobile-details','mobile-task','[data-action="mobile-details"]'],
      ['mobile-create','mobile-home','[data-action="mobile-create"]'],
    ];
    await fs.mkdir(path.join(__dirname,'exports','interactions'),{recursive:true});
    for(const [name,screen,selector,extra] of extraFrames) {
      const mobile=screen.startsWith('mobile-');await page.setViewportSize(mobile?{width:390,height:844}:{width:1440,height:900});
      await load(screen,'mockup','dark',extra||'');if(selector)await page.locator(selector).first().click();
      await page.screenshot({path:path.join(__dirname,'exports','interactions',`${name}.png`)});
    }
    // Exercise local demonstration flows; no app or provider calls occur.
    const checks=[];
    await page.setViewportSize({width:1440,height:900});await load('home');
    await page.keyboard.press('Control+k');if(await page.getByRole('dialog',{name:'Search workspace'}).count()!==1)throw Error('Search shortcut did not open dialog');
    await page.locator('[data-action="search-results"]').click();if(await page.locator('.search-results').count()!==1)throw Error('Search results navigation failed');checks.push('Search shortcut opens dialog and results action navigates');
    await page.setViewportSize({width:1440,height:900});await load('document');
    await page.getByRole('button',{name:'Share',exact:true}).click();
    if(await page.getByRole('dialog').count()!==1)throw Error('Share dialog missing');
    await page.keyboard.press('Escape');if(await page.getByRole('dialog').count())throw Error('Escape did not close dialog');checks.push('Share dialog opens and Escape closes');
    await page.locator('[data-action="details"]').click();if(await page.locator('.details-panel').count()!==1)throw Error('Details missing');checks.push('Details open in floating panel');
    await load('tasks');await page.locator('[data-tab="Board"]').click();if(await page.locator('#task-content .lane').count()!==3)throw Error('Board missing');await page.locator('#task-content [data-screen="task"]').first().click();if(!(await page.locator('h1').innerText()).includes('checklist'))throw Error('Task navigation failed');checks.push('Task list/board and detail navigation');
    await load('tasks','mockup','dark','&state=error');await page.locator('[data-action="retry"]').click();if(await page.locator('.state-layer').count())throw Error('Retry state failed');checks.push('Error retry restores populated fixture');
    await load('settings');await page.locator('[data-theme-choice="light"]').click();if(!(await page.locator('#app').getAttribute('class')).includes('light'))throw Error('Theme failed');checks.push('Theme changes locally');
    await page.setViewportSize({width:390,height:844});await load('mobile-form');await page.locator('[data-action="form-next"]').click();if(await page.locator('#team-name:invalid').count()!==1||!(await page.locator('h1').innerText()).includes('team’s name'))throw Error('Required input validation failed');await page.locator('#team-name').fill('Sample team');await page.locator('[data-action="form-next"]').click();if(!(await page.locator('h1').innerText()).includes('Sample team'))throw Error('Form preview failed');checks.push('Phone form validates and shows local completion');
    if(errors.length)throw Error(errors.join('\n'));
    const report={screens:catalog.length,baseExports:manifest.length,interactionExports:extraFrames.length,javascriptErrors:errors,checks,scope:'Standalone visual studies only; no reference application or backend exercised.'};
    await fs.writeFile(path.join(__dirname,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
    await fs.writeFile(path.join(__dirname,'validation.json'),JSON.stringify(report,null,2)+'\n');
    const picks=['home','tasks','document','mail','chat','crm','agents','spreadsheet','design'];
    const cards=picks.map(id=>{const s=catalog.find(s=>s.id===id);return `<figure><img src="exports/mockups-dark/${s.number}-${id}.png"><figcaption>${s.number} / ${s.title}</figcaption></figure>`;}).join('');
    const mobileCards=['mobile-home','mobile-task','mobile-chat','mobile-form','mobile-compose'].map(id=>{const s=catalog.find(s=>s.id===id);return `<figure><img src="exports/mockups-light/${s.number}-${id}.png"><figcaption>${s.title}</figcaption></figure>`;}).join('');
    const sheet=`<!doctype html><meta charset="utf-8"><title>Workspace visual overview</title><style>*{box-sizing:border-box}body{margin:0;padding:48px;background:#e9e9e5;color:#272727;font:14px Arial,sans-serif}header{display:flex;justify-content:space-between;align-items:end;margin-bottom:32px}h1{font-size:38px;font-weight:500;letter-spacing:-1.5px;margin:10px 0}p{color:#777;font-size:12px}small{font-size:10px;letter-spacing:.12em}section{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}figure{margin:0}img{width:100%;display:block;border:1px solid #d4d4ce;border-radius:6px}figcaption{padding:9px 0;font-size:11px;color:#666}.phones{grid-template-columns:repeat(5,1fr);gap:34px;margin:32px 90px 0}.phones img{border-radius:18px}footer{margin-top:28px;font-size:11px;color:#777}</style><header><div><small>CLEAN-ROOM / VISUAL REFERENCE</small><h1>One workspace. Connected views.</h1><p>Original source-informed studies · 32 screens · Light, dark, and annotated wireframes</p></div><small>DESKTOP + MOBILE</small></header><section>${cards}</section><section class="phones">${mobileCards}</section><footer>Concept mockups, not captures of the reference application. Synthetic content. See ../README.md for evidence and interaction limits.</footer>`;
    await fs.writeFile(path.join(__dirname,'overview.html'),sheet);
    await page.setViewportSize({width:1600,height:1200});await page.goto(pathToFileURL(path.join(__dirname,'overview.html')).href);
    await page.screenshot({path:path.join(__dirname,'exports','overview.png'),fullPage:true});
    process.stdout.write(JSON.stringify(report)+'\n');
  } finally {await browser.close();}
}
main().catch(error=>{process.stderr.write(`${error.stack}\n`);process.exitCode=1;});
