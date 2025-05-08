# Step 1:
Use the o-auth API to authorize and retrieve the access token.

# Step 2:
Use the access token to call the list-workspace API and fetch the workspace ID.
Then, use that workspace ID as a query parameter in the list-task API to retrieve tasks.

# Step 3:
Use the register-webhook API to register the webhook for the first time.
After registration, make any changes (e.g., update task status or add comments). These actions will trigger webhook events, and messages will be logged to the console accordingly.

# Important Note
The webhook URL "https://asana.loca.lt" must match the one displayed in the terminal log when using localtunnel.
Make sure this URL is active during webhook registration and testing.

Postman Collection is included inside this project to test the APIs.

For any questions regarding the project or code, please contact: Aditya - 8984865485