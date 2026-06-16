import { AuthorIcon } from './AuthorIcon'

export function AuthorBio({ author }) {
  return (
    <div className="flex gap-5 p-6 rounded-2xl border border-medium-roast/20 bg-dark-roast">
      <div
        className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-2"
        style={{ borderColor: '#C9A84C' }}
      >
        <AuthorIcon type={author.iconType} />
      </div>
      <div>
        <p className="text-xs text-gold uppercase tracking-widest mb-1">Written by</p>
        <h4 className="font-display text-lg mb-0.5" style={{ color: 'var(--color-text)' }}>{author.name}</h4>
        <p className="text-sm text-medium-roast mb-2">{author.role}</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{author.bio}</p>
      </div>
    </div>
  )
}
