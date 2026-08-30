import {
  MessageSquare,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Mail,
  MailOpen,
  User,
} from "lucide-react";

import { useEffect } from "react";
import toast from "react-hot-toast";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import useAdminStore from "../../store/admin";


const Messages = () => {

  const {
    messages,
    loading,
    error,
    fetchMessages,
    deleteMessage,
  } = useAdminStore();


  // ==================================================
  // LOAD MESSAGES
  // ==================================================

  useEffect(() => {

    fetchMessages();

  }, [fetchMessages]);


  // ==================================================
  // DELETE MESSAGE
  // ==================================================

  const handleDelete = async (messageId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;


    try {

      await deleteMessage(messageId);

      toast.success(
        "Message deleted successfully"
      );

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to delete message"
      );

    }

  };


  return (
    <AppLayout>

      <TopBar title="Messages" />


      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">


        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Messages
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Monitor messages exchanged between students.
            </p>

          </div>


          <button
            onClick={() => fetchMessages()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
          >

            <RefreshCw
              className={`w-4 h-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh

          </button>

        </div>


        {/* ERROR */}

        {error && (

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">

            <AlertCircle className="w-5 h-5 text-red-500" />

            <div>

              <p className="text-sm font-medium text-red-700">
                Unable to load messages
              </p>

              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <StatCard
            icon={MessageSquare}
            title="Total Messages"
            value={messages.length}
          />

          <StatCard
            icon={Mail}
            title="Unread"
            value={
              messages.filter(
                (message) =>
                  !message.isRead
              ).length
            }
          />

          <StatCard
            icon={MailOpen}
            title="Read"
            value={
              messages.filter(
                (message) =>
                  message.isRead
              ).length
            }
          />

        </div>


        {/* MESSAGE LIST */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


          <div className="p-5 border-b border-slate-100">

            <h2 className="text-lg font-semibold text-slate-900">
              All Messages
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Review messages sent between users.
            </p>

          </div>


          {loading && messages.length === 0 ? (

            <div className="min-h-[300px] flex items-center justify-center">

              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

            </div>

          ) : messages.length === 0 ? (

            <div className="min-h-[300px] flex items-center justify-center">

              <div className="text-center">

                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />

                <h3 className="text-sm font-semibold text-slate-700 mt-3">
                  No messages
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  There are no messages on the platform yet.
                </p>

              </div>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {messages.map((message) => (

                <MessageRow
                  key={message._id}
                  message={message}
                  onDelete={handleDelete}
                />

              ))}

            </div>

          )}

        </div>

      </div>

    </AppLayout>
  );
};


// ======================================================
// MESSAGE ROW
// ======================================================

const MessageRow = ({
  message,
  onDelete,
}) => {

  const sender = message.sender;
  const receiver = message.receiver;


  const senderName =
    `${sender?.firstName || ""} ${sender?.lastName || ""}`.trim()
    || "Unknown";


  const receiverName =
    `${receiver?.firstName || ""} ${receiver?.lastName || ""}`.trim()
    || "Unknown";


  return (

    <div className="p-5 hover:bg-slate-50 transition">

      <div className="flex items-start gap-4">


        {/* AVATAR */}

        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">

          <User className="w-5 h-5 text-indigo-600" />

        </div>


        {/* CONTENT */}

        <div className="flex-1 min-w-0">


          <div className="flex flex-wrap items-center gap-2">

            <span className="text-sm font-semibold text-slate-900">
              {senderName}
            </span>

            <span className="text-xs text-slate-400">
              →
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {receiverName}
            </span>


            {message.isRead ? (

              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">

                <MailOpen className="w-3 h-3" />

                Read

              </span>

            ) : (

              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full">

                <Mail className="w-3 h-3" />

                Unread

              </span>

            )}

          </div>


          <p className="text-xs text-slate-400 mt-1">

            {sender?.email}
            {" → "}
            {receiver?.email}

          </p>


          <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3">

            <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">
              {message.content}
            </p>

          </div>


          <p className="text-xs text-slate-400 mt-2">

            {message.createdAt
              ? new Date(
                  message.createdAt
                ).toLocaleString()
              : ""
            }

          </p>

        </div>


        {/* DELETE */}

        <button
          onClick={() =>
            onDelete(message._id)
          }
          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Delete message"
        >

          <Trash2 className="w-4 h-4" />

        </button>

      </div>

    </div>

  );
};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  icon: Icon,
  title,
  value,
}) => {

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

          <Icon className="w-5 h-5 text-indigo-600" />

        </div>

        <div>

          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="text-xl font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>

    </div>

  );
};


export default Messages;
