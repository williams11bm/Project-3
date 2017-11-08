import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(x) {
    return browser.get(x);
  }

  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }

  getParagraphText() {
    return element(by.css('app-root p')).getText();
  }
}
