import puppeteer from 'puppeteer';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';

export class ScrapeService {
  static async scrape(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const title = await page.title();
    const markdown = htmlToMarkdown(html);
    await browser.close();
    return { title, url, html, markdown };
  }
}
