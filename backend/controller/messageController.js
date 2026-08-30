import Message from "../models/message.js";
import User from "../models/user.js";


// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {

    const senderId = req.user._id;
    const { receiverId, content } = req.body;


    // VALIDATE INPUT

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({
        message: "Receiver and message content are required",
      });
    }


    // PREVENT SELF MESSAGE
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        message: "You cannot send a message to yourself",
      });
    }


    // CHECK RECEIVER

    const receiver = await User.findById(receiverId).select("-password");

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }


    // CREATE MESSAGE
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });


    // POPULATE USER INFORMATION
    await message.populate([
      {
        path: "sender",
        select: "firstName lastName email role",
      },
      {
        path: "receiver",
        select: "firstName lastName email role",
      },
    ]);


    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });

  } catch (error) {

    console.error("send message error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// GET MY CONVERSATIONS
export const getMyConversations = async (req, res) => {
  try {

    const userId = req.user._id;


    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate("sender", "firstName lastName email")
      .populate("receiver", "firstName lastName email")
      .sort({ createdAt: -1 });


    // BUILD UNIQUE CONVERSATIONS
    const conversations = new Map();


    for (const message of messages) {

      const senderId = message.sender._id.toString();
      const receiverId = message.receiver._id.toString();


      const otherUser =
        senderId === userId.toString()
          ? message.receiver
          : message.sender;


      const conversationKey = [
        senderId,
        receiverId,
      ].sort().join("_");


      // Only keep the latest message
      if (!conversations.has(conversationKey)) {

        const unreadCount = await Message.countDocuments({
          sender: otherUser._id,
          receiver: userId,
          isRead: false,
        });


        conversations.set(conversationKey, {
          user: otherUser,
          lastMessage: message,
          unreadCount,
        });

      }

    }


    return res.status(200).json({
      count: conversations.size,
      conversations: Array.from(conversations.values()),
    });

  } catch (error) {

    console.error("get conversations error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// GET CONVERSATION BETWEEN TWO USERS

export const getConversation = async (req, res) => {
  try {

    const currentUserId = req.user._id;
    const { userId } = req.params;


    
    const otherUser = await User.findById(userId)
      .select("firstName lastName email role");


    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUserId,
        },
      ],
    })
      .populate("sender", "firstName lastName email")
      .populate("receiver", "firstName lastName email")
      .sort({ createdAt: 1 });

    // MARK RECEIVED MESSAGES AS READ

    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );


    return res.status(200).json({
      count: messages.length,
      user: otherUser,
      messages,
    });

  } catch (error) {

    console.error("get conversation error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// MARK MESSAGE AS READ

export const markMessageAsRead = async (req, res) => {
  try {

    const userId = req.user._id;
    const { messageId } = req.params;


    const message = await Message.findOne({
      _id: messageId,
      receiver: userId,
    });


    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }


    message.isRead = true;

    await message.save();


    return res.status(200).json({
      message: "Message marked as read",
      data: message,
    });

  } catch (error) {

    console.error("mark message read error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// GET UNREAD MESSAGE COUNT


export const getUnreadMessageCount = async (req, res) => {
  try {

    const userId = req.user._id;


    const count = await Message.countDocuments({
      receiver: userId,
      isRead: false,
    });


    return res.status(200).json({
      count,
    });

  } catch (error) {

    console.error("get unread count error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// DELETE MY MESSAGE

export const deleteMyMessage = async (req, res) => {
  try {

    const userId = req.user._id;
    const { messageId } = req.params;


    const message = await Message.findOneAndDelete({
      _id: messageId,
      sender: userId,
    });


    if (!message) {
      return res.status(404).json({
        message: "Message not found or you are not allowed to delete it",
      });
    }


    return res.status(200).json({
      message: "Message deleted successfully",
    });

  } catch (error) {

    console.error("delete message error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const getUsersForNewMessage = async (req, res) => {
    try {

        const users = await User.find({
            _id: { $ne: req.user._id },
            role: "student",
        })
        .select("firstName lastName email")
        .sort({
            firstName: 1,
        });

        return res.status(200).json({
            users,
        });

    } catch (error) {

        console.error(
            "get users for new message error",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};