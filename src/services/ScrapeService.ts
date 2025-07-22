import puppeteer from 'puppeteer';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import { extract as _extract, extractFromHtml } from '@extractus/article-extractor';

export class ScrapeService {
  static async scrape(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForNetworkIdle({ idleTime: 100 });
    const html = await page.content();
    const article = await extractFromHtml(html, url);
    const title = article?.title || (await page.title());
    const markdown = htmlToMarkdown(article?.content || html);
    await browser.close();
    return {
      title,
      url,
      markdown,
      author: article?.author,
      published: article?.published,
      description: article?.description,
      image: article?.image,
      source: article?.source,
    };
  }
}
