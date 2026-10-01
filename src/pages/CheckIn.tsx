import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { AlertCircle, CheckCircle2, MessageCircleHeart, Send, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FormField, TextInput } from '../components/ui/FormField'
import { challengeLabel } from '../lib/recommendations'
import { sendCoachMessage, PlanGenerationError } from '../lib/coachChat'
import { getApiKey, setApiKey } from '../lib/geminiConfig'
import type { ChatMessage, ChatProposal, Challenge } from '../types'

const QUICK_PROMPTS: { issue: Challenge; text: string }[] = [
  { issue: 'hunger', text: "I'm constantly hungry between meals." },
  { issue: 'low_energy', text: "I've had low energy during workouts lately." },
  { issue: 'lack_of_time', text: "I don't have enough time for my workouts this week." },
  { issue: 'plateau', text: "My weight hasn't moved in over two weeks." },
  { issue: 'injury_pain', text: "I've got some pain that's making certain exercises hard." },
  { issue: 'motivation', text: "I'm struggling to stay motivated lately." },
  { issue: 'poor_sleep', text: "I haven't been sleeping well." },
]

export function CheckIn() {
  const { state, dispatch } = useApp()
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [keyError, setKeyError] = useState('')
  const [pendingRetry, setPendingRetry] = useState<{ history: ChatMessage[]; text: string; error: string } | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState(() => getApiKey() ?? '')
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = state.coachMessages
  const hasKey = !!getApiKey()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, sending, pendingRetry])

  async function callCoach(apiKey: string, history: ChatMessage[], text: string) {
    setSending(true)
    try {
      const result = await sendCoachMessage(apiKey, state, history, text)
      const assistantMessage: ChatMessage = {
        id: `m-${Date.now()}-a`,
        role: 'assistant',
        content: result.reply,
        proposal: result.proposal ?? undefined,
      }
      dispatch({ type: 'ADD_COACH_MESSAGE', message: assistantMessage })
      setPendingRetry(null)
    } catch (err) {
      const message = err instanceof PlanGenerationError ? err.message : 'Something went wrong reaching your coach.'
      setPendingRetry({ history, text, error: message })
    } finally {
      setSending(false)
    }
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    const apiKey = getApiKey()
    if (!apiKey) {
      setKeyError('Add your Gemini API key below to start chatting.')
      return
    }

    setKeyError('')
    const history = messages
    const userMessage: ChatMessage = { id: `m-${Date.now()}-u`, role: 'user', content: trimmed }
    dispatch({ type: 'ADD_COACH_MESSAGE', message: userMessage })
    setDraft('')
    await callCoach(apiKey, history, trimmed)
  }

  function retry() {
    if (!pendingRetry || sending) return
    const apiKey = getApiKey()
    if (!apiKey) return
    void callCoach(apiKey, pendingRetry.history, pendingRetry.text)
  }

  function saveKey() {
    const trimmed = apiKeyInput.trim()
    if (!trimmed) return
    setApiKey(trimmed)
    setApiKeyInput(trimmed)
    setKeyError('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Check-in</h1>

      <Card padded={false} className="flex flex-col">
        <div className="p-4">
          <CardHeader title="Chat with your coach" subtitle="Tell it what's going on — it'll ask questions and adjust your plan if it makes sense" />
        </div>

        <div className="space-y-3 px-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center">
              <MessageCircleHeart size={24} className="text-[var(--color-brand)]" />
              <p className="max-w-xs text-xs text-[var(--color-text-secondary)]">
                Hunger, low energy, a plateau, no time, an injury — tell your coach what's slowing you down.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} onApply={() => dispatch({ type: 'APPLY_COACH_PROPOSAL', messageId: m.id })} />
          ))}

          {sending && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Sparkles size={14} className="animate-pulse text-[var(--color-brand)]" /> Coach is typing…
            </div>
          )}

          {!sending && pendingRetry && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-critical)]/30 bg-[var(--color-critical)]/10 px-3.5 py-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--color-critical)]" />
                <p className="text-xs leading-relaxed text-[var(--color-critical)]">{pendingRetry.error}</p>
              </div>
              <Button size="sm" variant="secondary" className="shrink-0" onClick={retry}>
                Retry
              </Button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-3 pt-3">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.issue}
                onClick={() => setDraft(p.text)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                {challengeLabel(p.issue)}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-[var(--color-border)] p-4">
          {!hasKey ? (
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-text-secondary)]">Add your Gemini API key to start chatting with your coach.</p>
              <FormField label="Gemini API key">
                <TextInput
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIza..."
                  autoComplete="off"
                />
              </FormField>
              <Button className="w-full" onClick={saveKey} disabled={!apiKeyInput.trim()}>
                Save key
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void send(draft)
              }}
              className="flex items-end gap-2"
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void send(draft)
                  }
                }}
                placeholder="Tell your coach what's going on..."
                rows={1}
                className="max-h-32 flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
              />
              <Button type="submit" disabled={sending || !draft.trim()} aria-label="Send">
                <Send size={16} />
              </Button>
            </form>
          )}
          {keyError && <p className="mt-2 text-xs text-[var(--color-critical)]">{keyError}</p>}
        </div>
      </Card>
    </div>
  )
}

function ChatBubble({ message, onApply }: { message: ChatMessage; onApply: () => void }) {
  const isUser = message.role === 'user'
  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className="max-w-[85%] space-y-2">
        <div
          className={clsx(
            'whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
            isUser ? 'bg-[var(--color-brand)] text-white' : 'border border-[var(--color-border)] bg-[var(--color-surface-2)]',
          )}
        >
          {message.content}
        </div>
        {message.proposal && <ProposalCard proposal={message.proposal} onApply={onApply} />}
      </div>
    </div>
  )
}

function ProposalCard({ proposal, onApply }: { proposal: ChatProposal; onApply: () => void }) {
  return (
    <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 p-3">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-brand)]">Suggested update</p>
      <ul className="mb-2.5 space-y-1">
        {proposal.changes.map((c, i) => (
          <li key={i} className="flex gap-1.5 text-xs leading-relaxed">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[var(--color-brand)]" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      {proposal.applied ? (
        <p className="flex items-center gap-1 text-xs font-semibold text-[var(--color-good)]">
          <CheckCircle2 size={13} /> Applied to your plan
        </p>
      ) : (
        <Button size="sm" onClick={onApply}>
          Apply to my plan
        </Button>
      )}
    </div>
  )
}
