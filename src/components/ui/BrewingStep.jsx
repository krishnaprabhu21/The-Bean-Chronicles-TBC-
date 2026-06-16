export function BrewingStep({ step }) {
  return (
    <div className="flex gap-6 group">
      <div className="flex-shrink-0">
        <span
          className="font-display text-5xl font-bold leading-none"
          style={{ color: '#D4A853', opacity: 0.85 }}
        >
          {String(step.order).padStart(2, '0')}
        </span>
      </div>
      <div className="pt-1 pb-8 border-b border-medium-roast/20 flex-1">
        <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--color-text)' }}>{step.instruction}</p>
        {step.tip && (
          <div
            className="flex gap-3 rounded-lg px-4 py-3"
            style={{ background: '#2D1B14', borderLeft: '3px solid #D4A853' }}
          >
            <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm italic text-cream/70">{step.tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
