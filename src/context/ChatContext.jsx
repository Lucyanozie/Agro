import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CONVERSATIONS } from '@/data/seed';
import { KEYS, load, save } from '@/lib/storage';
import { uid } from '@/lib/utils';
/** Canned replies so a sent message gets an answer back, like a live thread. */
const REPLIES = [
    'Sure, let me check that for you right away.',
    'Yes, that batch was harvested this morning.',
    'Noted. I can have it dispatched today.',
    'Thank you! Let me know if you need anything else.',
    'That works for me.',
];
const ChatContext = createContext(null);
export function ChatProvider({ children }) {
    const [conversations, setConversations] = useState(() => load(KEYS.chats, CONVERSATIONS));
    useEffect(() => {
        save(KEYS.chats, conversations);
    }, [conversations]);
    const byId = useCallback((id) => conversations.find((c) => c.id === id), [conversations]);
    const unreadCount = useMemo(() => conversations.filter((c) => c.messages.some((m) => !m.read)).length, [conversations]);
    const send = useCallback((conversationId, from, body) => {
        const text = body.trim();
        if (!text)
            return;
        setConversations((list) => list.map((c) => c.id === conversationId
            ? {
                ...c,
                messages: [
                    ...c.messages,
                    { id: uid('m'), from, body: text, at: new Date().toISOString(), read: true },
                ],
            }
            : c));
        const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
        window.setTimeout(() => {
            setConversations((list) => list.map((c) => c.id === conversationId
                ? {
                    ...c,
                    messages: [
                        ...c.messages,
                        {
                            id: uid('m'),
                            from: c.participantId,
                            body: reply,
                            at: new Date().toISOString(),
                            read: true,
                        },
                    ],
                }
                : c));
        }, 1400);
    }, []);
    const markRead = useCallback((conversationId) => {
        setConversations((list) => list.map((c) => c.id === conversationId
            ? { ...c, messages: c.messages.map((m) => ({ ...m, read: true })) }
            : c));
    }, []);
    const startWith = useCallback((participant) => {
        const existing = conversations.find((c) => c.participantId === participant.id);
        if (existing)
            return existing;
        const created = {
            id: uid('c'),
            participantId: participant.id,
            participantName: participant.name,
            participantAvatar: participant.avatar,
            online: true,
            lastSeen: 'Online',
            messages: [],
        };
        setConversations((list) => [created, ...list]);
        return created;
    }, [conversations]);
    const value = useMemo(() => ({ conversations, byId, unreadCount, send, markRead, startWith }), [conversations, byId, unreadCount, send, markRead, startWith]);
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
export function useChats() {
    const ctx = useContext(ChatContext);
    if (!ctx)
        throw new Error('useChats must be used inside <ChatProvider>');
    return ctx;
}
