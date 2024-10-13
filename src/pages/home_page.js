
class HomePage {

  /**
   * Initializes a new instance of the Airalo Home Page class 
   * 
   * The constructor sets up the Playwright page object
   * 
   * @param {Page} page - The Playwright page object for interacting with the web page.
   
   */
  constructor(page) {
    this.page = page;
  }

  /**
 * Asynchronously retrieves the logo element from the Airalo home page.
 * 
 * This method uses the Playwright page object to locate and return the
 * element identified by the test ID 'airalo-logo'. It is intended for
 * use in automated testing to interact with the logo on the page.
 * 
 * @returns {Promise<ElementHandle>} A promise that resolves to the element
 *                                   representing the logo, or `null` if the element is not found.
 */

  async getLogo() {
    return await this.page.getByTestId('airalo-logo');
  }

  /**
 * Asynchronously clicks the "ACCEPT" button to accept the privacy policy on the Airalo home page.
 * 
 * This method uses the Playwright page object to find the button with the role 'button' 
 * and the name 'ACCEPT', then simulates a click on it. It is intended for use in automated
 * testing scenarios where user consent is required to proceed.
 * 
 * @returns {Promise<void>} A promise that resolves when the click action is completed.
 */

  async acceptPrivacy() {
    await this.page.getByRole('button', { name: 'ACCEPT' }).click();
  }

  /**
 * Asynchronously clicks the "ALLOW" button to grant notification permissions on the Airalo home page.
 * 
 * This method uses the Playwright page object to find the button with the role 'button' 
 * and the exact name 'ALLOW', then simulates a click on it. It is intended for use in automated
 * testing scenarios where user consent for notifications is required to proceed.
 * 
 * @returns {Promise<void>} A promise that resolves when the click action is completed.
 */

  async allowNotifications() {
    await this.page.waitForSelector("//button[@id='wzrk-confirm']");
    await this.page.getByRole('button', { name: 'ALLOW', exact: true }).click();
  }

  /**
 * Asynchronously changes the currency setting on the Airalo home page.
 * 
 * This method performs a series of actions to change the displayed currency 
 * from Euro (€ EUR) to US Dollar (USD). It first clicks on the currency selection header, 
 * then selects the US Dollar option, and finally clicks the "UPDATE" button to confirm the change.
 * 
 * @returns {Promise<void>} A promise that resolves when all click actions are completed.
 */

  async changeCurrency() {
    await this.page.getByTestId('€ EUR-header-language').click();
    await this.page.getByTestId('USD-currency-select').click();
    await this.page.getByTestId('UPDATE-button').click();
  }

  /**
 * Asynchronously selects a country from the search input on the Airalo home page.
 * 
 * This method interacts with the search input field to allow users to search for 
 * and select a specific country. It first clicks on the search input, fills in the 
 * specified country name, and then clicks on the corresponding country option from 
 * the filtered list of suggestions.
 * 
 * @param {string} countrySelection - The name of the country to be selected from the dropdown.
 * @returns {Promise<void>} A promise that resolves when all actions are completed.
 */

  async countrySelection(countrySelection) {
    await this.page.getByTestId('search-input').click();
    await this.page.getByTestId('search-input').fill(countrySelection);
    await this.page.locator('li').filter({ hasText: countrySelection }).click();
  }

  /**
 * Asynchronously selects the eSIM package for Japan from the options available on the Airalo home page.
 * 
 * This method clicks on the link corresponding to the specific eSIM package, 
 * which includes details such as coverage, data allowance, validity, and price. 
 * It is intended for use in automated testing scenarios where the user needs to select
 * a specific eSIM package for activation.
 * 
 * @returns {Promise<void>} A promise that resolves when the click action is completed.
 */

  async eSimSelectionPackage() {
    await this.page.getByRole('link', { name: 'Moshi Moshi Moshi Moshi  COVERAGE Japan  DATA 1 GB  VALIDITY 7 Days PRICE $4' }).click();
  }

  /**
 * Asynchronously retrieves the title of the eSIM package.
 * 
 * This method locates the title element for the eSIM package on the Airalo home page,
 * specifically looking for the text "Moshi Moshi". It returns the text content of the 
 * title element, which can be useful for verifying the package's name during automated testing.
 * 
 * @returns {Promise<string | null>} A promise that resolves to a string containing the title of the eSIM package,
 *                                     or `null` if the element is not found.
 */
  async getPackageTitle() {
    return await this.page.getByTestId('sim-detail-operator-title').getByText("Moshi Moshi").textContent();
  }

  /**
 * Asynchronously retrieves the coverage information for the eSIM package.
 * 
 * This method locates the coverage details for the eSIM package on the Airalo home page, 
 * specifically looking for the coverage related to Japan. It retrieves the text content, 
 * removes any excess whitespace, and returns the cleaned coverage text. 
 * This method is useful for verifying the coverage area of the selected eSIM package 
 * during automated testing.
 * 
 * @returns {Promise<string>} A promise that resolves to a string containing the cleaned coverage text.
 */

  async getPackageCoverage() {
    const coverage = await this.page.getByTestId('sim-detail-info-list').getByText('Japan');
    const coverageContent = await coverage.textContent(); // Await the text content
    const coverageText = coverageContent ? coverageContent.replace(/\s+/g, '') : '';
    return coverageText;
  }

  /**
 * Asynchronously retrieves the data information for the eSIM package.
 * 
 * This method locates the data information for the eSIM package on the Airalo home page,
 * specifically looking for the text '1 GB'. It retrieves the text content, cleans it up 
 * by removing excess whitespace, and formats it before returning. 
 * This method is useful for verifying the data allowance of the selected eSIM package 
 * during automated testing.
 * 
 * @returns {Promise<string>} A promise that resolves to a string containing the cleaned data text.
 */

  async getPackageData() {
    const data = await this.page.getByTestId('sim-detail-info-list').getByText('1 GB');
    const dataContent = await data.textContent(); // Await the text content
    const dataText = dataContent.replace(/^\s*(\d+)\s*(\w+)\s*$/, "$1 $2");
    return dataText;
  }

  /**
 * Asynchronously retrieves the validity information for the eSIM package.
 * 
 * This method locates the validity information for the eSIM package on the Airalo home page,
 * specifically looking for the text '7 Days'. It retrieves the text content, cleans it up 
 * by removing excess whitespace, and formats it before returning. 
 * This method is useful for verifying the validity period of the selected eSIM package 
 * during automated testing.
 * 
 * @returns {Promise<string>} A promise that resolves to a string containing the cleaned validity text.
 */

  async getPackageValidity() {
    const validity = await this.page.getByTestId('sim-detail-info-list').getByText('7 Days');
    const validityContent = await validity.textContent(); // Await the text content
    const validityText = validityContent.replace(/^\s*(\d+)\s*(\w+)\s*$/, "$1 $2");
    return validityText;
  }

  /**
 * Asynchronously retrieves the price information for the eSIM package.
 * 
 * This method locates the price information for the eSIM package on the Airalo home page,
 * specifically looking for the text '$4.50 USD'. It retrieves the text content, cleans it up 
 * by removing excess whitespace, and formats it before returning. 
 * This method is useful for verifying the price of the selected eSIM package 
 * during automated testing.
 * 
 * @returns {Promise<string>} A promise that resolves to a string containing the cleaned price value.
 */

  async getPackagePrice() {
    const price = await this.page.getByTestId('sim-detail-info-list').getByText('$4.50 USD');
    const priceValue = await price.textContent(); // Await the text content
    const priceText = priceValue ? priceValue.replace(/\s+/g, '') : '';
    return priceText.replace("USD", "").trim();
  }

}

export { HomePage };