import Message from "../models/message.js";

// GET ALL MESSAGES
export const getAllMessages = async (req, res) => {
  try {

    const messages = await Message.find()
      .populate("sender", "firstName lastName email role")
      .populate("receiver", "firstName lastName email role")
      .sort({ createdAt: -1 });


    return res.status(200).json({
      count: messages.length,
      messages,
    });

  } catch (error) {

    console.error("get all messages error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// GET MESSAGES BETWEEN USERS

export const getMessagesBetweenUsers = async (req, res) => {
  try {

    const { userId1, userId2 } = req.params;


    const messages = await Message.find({
      $or: [
        {
          sender: userId1,
          receiver: userId2,
        },
        {
          sender: userId2,
          receiver: userId1,
        },
      ],
    })
      .populate("sender", "firstName lastName email role")
      .populate("receiver", "firstName lastName email role")
      .sort({ createdAt: 1 });


    return res.status(200).json({
      count: messages.length,
      messages,
    });

  } catch (error) {

    console.error("get messages between users error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



// ADMIN DELETE MESSAGE

export const adminDeleteMessage = async (req, res) => {
  try {

    const { messageId } = req.params;


    const message = await Message.findByIdAndDelete(messageId);


    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }


    return res.status(200).json({
      message: "Message deleted successfully",
    });

  } catch (error) {

    console.error("admin delete message error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};