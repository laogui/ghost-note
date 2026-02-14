import { useState, useRef, useEffect } from 'react'
import './CreateNoteDialog.css'

const NOTE_TYPES = [
  'Note',
  'Project',
  'Experiment',
  'Responsibility',
  'Procedure',
  'Person',
  'Event',
  'Topic',
] as const

export type NoteType = (typeof NOTE_TYPES)[number]

interface CreateNoteDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (title: string, type: NoteType) => void
}

export function CreateNoteDialog({ open, onClose, onCreate }: CreateNoteDialogProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<NoteType>('Note')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTitle('')
      setType('Note')
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed, type)
    onClose()
  }

  return (
    <div className="create-dialog__overlay" onClick={onClose}>
      <div className="create-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="create-dialog__title">Create New Note</h3>
        <form onSubmit={handleSubmit}>
          <div className="create-dialog__field">
            <label className="create-dialog__label">Title</label>
            <input
              ref={inputRef}
              className="create-dialog__input"
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="create-dialog__field">
            <label className="create-dialog__label">Type</label>
            <div className="create-dialog__types">
              {NOTE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`create-dialog__type-btn${type === t ? ' create-dialog__type-btn--active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="create-dialog__actions">
            <button type="button" className="create-dialog__btn create-dialog__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-dialog__btn create-dialog__btn--create" disabled={!title.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
