const express = require("express");
const messageController = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all conversations
router.get("/conversations", messageController.getConversations);

// Get messages for a specific conversation
router.get("/conversations/:conversationId", messageController.getMessages);

// Send a new message
router.post("/", messageController.sendMessage);

// Mark messages as read
router.put("/conversations/:conversationId/read", messageController.markAsRead);

// Delete a message
router.delete("/:messageId", messageController.deleteMessage);

// Get unread message count
router.get("/unread", messageController.getUnreadCount);

module.exports = router;
