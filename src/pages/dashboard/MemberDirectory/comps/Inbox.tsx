import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Mail, Send, Loader2 } from "lucide-react";
import { memberDirectoryApi } from "@/services/memberDirectoryApi";
import { toast } from "react-toastify";

interface Conversation {
  id: number;
  memberId: string;
  senderName: string;
  senderCompany: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: number | string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export default function Inbox() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const currentUserId = localStorage.getItem("userId");

  // Fetch inbox conversations
  const fetchInbox = async () => {
    try {
      setLoading(true);
      const response = await memberDirectoryApi.getInbox();

      if (response.status && response.data) {
        try {
          const inboxData = Array.isArray(response.data) ? response.data : JSON.parse(response.data);
          // Transform API data to our Conversation interface
          const transformedConversations: Conversation[] = inboxData.map((item: any) => ({
            id: item.conversationId,
            memberId: item.member?.id || item.senderMemberId || item.conversationId.toString(),
            senderName: item.member?.name || "Unknown",
            senderCompany: item.member?.email || "No email",
            lastMessage: item.message?.body || "No message",
            timestamp: item.message?.sentOn ? new Date(item.message.sentOn).toLocaleString() : "Recently",
            unreadCount: item.message?.isRead ? 0 : 1,
          }));
          setConversations(transformedConversations);
        } catch (parseError) {
          console.error("Error processing inbox data:", parseError);
          toast.error("Failed to process inbox data");
        }
      }
    } catch (error: any) {
      console.error("Error fetching inbox:", error);
      toast.error(error.message || "Failed to fetch inbox");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: number) => {
    try {
      setMessagesLoading(true);
      const response = await memberDirectoryApi.getMessages({
        ConversationId: conversationId,
        PageNumber: 1,
        PageSize: 50,
      });

      if (response.status && response.data) {
        // The data is already an object with items array, no need to parse as string
        try {
          const messagesData = Array.isArray(response.data) 
            ? { items: response.data } 
            : typeof response.data === 'string' 
            ? JSON.parse(response.data)
            : response.data;
          // Transform API data to our Message interface
          const transformedMessages: Message[] = (messagesData.items || []).map((msg: any) => ({
            id: msg.id || Date.now(), // Generate ID if not provided
            senderId: msg.senderMemberId,
            content: msg.body,
            timestamp: msg.sentOn ? new Date(msg.sentOn).toLocaleString() : "Recently",
            isOwn: String(msg.senderMemberId) === String(currentUserId),
          }));
          setMessages(transformedMessages);
        } catch (parseError) {
          console.error("Error processing messages data:", parseError);
          toast.error("Failed to process messages data");
        }
      }
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error(error.message || "Failed to fetch messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  // Handle conversation selection
  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  // Handle sending new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // Send message using ContactMember API - use the memberId from selected conversation
      await memberDirectoryApi.contactMember({
        receiverMemberId: selectedConversation.memberId,
        message: newMessage.trim(),
      });

      // Clear input
      setNewMessage("");

      // Refresh messages to show the new message
      fetchMessages(selectedConversation.id);

      toast.success("Message sent successfully!");

    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6">
      {/* Title */}
      <h1 className="font-inter font-semibold text-[28px] md:text-[38px] leading-[100%] tracking-normal text-[#C6A95F]">
        Inbox
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="bg-[#FFFFFF26] border-none rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-[#C6A95F] flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#C6A95F]" />
                  </div>
                ) : conversations.length > 0 ? (
                  <div className="space-y-2 p-4">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleConversationClick(conversation)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? "bg-[#C6A95F] text-black"
                            : "bg-[#FFFFFF0D] text-white hover:bg-[#FFFFFF1A]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm truncate">
                            {conversation.senderName}
                          </h4>
                          {conversation.unreadCount > 0 && (
                            <div className="bg-[#C6A95F] text-black text-xs px-2 py-1 rounded-full min-w-5 text-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 mb-1 truncate">
                          {conversation.senderCompany}
                        </p>
                        <p className="text-sm truncate opacity-80">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {conversation.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Messages View */}
        <div className="lg:col-span-2">
          <Card className="bg-[#FFFFFF26] border-none rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-[#C6A95F] flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {selectedConversation
                  ? `${selectedConversation.senderName} - ${selectedConversation.senderCompany}`
                  : "Select a conversation"
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100vh-300px)]">
              {/* Messages Area */}
              <ScrollArea className="flex-1 mb-4">
                {messagesLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#C6A95F]" />
                  </div>
                ) : selectedConversation ? (
                  messages.length > 0 ? (
                    <div className="space-y-4 p-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.isOwn
                                ? "bg-[#C6A95F] text-black"
                                : "bg-[#FFFFFF1A] text-white"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isOwn ? "text-black/60" : "text-white/60"
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages in this conversation</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              {selectedConversation && (
                <div className="flex gap-2 p-4 border-t border-white/10">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-[#FFFFFF26] border-none text-white placeholder:text-white/70"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-[#C6A95F] text-black hover:bg-[#C6A95F]/80"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
