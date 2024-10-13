import { test, expect } from '@playwright/test';
import { CLIENT_ID, API_BASE_URL, CLIENT_SECRET } from '../../src/config/constants.js';

test.describe('Tests for GET- eSIMS list API', () => {
    let request;
    let token;

    /**
     * Setup function that runs before all tests in the suite.
     * 
     * This asynchronous function creates a new context for API requests using Playwright's 
     * request functionality. The new context can be used for making HTTP requests 
     * independently of the browser context, allowing for isolated API testing.
     * 
     * 
     * @async
     * @function
     * @param {Object} context - The context object provided by Playwright, containing various utilities.
     * @param {Playwright} context.playwright - The Playwright object used to create a new request context.
     * @returns {Promise<void>} Resolves once the new request context has been created.
     */
    test.beforeAll(async ({ playwright }) => {
        request = await playwright.request.newContext({
        });
        const formData = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials'
        };
        const response = await request.post(API_BASE_URL + 'token', {
            form: formData
        });
        // Check response status
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        token = responseBody.data.access_token;
    });

    /**
     * Cleanup function that runs after all tests in the suite.
     * 
     * This asynchronous function disposes of the request context created in the 
     * `beforeAll` setup. Disposing the context ensures that any resources used 
     * during the tests are properly released, preventing potential memory leaks 
     * or resource exhaustion.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once the request context has been successfully disposed of.
     */
    test.afterAll(async () => {
        await request.dispose();
    });

    /**
 * Tests the API response code for a valid request to the eSIMs endpoint.
 * 
 * This test sends a GET request to the eSIMs API endpoint and validates that
 * the response status code is 200, indicating a successful request. It sets the
 * necessary headers, including 'Accept' and 'Authorization', to ensure the
 * request is properly authenticated. This is crucial for verifying that the API
 * behaves as expected when valid credentials are provided.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */
    test('Validate for a valid request the response code is 200 ', async () => {
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const response = await request.get(API_BASE_URL + 'sims', {
            headers: headers
        });

        expect(response.status()).toBe(200);
    });

    /**
 * Tests the API response for order information when the order query parameter is included.
 * 
 * This test sends a GET request to the eSIMs API endpoint with the query parameter 
 * `include=order`, which requests additional order information in the response. 
 * It sets the necessary headers for content type and authorization. After sending 
 * the request, it asserts that the response body contains the expected link 
 * for the first page of the results. This is important for verifying that the 
 * API returns the correct information when the appropriate query parameters are provided.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */

    test('Validate the response contains order information once order is used as query parameter', async () => {
        const queryParams = "?include=order";
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers
        });

        const responseBody = await response.json();
        expect(responseBody.links.first).toEqual("https://sandbox-partners-api.airalo.com/v2/sims?include=order&page=1");

    });

    /**
 * Tests the API response for order and user information when the order.user query parameter is included.
 * 
 * This test sends a GET request to the eSIMs API endpoint with the query parameter 
 * `include=order.user`, which requests additional order and user information in the response. 
 * It sets the necessary headers for content type and authorization. After sending 
 * the request, it asserts that the response body contains the expected link 
 * for the first page of the results. This is important for verifying that the 
 * API returns the correct information when the appropriate query parameters are provided.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */

    test('Validate the response contains order information once order.user is used as query parameter', async () => {
        const queryParams = "?include=order.user";
        // Define custom headers
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        // Send the POST request with headers and body
        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            // This automatically sets the content type to 'application/x-www-form-urlencoded'
            headers: headers // Include the custom headers
        });

        //Assert response code is correct
        const responseBody = await response.json();
        expect(responseBody.links.first).toEqual("https://sandbox-partners-api.airalo.com/v2/sims?include=order.user&page=1");
    });

    /**
 * Tests the API response for order status information when the order.status query parameter is included.
 * 
 * This test sends a GET request to the eSIMs API endpoint with the query parameter 
 * `include=order.status`, which requests additional order status information in the response. 
 * It sets the necessary headers for content type and authorization. After sending 
 * the request, it asserts that the response body contains the expected link 
 * for the first page of the results. This is important for verifying that the 
 * API returns the correct information when the appropriate query parameters are provided.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */
    test('Validate the response contains order information once order.status is used as query parameter', async () => {
        const queryParams = "?include=order.status";
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers
        });

        const responseBody = await response.json();
        expect(responseBody.links.first).toEqual("https://sandbox-partners-api.airalo.com/v2/sims?include=order.status&page=1");
    });

    /**
 * Tests the API response for the correct number of orders when the limit query parameter is included.
 * 
 * This test sends a GET request to the eSIMs API endpoint with the query parameters 
 * `include=order` and `limit=2`, which requests order information limited to 2 items in the response. 
 * It sets the necessary headers for content type and authorization. After sending 
 * the request, it asserts that the number of order entries in the response data is exactly 2. 
 * This is important for verifying that the API correctly implements the limit functionality 
 * when specified in the request.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */
    test('Validate the response contains correct orders numbers once limit is used as query parameter', async () => {
        const queryParams = "?include=order&limit=2";
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers
        });

        const responseBody = await response.json();
        expect(Object.values(responseBody.data).length).toEqual(2);
    });

    /**
 * Tests the API response for the correct page information when the page query parameter is included.
 * 
 * This test sends a GET request to the eSIMs API endpoint with the query parameter 
 * `page=2`, which requests the data for the specified page in the response. 
 * It sets the necessary headers for content type and authorization. After sending 
 * the request, it asserts that the `current_page` field in the response metadata 
 * matches the specified page number. This is important for verifying that the 
 * API correctly handles pagination when a specific page number is provided.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */

    test('Validate that response contains correct page information once page is provided as query parameter', async () => {
        const queryParams = "?page=2"
        // Define custom headers
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        // Send the POST request with headers and body
        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers
        });

        //Assert response code is correct
        const responseBody = await response.json();
        expect(responseBody.meta.current_page).toEqual(2);
    });

    /**
 * Tests the API response for filtering based on the created date passed as a query parameter.
 * 
 * This test sends a GET request to the eSIMs API endpoint with the query parameter 
 * `filter[created_at]=2024-01-01 - 2024-10-13`, which requests data filtered 
 * by the specified date range. It sets the necessary headers for content type 
 * and authorization. After sending the request, it asserts that the `created_at` 
 * date of randomly selected entries in the response data is less than or equal 
 * to the current date. This is important for verifying that the API correctly filters 
 * the data based on the provided date range.
 * 
 * @returns {Promise<void>} A promise that resolves when the test execution is complete.
 */

    test('Validate that response gets filtered for created date passed as query parameter', async () => {
        const queryParams = "?filter[created_at]=2024-01-01 - 2024-10-13"
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers
        });

        const responseBody = await response.json();
        const dataObjects = Object.values(responseBody.data);
        const createdDateArray = dataObjects.map(item => item.created_at)
        const randomIndex = Math.floor(Math.random() * createdDateArray.length);
        const createdDate = createdDateArray[randomIndex];
        const date1 = new Date(createdDate).toISOString();
        const date2 = new Date().toISOString();
        expect(date1 <= date2);

    });
    /**
           * Tests the API response for filtering based on the provided ICCID as a query parameter.
           * 
           * This test sends a GET request to the eSIMs API endpoint with the query parameter 
           * `filter[iccid]=894000000000010490`, which requests data filtered by the specified ICCID. 
           * It sets the necessary headers for content type and authorization. After sending the request, 
           * it asserts that the ICCID of the first entry in the response data matches the expected ICCID value. 
           * This is important for verifying that the API correctly filters the data based on the provided ICCID.
           * 
           * @returns {Promise<void>} A promise that resolves when the test execution is complete.
           */
    test('Validate that response gets filtered provided iccid as query parameter', async () => {
        const queryParams = "?filter[iccid]=894000000000010490"
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        // Send the POST request with headers and body
        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers // Include the custom headers
        });

        //Assert response code is correct
        const responseBody = await response.json();
        const dataObjects = Object.values(responseBody.data);
        const iccid = dataObjects.map(item => item.iccid)
        const iccidValue = iccid[0];
        expect(iccidValue).toEqual("894000000000010490");

    });

    /**
     * Tests the API response for a malformed request by providing an invalid limit parameter.
     * 
     * This test sends a GET request to the eSIMs API endpoint with the query parameter 
     * `include=order&limit=ABC`, which uses a non-integer value for the limit. 
     * It sets the necessary headers for content type and authorization. After sending 
     * the request, it asserts that the response status code is 422, indicating that 
     * the request was malformed. Additionally, it verifies that the error message 
     * returned in the response body specifies that the limit must be an integer. 
     * This is important for ensuring that the API correctly handles invalid input 
     * and returns appropriate error messages.
     * 
     * @returns {Promise<void>} A promise that resolves when the test execution is complete.
     */

    test('Validate that for malformed request returned response code is 422 ', async () => {
        const queryParams = "?include=order&limit=ABC"
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        // Send the POST request with headers and body
        const response = await request.get(API_BASE_URL + 'sims' + queryParams, {
            headers: headers // Include the custom headers
        });

        //Assert response code is correct
        const responseBody = await response.json();
        expect(response.status()).toBe(422);
        expect(responseBody.data.limit).toEqual("The limit must be an integer.");

    });
});

