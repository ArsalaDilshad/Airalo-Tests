import { test, expect } from '@playwright/test';
import { CLIENT_ID, API_BASE_URL, CLIENT_SECRET } from '../../src/config/constants.js';

test.describe('Tests for POST - Submit Order API', () => {
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
     * Submits a new order and validates that the response code is 200.
     * 
     * This test sends a POST request to the eSIMs API endpoint to create a new order with the specified 
     * quantity, package ID, type, and description. It sets the necessary headers for content type 
     * and authorization. After sending the request, it asserts that the response status code is 200, 
     * indicating a successful order submission. The test then verifies that the response body contains 
     * the correct order details, including the quantity of ordered SIMs, the package ID, and the description. 
     * Additionally, it checks that the number of SIM objects returned in the response matches the quantity 
     * specified in the order. This ensures that the API behaves as expected when creating new orders 
     * and returns the correct data in the response.
     * 
     * @returns {Promise<void>} A promise that resolves when the test execution is complete.
     */

    test('Submit a new order and validate response code is 200', async () => {
        const formData = {
            quantity: '6',
            package_id: 'merhaba-7days-1gb',
            type: 'sim',
            description: '6 sim merhaba-7days-1gb'
        };
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const response = await request.post(API_BASE_URL + 'orders', {
            form: formData,
            headers: headers
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        //Assert order details
        expect(responseBody.data.quantity).toEqual(6);// Verify the order contains correct ordered sims quantity 
        expect(responseBody.data.package_id).toEqual("merhaba-7days-1gb"); // Verify order package id is correct
        expect(responseBody.data.description).toEqual("6 sim merhaba-7days-1gb");
        //Assert eSIMS properties
        expect(Object.values(responseBody.data.sims).length).toEqual(6); // Verify that 6 sims objects are present 
    });

    /**
     * Validates that an unauthenticated user receives a 401 response code.
     * 
     * This test sends a POST request to the eSIMs API endpoint to create a new order 
     * with specified details such as quantity, package ID, type, and description. 
     * However, it intentionally sets the Authorization header to an empty bearer token, 
     * simulating an unauthenticated user. After sending the request, it asserts that 
     * the response status code is 401, indicating that the user is not authorized to 
     * perform the action. This test ensures that the API correctly enforces authentication 
     * requirements and responds appropriately to unauthorized requests.
     * 
     * @returns {Promise<void>} A promise that resolves when the test execution is complete.
     */
    test('Validate that for unauthenticated user the response code is 401', async () => {
        const formData = {
            quantity: '6',
            package_id: 'merhaba-7days-1gb',
            type: 'sim',
            description: '6 sim merhaba-7days-1gb'
        };
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer '
        };
        const response = await request.post(API_BASE_URL + 'orders', {
            form: formData,
            headers: headers
        });

        expect(response.status()).toBe(401);
    });

    /**
     * Validates that a malformed request body returns a 422 response code.
     * 
     * This test sends a POST request to the eSIMs API endpoint to create a new order 
     * with specified details, including quantity, package ID, type, and description. 
     * However, it includes an additional field, `brand_settings_name`, set to null, 
     * which is not expected or valid for the API. This simulates a malformed request 
     * body. After sending the request, the test asserts that the response status code 
     * is 422, indicating that the server could not process the request due to client-side 
     * input errors. This test ensures that the API properly validates request data and 
     * responds appropriately to malformed requests.
     * 
     * @returns {Promise<void>} A promise that resolves when the test execution is complete.
     */
    test('Validate that for malformed request body response code is 422', async () => {
        const formData = {
            quantity: '6',
            package_id: 'merhaba-7days-1gb',
            type: 'sim',
            description: '6 sim merhaba-7days-1gb',
            brand_settings_name: null
        };

        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        console.log(API_BASE_URL + 'orders');

        const response = await request.post(API_BASE_URL + 'orders', {
            form: formData,
            headers: headers
        });

        //Assert response code is correct
        expect(response.status()).toBe(422);

    });

    /**
     * Validates that the absence of mandatory fields returns a 422 response code.
     * 
     * This test sends a POST request to the eSIMs API endpoint to create a new order 
     * without providing required fields: quantity, package ID, and type. The request 
     * includes a valid description, but leaves the mandatory fields empty. This simulates 
     * a scenario where required data is missing. After sending the request, the test asserts 
     * that the response status code is 422, indicating that the server could not process 
     * the request due to missing mandatory fields. The test further checks that the response 
     * body contains specific error messages related to the missing fields. This ensures that 
     * the API properly validates the presence of required fields and responds with appropriate 
     * error messages when they are not provided.
     * 
     * @returns {Promise<void>} A promise that resolves when the test execution is complete.
     */
    test('Validate that if mandatory field is not provided then response code is 422', async () => {
        const formData = {
            quantity: '',
            package_id: '',
            type: '',
            description: '6 sim merhaba-7days-1gb'
        };

        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const response = await request.post(API_BASE_URL + 'orders', {
            form: formData,
            headers: headers
        });

        //Assert response code is correct
        expect(response.status()).toBe(422);
        const responseBody = await response.json();

        //Assert error messages in the response
        expect(responseBody.data.package_id).toBe("The package id field is required.");
        expect(responseBody.data.quantity).toBe("The quantity field is required.");
        expect(responseBody.data.type).toBe("The selected type is invalid.");

    });

    /**
     * Validates that submitting an order with a quantity greater than 50 
     * and an invalid package ID returns a 422 response code.
     * 
     * This test sends a POST request to the eSIMs API endpoint to create a new order 
     * with a quantity of 100, which exceeds the maximum allowed limit of 50, and 
     * provides an invalid package ID. The test simulates a scenario where the user 
     * attempts to order an excessive quantity of SIMs with a package ID that does 
     * not exist or is not valid. After sending the request, the test asserts that 
     * the response status code is 422, indicating that the server cannot process 
     * the request due to validation errors. The test further checks that the 
     * response body contains specific error messages for both the package ID and 
     * the quantity fields, ensuring that the API provides clear feedback on 
     * validation failures.
     * 
     * @returns {Promise<void>} A promise that resolves when the test execution is complete.
     */
    test('Validate that for quantity greater than 50 and invalid package id the response code is 422', async () => {
        const formData = {
            quantity: '100',
            package_id: 'areeba-30days-3gbs',
            type: 'sim',
            description: '6 sim merhaba-7days-1gb'
        };

        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        
        const response = await request.post(API_BASE_URL + 'orders', {
            form: formData,
            headers: headers
        });

        //Assert response code is correct
        expect(response.status()).toBe(422);
        const responseBody = await response.json();

        //Assert error messages in the response
        expect(responseBody.data.package_id).toBe("The selected package is invalid.");
        expect(responseBody.data.quantity).toBe("The quantity may not be greater than 50.");
    });
});
