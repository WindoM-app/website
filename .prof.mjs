import { chromium } from 'playwright';
const b=await chromium.launch({args:['--disable-gpu','--disable-software-rasterizer']});
const pg=await b.newPage({viewport:{width:1280,height:1700}});
await pg.goto('https://github.com/WindoM-app',{waitUntil:'domcontentloaded'}); await new Promise(r=>setTimeout(r,6000));
await pg.screenshot({path:process.argv[2]}); await b.close();
