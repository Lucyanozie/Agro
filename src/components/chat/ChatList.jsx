import { Link } from 'react-router-dom';
import { Check, CheckCheck } from 'lucide-react';
import { chatStamp, cx } from '@/lib/utils';
function lastMessage(c) {
    return c.messages[c.messages.length - 1];
}
export function ChatList({ conversations, basePath, currentUserId, activeId, }) {
    return (<ul className="divide-y divide-ink-line border-y border-ink-line">
      {conversations.map((c) => {
            const last = lastMessage(c);
            const unread = c.messages.filter((m) => !m.read).length;
            const mine = last?.from === currentUserId;
            return (<li key={c.id}>
            <Link to={`${basePath}/${c.id}`} className={cx('flex items-center gap-3 px-4 py-3.5 transition hover:bg-brand-50/50', activeId === c.id && 'bg-brand-50')}>
              <img src={c.participantAvatar} alt="" className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"/>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-bold text-ink">{c.participantName}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[15px] text-ink-mute">
                  {mine ? (last?.read ? (<CheckCheck className="h-4 w-4 shrink-0 text-[#4A9BF5]"/>) : (<Check className="h-4 w-4 shrink-0"/>)) : null}
                  <span className="truncate">{last?.body ?? 'No messages yet'}</span>
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className={cx('text-sm font-semibold', unread ? 'text-brand-600' : 'text-ink-mute')}>
                  {last ? chatStamp(last.at) : ''}
                </span>
                {unread ? (<span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                    {unread}
                  </span>) : null}
              </div>
            </Link>
          </li>);
        })}
    </ul>);
}
