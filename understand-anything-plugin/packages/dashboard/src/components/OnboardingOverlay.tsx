import { useState, useEffect } from "react";
import { useI18n } from "../contexts/I18nContext";

/**
 * First-visit onboarding overlay.
 *
 * Renders 5 dismissible steps that teach a new user how to operate the dashboard.
 * State persists in localStorage so returning users are not interrupted.
 *
 * Force-show via `?onboard=force` URL param (useful for screenshots / demos).
 */

const STORAGE_KEY = "ua-onboarding-dismissed-v1";

export default function OnboardingOverlay() {
  const { t } = useI18n();
  const STEPS = t.onboarding.steps;
  const [stepIdx, setStepIdx] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const force = params.get("onboard") === "force";
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    if (force || !dismissed) setOpen(true);
  }, []);

  if (!open) return null;

  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;
  const step = STEPS[stepIdx];

  function dismiss(remember: boolean) {
    if (remember && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setOpen(false);
  }

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss(false);
      }}
    >
      <style>{KEYFRAMES}</style>
      <div style={cardStyle}>
        <div style={tagStyle}>
          <span style={numStyle}>0{stepIdx + 1}</span>
          <span> / 0{STEPS.length}</span>
          <span style={dotStyle} />
          <span>{t.onboarding.header}</span>
        </div>

        <h2 style={titleStyle}>{step.title}</h2>
        <p style={bodyStyle}>{step.body}</p>
        {step.hint && (
          <blockquote style={hintStyle}>
            <span style={{ color: "#c8a882", marginRight: 8 }}>·</span>
            {step.hint}
          </blockquote>
        )}

        <div style={progressTrackStyle}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                ...dotProgressStyle,
                background: i === stepIdx ? "#c8a882" : "#444",
                width: i === stepIdx ? 28 : 6,
              }}
            />
          ))}
        </div>

        <div style={btnRowStyle}>
          <button
            type="button"
            onClick={() => dismiss(true)}
            style={{ ...btnStyle, ...btnGhostStyle }}
          >
            {t.onboarding.skipForever}
          </button>
          <div style={{ flex: 1 }} />
          {!isFirst && (
            <button
              type="button"
              onClick={() => setStepIdx(stepIdx - 1)}
              style={{ ...btnStyle, ...btnGhostStyle }}
            >
              {t.onboarding.prev}
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              onClick={() => setStepIdx(stepIdx + 1)}
              style={{ ...btnStyle, ...btnPrimaryStyle }}
            >
              {t.onboarding.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => dismiss(true)}
              style={{ ...btnStyle, ...btnPrimaryStyle }}
            >
              {t.onboarding.finish}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const KEYFRAMES = `@keyframes ua-fade-in { from { opacity: 0 } to { opacity: 1 } }`;

// ----- styles (inline 避免依赖 css 文件) -----

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.78)",
  backdropFilter: "blur(6px)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  fontFamily:
    '"Noto Sans SC", "Microsoft YaHei", system-ui, -apple-system, sans-serif',
  animation: "ua-fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
};

const cardStyle: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#fafafa",
  maxWidth: 580,
  width: "100%",
  padding: "48px 48px 36px",
  border: "1px solid #2a2a2a",
  borderTop: "2px solid #c8a882",
  position: "relative",
};

const tagStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  letterSpacing: "0.3em",
  color: "#888",
  textTransform: "uppercase",
  marginBottom: 24,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 4,
};

const numStyle: React.CSSProperties = {
  fontFamily: '"Noto Serif SC", Georgia, serif',
  color: "#c8a882",
  fontSize: "0.9rem",
  letterSpacing: "0.1em",
  marginRight: 4,
};

const dotStyle: React.CSSProperties = {
  width: 4,
  height: 4,
  background: "#c8a882",
  borderRadius: "50%",
  margin: "0 12px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: '"Noto Serif SC", Georgia, serif',
  fontSize: "1.7rem",
  fontWeight: 400,
  letterSpacing: "0.02em",
  lineHeight: 1.3,
  marginBottom: 16,
  color: "#fafafa",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "0.98rem",
  lineHeight: 1.7,
  color: "#bbb",
  marginBottom: 0,
};

const hintStyle: React.CSSProperties = {
  margin: "20px 0 0",
  padding: "12px 18px",
  borderLeft: "2px solid #5a4a3a",
  background: "rgba(200, 168, 130, 0.06)",
  fontSize: "0.86rem",
  color: "#c8a882",
  fontStyle: "italic",
};

const progressTrackStyle: React.CSSProperties = {
  display: "flex",
  gap: 6,
  marginTop: 36,
  marginBottom: 28,
};

const dotProgressStyle: React.CSSProperties = {
  height: 4,
  borderRadius: 2,
  transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s",
};

const btnRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const btnStyle: React.CSSProperties = {
  padding: "10px 22px",
  fontSize: "0.82rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  border: "1px solid",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  fontWeight: 400,
};

const btnGhostStyle: React.CSSProperties = {
  background: "transparent",
  borderColor: "#444",
  color: "#888",
};

const btnPrimaryStyle: React.CSSProperties = {
  background: "#c8a882",
  borderColor: "#c8a882",
  color: "#1a1a1a",
  fontWeight: 500,
};
