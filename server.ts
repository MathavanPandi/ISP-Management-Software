import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store received OTPs (Mobile -> { otp, time })
const bridgeOtpBuffer = new Map<string, { otp: string, timestamp: number }>();
let lastBridgeHit = 0;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OTP Bridge Webhook (Used by mobile automation apps)
  app.post('/api/webhook/otp', (req, res) => {
    const { secret, mobile, otp } = req.body;
    
    // Validate secret
    if (process.env.OTP_BRIDGE_SECRET && secret !== process.env.OTP_BRIDGE_SECRET) {
      console.warn(`[OTP Bridge] Unauthorized webhook attempt for ${mobile}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log(`[OTP Bridge] Received OTP via bridge for ${mobile}: ${otp}`);
    bridgeOtpBuffer.set(mobile.replace(/\D/g, ''), { 
      otp, 
      timestamp: Date.now() 
    });
    lastBridgeHit = Date.now();

    res.json({ success: true });
  });

  app.get('/api/sync/bridge-status', (req, res) => {
    const isOnline = lastBridgeHit > 0 && (Date.now() - lastBridgeHit) < 600000; // 10 mins
    res.json({ online: isOnline, lastHit: lastBridgeHit });
  });

  app.get('/api/sync/check-otp', (req, res) => {
    const { mobile } = req.query;
    if (!mobile) return res.status(400).json({ error: 'Mobile required' });
    
    const sanitizedMobile = (mobile as string).replace(/\D/g, '');
    const entry = bridgeOtpBuffer.get(sanitizedMobile);
    
    if (entry && (Date.now() - entry.timestamp < 180000)) {
      return res.json({ found: true, otp: entry.otp });
    }
    
    res.json({ found: false });
  });

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
    const { mobile, otp: userProvidedOtp, providerId, providerName } = req.body;
    const sanitizedMobile = mobile ? mobile.replace(/\D/g, '') : '';
    
    // 1. Check if we have an OTP from the bridge first
    let finalOtp = userProvidedOtp;
    const bridgeEntry = bridgeOtpBuffer.get(sanitizedMobile);
    
    // If bridge OTP is fresh (less than 3 mins old), use it automatically
    if (bridgeEntry && (Date.now() - bridgeEntry.timestamp < 180000)) {
      console.log(`[OTP Bridge] Automatically using bridge OTP for ${mobile}`);
      finalOtp = bridgeEntry.otp;
      bridgeOtpBuffer.delete(sanitizedMobile); // Consume it
    }

    console.log(`[Puppeteer] Syncing ${providerName} for ${mobile} with OTP ${finalOtp}`);

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
