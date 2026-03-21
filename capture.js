import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'public', 'projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const sites = [
    { url: 'https://erp.stdn.in', file: 'erp.png' },
    { url: 'https://research-ai-navy.vercel.app', file: 'research.png' },
    { url: 'https://jd-and-dark.vercel.app', file: 'jd.png' },
    { url: 'https://sps-naguran.vercel.app', file: 'sps.png' }
  ];

  for (const site of sites) {
    try {
      console.log('Capturing ' + site.url + '...');
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait to allow React/Framer entry animations to finish
      await new Promise(r => setTimeout(r, 4000));
      await page.screenshot({ path: path.join(outDir, site.file) });
    } catch (e) {
      console.error('Failed ' + site.url, e);
    }
  }

  await browser.close();
  console.log('Done');
})();
