exports.constantURL = {
    oauth_url: 'https://app.asana.com/-/oauth_authorize',
    oauth_token_url: 'https://app.asana.com/-/oauth_token',
    list_task_url: 'https://app.asana.com/api/1.0/tasks',
    list_workspace_url: 'https://app.asana.com/api/1.0/workspaces',
    asana_webhook_url: 'https://app.asana.com/api/1.0/webhooks',
    webhook_handler_api_url: 'https://asana.loca.lt/asana-webhook-handler'     //localtunnel is used to create https url for webhook
}

exports.validationMessage = {
    AUTH_CODE_REQUIRED: 'Authorization code is required.',
    INTERNAL_SERVER_ERROR: 'Internal server error.',
    DATA_SUCCEESS: 'Success.',
    WORKSPACE_REQUIRED: 'Workspace Id is required.',
    ACCESS_TOKEN_REQUIRED: 'Access token is required.',
    TASK_REQUIRED: 'Task Id is required.',
}