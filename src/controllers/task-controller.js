const helper = require('../helpers/api-response');
const { body, query, validationResult, header } = require('express-validator');
const commonFunction = require('../helpers/common-function');
const { constantURL, validationMessage } = require('../helpers/constant');
const axios = require('axios');


// This authorizes using the Asana client ID, redirects to the Asana redirect URI.
exports.oAuth = async (req, res) => {
    try {
        const { ASANA_CLIENT_ID, ASANA_REDIRECT_URI } = process.env;

        const authUrl = `${constantURL?.oauth_url}?client_id=${ASANA_CLIENT_ID}&redirect_uri=${encodeURIComponent(ASANA_REDIRECT_URI)}&response_type=code`;

        res.redirect(authUrl);
    }
    catch (err) {
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
};


// After authorizing with the above API, the callback URL returns the access token and other data for further use. 
exports.oAuthCallback = [
    query('code').trim().isString().notEmpty().withMessage(validationMessage.AUTH_CODE_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { code } = req.query;
            const { ASANA_CLIENT_ID, ASANA_CLIENT_SECRET, ASANA_REDIRECT_URI } = process.env;

            const tokenUrl = `${constantURL?.oauth_token_url}?grant_type=authorization_code&client_id=${ASANA_CLIENT_ID}&client_secret=${ASANA_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(ASANA_REDIRECT_URI)}&code=${encodeURIComponent(code)}`;

            const tokenResponse = await axios.post(
                tokenUrl,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            console.log('Access Token:', tokenResponse.data);

            return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, tokenResponse.data);
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


// This is used to list tasks using the Workspace ID.
exports.listTask = [
    header('access_token').trim().isString().notEmpty().withMessage(validationMessage.ACCESS_TOKEN_REQUIRED),
    query('workspace_id').trim().isString().notEmpty().withMessage(validationMessage.WORKSPACE_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { access_token } = req.headers;;
            const { workspace_id } = req.query;;

            const response = await axios.get(constantURL?.list_task_url, {
                headers: { Authorization: `Bearer ${access_token}` },
                params: {
                    assignee: 'me',
                    workspace: workspace_id,
                    completed_since: 'now',
                },
            });

            return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, response.data);
        }
        catch (err) {
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


// This is used to list workspaces.
exports.listWorkspace = [
    header('access_token').trim().isString().notEmpty().withMessage(validationMessage.ACCESS_TOKEN_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { access_token } = req.headers;

            const response = await axios.get(constantURL?.list_workspace_url, {
                headers: { Authorization: `Bearer ${access_token}`, },
            });

            return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, response.data);
        }
        catch (err) {
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


// This handles events like status changes or comments and logs messages based on the event type.
exports.webhookHandler = async (req, res) => {
    try {
        const hookSecret = req.headers['x-hook-secret'];

        // Handle the verification handshake
        if (hookSecret) {
            res.setHeader('X-Hook-Secret', hookSecret);
            return res.status(200).end();
        }

        const events = req.body.events || [];

        events.forEach(event => {
            const { resource, action } = event;

            if (resource.resource_type === 'task' && action === 'changed') {
                console.log(`Task field updated! GID: ${resource.gid}`);
            }
            else if (resource.resource_type === 'story' && action === 'added') {
                console.log(`Comment or status update on task! Story GID: ${resource.gid}`);
            }
            else {
                console.log(`Other event:`, event);
            }
        });

        res.status(200).end();
    }
    catch (err) {
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
};


// This is used to register the Asana webhook handler URL with the Asana app for the first time.
exports.registerWebhook = [
    header('access_token').trim().isString().notEmpty().withMessage(validationMessage.ACCESS_TOKEN_REQUIRED),
    body('task_id').trim().isString().notEmpty().withMessage(validationMessage.TASK_REQUIRED),
    commonFunction.validateRequest,
    async (req, res) => {
        try {
            const { access_token } = req.headers;
            const { task_id } = req.body;

            const response = await axios.post(constantURL?.asana_webhook_url, {
                data: {
                    resource: task_id,
                    target: constantURL?.webhook_handler_api_url
                }
            }, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, response.data);
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }];