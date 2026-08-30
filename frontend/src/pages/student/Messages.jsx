import {
  MessageCircle,
  Send,
  Search,
  Loader2,
  User,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import useMessageStore from "../../store/message";
import userStore from "../../store/user";


const Messages = () => {

  const currentUser = userStore((state) => state.user);

  const {
    conversations,
    messages,
    selectedUser,
    loading,
    fetchConversations,
    fetchConversation,
    sendMessage,
    clearSelectedUser,
    students,
    fetchStudents,
  } = useMessageStore();


  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // New conversation modal
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Student search
  const [studentSearch, setStudentSearch] = useState("");


  // ==================================================
  // LOAD CONVERSATIONS
  // ==================================================

  useEffect(() => {

    fetchConversations();

  }, [fetchConversations]);


  // ==================================================
  // LOAD STUDENTS WHEN MODAL OPENS
  // ==================================================

  useEffect(() => {

    if (showNewMessage) {
      fetchStudents();
    }

  }, [showNewMessage, fetchStudents]);


  // ==================================================
  // OPEN EXISTING CONVERSATION
  // ==================================================

  const handleOpenConversation = async (user) => {

    try {

      await fetchConversation(user._id);

      setShowNewMessage(false);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to load conversation"
      );

    }

  };


  // ==================================================
  // START NEW CONVERSATION
  // ==================================================

  const handleStartConversation = async (student) => {

    try {

      await fetchConversation(student._id);

      setShowNewMessage(false);
      setStudentSearch("");

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to start conversation"
      );

    }

  };


  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const handleSendMessage = async (e) => {

    e.preventDefault();

    if (!message.trim()) return;

    if (!selectedUser) {
      toast.error("Select a student first");
      return;
    }


    try {

      await sendMessage({
        receiverId: selectedUser._id,
        content: message.trim(),
      });

      setMessage("");

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to send message"
      );

    }

  };


  // ==================================================
  // FILTER EXISTING CONVERSATIONS
  // ==================================================

  const filteredConversations =
    conversations?.filter((conversation) => {

      const user = conversation.user;

      const name =
        `${user?.firstName || ""} ${user?.lastName || ""}`
          .toLowerCase();

      return name.includes(
        search.toLowerCase()
      );

    }) || [];


  // ==================================================
  // FILTER STUDENTS FOR NEW MESSAGE
  // ==================================================

  const filteredStudents =
    students?.filter((student) => {

      const name =
        `${student?.firstName || ""} ${student?.lastName || ""}`
          .toLowerCase();

      const email =
        student?.email?.toLowerCase() || "";

      const searchValue =
        studentSearch.toLowerCase();

      return (
        name.includes(searchValue) ||
        email.includes(searchValue)
      );

    }) || [];


  return (
    <AppLayout>

      <TopBar title="Messages" />


      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-180px)] min-h-[500px]">


            {/* ==================================================
                CONVERSATIONS
            ================================================== */}

            <div
              className={`border-r border-slate-200 ${
                selectedUser
                  ? "hidden md:flex"
                  : "flex"
              } flex-col`}
            >


              {/* HEADER */}

              <div className="p-4 border-b border-slate-200">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-semibold text-slate-900">
                      Messages
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Your conversations
                    </p>

                  </div>


                  {/* NEW MESSAGE */}

                  <button
                    onClick={() =>
                      setShowNewMessage(true)
                    }
                    className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition"
                    title="Start new conversation"
                  >

                    <Plus className="w-4 h-4" />

                  </button>

                </div>


                {/* SEARCH EXISTING CONVERSATIONS */}

                <div className="relative mt-4">

                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

              </div>


              {/* CONVERSATIONS */}

              <div className="flex-1 overflow-y-auto">

                {loading &&
                conversations.length === 0 ? (

                  <div className="h-full flex items-center justify-center">

                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />

                  </div>

                ) : filteredConversations.length === 0 ? (

                  <div className="h-full flex items-center justify-center p-6">

                    <div className="text-center">

                      <MessageCircle className="w-10 h-10 text-slate-300 mx-auto" />

                      <p className="text-sm font-medium text-slate-700 mt-3">
                        No conversations
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Click + to start a conversation.
                      </p>

                    </div>

                  </div>

                ) : (

                  filteredConversations.map(
                    (conversation) => (

                      <ConversationItem
                        key={
                          conversation.user._id
                        }
                        conversation={
                          conversation
                        }
                        selected={
                          selectedUser?._id ===
                          conversation.user._id
                        }
                        onClick={() =>
                          handleOpenConversation(
                            conversation.user
                          )
                        }
                      />

                    )
                  )

                )}

              </div>

            </div>


            {/* ==================================================
                CHAT
            ================================================== */}

            <div
              className={`${
                selectedUser
                  ? "flex"
                  : "hidden md:flex"
              } flex-col`}
            >

              {!selectedUser ? (

                <div className="flex-1 flex items-center justify-center">

                  <div className="text-center">

                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">

                      <MessageCircle className="w-8 h-8 text-indigo-600" />

                    </div>

                    <h3 className="text-lg font-semibold text-slate-800 mt-4">
                      Select a conversation
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Select a conversation or click + to message a student.
                    </p>

                    <button
                      onClick={() =>
                        setShowNewMessage(true)
                      }
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >

                      <Plus className="w-4 h-4" />

                      New Message

                    </button>

                  </div>

                </div>

              ) : (

                <>

                  {/* ==================================================
                      CHAT HEADER
                  ================================================== */}

                  <div className="p-4 border-b border-slate-200 flex items-center gap-3">

                    <button
                      onClick={() =>
                        clearSelectedUser()
                      }
                      className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                    >

                      <ArrowLeft className="w-5 h-5" />

                    </button>


                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">

                      <User className="w-5 h-5 text-indigo-600" />

                    </div>


                    <div>

                      <p className="text-sm font-semibold text-slate-900">

                        {selectedUser.firstName}{" "}

                        {selectedUser.lastName}

                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedUser.email}
                      </p>

                    </div>

                  </div>


                  {/* ==================================================
                      MESSAGES
                  ================================================== */}

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {loading &&
                    messages.length === 0 ? (

                      <div className="h-full flex items-center justify-center">

                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />

                      </div>

                    ) : messages.length === 0 ? (

                      <div className="h-full flex items-center justify-center">

                        <div className="text-center">

                          <MessageCircle className="w-8 h-8 text-slate-300 mx-auto" />

                          <p className="text-sm font-medium text-slate-600 mt-3">
                            Start a conversation
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Send a message to{" "}
                            {selectedUser.firstName}.
                          </p>

                        </div>

                      </div>

                    ) : (

                      messages.map((item) => (

                        <MessageBubble
                          key={item._id}
                          message={item}
                          currentUser={currentUser}
                        />

                      ))

                    )}

                  </div>


                  {/* ==================================================
                      MESSAGE FORM
                  ================================================== */}

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-slate-200"
                  >

                    <div className="flex items-center gap-2">

                      <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value)
                        }
                        placeholder="Type a message..."
                        maxLength={2000}
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <button
                        type="submit"
                        disabled={
                          loading ||
                          !message.trim()
                        }
                        className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition"
                      >

                        <Send className="w-4 h-4" />

                      </button>

                    </div>

                  </form>

                </>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          NEW MESSAGE MODAL
      ================================================== */}

      {showNewMessage && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">


            {/* MODAL HEADER */}

            <div className="p-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  New Message
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Choose a student to message
                </p>

              </div>


              <button
                onClick={() => {
                  setShowNewMessage(false);
                  setStudentSearch("");
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500"
              >

                <X className="w-5 h-5" />

              </button>

            </div>


            {/* SEARCH */}

            <div className="p-4 border-b border-slate-100">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) =>
                    setStudentSearch(
                      e.target.value
                    )
                  }
                  autoFocus
                  placeholder="Search students..."
                  className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

            </div>


            {/* STUDENTS */}

            <div className="max-h-80 overflow-y-auto">

              {loading ? (

                <div className="py-10 flex justify-center">

                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />

                </div>

              ) : filteredStudents.length === 0 ? (

                <div className="py-10 text-center px-6">

                  <User className="w-10 h-10 text-slate-300 mx-auto" />

                  <p className="text-sm font-medium text-slate-700 mt-3">
                    No students found
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Try another name or email.
                  </p>

                </div>

              ) : (

                filteredStudents.map((student) => (

                  <button
                    key={student._id}
                    onClick={() =>
                      handleStartConversation(
                        student
                      )
                    }
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 border-b border-slate-100 transition"
                  >

                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">

                      <span className="text-sm font-semibold text-indigo-700">

                        {student.firstName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}

                      </span>

                    </div>


                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-slate-800 truncate">

                        {student.firstName}{" "}

                        {student.lastName}

                      </p>

                      <p className="text-xs text-slate-500 truncate">

                        {student.email}

                      </p>

                    </div>

                  </button>

                ))

              )}

            </div>

          </div>

        </div>

      )}

    </AppLayout>
  );
};


// ======================================================
// CONVERSATION ITEM
// ======================================================

const ConversationItem = ({
  conversation,
  selected,
  onClick,
}) => {

  const user = conversation.user;

  const name =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
    || "Unknown User";


  return (

    <button
      onClick={onClick}
      className={`w-full text-left p-4 flex gap-3 border-b border-slate-100 transition ${
        selected
          ? "bg-indigo-50"
          : "hover:bg-slate-50"
      }`}
    >

      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">

        <span className="text-sm font-semibold text-indigo-700">

          {user?.firstName
            ?.charAt(0)
            ?.toUpperCase() || "U"}

        </span>

      </div>


      <div className="flex-1 min-w-0">

        <div className="flex items-center justify-between gap-2">

          <p className="text-sm font-semibold text-slate-800 truncate">
            {name}
          </p>


          {conversation.unreadCount > 0 && (

            <span className="min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">

              {conversation.unreadCount}

            </span>

          )}

        </div>


        <p className="text-xs text-slate-500 truncate mt-1">

          {conversation.lastMessage?.content ||
            "No message"}

        </p>

      </div>

    </button>

  );
};


// ======================================================
// MESSAGE BUBBLE
// ======================================================

const MessageBubble = ({
  message,
  currentUser,
}) => {

  const senderId =
    typeof message.sender === "object"
      ? message.sender?._id
      : message.sender;


  const isMine =
    senderId?.toString() ===
    currentUser?._id?.toString();


  return (

    <div
      className={`flex ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >

        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>


        <p
          className={`text-[10px] mt-1 ${
            isMine
              ? "text-indigo-100"
              : "text-slate-400"
          }`}
        >

          {message.createdAt
            ? new Date(
                message.createdAt
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}

        </p>

      </div>

    </div>

  );
};


export default Messages;
