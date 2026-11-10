import * as React from 'react';
/** Product status (label always rendered; never colour alone). */
export type PersonaStatus = 'registrada' | 'documentada' | 'para-revisar' | 'rascunho' | 'revisado' | 'lacuna';
/** Small status pill or a numeric unread count. Prefer `status` for evidence and artefact states. */
export interface BadgeProps {
  /**
   * Semantic product status. Sets tone, Lucide icon and default label:
   * registrada / rascunho → Slate (neutral) · documentada / revisado → success (#064E3B on #ECFDF5) · para-revisar / lacuna → attention (#78350F on #FFFBEB).
   * Overrides `tone` when set.
   */
  status?: PersonaStatus;
  /** Generic tone, kept for existing uses. */
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'ink';
  /** soft = tinted pill with ink text; count = filled circle for unread counts */
  variant?: 'soft' | 'count';
  /** Leading presence/status dot */
  dot?: boolean;
  /** Lucide icon name; `null` hides the status icon. */
  icon?: string | null;
  /** Label. Defaults to the status label ("Para revisar", …). */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare const STATUSES: Record<PersonaStatus, { tone: 'neutral' | 'success' | 'warning'; icon: string; label: string }>;
export declare function Badge(props: BadgeProps): JSX.Element;
