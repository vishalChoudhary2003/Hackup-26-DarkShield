import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const url = process.argv[2];
    if (!url) {
        console.error("Please provide a URL");
        process.exit(1);
    }

    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    const domain = parsedUrl.hostname;

    console.log(`## Crawler started from ${parsedUrl.toString()} with Playwright engine.`);
    
    // Playwright options for Tor integration
    const browserOptions = {
        headless: true
    };
    
    // Check if it's a darkweb domain, optionally enabling Tor proxy
    if (domain.endsWith('.onion')) {
        console.log(`## Onion domain detected. Routing through TOR proxy...`);
        browserOptions.proxy = { server: 'socks5://127.0.0.1:9050' };
    }

    try {
        console.log(`## Launching Chromium browser...`);
        const browser = await chromium.launch(browserOptions);
        const page = await browser.newPage();
        
        console.log(`## Navigating to ${parsedUrl.toString()}...`);
        await page.goto(parsedUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log(`## Page loaded. Extracting nodes...`);

        // Extract Links
        const links = await page.$$eval('a', els => els.map(el => el.href).filter(h => h));
        console.log(`## Extracted ${links.length} hyperlinks from DOM.`);

        // Extract Text and search for Emails
        const pageText = await page.evaluate(() => document.body.innerText);
        const emails = pageText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
        const uniqueEmails = [...new Set(emails)];
        console.log(`## Extracted ${uniqueEmails.length} unique email addresses.`);

        const files = await page.$$eval('a', els => els.map(el => el.href).filter(h => h.match(/\.(pdf|doc|docx|csv|sql|bak|zip|tar)$/i)));
        console.log(`## Extracted ${files.length} sensitive file links.`);

        await browser.close();
        console.log(`## Browser closed. Finalizing analysis.`);

        // Format to JSON identical to TorCrawl output
        const compName = domain.startsWith('www.') ? domain.slice(4).split('.')[0] : domain.split('.')[0];
        
        const results = {
            start_url: parsedUrl.toString(),
            links: links,
            external_links: [],
            images: [],
            scripts: [],
            telephones: [],
            emails: uniqueEmails,
            files: files,
            // Insert standard fields required by robust bridge mapping if optionally picked up
            companyLabel: compName
        };

        const today = new Date();
        const dateStr = `${String(today.getFullYear()).slice(-2)}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`;
        
        const outDir = path.join(__dirname, 'TorCrawl.py', 'output', domain);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        
        const outFileJSON = path.join(outDir, `${dateStr}_results.json`);
        fs.writeFileSync(outFileJSON, JSON.stringify(results, null, 2));

        console.log(`## JSON results created at: output/${domain}\\${dateStr}_results.json`);

    } catch (e) {
        console.log(`## Crawler Error: ${e.message}`);
        process.exit(1);
    }
})();
