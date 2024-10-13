import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home_page.js';
import { COUNTRY_SELECTION } from '../../src/config/constants.js';

test.describe('eSim package selection tests', () => {
  let homePage;
  const assertionErrors = [];

  /**
  * Searches for and verifies the details of the Japan eSIM package on the Airalo website.
  * 
  * This test performs a series of automated interactions on the Airalo homepage to 
  * verify the details of the eSIM package for Japan. It navigates to the website, 
  * accepts privacy notices, conditionally allows notifications based on the headless mode, 
  * changes the currency, and selects the Japan eSIM package. After selecting the package, 
  * it retrieves relevant details such as the package title, coverage, data, validity, 
  * and price. Each retrieved detail is then compared against expected values using assertions.
  * 
  * If any assertions fail, a corresponding error message is collected and reported 
  * at the end of the test run, allowing for a "soft assertion" approach where 
  * multiple assertion failures can be documented in a single test execution.
  * 
  * @param {object} context - The test execution context provided by the testing framework.
  * @param {Page} context.page - The Playwright page object used for interacting with the browser.
  * @param {Browser} context.browser - The Playwright browser object used for headless mode detection.
  * 
  * @throws {Error} Throws an error if any assertions fail, detailing the failed assertions.
  */

  test('Search and verify package details for Japan eSIM', async ({ page, browser }) => {
    // Access the headless property directly from the browser options
    const isHeadless = page.context().browser()._options.headless;
    const assertionErrors = [];

    //Step 1: Navigation to Airalo Website
    await page.goto('/');

    const homePage = new HomePage(page);
    await homePage.acceptPrivacy();
    if (!isHeadless) {
      await homePage.allowNotifications();
    }

    await homePage.changeCurrency();

    // Step 2: Search for Japan]
    await homePage.countrySelection(COUNTRY_SELECTION);

    //Step 3: Local eSim Package selection
    await homePage.eSimSelectionPackage();

    //Assertions
    const title = await homePage.getPackageTitle();
    const coverage = await homePage.getPackageCoverage();
    const data = await homePage.getPackageData();
    const validity = await homePage.getPackageValidity();
    const price = await homePage.getPackagePrice();
    try {
      expect(title).toBe("Moshi Moshi");
    } catch (error) {
      assertionErrors.push(`Package Title  Assertion Failed: Actual Field is "${title}" and Expected Field is "Moshi Moshi"`);
    }

    try {

      expect(coverage).toBe("Japan");
    } catch (error) {
      assertionErrors.push(`Package Coverage Assertion Failed: Actual Field is "${coverage}" and Expected Field is "Japan"`);
    }

    try {
      expect(data).toBe("1 GB");
    } catch (error) {
      assertionErrors.push(`Package Data Assertion Failed: Actual Field is "${data}" and Expected Field is "1 GB"`);
    }

    try {
      expect(validity).toBe("7 Days");
    } catch (error) {
      assertionErrors.push(`Package Validity Assertion Failed: Actual Field is "${validity}" and Expected Field is "7 Days"`);
    }

    try {
      expect(price).toBe("$4.50");
    } catch (error) {
      assertionErrors.push(`Package Price Assertion Failed: Actual Field is "${price}" and Expected Field is "$4.50"`);
    }
    // Report all assertion errors at the end
    if (assertionErrors.length > 0) {
      throw new Error(`Soft Assertion Failures:\n${assertionErrors.join('\n')}`);
    }
  });
});