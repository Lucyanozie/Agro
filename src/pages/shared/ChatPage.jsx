import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MessageSquareDashed } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChats } from '@/context/ChatContext';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { EmptyState, SearchInput } from '@/components/ui/Bits';
import { cx } from '@/lib/utils';
/**
 * One screen serving both chat routes. Phones show either the list or the
 * thread; from `lg` up both panes sit side by side, as in the desktop designs.
 */
export function ChatPage({ role }) {
    const { id } = useParams();
    const { user } = useAuth();
    const { conversations, byId, send, markRead } = useChats();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const basePath = role === 'farmer' ? '/farmer/chats' : '/buyer/chats';
    const currentUserId = user?.id ?? '';
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q)
            return conversations;
        return conversations.filter((c) => c.participantName.toLowerCase().includes(q) ||
            c.messages.some((m) => m.body.toLowerCase().includes(q)));
    }, [conversations, query]);
    // On desktop a thread is always shown; default to the first conversation.
    const active = id ? byId(id) : filtered[0];
    useEffect(() => {
        if (id)
            markRead(id);
    }, [id, markRead]);
    const showThreadOnMobile = Boolean(id);
    return (<div className="flex min-h-0 flex-1 flex-col lg:h-[100dvh]">
      {/* Mobile thread header */}
      {showThreadOnMobile && active ? (<header className="flex items-center gap-3 border-b border-ink-line bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => navigate(basePath)} aria-label="Back to chats" className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-brand-50">
            <ChevronLeft className="h-6 w-6"/>
          </button>
          <img src={active.participantAvatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover"/>
          <div className="min-w-0">
            <p className="truncate text-[19px] font-bold text-ink">{active.participantName}</p>
            <p className={cx('text-[15px] font-medium', active.online ? 'text-brand-600' : 'text-ink-mute')}>
              {active.online ? 'Online' : active.lastSeen}
            </p>
          </div>
        </header>) : (<header className={cx('flex items-center gap-3 px-4 py-3 lg:px-8 lg:pt-6', showThreadOnMobile && 'hidden lg:flex')}>
          <button type="button" onClick={() => navigate(role === 'farmer' ? '/farmer' : '/buyer')} aria-label="Go back" className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 lg:hidden">
            <ChevronLeft className="h-6 w-6"/>
          </button>
          <h1 className={cx('flex-1 text-xl font-bold text-ink lg:text-left', role === 'buyer' ? 'text-center lg:text-3xl lg:text-brand-600' : 'text-center lg:text-[22px]')}>
            Chats
          </h1>
          <span className="h-10 w-10 lg:hidden"/>
        </header>)}

      <div className="flex min-h-0 flex-1 lg:gap-4 lg:px-8 lg:pb-6">
        {/* List pane */}
        <section className={cx('flex min-h-0 w-full flex-col lg:w-[340px] lg:shrink-0 lg:rounded-xl lg:border lg:border-ink-line', showThreadOnMobile && 'hidden lg:flex')}>
          <div className="px-4 py-3">
            <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chat..."/>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.length ? (<ChatList conversations={filtered} basePath={basePath} currentUserId={currentUserId} activeId={active?.id}/>) : (<div className="p-4">
                <EmptyState icon={<MessageSquareDashed className="h-7 w-7"/>} title="No conversations found" description="Try a different name or message."/>
              </div>)}
          </div>
        </section>

        {/* Thread pane */}
        <section className={cx('flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-xl lg:border lg:border-ink-line', !showThreadOnMobile && 'hidden lg:flex')}>
          {active ? (<>
              <header className="hidden items-center gap-3 border-b border-ink-line px-4 py-3 lg:flex">
                <img src={active.participantAvatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover"/>
                <div className="min-w-0">
                  <p className="truncate text-[17px] font-bold text-ink">
                    {active.participantName}
                  </p>
                  <p className={cx('text-[15px] font-medium', active.online ? 'text-brand-600' : 'text-brand-600')}>
                    {active.online ? 'Online' : active.lastSeen}
                  </p>
                </div>
              </header>
              <ChatWindow conversation={active} currentUserId={currentUserId} onSend={(body) => send(active.id, currentUserId, body)}/>
            </>) : (<div className="flex flex-1 items-center justify-center p-8">
              <EmptyState icon={<MessageSquareDashed className="h-7 w-7"/>} title="Pick a conversation" description="Choose a chat on the left to start messaging."/>
            </div>)}
        </section>
      </div>
    </div>);
}
