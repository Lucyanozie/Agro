import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uid } from "@/lib/utils";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);
export function ChatProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setConversations([]);
    setError("");
    if (!userId) return undefined;
    getDocs(
      query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId),
      ),
    )
      .then((snapshot) => {
        if (!cancelled)
          setConversations(
            snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
          );
      })
      .catch(() => {
        if (!cancelled) {
          setConversations([]);
          setError("Unable to load your conversations.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const byId = useCallback(
    (id) => conversations.find((conversation) => conversation.id === id),
    [conversations],
  );
  const unreadCount = useMemo(
    () =>
      conversations.filter((conversation) =>
        conversation.messages?.some(
          (message) => !message.read && message.from !== userId,
        ),
      ).length,
    [conversations, userId],
  );

  const send = useCallback(
    (conversationId, from, body) => {
      const text = body.trim();
      const conversation = conversations.find(
        (item) => item.id === conversationId,
      );
      if (
        !text ||
        !conversation ||
        !userId ||
        !conversation.participants.includes(userId)
      )
        return;
      const message = {
        id: uid("m"),
        from,
        body: text,
        at: new Date().toISOString(),
        read: true,
      };
      const messages = [...(conversation.messages ?? []), message];
      setConversations((list) =>
        list.map((item) =>
          item.id === conversationId ? { ...item, messages } : item,
        ),
      );
      updateDoc(doc(db, "conversations", conversationId), { messages }).catch(
        () => setError("Unable to send message."),
      );
    },
    [conversations, userId],
  );

  const markRead = useCallback(
    (conversationId) => {
      const conversation = conversations.find(
        (item) => item.id === conversationId,
      );
      if (
        !conversation ||
        !userId ||
        !conversation.participants.includes(userId)
      )
        return;
      const messages = (conversation.messages ?? []).map((message) =>
        message.from === userId ? message : { ...message, read: true },
      );
      setConversations((list) =>
        list.map((item) =>
          item.id === conversationId ? { ...item, messages } : item,
        ),
      );
      updateDoc(doc(db, "conversations", conversationId), { messages }).catch(
        () => setError("Unable to mark conversation read."),
      );
    },
    [conversations, userId],
  );

  const startWith = useCallback(
    (participant) => {
      if (!userId || !participant?.id) return null;
      const existing = conversations.find((conversation) =>
        conversation.participants?.includes(participant.id),
      );
      if (existing) return existing;
      const ref = doc(collection(db, "conversations"));
      const created = {
        id: ref.id,
        participants: [userId, participant.id],
        participantId: participant.id,
        participantName: participant.name ?? "",
        participantAvatar: participant.avatar ?? "",
        online: true,
        lastSeen: "Online",
        messages: [],
      };
      setConversations((list) => [created, ...list]);
      setDoc(ref, {
        participants: created.participants,
        participantId: created.participantId,
        participantName: created.participantName,
        participantAvatar: created.participantAvatar,
        online: created.online,
        lastSeen: created.lastSeen,
        messages: created.messages,
      }).catch(() => {
        setConversations((list) =>
          list.filter((item) => item.id !== created.id),
        );
        setError("Unable to start conversation.");
      });
      return created;
    },
    [conversations, userId],
  );

  const value = useMemo(
    () => ({
      conversations,
      byId,
      unreadCount,
      send,
      markRead,
      startWith,
      error,
    }),
    [conversations, byId, unreadCount, send, markRead, startWith, error],
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
export function useChats() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChats must be used inside <ChatProvider>");
  return ctx;
}
