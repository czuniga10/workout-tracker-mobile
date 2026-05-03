import { useState, useRef, useEffect } from "react";
import { useUpdateNotes } from "../hooks/useUpdateNotes";

interface NotesDrawerProps {
  date: string;
  initialNotes: string | null;
}

export function NotesDrawer({ date, initialNotes }: NotesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateNotes = useUpdateNotes(date);

  useEffect(() => {
    setNotes(initialNotes ?? "");
  }, [initialNotes]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  function handleSave() {
    updateNotes.mutate(notes);
  }

  function handleClose() {
    handleSave();
    setIsOpen(false);
  }

  return (
    <>
      {/* Trigger */}
      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            color: "var(--color-text-tertiary)",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          Notes
          {initialNotes && (
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--color-text-info)",
                display: "inline-block",
              }}
            />
          )}
        </button>
      </div>

      {/* Drawer overlay */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              background: "var(--color-background-primary)",
              borderRadius: "16px 16px 0 0",
              padding: "20px 16px 32px",
              maxWidth: "480px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: "36px",
                height: "4px",
                background: "var(--color-border-tertiary)",
                borderRadius: "2px",
                margin: "0 auto 16px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>Session notes</h3>
              <button
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)",
                  fontSize: "16px",
                  padding: 0,
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSave}
              placeholder="How did the session feel? Any PRs?"
              rows={5}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--color-background-tertiary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                fontFamily: "inherit",
                lineHeight: 1.6,
                resize: "none",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-border-info)";
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
