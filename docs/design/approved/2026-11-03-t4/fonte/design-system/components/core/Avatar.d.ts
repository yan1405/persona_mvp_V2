/** Circular avatar: photo, monogram, icon, or the AI mark on the dark focal gradient. */
export interface AvatarProps {
  /** Used for monogram initials and alt text */
  name?: string;
  src?: string;
  size?: number;
  /** Pastel tint for monogram avatars */
  tone?: 'neutral' | 'indigo' | 'blue' | 'amber' | 'green' | 'rose';
  /** ai = dark indigo gradient with sparkles glyph */
  variant?: 'person' | 'ai';
  /** Lucide icon instead of initials */
  icon?: string;
  status?: 'online' | 'away' | 'offline';
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
