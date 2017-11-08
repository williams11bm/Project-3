import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('redsquare App', () => {
  let page: AppPage;
  var username = 'test' + Math.floor((Math.random()*1000));


  beforeEach(() => {
    page = new AppPage();
  });

  it('should display load the welcome page', () => {
    page.navigateTo('/');
    expect(page.getHeaderText()).toEqual('Red Square');
  });

  it('create a new user', () => {
    element(by.css('.navbar-brand')).click();
    expect(element(by.css('app-root h2')).getText()).toContain('Sign Up');
    element(by.id('first_name')).sendKeys('protractor');
    element(by.id('last_name')).sendKeys('test');
    element(by.id('username')).sendKeys(username);
    element(by.id('password')).sendKeys('password');
    element(by.buttonText('Submit')).click();
    expect(browser.getCurrentUrl()).toContain("/dashboard");
  });
  
  it('should create a new group message', () => {
    // element(by.id('gname')).sendKeys('test');
    element(by.tagName('input')).sendKeys('test');
    expect(element(by.tagName('input')).getAttribute('value')).toBe('Foo123');
  })

  // it('should log out', () => {
  //   element(by.partialLinkText('log-out')).click();
  //   expect(browser.getCurrentUrl()).toContain("/home");
  // })

  // it('should send a message to the bot', () => {
  //
  // })

  // it('should add another user to the group', () => {
  //
  // })
});
