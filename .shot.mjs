import { chromium } from 'playwright';
const [svg,out,wait,w,h]=process.argv.slice(2);
const b=await chromium.launch({args:['--disable-gpu','--disable-software-rasterizer']}); const pg=await b.newPage({viewport:{width:+w||1200,height:+h||380}});
await pg.goto('file://'+svg); await new Promise(r=>setTimeout(r,+wait)); await pg.screenshot({path:out}); await b.close();
