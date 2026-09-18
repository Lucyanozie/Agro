import { useEffect, useRef, useState } from "react";
import { CheckCheck, Send } from "lucide-react";
import { cx, shortTime } from "@/lib/utils";
export function ChatWindow({
  conversation,
  currentUserId,
  onSend,
  showAvatars = true,
}) {
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation.messages.length]);
  function submit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto bg-brand-50/60 px-4 py-4">
        <ul className="mx-auto flex max-w-3xl flex-col gap-3">
          {conversation.messages.map((m) => {
            const mine = m.from === currentUserId;
            return (
              <li
                key={m.id}
                className={cx(
                  "flex items-end gap-2",
                  mine ? "justify-end" : "justify-start",
                )}
              >
                {!mine && showAvatars && conversation.participantAvatar ? (
                  <img
                    src={conversation.participantAvatar}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <div
                  className={cx(
                    "max-w-[76%] rounded-lg px-3.5 py-2.5 shadow-card sm:max-w-[68%]",
                    mine ? "bg-brand-700 text-white" : "bg-white text-ink",
                  )}
                >
                  <p className="whitespace-pre-line text-[15px] leading-snug">
                    {m.body}
                  </p>
                  <p
                    className={cx(
                      "mt-1 flex items-center justify-end gap-1 text-[11px]",
                      mine ? "text-white/75" : "text-ink-mute",
                    )}
                  >
                    {shortTime(m.at)}
                    {mine ? (
                      <CheckCheck className="h-3.5 w-3.5 text-[#7FD4FF]" />
                    ) : null}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={endRef} />
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-3 border-t border-ink-line bg-white px-4 py-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) submit(e);
          }}
          placeholder="Type a message"
          aria-label="Message"
          className="field flex-1"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 active:scale-95 disabled:bg-brand-300"
        >
          <Send className="h-5 w-5 translate-x-[1px]" />
        </button>
      </form>
    </div>
  );
}
