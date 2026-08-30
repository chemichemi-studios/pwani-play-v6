type Props = {
  icon: string
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export default function EmptyState({ icon, title, body, actionLabel, onAction, secondaryLabel, onSecondary }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '60px 32px',
      flex: 1,
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 46, marginBottom: 24,
      }}>{icon}</div>
      <h3 style={{
        fontFamily: 'DM Serif Display, serif',
        fontSize: 22, color: 'white',
        margin: '0 0 10px', fontWeight: 400,
      }}>{title}</h3>
      <p style={{
        fontSize: 14, color: 'rgba(255,255,255,0.45)',
        margin: '0 0 28px', lineHeight: 1.6, maxWidth: 260,
      }}>{body}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="btn-primary"
          style={{ maxWidth: 240 }}
        >{actionLabel}</button>
      )}
      {secondaryLabel && (
        <button
          onClick={onSecondary}
          style={{
            marginTop: 12, background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
            fontSize: 14, fontFamily: 'Outfit, sans-serif',
          }}
        >{secondaryLabel}</button>
      )}
    </div>
  )
}

export const EMPTY_STATES = {
  noDownloads: {
    icon: '📭',
    title: 'No downloads yet',
    body: 'Save content to watch offline, even without internet. Perfect for travel and low-bandwidth moments.',
    actionLabel: 'Browse Content',
  },
  emptyWatchlist: {
    icon: '📋',
    title: 'Your watchlist is empty',
    body: 'Tap the + button on any movie, series, or podcast to save it here for later.',
    actionLabel: 'Discover Content',
  },
  noHistory: {
    icon: '🕐',
    title: 'No viewing history',
    body: "Content you've watched will appear here. Start watching to build your history.",
    actionLabel: 'Start Watching',
  },
  noResults: {
    icon: '🔍',
    title: 'No results found',
    body: "We couldn't find anything matching your search. Try different keywords or browse by category.",
    actionLabel: 'Browse Categories',
  },
  noInternet: {
    icon: '📡',
    title: 'No internet connection',
    body: "You're offline. Switch to your offline library to watch downloaded content.",
    actionLabel: 'Open Offline Library',
  },
  noRecommendations: {
    icon: '🤖',
    title: 'Building your profile',
    body: "Watch a few titles and we'll start personalising recommendations just for you.",
    actionLabel: 'Start Exploring',
  },
  storageFullError: {
    icon: '💾',
    title: 'Storage full',
    body: 'Your device is running low on space. Delete some downloads to free up room.',
    actionLabel: 'Manage Storage',
  },
  playbackError: {
    icon: '🎬',
    title: 'Playback failed',
    body: 'Something went wrong while loading this content. Check your connection and try again.',
    actionLabel: 'Try Again',
  },
  geoRestricted: {
    icon: '🌍',
    title: 'Not available in your region',
    body: 'This content is restricted in your area. Explore thousands of other African stories available to you.',
    actionLabel: 'Browse Available Content',
  },
  premiumRequired: {
    icon: '⭐',
    title: 'Premium content',
    body: 'Upgrade to Pwani Premium to unlock this content and get ad-free streaming, 4K quality, and offline downloads.',
    actionLabel: 'Go Premium',
  },
  subscriptionExpired: {
    icon: '📅',
    title: 'Subscription expired',
    body: 'Your Premium plan has ended. Renew to continue enjoying ad-free streaming, offline downloads, and exclusive content.',
    actionLabel: 'Renew Now',
  },
  noCreatorContent: {
    icon: '🎥',
    title: 'No content yet',
    body: 'This creator hasn\'t published any content yet. Follow them to be notified when they upload.',
    actionLabel: 'Follow Creator',
  },
  networkError: {
    icon: '⚡',
    title: 'Network error',
    body: 'Something went wrong on our end. Please try again in a moment.',
    actionLabel: 'Retry',
  },
}
