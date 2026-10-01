import { useState } from 'react'

type CareerEvent = {
  id: 'weaverse' | 'ptit'
  year: string
  title: string
  subtitle: string
  range: string
  eyebrow: string
  description: string
  future?: boolean
}

const events: CareerEvent[] = [
  {
    id: 'weaverse',
    year: 'JAN 2026',
    title: 'Joined Weaverse',
    subtitle: 'Active',
    range: 'JAN 2026 — PRESENT',
    eyebrow: 'WEAVERSE',
    description: 'Building thoughtful product experiences with a team that cares about craft.',
  },
  {
    id: 'ptit',
    year: '2023',
    title: 'PTIT',
    subtitle: 'Student · Studying',
    range: '2023 — Expected 2027',
    eyebrow: 'POSTS AND TELECOMMUNICATIONS INSTITUTE OF TECHNOLOGY',
    description: 'Learning computer science foundations while turning ideas into working software.',
    future: true,
  },
]

export default function CareerPath() {
  const [selectedId, setSelectedId] = useState<CareerEvent['id']>('ptit')
  const selected = events.find((event) => event.id === selectedId) ?? events[1]
  const nowLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date()).toUpperCase()

  return (
    <section className="career" aria-labelledby="career-title">
      <header className="career__header">
        <h2 id="career-title">CAREER PATH</h2>
        <p>Click an event to inspect the chapter.</p>
      </header>

      <div className={`career__stage career__stage--${selected.id}`}>
        <div className="career__future-line" aria-hidden="true" />
        <div className="career__axis" aria-hidden="true" />
        <div className="career__now" aria-label={`Now, ${nowLabel}`}>
          <i aria-hidden="true" />
          <strong>NOW</strong>
          <small>{nowLabel}</small>
        </div>
        <div className="career__bracket" aria-hidden="true">
          <span>[ {selected.range} ]</span>
        </div>

        <div className="career__events">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              className={`career-event career-event--${event.id} ${selected.id === event.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(event.id)}
              aria-pressed={selected.id === event.id}
            >
              <span className="career-event__year">{event.year}</span>
              <span className="career-event__node" />
              <span className="career-event__copy">
                <strong>{event.title}</strong>
                <small>{event.subtitle}</small>
              </span>
            </button>
          ))}
        </div>

        <article className="career__detail" aria-live="polite">
          <span className="career__eyebrow">{selected.eyebrow}</span>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          <div className="career__meta">
            <span>{selected.range}</span>
            <span>{selected.subtitle}</span>
          </div>
          {selected.id === 'ptit' && <small>Overlaps with Weaverse from 2026.</small>}
        </article>
      </div>
    </section>
  )
}
