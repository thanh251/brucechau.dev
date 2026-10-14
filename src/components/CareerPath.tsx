import { useLayoutEffect, useRef, useState } from 'react'

type CareerEvent = {
  id: 'weaverse' | 'ptit'
  year: string
  title: string
  subtitle: string
  range: string
  eyebrow: string
  description: string
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
  },
]

export default function CareerPath() {
  const [selectedId, setSelectedId] = useState<CareerEvent['id']>('ptit')
  const [rangePosition, setRangePosition] = useState({ top: 0, height: 0 })
  const timelineRef = useRef<HTMLDivElement>(null)
  const nowLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date()).toUpperCase()

  useLayoutEffect(() => {
    const timeline = timelineRef.current
    const nowNode = timeline?.querySelector<HTMLElement>('[data-career-now-node]')
    const selectedNode = timeline?.querySelector<HTMLElement>(`[data-career-node="${selectedId}"]`)
    if (!timeline || !nowNode || !selectedNode) return

    const updateRange = () => {
      const timelineRect = timeline.getBoundingClientRect()
      const nowRect = nowNode.getBoundingClientRect()
      const selectedRect = selectedNode.getBoundingClientRect()
      const top = nowRect.top + nowRect.height / 2 - timelineRect.top
      const bottom = selectedRect.top + selectedRect.height / 2 - timelineRect.top
      setRangePosition({ top, height: Math.max(0, bottom - top) })
    }

    updateRange()
    const observer = new ResizeObserver(updateRange)
    observer.observe(timeline)
    observer.observe(nowNode)
    observer.observe(selectedNode)
    window.addEventListener('resize', updateRange)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateRange)
    }
  }, [selectedId])

  return (
    <section className="career" aria-labelledby="career-title">
      <header className="career__header">
        <span className="career__index" aria-hidden="true">04</span>
        <h2 id="career-title">Career Path</h2>
        <p>Click an event to inspect the chapter.</p>
      </header>

      <div className={`career-timeline career-timeline--${selectedId}`} ref={timelineRef}>
        <div className="career-timeline__axis" aria-hidden="true" />
        <div
          className="career-timeline__range"
          style={{ top: rangePosition.top, height: rangePosition.height }}
          aria-hidden="true"
        />
        <div className="career-timeline__now" aria-label={`Now, ${nowLabel}`}>
          <span className="career-timeline__now-node" data-career-now-node aria-hidden="true" />
          <span className="career-timeline__now-label"><strong>NOW</strong><small>{nowLabel}</small></span>
        </div>

        <div className="career-timeline__entries">
          {events.map((event) => {
            const selected = selectedId === event.id
            return (
              <div className={`career-entry career-entry--${event.id}`} key={event.id}>
                <button
                  type="button"
                  className="career-entry__event"
                  onClick={() => setSelectedId(event.id)}
                  aria-pressed={selected}
                  aria-controls={selected ? `career-detail-${event.id}` : undefined}
                >
                  <span className="career-entry__year">{event.year}</span>
                  <strong>{event.title}</strong>
                  <small>{event.subtitle}</small>
                </button>
                <button
                  type="button"
                  className={`career-entry__node ${selected ? 'selected' : ''}`}
                  data-career-node={event.id}
                  onClick={() => setSelectedId(event.id)}
                  aria-label={`Inspect ${event.title}`}
                  aria-pressed={selected}
                  aria-controls={selected ? `career-detail-${event.id}` : undefined}
                />
                {selected && (
                  <article className="career-entry__detail" id={`career-detail-${event.id}`} aria-live="polite">
                    <span className="career-entry__range-label">[ {event.range} ]</span>
                    <span className="career-entry__eyebrow">{event.eyebrow}</span>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="career-entry__meta"><span>{event.subtitle}</span></div>
                    {event.id === 'ptit' && <small>Overlaps with Weaverse from 2026.</small>}
                  </article>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
