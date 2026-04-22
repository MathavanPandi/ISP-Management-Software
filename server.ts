import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/sync/otp-request', async (req, res) => {
    const { mobile, provider } = req.body;
    console.log(`[Puppeteer] Starting OTP request for ${mobile} on ${provider}`);
    
    // In a real implementation, Puppeteer would go to the login page
    // and trigger the OTP.
    try {
      // simulate success
      res.json({ success: true, message: 'OTP requested successfully via automation' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/sync/verify-and-fetch', async (req, res) => {
    const { mobile, otp, providerId, providerName } = req.body;
    console.log(`[Puppeteer] Syncing ${providerName} for ${mobile}`);

    let browser;
    try {
      // Launch Puppeteer (Headed/Headless depending on env)
      // Note: --no-sandbox is often required in container environments
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      
      // MOCK AUTOMATION FLOW (since we don't have real ISP portals to test here)
      // In a real app:
      // await page.goto('https://isp-portal.com/login');
      // await page.type('#mobile', mobile);
      // await page.type('#otp', otp);
      // await page.click('#login-btn');
      // await page.waitForNavigation();
      // const data = await page.evaluate(() => { ... fetch bill data ... });

      console.log(`[Puppeteer] Executing automation for ${providerName}...`);
      await new Promise(r => setTimeout(r, 2000)); // Simulate work

      // Discovered Data Structure
      const results = {
        locations: [
          {
            name: `${providerName} Automated Branch`,
            branchType: 'Office',
            city: 'Auto-City',
            state: 'Auto-State',
            address: 'Fetched via Puppeteer Automation',
            ispProviderId: providerId,
            accountId: `AUTO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            registeredMobile: mobile,
            status: 'Active',
            nextDueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
          }
        ],
        plans: [
          {
            providerId: providerId,
            name: `${providerName} High Speed`,
            bandwidth: '300 Mbps',
            amount: 1299,
            billingCycle: 'Monthly',
          }
        ]
      };

      res.json({ success: true, data: results });
    } catch (error: any) {
      console.error('[Puppeteer Error]', error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      if (browser) await browser.close();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
