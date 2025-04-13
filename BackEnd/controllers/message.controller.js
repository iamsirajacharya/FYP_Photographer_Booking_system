const db = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");

const Message = db.Message;
const User = db.User;
const Photographer = db.Photographer;

// Get all conversations for the authenticated user
exports.getConversations = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Find all messages where the user is either sender or recipient
  const messages = await Message.findAll({
    where: {
      [Op.or]: [{ senderId: userId }, { recipientId: userId }],
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: User,
        as: "recipient",
        attributes: ["id", "name", "profileImage"],
      },
    ],
  });

  // Extract unique conversation partners
  const conversations = [];
  const conversationMap = new Map();

  messages.forEach((message) => {
    // Determine the conversation partner (the other user)
    const partnerId =
      message.senderId === userId ? message.recipientId : message.senderId;
    const partner =
      message.senderId === userId ? message.recipient : message.sender;

    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        id: partnerId,
        name: partner.name,
        profileImage: partner.profileImage,
        lastMessage: message.content,
        lastMessageTime: message.createdAt,
        unreadCount: message.senderId !== userId && !message.read ? 1 : 0,
      });
    } else if (message.senderId !== userId && !message.read) {
      // Increment unread count for existing conversation
      const conversation = conversationMap.get(partnerId);
      conversation.unreadCount += 1;
    }
  });

  // Convert map to array
  conversationMap.forEach((value) => {
    conversations.push(value);
  });

  // Sort by most recent message
  conversations.sort(
    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  res.json({ conversations });
});

// Get messages for a specific conversation
exports.getMessages = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { conversationId } = req.params;

  // Validate that conversationId is a valid user ID
  const conversationPartner = await User.findByPk(conversationId);
  if (!conversationPartner) {
    return res.status(404).json({ message: "Conversation partner not found" });
  }

  // Find all messages between the two users
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId, recipientId: conversationId },
        { senderId: conversationId, recipientId: userId },
      ],
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: User,
        as: "recipient",
        attributes: ["id", "name", "profileImage"],
      },
    ],
  });

  // Mark all unread messages as read
  await Message.update(
    { read: true, readAt: new Date() },
    {
      where: {
        senderId: conversationId,
        recipientId: userId,
        read: false,
      },
    }
  );

  // Get additional info about the conversation partner
  const partnerInfo = {
    id: conversationPartner.id,
    name: conversationPartner.name,
    profileImage: conversationPartner.profileImage,
  };

  // If the partner is a photographer, get their photographer profile
  if (conversationPartner.role === "photographer") {
    const photographerProfile = await Photographer.findOne({
      where: { userId: conversationPartner.id },
    });

    if (photographerProfile) {
      partnerInfo.photographerId = photographerProfile.id;
      partnerInfo.specialty = photographerProfile.specialty;
      partnerInfo.location = photographerProfile.location;
    }
  }

  res.json({ messages, partner: partnerInfo });
});

// Send a new message
exports.sendMessage = catchAsync(async (req, res) => {
  const senderId = req.userId;
  const { recipientId, content } = req.body;

  // Validate recipient exists
  const recipient = await User.findByPk(recipientId);
  if (!recipient) {
    return res.status(404).json({ message: "Recipient not found" });
  }

  // Create message
  const message = await Message.create({
    senderId,
    recipientId,
    content,
    read: false,
  });

  // Include sender and recipient info in response
  const messageWithUsers = await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: User,
        as: "recipient",
        attributes: ["id", "name", "profileImage"],
      },
    ],
  });

  // Emit socket event for real-time notification
  const io = req.app.get("io");
  if (io) {
    io.to(`user:${recipientId}`).emit("new_message", {
      message: messageWithUsers,
      sender: {
        id: messageWithUsers.sender.id,
        name: messageWithUsers.sender.name,
        profileImage: messageWithUsers.sender.profileImage,
      },
    });
  }

  res.status(201).json({ message: messageWithUsers });
});

// Mark messages as read
exports.markAsRead = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { conversationId } = req.params;

  // Update all unread messages from the conversation partner
  const result = await Message.update(
    { read: true, readAt: new Date() },
    {
      where: {
        senderId: conversationId,
        recipientId: userId,
        read: false,
      },
    }
  );

  res.json({
    message: "Messages marked as read",
    count: result[0], // Number of messages updated
  });
});

// Delete a message
exports.deleteMessage = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { messageId } = req.params;

  // Find the message
  const message = await Message.findByPk(messageId);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  // Check if the user is the sender
  if (message.senderId !== userId) {
    return res
      .status(403)
      .json({ message: "You can only delete your own messages" });
  }

  // Delete the message
  await message.destroy();

  res.json({ message: "Message deleted successfully" });
});

// Get unread message count
exports.getUnreadCount = catchAsync(async (req, res) => {
  const userId = req.userId;

  // Count unread messages where user is recipient
  const count = await Message.count({
    where: {
      recipientId: userId,
      read: false,
    },
  });

  res.json({ unreadCount: count });
});
