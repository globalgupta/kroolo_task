const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task-controller');

router.get('/o-auth', taskController.oAuth);
router.get('/auth/callback', taskController.oAuthCallback);
router.get('/list-task', taskController.listTask);
router.get('/list-workspace', taskController.listWorkspace);
router.post('/register-webhook', taskController.registerWebhook);
router.post('/asana-webhook-handler', taskController.webhookHandler);


module.exports = router;