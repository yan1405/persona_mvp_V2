/* @ds-bundle: {"format":4,"namespace":"PersonaDesignSystem_ff1a7b","components":[{"name":"AgentPanel","sourcePath":"components/agent/AgentPanel.jsx"},{"name":"HOME_SUGGESTIONS","sourcePath":"components/agent/AgentPrompt.jsx"},{"name":"AgentPrompt","sourcePath":"components/agent/AgentPrompt.jsx"},{"name":"ARTIFACT_TYPES","sourcePath":"components/artifacts/ArtifactCard.jsx"},{"name":"ArtifactCard","sourcePath":"components/artifacts/ArtifactCard.jsx"},{"name":"AGENT_FOOTER","sourcePath":"components/chat/Composer.jsx"},{"name":"AGENT_SUGGESTIONS","sourcePath":"components/chat/Composer.jsx"},{"name":"Composer","sourcePath":"components/chat/Composer.jsx"},{"name":"MessageBubble","sourcePath":"components/chat/MessageBubble.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"STATUSES","sourcePath":"components/core/Badge.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"FOCUS_RING","sourcePath":"components/core/focusRing.jsx"},{"name":"FOCUS_RING_DARK","sourcePath":"components/core/focusRing.jsx"},{"name":"FIELD_FOCUS","sourcePath":"components/core/focusRing.jsx"},{"name":"NO_OUTLINE","sourcePath":"components/core/focusRing.jsx"},{"name":"MIN_CHARS","sourcePath":"components/entries/CaptureEditor.jsx"},{"name":"MAX_CHARS","sourcePath":"components/entries/CaptureEditor.jsx"},{"name":"CaptureEditor","sourcePath":"components/entries/CaptureEditor.jsx"},{"name":"EntryCard","sourcePath":"components/entries/EntryCard.jsx"},{"name":"EvidenceCard","sourcePath":"components/evidence/EvidenceCard.jsx"},{"name":"StepFlow","sourcePath":"components/flow/StepFlow.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"PillTabs","sourcePath":"components/forms/PillTabs.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"ArgumentPanel","sourcePath":"components/live/ArgumentPanel.jsx"},{"name":"DRAFT_DURATIONS","sourcePath":"components/live/DraftPanel.jsx"},{"name":"DraftPanel","sourcePath":"components/live/DraftPanel.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"NAV_DESTINATIONS","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"NAV_SETTINGS","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"FloatingPanel","sourcePath":"components/overlay/FloatingPanel.jsx"},{"name":"SectionIndex","sourcePath":"components/overlay/SectionIndex.jsx"},{"name":"DimensionRow","sourcePath":"components/score/DimensionRow.jsx"},{"name":"AppShell","sourcePath":"components/shell/AppShell.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"DestinationGrid","sourcePath":"components/surfaces/DestinationGrid.jsx"},{"name":"DestinationTile","sourcePath":"components/surfaces/DestinationTile.jsx"},{"name":"FocalCard","sourcePath":"components/surfaces/FocalCard.jsx"},{"name":"FOCAL_STEPS","sourcePath":"components/surfaces/FocalJourney.jsx"},{"name":"FocalJourney","sourcePath":"components/surfaces/FocalJourney.jsx"},{"name":"JourneyStepper","sourcePath":"components/surfaces/JourneyStepper.jsx"},{"name":"ProgressBar","sourcePath":"components/surfaces/ProgressBar.jsx"},{"name":"ScoreRing","sourcePath":"components/surfaces/ScoreRing.jsx"},{"name":"TRACE_KINDS","sourcePath":"components/trace/TraceLine.jsx"},{"name":"TraceLine","sourcePath":"components/trace/TraceLine.jsx"}],"sourceHashes":{"components/agent/AgentPanel.jsx":"53983f15dba6","components/agent/AgentPrompt.jsx":"8719b9386fdf","components/artifacts/ArtifactCard.jsx":"707ec66629cf","components/chat/Composer.jsx":"b1db5819106f","components/chat/MessageBubble.jsx":"3f8209977ee5","components/core/Avatar.jsx":"7266227db257","components/core/Badge.jsx":"f8c1fec27f87","components/core/Button.jsx":"cfb659dab75e","components/core/Chip.jsx":"f184760bb422","components/core/Icon.jsx":"9aa116ca997a","components/core/IconButton.jsx":"8ff48329d219","components/core/focusRing.jsx":"192d5248477d","components/entries/CaptureEditor.jsx":"3763d43006c5","components/entries/EntryCard.jsx":"1f23a7f181f2","components/evidence/EvidenceCard.jsx":"e20dae530e3a","components/flow/StepFlow.jsx":"2b7e464db211","components/forms/Input.jsx":"3e3639c60bd7","components/forms/PillTabs.jsx":"9c092cafbc84","components/forms/Switch.jsx":"0e36ea7ef5c2","components/live/ArgumentPanel.jsx":"8b1a7162d3d5","components/live/DraftPanel.jsx":"7e45e1443273","components/navigation/AppHeader.jsx":"419f97802b17","components/navigation/NavItem.jsx":"f081292c22e1","components/navigation/Sidebar.jsx":"33d997a18e6b","components/overlay/FloatingPanel.jsx":"85593d5d36fe","components/overlay/SectionIndex.jsx":"33b86097acf2","components/score/DimensionRow.jsx":"95615ac42209","components/shell/AppShell.jsx":"31e6f1eeba44","components/surfaces/Card.jsx":"58a64d935e5d","components/surfaces/DestinationGrid.jsx":"ea54945ddef3","components/surfaces/DestinationTile.jsx":"0220b1c06b10","components/surfaces/FocalCard.jsx":"e68550bfbd7d","components/surfaces/FocalJourney.jsx":"20ba8be53426","components/surfaces/JourneyStepper.jsx":"a11fdee75574","components/surfaces/ProgressBar.jsx":"9b25c3b40555","components/surfaces/ScoreRing.jsx":"701d73e5f758","components/trace/TraceLine.jsx":"5899c27c2447"},"inlinedExternals":[],"unexposedExports":[{"name":"useFocusVisible","sourcePath":"components/core/focusRing.jsx"}]} */

(() => {

const __ds_ns = (window.PersonaDesignSystem_ff1a7b = window.PersonaDesignSystem_ff1a7b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
// Lucide icons (lucide-static@0.460.0, ISC license) — copied programmatically. Default stroke 1.75 per Persona DNA.
const PATHS = {
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "message-square": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" />",
  "messages-square": "<path d=\"M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z\" /> <path d=\"M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1\" />",
  "book-open": "<path d=\"M12 7v14\" /> <path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
  "library": "<path d=\"m16 6 4 14\" /> <path d=\"M12 6v14\" /> <path d=\"M8 8v12\" /> <path d=\"M4 4v16\" />",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /> <path d=\"M10 9H8\" /> <path d=\"M16 13H8\" /> <path d=\"M16 17H8\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /> <path d=\"m21 21-4.3-4.3\" />",
  "plus": "<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />",
  "mic": "<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\" /> <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" /> <line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\" />",
  "paperclip": "<path d=\"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48\" />",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /> <path d=\"m21.854 2.147-10.94 10.939\" />",
  "arrow-up": "<path d=\"m5 12 7-7 7 7\" /> <path d=\"M12 19V5\" />",
  "arrow-up-right": "<path d=\"M7 7h10v10\" /> <path d=\"M7 17 17 7\" />",
  "arrow-right": "<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "check-check": "<path d=\"M18 6 7 17l-5-5\" /> <path d=\"m22 10-7.5 7.5L13 16\" />",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /> <path d=\"M20 3v4\" /> <path d=\"M22 5h-4\" /> <path d=\"M4 17v2\" /> <path d=\"M5 18H3\" />",
  "quote": "<path d=\"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z\" /> <path d=\"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z\" />",
  "bookmark": "<path d=\"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\" /> <path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\" />",
  "calendar": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" />",
  "panel-left": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /> <path d=\"M9 3v18\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"19\" cy=\"12\" r=\"1\" /> <circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "ellipsis-vertical": "<circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"12\" cy=\"5\" r=\"1\" /> <circle cx=\"12\" cy=\"19\" r=\"1\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /> <path d=\"M21 3v5h-5\" /> <path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /> <path d=\"M8 16H3v5\" />",
  "thumbs-up": "<path d=\"M7 10v12\" /> <path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\" />",
  "thumbs-down": "<path d=\"M17 14V2\" /> <path d=\"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z\" />",
  "graduation-cap": "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\" /> <path d=\"M22 10v6\" /> <path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\" />",
  "flask-conical": "<path d=\"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2\" /> <path d=\"M8.5 2h7\" /> <path d=\"M7 16h10\" />",
  "pen-line": "<path d=\"M12 20h9\" /> <path d=\"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z\" />",
  "brain": "<path d=\"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z\" /> <path d=\"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z\" /> <path d=\"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4\" /> <path d=\"M17.599 6.5a3 3 0 0 0 .399-1.375\" /> <path d=\"M6.003 5.125A3 3 0 0 0 6.401 6.5\" /> <path d=\"M3.477 10.896a4 4 0 0 1 .585-.396\" /> <path d=\"M19.938 10.5a4 4 0 0 1 .585.396\" /> <path d=\"M6 18a4 4 0 0 1-1.967-.516\" /> <path d=\"M19.967 17.484A4 4 0 0 1 18 18\" />",
  "layers": "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\" /> <path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\" /> <path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16 14\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /> <polyline points=\"16 17 21 12 16 7\" /> <line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
  "folder": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\" />",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /> <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />",
  "external-link": "<path d=\"M15 3h6v6\" /> <path d=\"M10 14 21 3\" /> <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
  "filter": "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  "trash-2": "<path d=\"M3 6h18\" /> <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /> <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /> <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /> <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /> <path d=\"m15 5 4 4\" />",
  "badge-check": "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\" /> <path d=\"m9 12 2 2 4-4\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"m9 12 2 2 4-4\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"17 8 12 3 7 8\" /> <line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"7 10 12 15 17 10\" /> <line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
  "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\" /> <circle cx=\"6\" cy=\"12\" r=\"3\" /> <circle cx=\"18\" cy=\"19\" r=\"3\" /> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" />",
  "list-checks": "<path d=\"m3 17 2 2 4-4\" /> <path d=\"m3 7 2 2 4-4\" /> <path d=\"M13 6h8\" /> <path d=\"M13 12h8\" /> <path d=\"M13 18h8\" />",
  "history": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /> <path d=\"M3 3v5h5\" /> <path d=\"M12 7v5l4 2\" />",
  "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />",
  "target": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <circle cx=\"12\" cy=\"12\" r=\"6\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" />",
  "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <path d=\"M16 3.13a4 4 0 0 1 0 7.75\" />",
  "smile": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M8 14s1.5 2 4 2 4-2 4-2\" /> <line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\" /> <line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\" />",
  "file-search": "<path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /> <path d=\"M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3\" /> <path d=\"m9 18-1.5-1.5\" /> <circle cx=\"5\" cy=\"14\" r=\"3\" />",
  "notebook-pen": "<path d=\"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4\" /> <path d=\"M2 6h4\" /> <path d=\"M2 10h4\" /> <path d=\"M2 14h4\" /> <path d=\"M2 18h4\" /> <path d=\"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\" />",
  "square-pen": "<path d=\"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\" /> <path d=\"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z\" />",
  "book-marked": "<path d=\"M10 2v8l3-3 3 3V2\" /> <path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "pause": "<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\" /> <rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\" />",
  "square": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /> <path d=\"M19 12H5\" />",
  "languages": "<path d=\"m5 8 6 6\" /> <path d=\"m4 14 6-6 2-3\" /> <path d=\"M2 5h12\" /> <path d=\"M7 2h1\" /> <path d=\"m22 22-5-10-5 10\" /> <path d=\"M14 18h6\" />"
};
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = 'currentColor',
  style,
  ...rest
}) {
  const inner = PATHS[name];
  if (!inner) return null;
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    },
    ...rest
  });
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
const TONE_BG = {
  neutral: 'var(--n-50)',
  indigo: 'var(--tile-indigo)',
  blue: 'var(--tile-blue)',
  amber: 'var(--tile-amber)',
  green: 'var(--tile-green)',
  rose: 'var(--tile-rose)'
};
const TONE_FG = {
  neutral: 'var(--text-strong)',
  indigo: 'var(--indigo-700)',
  blue: 'var(--blue-ink)',
  amber: 'var(--amber-ink)',
  green: 'var(--green-ink)',
  rose: '#9F1239'
};
const STATUS = {
  online: 'var(--green-500)',
  away: 'var(--amber-500)',
  offline: 'var(--n-200)'
};
function Avatar({
  name = '',
  src,
  size = 40,
  tone = 'neutral',
  variant = 'person',
  icon,
  status,
  style
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const isAi = variant === 'ai';
  const dotSize = Math.max(8, Math.round(size * 0.26));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0,
      display: 'inline-block',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 999,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isAi ? 'var(--surface-focal)' : TONE_BG[tone] || TONE_BG.neutral,
      color: isAi ? '#FFFFFF' : TONE_FG[tone] || TONE_FG.neutral,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.36),
      letterSpacing: '-0.01em'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : isAi || icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || 'sparkles',
    size: Math.round(size * 0.48),
    color: isAi ? 'var(--indigo-300)' : 'currentColor'
  }) : initials), status ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: dotSize,
      height: dotSize,
      borderRadius: 999,
      background: STATUS[status],
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }) : null);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--n-50)',
    fg: 'var(--n-600)',
    dot: 'var(--n-400)'
  },
  brand: {
    bg: 'var(--brand-soft)',
    fg: 'var(--indigo-700)',
    dot: 'var(--brand)'
  },
  success: {
    bg: 'var(--green-soft)',
    fg: 'var(--green-ink)',
    dot: 'var(--green-500)'
  },
  warning: {
    bg: 'var(--amber-soft)',
    fg: 'var(--amber-ink)',
    dot: 'var(--amber-500)'
  },
  danger: {
    bg: 'var(--red-soft)',
    fg: 'var(--red-ink)',
    dot: 'var(--red-500)'
  },
  info: {
    bg: 'var(--blue-soft)',
    fg: 'var(--blue-ink)',
    dot: 'var(--blue-500)'
  },
  ink: {
    bg: 'var(--ink)',
    fg: '#FFFFFF',
    dot: '#FFFFFF'
  }
};
// Product statuses: label is always rendered (never colour alone). Neutral = Slate, success = green ink on green soft, attention = amber ink on amber soft.
const STATUSES = {
  registrada: {
    tone: 'neutral',
    icon: 'circle-check',
    label: 'Registrada'
  },
  documentada: {
    tone: 'success',
    icon: 'badge-check',
    label: 'Documentada'
  },
  'para-revisar': {
    tone: 'warning',
    icon: 'sparkles',
    label: 'Para revisar'
  },
  rascunho: {
    tone: 'neutral',
    icon: 'pencil',
    label: 'Rascunho'
  },
  revisado: {
    tone: 'success',
    icon: 'check-check',
    label: 'Revisado'
  },
  lacuna: {
    tone: 'warning',
    icon: 'triangle-alert',
    label: 'Lacuna'
  }
};
function Badge({
  status,
  tone,
  variant = 'soft',
  dot,
  icon,
  children,
  style
}) {
  const st = status ? STATUSES[status] : null;
  const t = TONES[st && st.tone || tone || 'neutral'] || TONES.neutral;
  const ic = icon !== undefined ? icon : st ? st.icon : null;
  if (variant === 'count') {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        borderRadius: 999,
        background: (tone || 'neutral') === 'neutral' ? 'var(--brand)' : t.dot,
        color: '#FFFFFF',
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFeatureSettings: "'tnum'",
        ...style
      }
    }, children);
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 9px',
      borderRadius: 999,
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: t.dot
    }
  }) : null, ic ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 13,
    strokeWidth: 1.75
  }) : null, children != null ? children : st ? st.label : null);
}
Object.assign(__ds_scope, { STATUSES, Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/focusRing.jsx
try { (() => {
// Double focus indicator (WCAG 2.2 AA, 1.4.11 ≥ 3:1). Built only from existing tokens.
// Light surfaces (#FFFFFF · #FAFAFC · #F2F1F7): inner 2px #A78BFA + outer 2px #6D28D9 (outer vs bg 6.3–7.1:1).
// Dark surfaces (#1A1726 · #2E1A6B): inner 2px #6D28D9 + outer 2px #A78BFA (outer vs bg 5.2–6.5:1).
const FOCUS_RING = {
  outline: '2px solid var(--brand-strong)',
  outlineOffset: 2,
  boxShadow: '0 0 0 2px var(--focus-ring)'
};
const FOCUS_RING_DARK = {
  outline: '2px solid var(--focus-ring)',
  outlineOffset: 2,
  boxShadow: '0 0 0 2px var(--brand-strong)'
};
// Text fields: 2px #6D28D9 edge hugging the 1px border (box-shadow, no layout shift) + soft #A78BFA halo.
const FIELD_FOCUS = {
  boxShadow: '0 0 0 2px var(--brand-strong), 0 0 0 5px rgb(167 139 250 / 0.35)'
};
const NO_OUTLINE = {
  outline: 'none'
};
function isVisible(el) {
  try {
    return el.matches(':focus-visible');
  } catch (e) {
    return true;
  }
}
// Ring only for :focus-visible (keyboard); mouse focus shows nothing. Merges caller's onFocus/onBlur.
function useFocusVisible(onFocus, onBlur) {
  const [on, setOn] = React.useState(false);
  return [on, {
    onFocus: e => {
      if (e.target === e.currentTarget) setOn(isVisible(e.currentTarget));
      onFocus && onFocus(e);
    },
    onBlur: e => {
      if (e.target === e.currentTarget) setOn(false);
      onBlur && onBlur(e);
    }
  }];
}
Object.assign(__ds_scope, { FOCUS_RING, FOCUS_RING_DARK, FIELD_FOCUS, NO_OUTLINE, useFocusVisible });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/focusRing.jsx", error: String((e && e.message) || e) }); }

// components/artifacts/ArtifactCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ARTIFACT_TYPES = {
  star: {
    label: 'Resposta STAR',
    icon: 'list-checks',
    tint: 'var(--tile-indigo)'
  },
  pitch: {
    label: 'Pitch pessoal',
    icon: 'quote',
    tint: 'var(--tile-blue)'
  },
  curriculo: {
    label: 'Currículo ATS',
    icon: 'file-text',
    tint: 'var(--tile-green)'
  },
  portfolio: {
    label: 'Portfólio por casos',
    icon: 'layers',
    tint: 'var(--tile-amber)'
  }
};
function ArtifactCard({
  type = 'star',
  title,
  objective,
  status = 'rascunho',
  updated,
  sources = [],
  onOpen,
  focused,
  disabled,
  disabledText = 'Gerando rascunho…',
  error,
  style
}) {
  const t = ARTIFACT_TYPES[type] || ARTIFACT_TYPES.star;
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = __ds_scope.useFocusVisible();
  const interactive = !!onOpen && !disabled;
  const Tag = interactive ? 'button' : 'article';
  const lift = interactive && hover;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: interactive ? 'button' : undefined,
    onClick: interactive ? onOpen : undefined,
    "aria-label": interactive ? 'Abrir ' + t.label + ': ' + (title || 'sem título') : undefined,
    "aria-disabled": disabled || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, fh, {
    style: {
      background: disabled ? 'var(--n-25)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: disabled ? 'none' : lift ? 'var(--shadow-float)' : 'var(--shadow-soft)',
      border: '1px solid ' + (error ? 'var(--red-500)' : disabled ? 'var(--border-subtle)' : 'transparent'),
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      cursor: interactive ? 'pointer' : disabled ? 'not-allowed' : 'default',
      transform: lift ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)',
      ...__ds_scope.NO_OUTLINE,
      ...(kf || focused ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: t.tint,
      color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)',
      whiteSpace: 'nowrap'
    }
  }, t.label)), disabled ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    icon: "clock"
  }, disabledText) : /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    status: status
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)'
    }
  }, title || t.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: 1.45,
      color: 'var(--text-body)'
    }
  }, objective ? /*#__PURE__*/React.createElement(React.Fragment, null, "Objetivo: ", objective) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Objetivo n\xE3o informado.")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
      borderTop: '1px solid var(--divider)',
      paddingTop: 12,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "link",
    size: 14,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, "Fontes"), sources.length ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, sources.join(' · ')) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--amber-ink)',
      fontWeight: 600
    }
  }, "Nenhuma evid\xEAncia citada"), updated ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 12,
      color: 'var(--text-muted)',
      fontFeatureSettings: "'tnum'"
    }
  }, updated) : null), error ? /*#__PURE__*/React.createElement("span", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 6,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--red-ink)',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 14,
    style: {
      marginTop: 2
    }
  }), error) : null);
}
Object.assign(__ds_scope, { ARTIFACT_TYPES, ArtifactCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/artifacts/ArtifactCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    h: 32,
    px: 14,
    fs: 13,
    ic: 16
  },
  md: {
    h: 40,
    px: 18,
    fs: 14,
    ic: 18
  },
  lg: {
    h: 48,
    px: 22,
    fs: 15,
    ic: 20
  }
};
function Button({
  variant = 'solid',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  disabled,
  children,
  onClick,
  type = 'button',
  style,
  onFocus,
  onBlur,
  ...rest
}) {
  const [kf, fh] = __ds_scope.useFocusVisible(onFocus, onBlur);
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const V = {
    brand: {
      background: 'var(--brand-gradient)',
      color: 'var(--text-on-brand)',
      border: '1px solid transparent',
      boxShadow: hover ? '0 10px 24px -6px rgb(124 58 237 / 0.55)' : 'var(--shadow-brand-glow)'
    },
    solid: {
      background: hover ? 'var(--n-800)' : 'var(--ink)',
      color: '#FFFFFF',
      border: '1px solid transparent'
    },
    outline: {
      background: hover ? 'var(--n-25)' : 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: '1px solid ' + (hover ? 'var(--border-strong)' : 'var(--border-subtle)')
    },
    ghost: {
      background: hover ? 'var(--n-50)' : 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid transparent'
    },
    onFocal: {
      background: hover ? 'rgb(255 255 255 / 0.16)' : 'rgb(255 255 255 / 0.10)',
      color: '#FFFFFF',
      border: '1px solid rgb(255 255 255 / 0.16)'
    }
  }[variant] || {};
  const dis = disabled ? {
    background: 'var(--n-100)',
    color: 'var(--text-disabled)',
    border: '1px solid transparent',
    boxShadow: 'none',
    cursor: 'not-allowed'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, fh, {
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: s.fs,
      fontWeight: 600,
      letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition: 'background var(--dur-micro) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out), transform var(--dur-micro) var(--ease-out), border-color var(--dur-micro)',
      transform: press && !disabled ? 'scale(0.98)' : 'none',
      ...__ds_scope.NO_OUTLINE,
      ...V,
      ...dis,
      ...(kf ? variant === 'onFocal' ? __ds_scope.FOCUS_RING_DARK : __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.ic
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATUS_TONE = {
  neutral: {
    bg: 'var(--n-50)',
    fg: 'var(--n-600)',
    border: 'var(--n-100)'
  },
  success: {
    bg: 'var(--green-soft)',
    fg: 'var(--green-ink)',
    border: 'var(--green-soft)'
  },
  warning: {
    bg: 'var(--amber-soft)',
    fg: 'var(--amber-ink)',
    border: 'var(--amber-soft)'
  }
};
function Chip({
  status,
  icon,
  tone = 'neutral',
  selected,
  size = 'md',
  onClick,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = __ds_scope.useFocusVisible();
  const h = size === 'sm' ? 28 : 34;
  const st = status ? __ds_scope.STATUSES[status] : null;
  const toneFg = tone === 'success' ? 'var(--green-ink)' : tone === 'brand' ? 'var(--brand)' : 'var(--text-strong)';
  const iconFg = tone === 'success' ? 'var(--green-500)' : tone === 'brand' ? 'var(--brand)' : 'var(--text-muted)';
  let base;
  if (selected) base = {
    background: 'var(--ink)',
    color: '#FFFFFF',
    border: '1px solid var(--ink)'
  };else if (st) {
    const s = STATUS_TONE[st.tone];
    base = {
      background: s.bg,
      color: s.fg,
      border: '1px solid ' + (hover && onClick ? 'var(--border-strong)' : s.border)
    };
  } else base = {
    background: hover && onClick ? 'var(--n-25)' : 'var(--surface-card)',
    color: toneFg,
    border: '1px solid ' + (hover && onClick ? 'var(--border-strong)' : 'var(--border-subtle)')
  };
  const ic = icon !== undefined ? icon : st ? st.icon : null;
  const icColor = selected ? '#FFFFFF' : st ? 'currentColor' : iconFg;
  const Tag = onClick ? 'button' : 'span';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: onClick ? 'button' : undefined,
    onClick: onClick,
    "aria-pressed": onClick && selected != null ? !!selected : undefined
  }, onClick ? fh : {}, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: h,
      padding: '0 ' + (size === 'sm' ? 10 : 13) + 'px',
      borderRadius: 999,
      fontFamily: 'var(--font-body)',
      fontSize: size === 'sm' ? 12 : 13,
      fontWeight: st ? 600 : 500,
      whiteSpace: 'nowrap',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--dur-micro), border-color var(--dur-micro)',
      ...__ds_scope.NO_OUTLINE,
      ...base,
      ...(kf && onClick ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }), ic ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: size === 'sm' ? 14 : 15,
    strokeWidth: 1.75,
    color: icColor
  }) : null, children != null ? children : st ? st.label : null);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/chat/MessageBubble.jsx
try { (() => {
function Typing() {
  return /*#__PURE__*/React.createElement("span", {
    role: "status",
    "aria-label": "Agente Persona est\xE1 respondendo",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: '6px 0'
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--n-400)',
      animation: 'persona-dot 1.2s ' + i * 0.15 + 's infinite var(--ease-out)'
    }
  })));
}
const ACTION_ICON = {
  'Revisar sugestões': 'list-checks',
  'Abrir no Persona Live': 'mic',
  'Criar Artefato': 'file-text',
  'Registrar no Diário': 'notebook-pen'
};
function MessageBubble({
  role = 'agent',
  time,
  typing,
  citations,
  actions,
  onAction,
  onCitation,
  showAvatar = true,
  children,
  style
}) {
  const user = role === 'user';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: user ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: 10,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, !user && showAvatar ? /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    variant: "ai",
    name: "Agente Persona",
    size: 32
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: user ? 'flex-end' : 'flex-start',
      gap: 6,
      maxWidth: user ? '82%' : '100%',
      minWidth: 0,
      flex: user ? undefined : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)',
      padding: '0 4px',
      display: 'flex',
      gap: 6
    }
  }, user ? 'Você' : 'Agente Persona', time ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--text-muted)',
      fontFeatureSettings: "'tnum'"
    }
  }, time) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: user ? '12px 16px' : '14px 16px',
      borderRadius: user ? '22px 22px 8px 22px' : '8px 22px 22px 22px',
      background: user ? 'var(--bubble-user)' : 'var(--bubble-ai)',
      color: user ? 'var(--bubble-user-text)' : 'var(--bubble-ai-text)',
      border: user ? '0' : '1px solid var(--border-subtle)',
      boxShadow: user ? 'none' : 'var(--shadow-soft)',
      fontSize: 14,
      lineHeight: 1.55,
      textWrap: 'pretty',
      maxWidth: '100%',
      boxSizing: 'border-box',
      alignSelf: user || typing ? undefined : 'stretch'
    }
  }, typing ? /*#__PURE__*/React.createElement(Typing, null) : children, !user && !typing && citations && citations.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginTop: 12,
      paddingTop: 10,
      borderTop: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Origem"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, citations.map(c => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: c,
    size: "sm",
    icon: "link",
    onClick: onCitation ? () => onCitation(c) : undefined
  }, c)))) : null), !user && !typing && actions && actions.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, actions.map(a => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: a,
    variant: "outline",
    size: "sm",
    icon: ACTION_ICON[a] || 'arrow-right',
    onClick: () => onAction && onAction(a)
  }, a))) : null));
}
Object.assign(__ds_scope, { MessageBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/MessageBubble.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  variant = 'ghost',
  size = 40,
  badge,
  dot,
  label,
  active,
  disabled,
  onClick,
  style,
  onFocus,
  onBlur,
  ...rest
}) {
  const [kf, fh] = __ds_scope.useFocusVisible(onFocus, onBlur);
  const [hover, setHover] = React.useState(false);
  const V = {
    ghost: {
      background: active ? 'var(--brand-soft)' : hover ? 'var(--n-50)' : 'transparent',
      color: active ? 'var(--brand)' : 'var(--text-strong)',
      border: '1px solid transparent'
    },
    outline: {
      background: hover ? 'var(--n-25)' : 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-subtle)'
    },
    soft: {
      background: hover ? 'var(--indigo-200)' : 'var(--brand-soft)',
      color: 'var(--brand)',
      border: '1px solid transparent'
    },
    solid: {
      background: hover ? 'var(--n-800)' : 'var(--ink)',
      color: '#FFFFFF',
      border: '1px solid transparent'
    },
    brand: {
      background: 'var(--brand-gradient)',
      color: '#FFFFFF',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-brand-glow)'
    }
  }[variant] || {};
  const ic = size <= 32 ? 16 : size <= 40 ? 18 : 20;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, fh, {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      padding: 0,
      transition: 'background var(--dur-micro) var(--ease-out)',
      ...__ds_scope.NO_OUTLINE,
      ...V,
      ...(kf ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: ic
  }), badge != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -3,
      right: -3,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      borderRadius: 999,
      background: 'var(--brand)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 0 2px var(--surface-card)',
      fontFeatureSettings: "'tnum'"
    }
  }, badge) : null, dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      right: 9,
      width: 8,
      height: 8,
      borderRadius: 999,
      background: 'var(--danger)',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }) : null);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/agent/AgentPrompt.jsx
try { (() => {
const HOME_SUGGESTIONS = ['O que falta para o score observado?', 'Organize minhas evidências', 'Preparar uma entrevista', 'Criar um Artefato'];
function AgentPrompt({
  size = 'large',
  value,
  onChange,
  onSubmit,
  suggestions,
  onSuggestion,
  placeholder = 'Buscar ou perguntar',
  shortcut = '⌘K',
  style
}) {
  const large = size === 'large';
  const [inner, setInner] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const v = value != null ? value : inner;
  const set = x => {
    if (value == null) setInner(x);
    onChange && onChange(x);
  };
  const submit = () => {
    if (!v.trim()) return;
    onSubmit && onSubmit(v.trim());
  };
  const chips = (suggestions || (large ? HOME_SUGGESTIONS : [])).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: large ? 14 : 0,
      width: '100%',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("form", {
    role: "search",
    onSubmit: e => {
      e.preventDefault();
      submit();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: large ? 12 : 8,
      height: large ? 64 : 40,
      padding: large ? '0 8px 0 22px' : '0 4px 0 14px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-card)',
      border: '1px solid ' + (large ? 'transparent' : 'var(--border-subtle)'),
      boxShadow: large ? 'var(--shadow-float)' : 'none',
      boxSizing: 'border-box',
      transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)',
      ...(focus ? __ds_scope.FIELD_FOCUS : {})
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: large ? 22 : 18,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "search",
    value: v,
    onChange: e => set(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: placeholder,
    "aria-label": placeholder,
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: large ? 17 : 14,
      color: 'var(--text-strong)'
    }
  }), !large && shortcut ? /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)',
      background: 'var(--n-50)',
      borderRadius: 6,
      padding: '3px 6px',
      whiteSpace: 'nowrap'
    }
  }, shortcut) : null, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    type: "submit",
    icon: "arrow-up",
    variant: "solid",
    size: large ? 48 : 32,
    label: "Enviar pergunta",
    disabled: !v.trim()
  })), chips.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, chips.map(s => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: s,
    icon: "sparkles",
    style: {
      maxWidth: '100%',
      whiteSpace: 'normal',
      height: 'auto',
      minHeight: 28,
      padding: '6px 12px',
      textAlign: 'left'
    },
    onClick: () => onSuggestion ? onSuggestion(s) : set(s)
  }, s))) : null);
}
Object.assign(__ds_scope, { HOME_SUGGESTIONS, AgentPrompt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/AgentPrompt.jsx", error: String((e && e.message) || e) }); }

// components/chat/Composer.jsx
try { (() => {
const AGENT_FOOTER = 'O agente só usa as evidências que você registrou. Confira sempre a origem.';
const AGENT_SUGGESTIONS = ['O que falta para o score observado?', 'Organize minhas evidências', 'Preparar uma entrevista'];
function Composer({
  value,
  onChange,
  onSend,
  placeholder = 'Pergunte ao Agente Persona…',
  suggestions = AGENT_SUGGESTIONS,
  onSuggestion,
  disabled,
  footer = AGENT_FOOTER,
  style
}) {
  const [inner, setInner] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const v = value != null ? value : inner;
  const set = x => {
    if (value == null) setInner(x);
    onChange && onChange(x);
  };
  const send = () => {
    if (!v.trim() || disabled) return;
    onSend && onSend(v.trim());
    if (value == null) setInner('');
  };
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [v]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, suggestions && suggestions.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, suggestions.map(s => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: s,
    size: "sm",
    onClick: () => onSuggestion ? onSuggestion(s) : set(s)
  }, s))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      padding: '6px 6px 6px 18px',
      borderRadius: 26,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-soft)',
      transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)',
      ...(focus ? __ds_scope.FIELD_FOCUS : {})
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    rows: 1,
    value: v,
    placeholder: placeholder,
    "aria-label": "Mensagem para o Agente Persona",
    disabled: disabled,
    onChange: e => set(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    style: {
      flex: 1,
      minWidth: 0,
      resize: 'none',
      border: 0,
      outline: 0,
      background: 'transparent',
      padding: '10px 0',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.45,
      color: 'var(--text-strong)',
      maxHeight: 160
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-up",
    variant: "solid",
    size: 40,
    label: "Enviar ao Agente Persona",
    onClick: send,
    disabled: !v.trim() || disabled
  })), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      textWrap: 'pretty'
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { AGENT_FOOTER, AGENT_SUGGESTIONS, Composer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/Composer.jsx", error: String((e && e.message) || e) }); }

// components/agent/AgentPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AgentPanel({
  open = true,
  onToggle,
  screen,
  messages = [],
  onSend,
  onAction,
  composerProps,
  emptyText = 'Pergunte sobre suas evidências, seu score ou a próxima entrevista. Eu só uso o que você registrou.',
  style
}) {
  const id = React.useId ? React.useId() : 'agent';
  const logRef = React.useRef(null);
  const [kf, fh] = __ds_scope.useFocusVisible();
  const last = messages.length ? messages[messages.length - 1] : null;
  // Keep the latest message in view (scrolls only the log, never the page).
  React.useLayoutEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages.length, last && last.typing]);
  if (!open) {
    return /*#__PURE__*/React.createElement("aside", {
      "aria-label": "Agente Persona (recolhido)",
      style: {
        width: 64,
        height: '100%',
        minHeight: 240,
        flexShrink: 0,
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-float)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '14px 0',
        boxSizing: 'border-box',
        ...style
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      icon: "chevron-left",
      variant: "outline",
      size: 40,
      label: "Expandir Agente Persona",
      "aria-expanded": false,
      "aria-controls": id,
      onClick: () => onToggle && onToggle(true)
    }), /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
      variant: "ai",
      name: "Agente Persona",
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text-body)',
        whiteSpace: 'nowrap'
      }
    }, "Agente Persona"));
  }
  return /*#__PURE__*/React.createElement("aside", {
    id: id,
    "aria-label": "Agente Persona",
    style: {
      width: 'clamp(380px, 30vw, 420px)',
      height: '100%',
      minHeight: 480,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-float)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 16px 14px 20px',
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    variant: "ai",
    name: "Agente Persona",
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)'
    }
  }, "Agente Persona"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "target",
    size: 13
  }), "Voc\xEA est\xE1 em: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, screen || 'tela não informada'))), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "chevron-right",
    variant: "ghost",
    size: 36,
    label: "Recolher Agente Persona",
    "aria-expanded": true,
    "aria-controls": id,
    onClick: () => onToggle && onToggle(false)
  })), /*#__PURE__*/React.createElement("div", _extends({
    ref: logRef,
    role: "log",
    "aria-live": "polite",
    "aria-label": "Conversa com o Agente Persona",
    tabIndex: 0
  }, fh, {
    style: {
      flex: 1,
      minHeight: 0,
      minWidth: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '18px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      borderRadius: 4,
      ...__ds_scope.NO_OUTLINE,
      ...(kf ? {
        boxShadow: 'inset 0 0 0 2px var(--focus-ring), inset 0 0 0 4px var(--brand-strong)'
      } : {})
    }
  }), messages.length ? messages.map((m, i) => /*#__PURE__*/React.createElement(__ds_scope.MessageBubble, _extends({
    key: i
  }, m, {
    style: {
      flexShrink: 0,
      ...m.style
    },
    onAction: m.onAction || onAction
  }), m.text)) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, emptyText)), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: '12px 16px 14px',
      borderTop: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Composer, _extends({
    onSend: onSend
  }, composerProps))));
}
Object.assign(__ds_scope, { AgentPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/AgentPanel.jsx", error: String((e && e.message) || e) }); }

// components/entries/CaptureEditor.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MIN_CHARS = 40;
const MAX_CHARS = 2000;
const fmt = n => n.toLocaleString('pt-BR');
const fieldBase = {
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: 'var(--text-strong)',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  outline: 0,
  transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)'
};
const focusStyle = __ds_scope.FIELD_FOCUS;
function useField() {
  const [f, setF] = React.useState(false);
  return [f, {
    onFocus: () => setF(true),
    onBlur: () => setF(false)
  }];
}
function CaptureEditor({
  value,
  defaultValue = '',
  onChange,
  date,
  onDateChange,
  context,
  onContextChange,
  onSave,
  saving,
  disabled,
  error,
  focused,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const [innerDate, setInnerDate] = React.useState('');
  const [innerCtx, setInnerCtx] = React.useState('');
  const v = value != null ? value : inner;
  const d = date != null ? date : innerDate;
  const c = context != null ? context : innerCtx;
  const [fT, hT] = useField();
  const [fD, hD] = useField();
  const [fC, hC] = useField();
  const n = v.length;
  const state = error ? 'error' : disabled ? 'disabled' : n === 0 ? 'empty' : n < MIN_CHARS ? 'short' : n >= MAX_CHARS ? 'limit' : 'valid';
  const id = React.useId ? React.useId() : 'cap';
  const counter = {
    empty: {
      color: 'var(--text-muted)',
      icon: null,
      text: 'Mínimo de ' + MIN_CHARS + ' caracteres',
      nowrap: true
    },
    short: {
      color: 'var(--amber-ink)',
      icon: 'info',
      text: 'Faltam ' + (MIN_CHARS - n) + ' caracteres para salvar'
    },
    valid: {
      color: 'var(--green-ink)',
      icon: 'circle-check',
      text: 'Pronto para salvar'
    },
    limit: {
      color: 'var(--amber-ink)',
      icon: 'triangle-alert',
      text: 'Limite de ' + fmt(MAX_CHARS) + ' caracteres atingido'
    },
    error: {
      color: 'var(--red-ink)',
      icon: 'triangle-alert',
      text: error
    },
    disabled: {
      color: 'var(--n-600)',
      icon: 'lock',
      text: 'Edição indisponível'
    }
  }[state];
  const disStyle = disabled ? {
    background: 'var(--n-50)',
    color: 'var(--n-600)',
    cursor: 'not-allowed'
  } : {};
  const errStyle = state === 'error' ? {
    borderColor: 'var(--danger)'
  } : {};
  const canSave = !disabled && !saving && !error && n >= MIN_CHARS && n <= MAX_CHARS;
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": id + '-l',
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-soft)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      fontFamily: 'var(--font-body)',
      boxSizing: 'border-box',
      width: '100%',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("label", {
    id: id + '-l',
    htmlFor: id + '-t',
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--text-strong)'
    }
  }, "O que aconteceu hoje?"), /*#__PURE__*/React.createElement("textarea", _extends({
    id: id + '-t',
    value: v,
    maxLength: MAX_CHARS,
    disabled: disabled,
    "aria-describedby": id + '-c',
    "aria-invalid": state === 'error' || undefined,
    onChange: e => {
      const x = e.target.value.slice(0, MAX_CHARS);
      if (value == null) setInner(x);
      onChange && onChange(x);
    }
  }, hT, {
    style: {
      ...fieldBase,
      minHeight: 168,
      resize: 'vertical',
      padding: '14px 16px',
      fontSize: 15,
      lineHeight: 1.6,
      background: 'var(--n-25)',
      ...errStyle,
      ...((fT || focused) && !disabled ? focusStyle : {}),
      ...disStyle
    }
  })), /*#__PURE__*/React.createElement("div", {
    id: id + '-c',
    "aria-live": "polite",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      fontSize: 13,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      color: counter.color,
      fontWeight: state === 'empty' || state === 'disabled' ? 400 : 600,
      flex: '1 1 260px',
      minWidth: 0,
      whiteSpace: counter.nowrap ? 'nowrap' : undefined
    }
  }, counter.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: counter.icon,
    size: 15
  }) : null, counter.text), /*#__PURE__*/React.createElement("span", {
    style: {
      color: state === 'limit' ? 'var(--amber-ink)' : 'var(--text-muted)',
      fontWeight: state === 'limit' ? 600 : 400,
      whiteSpace: 'nowrap',
      fontFeatureSettings: "'tnum'"
    }
  }, fmt(n), " / ", fmt(MAX_CHARS))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,180px) minmax(0,1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Data (opcional)", /*#__PURE__*/React.createElement("input", _extends({
    type: "date",
    value: d,
    disabled: disabled,
    onChange: e => {
      if (date == null) setInnerDate(e.target.value);
      onDateChange && onDateChange(e.target.value);
    }
  }, hD, {
    style: {
      ...fieldBase,
      height: 40,
      padding: '0 12px',
      fontWeight: 400,
      ...(fD ? focusStyle : {}),
      ...disStyle
    }
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Contexto (opcional)", /*#__PURE__*/React.createElement("input", _extends({
    type: "text",
    value: c,
    disabled: disabled,
    placeholder: "Ex.: est\xE1gio, projeto, curso",
    onChange: e => {
      if (context == null) setInnerCtx(e.target.value);
      onContextChange && onContextChange(e.target.value);
    }
  }, hC, {
    style: {
      ...fieldBase,
      height: 40,
      padding: '0 12px',
      fontWeight: 400,
      ...(fC ? focusStyle : {}),
      ...disStyle
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      borderTop: '1px solid var(--divider)',
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      maxWidth: 360
    }
  }, "Seu texto fica como voc\xEA escreveu. As sugest\xF5es da IA aparecem depois, separadas."), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "brand",
    icon: "check",
    disabled: !canSave,
    onClick: () => canSave && onSave && onSave({
      text: v,
      date: d,
      context: c
    })
  }, saving ? 'Salvando…' : 'Salvar registro')));
}
Object.assign(__ds_scope, { MIN_CHARS, MAX_CHARS, CaptureEditor });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entries/CaptureEditor.jsx", error: String((e && e.message) || e) }); }

// components/entries/EntryCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KIND = {
  registro: {
    icon: 'notebook-pen',
    label: 'Registro do Diário'
  },
  sessao: {
    icon: 'mic',
    label: 'Sessão do Persona Live'
  },
  versao: {
    icon: 'history',
    label: 'Versão de Artefato'
  }
};
const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  lineHeight: 1.35,
  color: 'var(--text-strong)',
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};
function EntryCard({
  kind = 'registro',
  date,
  title,
  meta,
  status,
  statusLabel,
  statusIcon,
  onOpen,
  openLabel,
  style
}) {
  const k = KIND[kind] || KIND.registro;
  const [hover, setHover] = React.useState(false);
  const [focus, fh] = __ds_scope.useFocusVisible();
  const Tag = onOpen ? 'button' : 'article';
  const badge = status ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    status: status
  }, statusLabel) : statusLabel ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    icon: statusIcon || null
  }, statusLabel) : null;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: onOpen ? 'button' : undefined,
    onClick: onOpen,
    "aria-label": onOpen ? (openLabel || 'Abrir') + ': ' + (title || k.label) : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, onOpen ? fh : {}, {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: onOpen && hover ? 'var(--shadow-float)' : 'var(--shadow-soft)',
      border: '1px solid transparent',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      cursor: onOpen ? 'pointer' : 'default',
      transform: onOpen && hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)',
      ...__ds_scope.NO_OUTLINE,
      ...(focus ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: 'var(--n-50)',
      color: 'var(--text-body)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: k.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)',
      whiteSpace: 'nowrap'
    }
  }, k.label), date ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontFeatureSettings: "'tnum'",
      whiteSpace: 'nowrap'
    }
  }, date) : null)), onOpen ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 18,
    color: "var(--text-muted)",
    style: {
      flexShrink: 0,
      transform: hover ? 'translate(2px,-2px)' : 'none',
      transition: 'transform var(--dur-micro) var(--ease-out)'
    }
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: titleStyle
  }, title || 'Sem título'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: 1.45,
      color: meta ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, meta || 'Sem detalhes registrados.'), badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      borderTop: '1px solid var(--divider)',
      paddingTop: 12
    }
  }, badge) : null);
}
Object.assign(__ds_scope, { EntryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entries/EntryCard.jsx", error: String((e && e.message) || e) }); }

// components/evidence/EvidenceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LEVEL = {
  Documentada: {
    tone: 'success',
    icon: 'badge-check'
  },
  Registrada: {
    tone: 'neutral',
    icon: 'circle-check'
  }
};
function LevelBadge({
  level
}) {
  const l = LEVEL[level] || LEVEL.Registrada;
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: l.tone
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: l.icon,
    size: 13
  }), level || 'Registrada');
}
function proofText(n) {
  return n === 1 ? '1 link de prova' : (n || 0) + ' links de prova';
}
function Meta({
  origin,
  updatedAt,
  proofCount,
  showProofs = true
}) {
  const item = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    whiteSpace: 'nowrap'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px 14px',
      fontSize: 12,
      color: 'var(--text-muted)',
      fontFeatureSettings: "'tnum'"
    }
  }, showProofs ? /*#__PURE__*/React.createElement("span", {
    style: item
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "link",
    size: 13
  }), proofText(proofCount)) : null, /*#__PURE__*/React.createElement("span", {
    style: item
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: origin === 'Manual' ? 'pen-line' : 'notebook-pen',
    size: 13
  }), origin ? 'Origem: ' + origin : 'Origem não informada'), updatedAt ? /*#__PURE__*/React.createElement("span", {
    style: item
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 13
  }), 'Atualizada ' + updatedAt) : null);
}
function Competencies({
  list,
  emptyText
}) {
  if (!list || !list.length) return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, emptyText);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, list.map(c => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: c,
    size: "sm"
  }, c)));
}
const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  lineHeight: 1.35,
  color: 'var(--text-strong)',
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};
const shell = {
  background: 'var(--surface-card)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-soft)',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  fontFamily: 'var(--font-body)',
  textAlign: 'left',
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0
};
function GridCard({
  title,
  competencies,
  level,
  proofCount,
  origin,
  updatedAt,
  onOpen,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, fh] = __ds_scope.useFocusVisible();
  const Tag = onOpen ? 'button' : 'article';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: onOpen ? 'button' : undefined,
    onClick: onOpen
  }, onOpen ? fh : {}, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...shell,
      border: '1px solid transparent',
      cursor: onOpen ? 'pointer' : 'default',
      transform: onOpen && hover ? 'translateY(-2px)' : 'none',
      boxShadow: onOpen && hover ? 'var(--shadow-float)' : 'var(--shadow-soft)',
      transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)',
      ...__ds_scope.NO_OUTLINE,
      ...(focus ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: level
  }), onOpen ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 18,
    color: "var(--text-muted)",
    style: {
      transform: hover ? 'translate(2px,-2px)' : 'none',
      transition: 'transform var(--dur-micro) var(--ease-out)'
    }
  }) : null), /*#__PURE__*/React.createElement("h3", {
    style: titleStyle
  }, title), /*#__PURE__*/React.createElement(Competencies, {
    list: competencies,
    emptyText: "Nenhuma compet\xEAncia registrada."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--divider)',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement(Meta, {
    origin: origin,
    updatedAt: updatedAt,
    proofCount: proofCount
  })));
}
function SuggestionCard({
  title,
  competencies,
  level = 'Registrada',
  proofCount,
  origin,
  updatedAt,
  onConfirm,
  onDiscard,
  confirmVariant = 'solid',
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      ...shell,
      background: 'var(--surface-subtle)',
      border: '1px dashed var(--border-strong)',
      boxShadow: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "warning"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkles",
    size: 13
  }), "Para revisar"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Sugerida pela IA \xB7 nada \xE9 salvo sem sua confirma\xE7\xE3o")), /*#__PURE__*/React.createElement("h3", {
    style: titleStyle
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Compet\xEAncias sugeridas"), /*#__PURE__*/React.createElement(Competencies, {
    list: competencies,
    emptyText: "A IA ainda n\xE3o sugeriu compet\xEAncias. Voc\xEA pode adicion\xE1-las ao revisar."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, "N\xEDvel ao confirmar:"), /*#__PURE__*/React.createElement(LevelBadge, {
    level: level
  })), /*#__PURE__*/React.createElement(Meta, {
    origin: origin,
    updatedAt: updatedAt,
    proofCount: proofCount
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      borderTop: '1px solid var(--divider)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: confirmVariant,
    size: "sm",
    icon: "check",
    onClick: onConfirm
  }, "Confirmar evid\xEAncia"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    icon: "x",
    onClick: onDiscard
  }, "Descartar")));
}
function SelectableCard({
  title,
  competencies,
  level,
  proofCount,
  origin,
  updatedAt,
  reason,
  selected,
  onSelectedChange,
  disabled,
  style
}) {
  const [focus, fh] = __ds_scope.useFocusVisible();
  const id = React.useId ? React.useId() : 'ev-' + Math.random().toString(36).slice(2);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      ...shell,
      flexDirection: 'row',
      gap: 14,
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: selected ? '2px solid var(--brand-strong)' : '2px solid transparent',
      padding: 18,
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      flexShrink: 0,
      width: 22,
      height: 22,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: "checkbox",
    checked: !!selected,
    disabled: disabled,
    onChange: e => onSelectedChange && onSelectedChange(e.target.checked)
  }, fh, {
    style: {
      position: 'absolute',
      inset: 0,
      margin: 0,
      opacity: 0,
      cursor: 'inherit'
    }
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 22,
      height: 22,
      borderRadius: 7,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid ' + (selected ? 'var(--brand-strong)' : 'var(--n-500)'),
      background: selected ? 'var(--brand-strong)' : 'var(--surface-card)',
      pointerEvents: 'none',
      ...(focus ? __ds_scope.FOCUS_RING : {})
    }
  }, selected ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 15,
    color: "#FFFFFF",
    strokeWidth: 1.75
  }) : null)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: level
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      color: selected ? 'var(--brand-strong)' : 'var(--text-muted)'
    }
  }, selected ? 'Selecionada' : 'Não selecionada')), /*#__PURE__*/React.createElement("span", {
    style: titleStyle
  }, title), /*#__PURE__*/React.createElement(Competencies, {
    list: competencies,
    emptyText: "Nenhuma compet\xEAncia registrada."
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      background: 'var(--n-25)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Motivo da recomenda\xE7\xE3o"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: 1.45,
      color: reason ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, reason || 'Motivo não informado.')), /*#__PURE__*/React.createElement(Meta, {
    origin: origin,
    updatedAt: updatedAt,
    proofCount: proofCount
  })));
}
function EvidenceCard({
  variant = 'grid',
  ...props
}) {
  if (variant === 'suggestion') return /*#__PURE__*/React.createElement(SuggestionCard, props);
  if (variant === 'selectable') return /*#__PURE__*/React.createElement(SelectableCard, props);
  return /*#__PURE__*/React.createElement(GridCard, props);
}
Object.assign(__ds_scope, { EvidenceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/EvidenceCard.jsx", error: String((e && e.message) || e) }); }

// components/flow/StepFlow.jsx
try { (() => {
function StepFlow({
  step = 1,
  total = 4,
  title,
  description,
  children,
  onBack,
  onNext,
  backLabel = 'Voltar',
  nextLabel = 'Continuar',
  nextVariant = 'solid',
  nextDisabled,
  nextDisabledReason,
  disabled,
  error,
  saving,
  focused,
  style
}) {
  const id = React.useId ? React.useId() : 'step';
  const s = Math.max(1, Math.min(total, step));
  const blockNext = disabled || nextDisabled || saving;
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": id + '-t',
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-soft)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--brand-strong)',
      fontFeatureSettings: "'tnum'"
    }
  }, "Etapa ", s, " de ", total), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-label": 'Etapa ' + s + ' de ' + total,
    "aria-valuemin": 1,
    "aria-valuemax": total,
    "aria-valuenow": s,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + total + ', minmax(0,1fr))',
      gap: 4
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 4,
      borderRadius: 999,
      background: i < s ? 'var(--brand)' : 'var(--n-100)'
    }
  }))), /*#__PURE__*/React.createElement("h3", {
    id: id + '-t',
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--text-strong)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, description) : null), children ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? 'none' : undefined
    },
    "aria-disabled": disabled || undefined
  }, children) : null, error ? /*#__PURE__*/React.createElement("p", {
    role: "alert",
    style: {
      margin: 0,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--red-soft)',
      color: 'var(--red-ink)',
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 16
  }), error) : null, /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      borderTop: '1px solid var(--divider)',
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    icon: "arrow-left",
    disabled: disabled || s === 1,
    onClick: onBack
  }, backLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }
  }, blockNext && nextDisabledReason && !saving ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--n-600)'
    }
  }, nextDisabledReason) : null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: nextVariant,
    iconRight: "arrow-right",
    disabled: blockNext,
    onClick: onNext,
    style: focused ? __ds_scope.FOCUS_RING : undefined
  }, saving ? 'Salvando…' : nextLabel))));
}
Object.assign(__ds_scope, { StepFlow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/flow/StepFlow.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  variant = 'field',
  icon,
  label,
  hint,
  error,
  value,
  defaultValue,
  onChange,
  placeholder,
  trailing,
  disabled,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const isSearch = variant === 'search';
  const border = error ? 'var(--danger)' : 'var(--border-subtle)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 44,
      padding: '0 ' + (isSearch ? 16 : 14) + 'px',
      borderRadius: isSearch ? 'var(--radius-pill)' : 'var(--radius-sm)',
      background: disabled ? 'var(--n-50)' : 'var(--surface-card)',
      border: '1px solid ' + border,
      boxShadow: 'none',
      transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)',
      ...(focus && !disabled ? __ds_scope.FIELD_FOCUS : {})
    }
  }, icon || isSearch ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || 'search',
    size: 18,
    color: "var(--text-muted)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-strong)',
      ...inputStyle
    }
  }, rest)), trailing), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--red-ink)' : 'var(--text-muted)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/PillTabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// LEGADO — remover na T6.2. Não usar como navegação do produto; sem usos novos.
// WAI-ARIA tabs: roving tabindex, ←/→/Home/End move focus and select.
function Tab({
  it,
  id,
  active,
  size,
  onPick,
  onKey,
  btnRef
}) {
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = __ds_scope.useFocusVisible();
  return /*#__PURE__*/React.createElement("button", _extends({
    ref: btnRef,
    role: "tab",
    "aria-selected": active,
    tabIndex: active ? 0 : -1,
    type: "button",
    onClick: () => onPick(id),
    onKeyDown: onKey,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, fh, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: size === 'sm' ? 28 : 32,
      padding: '0 ' + (size === 'sm' ? 10 : 12) + 'px',
      borderRadius: 999,
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: size === 'sm' ? 12 : 13,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      background: active ? 'var(--ink)' : hover ? 'var(--n-50)' : 'transparent',
      color: active ? '#FFFFFF' : 'var(--text-strong)',
      transition: 'background var(--dur-micro)',
      ...__ds_scope.NO_OUTLINE,
      ...(kf ? __ds_scope.FOCUS_RING : {})
    }
  }), it.label, it.count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: active ? 'var(--indigo-300)' : 'var(--brand)',
      fontFeatureSettings: "'tnum'"
    }
  }, it.count) : null);
}
function PillTabs({
  items = [],
  value,
  onChange,
  size = 'md',
  label = 'Filtros',
  style
}) {
  const refs = React.useRef([]);
  const ids = items.map(it => it.id ?? it.label);
  const cur = ids.indexOf(value) < 0 ? ids[0] : value;
  const pick = id => onChange && onChange(id);
  const key = i => e => {
    const n = ids.length;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % n;else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;else if (e.key === 'Home') j = 0;else if (e.key === 'End') j = n - 1;
    if (j == null) return;
    e.preventDefault();
    pick(ids[j]);
    refs.current[j] && refs.current[j].focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": label,
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      flexWrap: 'wrap',
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(Tab, {
    key: ids[i],
    it: it,
    id: ids[i],
    active: ids[i] === cur,
    size: size,
    onPick: pick,
    onKey: key(i),
    btnRef: el => {
      refs.current[i] = el;
    }
  })));
}
Object.assign(__ds_scope, { PillTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/PillTabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Native <button role="switch">: reachable by Tab, toggles with Space/Enter, real `disabled`.
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  id,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const [kf, fh] = __ds_scope.useFocusVisible();
  const auto = React.useId ? React.useId() : 'sw';
  const bid = id || auto;
  const on = checked != null ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    const v = !on;
    if (checked == null) setInner(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-strong)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: bid,
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle
  }, fh, {
    style: {
      width: 36,
      height: 20,
      padding: 0,
      border: 0,
      borderRadius: 999,
      background: on ? 'var(--brand)' : 'var(--n-200)',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-normal) var(--ease-out)',
      flexShrink: 0,
      ...__ds_scope.NO_OUTLINE,
      ...(kf ? __ds_scope.FOCUS_RING : {})
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 18 : 2,
      width: 16,
      height: 16,
      borderRadius: 999,
      background: '#FFFFFF',
      boxShadow: '0 1px 2px rgb(26 23 38 / 0.2)',
      transition: 'left var(--dur-normal) var(--ease-out)'
    }
  })), label != null ? /*#__PURE__*/React.createElement("label", {
    htmlFor: bid,
    style: {
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/live/ArgumentPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const shell = {
  background: 'var(--surface-card)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-soft)',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  fontFamily: 'var(--font-body)'
};
const field = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-muted)'
};
function Dots() {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      gap: 4
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--n-400)',
      animation: 'persona-dot 1.2s ' + i * 0.15 + 's infinite var(--ease-out)'
    }
  })));
}
function SourceButton({
  label,
  onClick,
  focused,
  disabled
}) {
  const [kf, fh] = __ds_scope.useFocusVisible();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick
  }, fh, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 28,
      padding: '0 10px',
      borderRadius: 999,
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)',
      color: disabled ? 'var(--text-disabled)' : 'var(--brand-strong)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      cursor: disabled ? 'default' : 'pointer',
      whiteSpace: 'nowrap',
      ...__ds_scope.NO_OUTLINE,
      ...(kf || focused ? __ds_scope.FOCUS_RING : {})
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "link",
    size: 14
  }), label);
}
function ArgumentPanel({
  state = 'sustained',
  question,
  items = [],
  avoid,
  missing = [],
  onRegister,
  onSource,
  onRetry,
  error,
  focused,
  style
}) {
  const closed = state === 'closed';
  return /*#__PURE__*/React.createElement("section", {
    "aria-label": "Argumentos reais",
    "aria-busy": state === 'processing' || undefined,
    style: {
      ...shell,
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "list-checks",
    size: 18,
    color: "var(--brand)"
  }), "Argumentos reais"), state === 'gap' ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    status: "lacuna"
  }) : closed ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    icon: "lock"
  }, "Somente leitura") : null), question ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-body)',
      lineHeight: 1.45
    }
  }, "Pergunta: \u201C", question, "\u201D") : null), state === 'processing' ? /*#__PURE__*/React.createElement("p", {
    role: "status",
    style: {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Dots, null), "Buscando fatos nas evid\xEAncias autorizadas\u2026") : null, state === 'error' ? /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: 'flex',
      gap: 8,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--red-ink)',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 16
  }), error || 'Não foi possível montar os argumentos agora. Sua pergunta continua aqui.'), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: "refresh-cw",
    onClick: onRetry
  }, "Tentar de novo")) : null, state === 'gap' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)',
      lineHeight: 1.45
    }
  }, "Ainda n\xE3o h\xE1 evid\xEAncia para sustentar esta resposta."), missing.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: field
  }, "O que falta registrar"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, missing.map(m => /*#__PURE__*/React.createElement("li", {
    key: m
  }, m)))) : null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "solid",
    size: "sm",
    icon: "notebook-pen",
    onClick: onRegister,
    style: focused ? __ds_scope.FOCUS_RING : undefined
  }, "Registrar no Di\xE1rio")) : null, state === 'sustained' || closed ? items.map((it, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: i ? 14 : 0,
      borderTop: i ? '1px solid var(--divider)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: field
  }, "Fato"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)',
      lineHeight: 1.4
    }
  }, it.fact)), it.action ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: field
  }, "A\xE7\xE3o"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)',
      lineHeight: 1.5
    }
  }, it.action)) : null, it.result ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: field
  }, "Resultado"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)',
      lineHeight: 1.5
    }
  }, it.result)) : null, it.competencies && it.competencies.length ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...field,
      marginRight: 4
    }
  }, "Compet\xEAncias"), it.competencies.map(c => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: c,
    size: "sm"
  }, c))) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: field
  }, "Origem"), /*#__PURE__*/React.createElement(SourceButton, {
    label: it.source,
    focused: focused && i === 0,
    disabled: closed && !onSource,
    onClick: () => onSource && onSource(it.source)
  }), it.level ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    status: it.level
  }) : null))) : null, (state === 'sustained' || closed) && avoid ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: 'flex',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--amber-soft)',
      color: 'var(--amber-ink)',
      fontSize: 13,
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 16,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("b", null, "N\xE3o afirme:"), " ", avoid)) : null);
}
Object.assign(__ds_scope, { ArgumentPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/live/ArgumentPanel.jsx", error: String((e && e.message) || e) }); }

// components/live/DraftPanel.jsx
try { (() => {
const DRAFT_DURATIONS = {
  objetiva: '15–25 s',
  comportamental: '30–45 s',
  complexa: 'até 60 s'
};
const KIND_LABEL = {
  objetiva: 'objetiva',
  comportamental: 'comportamental · STAR',
  complexa: 'complexa'
};
function DraftPanel({
  state = 'ready',
  kind = 'comportamental',
  text,
  sources = [],
  onShorten,
  onDeepen,
  onOther,
  onCopy,
  onSave,
  onDuplicate,
  onRetry,
  error,
  focused,
  style
}) {
  const [copied, setCopied] = React.useState(false);
  const ready = state === 'ready';
  const closed = state === 'closed';
  const copy = () => {
    onCopy && onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return /*#__PURE__*/React.createElement("section", {
    "aria-label": "Rascunho sugerido",
    "aria-busy": state === 'processing' || undefined,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-soft)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "pen-line",
    size: 18,
    color: "var(--brand)"
  }), "Rascunho sugerido"), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    icon: "clock"
  }, DRAFT_DURATIONS[kind], " \xB7 ", KIND_LABEL[kind])), ready || closed ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.65,
      color: closed ? 'var(--text-body)' : 'var(--text-strong)',
      textWrap: 'pretty'
    }
  }, text) : null, state === 'processing' ? /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-label": "Gerando rascunho",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, [100, 92, 64].map(w => /*#__PURE__*/React.createElement("span", {
    key: w,
    style: {
      height: 12,
      width: w + '%',
      borderRadius: 6,
      background: 'var(--n-50)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Gerando rascunho a partir dos argumentos\u2026")) : null, state === 'gap' ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--n-600)'
    }
  }, "Sem rascunho: n\xE3o h\xE1 evid\xEAncia para sustentar esta resposta. Nada \xE9 gerado sem fato registrado.") : null, state === 'error' ? /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: 'flex',
      gap: 8,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--red-ink)',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 16
  }), error || 'Não foi possível gerar o rascunho. Os argumentos continuam disponíveis.'), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: "refresh-cw",
    onClick: onRetry
  }, "Tentar de novo")) : null, (ready || closed) && sources.length ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Baseado em: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-body)',
      fontWeight: 600
    }
  }, sources.join(' · '))) : null, closed ? /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      flexWrap: 'wrap',
      borderTop: '1px solid var(--divider)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: 'var(--n-600)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 14
  }), "Sess\xE3o encerrada \xB7 somente leitura"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: "copy",
    onClick: onDuplicate
  }, "Duplicar sess\xE3o")) : /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      borderTop: '1px solid var(--divider)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: "minus",
    disabled: !ready,
    onClick: onShorten,
    style: focused && ready ? __ds_scope.FOCUS_RING : undefined
  }, "Encurtar"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: "plus",
    disabled: !ready,
    onClick: onDeepen
  }, "Aprofundar"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: "refresh-cw",
    disabled: !ready,
    onClick: onOther
  }, "Outra experi\xEAncia"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    icon: copied ? 'check' : 'copy',
    disabled: !ready,
    onClick: copy
  }, copied ? 'Copiado' : 'Copiar'), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "solid",
    size: "sm",
    icon: "file-text",
    disabled: !ready,
    onClick: onSave
  }, "Salvar nos Artefatos")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      lineHeight: 1.45
    }
  }, "Apoio para a sua resposta, n\xE3o para leitura literal. O Persona n\xE3o responde por voc\xEA.")));
}
Object.assign(__ds_scope, { DRAFT_DURATIONS, DraftPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/live/DraftPanel.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
function AppHeader({
  title,
  agentOpen,
  onAgentToggle,
  onMenu,
  searchValue,
  onSearchChange,
  onSearch,
  style
}) {
  const hRef = React.useRef(null);
  const [hw, setHw] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = hRef.current;
    if (!el) return;
    const set = () => setHw(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Em contêiner estreito (< 460 px) a busca passa para a segunda linha, com largura total: nunca encolhe abaixo do alvo mínimo.
  const narrow = hw > 0 && hw < 460;
  return /*#__PURE__*/React.createElement("header", {
    ref: hRef,
    style: {
      display: 'flex',
      flexWrap: narrow ? 'wrap' : 'nowrap',
      alignItems: 'center',
      gap: narrow ? 12 : 16,
      minHeight: 56,
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, onMenu ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    "data-nav-trigger": "",
    icon: "panel-left",
    variant: "outline",
    size: 40,
    label: "Abrir menu",
    "aria-haspopup": "dialog",
    onClick: onMenu
  }) : null, title ? /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap'
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: narrow ? {
      order: 3,
      flex: '1 1 100%',
      minWidth: 0
    } : {
      flex: '1 1 auto',
      minWidth: 0,
      maxWidth: 520,
      marginLeft: title ? 'auto' : 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.AgentPrompt, {
    size: "compact",
    value: searchValue,
    onChange: onSearchChange,
    onSubmit: onSearch
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: narrow ? 'auto' : title ? 0 : 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "sparkles",
    variant: agentOpen ? 'soft' : 'outline',
    size: 40,
    label: agentOpen ? 'Agente (aberto)' : 'Agente',
    active: agentOpen,
    "aria-pressed": !!agentOpen,
    "aria-expanded": !!agentOpen,
    onClick: () => onAgentToggle && onAgentToggle(!agentOpen)
  })));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavItem({
  icon,
  label,
  active,
  badge,
  badgeLabel,
  collapsed,
  onClick,
  focused,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = __ds_scope.useFocusVisible();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    title: collapsed ? label : undefined,
    "aria-label": collapsed ? label + (badge != null ? ', ' + (badgeLabel || badge) : '') : undefined,
    "aria-current": active ? 'page' : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, fh, {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: collapsed ? 44 : '100%',
      height: 44,
      padding: collapsed ? 0 : '0 12px',
      justifyContent: collapsed ? 'center' : 'flex-start',
      borderRadius: 'var(--radius-pill)',
      border: 0,
      cursor: 'pointer',
      background: active ? 'var(--brand-soft)' : hover ? 'var(--n-50)' : 'transparent',
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: active ? 600 : 500,
      textAlign: 'left',
      flexShrink: 0,
      transition: 'background var(--dur-micro)',
      ...__ds_scope.NO_OUTLINE,
      ...(kf || focused ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    color: active ? 'var(--brand)' : 'var(--n-600)'
  }), collapsed ? null : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label), badge != null ? collapsed ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 7,
      right: 7,
      width: 8,
      height: 8,
      borderRadius: 999,
      background: 'var(--ink)',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    "aria-label": badgeLabel,
    style: {
      minWidth: 20,
      height: 20,
      padding: '0 7px',
      borderRadius: 999,
      background: 'var(--ink)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontFeatureSettings: "'tnum'",
      boxSizing: 'border-box'
    }
  }, badge) : null);
}
Object.assign(__ds_scope, { NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
const NAV_DESTINATIONS = [{
  id: 'inicio',
  icon: 'house',
  label: 'Início'
}, {
  id: 'diario',
  icon: 'notebook-pen',
  label: 'Diário'
}, {
  id: 'evidencias',
  icon: 'badge-check',
  label: 'Evidências'
}, {
  id: 'live',
  icon: 'mic',
  label: 'Persona Live'
}, {
  id: 'artefatos',
  icon: 'file-text',
  label: 'Artefatos'
}];
const NAV_SETTINGS = {
  id: 'configuracoes',
  icon: 'settings',
  label: 'Configurações'
};

// Geometry copied from assets/logos/persona-logo-compacta.svg.
function Mark({
  size = 28
}) {
  const L = [[32, 30], [92, 42], [34, 92], [98, 88]];
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 120 120',
    'aria-hidden': true,
    style: {
      flexShrink: 0,
      display: 'block'
    }
  }, ...L.map(([x, y], i) => React.createElement('line', {
    key: 'l' + i,
    x1: x,
    y1: y,
    x2: 60,
    y2: 60,
    stroke: '#7C3AED',
    strokeWidth: 11,
    strokeLinecap: 'round'
  })), ...L.map(([x, y], i) => React.createElement('circle', {
    key: 'c' + i,
    cx: x,
    cy: y,
    r: 14,
    fill: '#A78BFA'
  })), React.createElement('circle', {
    key: 'core',
    cx: 60,
    cy: 60,
    r: 22,
    fill: '#7C3AED'
  }));
}
function Sidebar({
  active = 'inicio',
  onNavigate,
  collapsed,
  onToggle,
  onRegister,
  resume,
  onResume,
  badges = {},
  style
}) {
  const nav = id => onNavigate && onNavigate(id);
  const register = () => {
    if (onRegister) onRegister();else nav('diario');
  };
  const w = collapsed ? 76 : 256;
  return /*#__PURE__*/React.createElement("aside", {
    "aria-label": "Navega\xE7\xE3o principal",
    style: {
      width: w,
      flexShrink: 0,
      height: '100%',
      minHeight: 560,
      boxSizing: 'border-box',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-soft)',
      padding: collapsed ? '16px 16px' : '18px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: collapsed ? 'center' : 'stretch',
      gap: 16,
      fontFamily: 'var(--font-body)',
      transition: 'width var(--dur-normal) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'space-between',
      flexDirection: collapsed ? 'column' : 'row',
      gap: collapsed ? 12 : 8,
      padding: collapsed ? 0 : '0 4px 0 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 28
  }), collapsed ? null : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: 'var(--text-strong)'
    }
  }, "Persona")), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "panel-left",
    size: 36,
    label: collapsed ? 'Expandir menu' : 'Recolher menu',
    "aria-expanded": !collapsed,
    onClick: () => onToggle && onToggle(!collapsed)
  })), collapsed ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "square-pen",
    variant: "solid",
    size: 44,
    label: "Registrar agora",
    onClick: register
  }) : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "solid",
    icon: "square-pen",
    fullWidth: true,
    onClick: register,
    style: {
      height: 44
    }
  }, "Registrar agora"), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Destinos",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: collapsed ? 'center' : 'stretch',
      gap: 2
    }
  }, NAV_DESTINATIONS.map(d => {
    const b = badges[d.id];
    return /*#__PURE__*/React.createElement(__ds_scope.NavItem, {
      key: d.id,
      icon: d.icon,
      label: d.label,
      collapsed: collapsed,
      active: active === d.id,
      badge: b && b.count,
      badgeLabel: b && b.label,
      onClick: () => nav(d.id)
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), resume ? collapsed ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "history",
    variant: "outline",
    size: 44,
    label: 'Continue de onde parou: ' + resume.title + ' · ' + resume.meta,
    onClick: onResume
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 8,
      height: 8,
      borderRadius: 999,
      background: 'var(--amber-500)',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  })) : /*#__PURE__*/React.createElement("section", {
    "aria-label": "Continue de onde parou",
    style: {
      background: 'var(--n-25)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "history",
    size: 14
  }), "Continue de onde parou"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)',
      lineHeight: 1.3
    }
  }, resume.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--amber-ink)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkles",
    size: 13
  }), resume.meta), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    fullWidth: true,
    onClick: onResume,
    style: {
      marginTop: 2
    }
  }, resume.action || 'Revisar sugestões')) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--divider)',
      paddingTop: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: collapsed ? 'center' : 'stretch',
      width: collapsed ? '100%' : undefined
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.NavItem, {
    icon: NAV_SETTINGS.icon,
    label: NAV_SETTINGS.label,
    collapsed: collapsed,
    active: active === NAV_SETTINGS.id,
    onClick: () => nav(NAV_SETTINGS.id)
  })));
}
Object.assign(__ds_scope, { NAV_DESTINATIONS, NAV_SETTINGS, Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/overlay/FloatingPanel.jsx
try { (() => {
// One floating panel at a time: opening a panel closes the one already open.
const ACTIVE = {
  current: null
};
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
function FloatingPanel({
  open,
  onClose,
  eyebrow,
  title,
  subtitle,
  width = 600,
  children,
  footer,
  contained,
  style
}) {
  const id = React.useId ? React.useId() : 'fp';
  const ref = React.useRef(null);
  const wrapRef = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => {
    if (!open) return;
    const me = {
      id,
      close: () => closeRef.current && closeRef.current()
    };
    if (ACTIVE.current && ACTIVE.current.id !== id) ACTIVE.current.close();
    ACTIVE.current = me;
    const prev = document.activeElement;
    const el = ref.current;
    // Conteúdo de fundo inerte enquanto o painel está aberto: nenhum CTA da página fica focável ou clicável por trás do painel.
    const wrap = wrapRef.current;
    const made = [];
    if (wrap && wrap.parentNode) Array.from(wrap.parentNode.children).forEach(c => {
      if (c !== wrap && !c.hasAttribute('inert')) {
        c.setAttribute('inert', '');
        made.push(c);
      }
    });
    el && el.focus({
      preventScroll: true
    });
    const onKey = e => {
      if (!el || !el.contains(document.activeElement) && document.activeElement !== el) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        me.close();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = Array.from(el.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const a = list[0],
        z = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === el)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      made.forEach(c => c.removeAttribute('inert'));
      if (ACTIVE.current === me) ACTIVE.current = null;
      if (prev && prev.focus && document.contains(prev)) prev.focus({
        preventScroll: true
      });
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: contained ? 'absolute' : 'fixed',
      inset: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    onClick: () => onClose && onClose(),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgb(26 23 38 / 0.18)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": id + '-t',
    tabIndex: -1,
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      bottom: 16,
      width: 'min(' + width + 'px, calc(100% - 32px))',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-float)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      outline: 0,
      fontFamily: 'var(--font-body)',
      animation: 'persona-rise var(--dur-normal) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '20px 16px 16px 24px',
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    id: id + '-t',
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
      color: 'var(--text-strong)',
      textWrap: 'pretty'
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, subtitle) : null), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    variant: "ghost",
    size: 40,
    label: "Fechar painel (Esc)",
    onClick: () => onClose && onClose()
  })), /*#__PURE__*/React.createElement("div", {
    "data-fp-body": "",
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: 24
    }
  }, children), footer ? /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      flexWrap: 'wrap',
      padding: '14px 24px',
      borderTop: '1px solid var(--divider)'
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { FloatingPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/FloatingPanel.jsx", error: String((e && e.message) || e) }); }

// components/overlay/SectionIndex.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function scrollParent(el) {
  let p = el && el.parentElement;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return document.scrollingElement;
}
function Item({
  it,
  n,
  active,
  onGo,
  focused
}) {
  const [kf, fh] = __ds_scope.useFocusVisible();
  const [hover, setHover] = React.useState(false);
  const num = String(n).padStart(2, '0');
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      flexShrink: 0,
      background: active ? 'var(--brand)' : 'transparent',
      border: active ? 0 : '1px solid var(--n-200)',
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontFeatureSettings: "'tnum'",
      flexShrink: 0
    }
  }, num), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, it.label), it.meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontWeight: 400,
      whiteSpace: 'nowrap'
    }
  }, it.meta) : null);
  const base = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 4px',
    borderRadius: 6,
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    lineHeight: 1.35,
    textDecoration: 'none'
  };
  if (it.disabled) return /*#__PURE__*/React.createElement("li", {
    style: {
      listStyle: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-disabled": "true",
    style: {
      ...base,
      color: 'var(--text-disabled)',
      cursor: 'default'
    }
  }, inner));
  return /*#__PURE__*/React.createElement("li", {
    style: {
      listStyle: 'none'
    }
  }, /*#__PURE__*/React.createElement("a", _extends({
    href: '#' + it.id,
    "aria-current": active ? 'location' : undefined,
    onClick: e => {
      e.preventDefault();
      onGo(it.id);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, fh, {
    style: {
      ...base,
      color: active || hover ? 'var(--text-strong)' : 'var(--text-body)',
      fontWeight: active ? 600 : 400,
      textDecoration: hover && !active ? 'underline' : 'none',
      textUnderlineOffset: 3,
      ...__ds_scope.NO_OUTLINE,
      ...(kf || focused ? __ds_scope.FOCUS_RING : {})
    }
  }), inner));
}
function SectionIndex({
  items = [],
  activeId,
  onSelect,
  title = 'Nesta página',
  focusedId,
  style
}) {
  const [inner, setInner] = React.useState(activeId || items[0] && items[0].id);
  const current = activeId != null ? activeId : inner;
  const go = id => {
    const el = document.getElementById(id);
    if (el) {
      const p = scrollParent(el);
      const pad = parseFloat(getComputedStyle(p).scrollPaddingTop) || 0;
      const top = el.getBoundingClientRect().top - (p === document.scrollingElement ? 0 : p.getBoundingClientRect().top) + p.scrollTop - Math.max(8, pad);
      p.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
    if (activeId == null) setInner(id);
    onSelect && onSelect(id);
  };
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": title,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 0,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-muted)',
      padding: '0 4px'
    }
  }, title), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(Item, {
    key: it.id,
    it: it,
    n: i + 1,
    active: current === it.id,
    onGo: go,
    focused: focusedId === it.id
  }))));
}
Object.assign(__ds_scope, { SectionIndex });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/SectionIndex.jsx", error: String((e && e.message) || e) }); }

// components/shell/AppShell.jsx
try { (() => {
const STORE = 'persona.agentPanel.open';
const readStore = () => {
  try {
    const v = localStorage.getItem(STORE);
    return v == null ? null : v === '1';
  } catch (e) {
    return null;
  }
};
const writeStore = v => {
  try {
    localStorage.setItem(STORE, v ? '1' : '0');
  } catch (e) {}
};
function useWidth() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
function AppShell({
  active = 'inicio',
  onNavigate,
  title,
  children,
  panel,
  resume,
  onResume,
  badges,
  onRegister,
  agentOpen,
  defaultAgentOpen = false,
  onAgentToggle,
  agentScreen,
  agentMessages,
  onAgentSend,
  onAgentAction,
  sidebarCollapsed,
  height = '100vh',
  style
}) {
  const [rootRef, w] = useWidth();
  const [innerOpen, setInnerOpen] = React.useState(() => {
    const s = readStore();
    return s == null ? defaultAgentOpen : s;
  });
  const open = agentOpen != null ? agentOpen : innerOpen;
  const setOpen = v => {
    writeStore(v);
    if (agentOpen == null) setInnerOpen(v);
    onAgentToggle && onAgentToggle(v);
  };
  const [manualRail, setManualRail] = React.useState(null);
  const sheet = w > 0 && w < 1024;
  // < 640 px: sem sidebar inline; navegação por gaveta acessível (foco, trap de Tab, Esc, restauração do foco).
  const phone = w > 0 && w < 640;
  const [navOpen, setNavOpen] = React.useState(false);
  const navRef = React.useRef(null);
  React.useEffect(() => {
    if (!phone && navOpen) setNavOpen(false);
  }, [phone]);
  React.useEffect(() => {
    if (!(phone && navOpen)) return;
    const prev = document.activeElement;
    const el = navRef.current;
    el && el.focus({
      preventScroll: true
    });
    const k = e => {
      if (!el || !el.contains(document.activeElement) && document.activeElement !== el) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        setNavOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const list = Array.from(el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(n => n.offsetParent !== null);
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const a = list[0],
        z = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === el)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', k, true);
    return () => {
      document.removeEventListener('keydown', k, true);
      const t = rootRef.current && rootRef.current.querySelector('[data-nav-trigger]');
      if (t) t.focus({
        preventScroll: true
      });else if (prev && prev.focus && document.contains(prev)) prev.focus({
        preventScroll: true
      });
    };
  }, [phone, navOpen]);
  const autoRail = w < 1280 && (open || w < 1100);
  const rail = sidebarCollapsed != null ? sidebarCollapsed : manualRail != null ? manualRail : autoRail;
  const scrollRef = React.useRef(null);
  const headRef = React.useRef(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [headH, setHeadH] = React.useState(72);
  React.useLayoutEffect(() => {
    if (headRef.current) setHeadH(headRef.current.offsetHeight);
  });
  React.useEffect(() => {
    if (!(sheet && open)) return;
    const k = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [sheet, open]);
  const agent = /*#__PURE__*/React.createElement(__ds_scope.AgentPanel, {
    open: true,
    screen: agentScreen || title,
    messages: agentMessages,
    onSend: onAgentSend,
    onAction: onAgentAction,
    onToggle: setOpen,
    composerProps: {
      suggestions: []
    },
    style: {
      width: sheet ? 'min(400px, calc(100% - 32px))' : 'clamp(340px, 28vw, 400px)',
      height: '100%',
      minHeight: 0
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    "data-agent": open ? sheet ? 'sheet' : 'docked' : 'closed',
    "data-rail": rail ? '1' : '0',
    style: {
      position: 'relative',
      display: 'flex',
      gap: phone ? 8 : 16,
      paddingTop: phone ? 8 : 16,
      paddingRight: phone ? 8 : 16,
      paddingBottom: phone ? 8 : 16,
      paddingLeft: phone ? 8 : 16,
      height,
      boxSizing: 'border-box',
      background: 'var(--bg-app)',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, phone ? null : /*#__PURE__*/React.createElement(__ds_scope.Sidebar, {
    active: active,
    onNavigate: onNavigate,
    collapsed: rail,
    onToggle: setManualRail,
    resume: resume,
    onResume: onResume,
    badges: badges,
    onRegister: onRegister,
    style: {
      minHeight: 0
    }
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      position: 'relative',
      flex: '1 1 auto',
      minWidth: 0,
      background: 'var(--n-25)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    "data-shell-scroll": "",
    onScroll: e => setScrolled(e.currentTarget.scrollTop > 0),
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollPaddingTop: headH + 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: headRef,
    "data-shell-header": "",
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 5,
      background: '#FAFAFC',
      padding: phone ? '12px 16px' : '14px 28px',
      boxShadow: scrolled ? 'var(--shadow-soft)' : 'none',
      transition: 'box-shadow var(--dur-micro)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.AppHeader, {
    title: title,
    agentOpen: open,
    onAgentToggle: setOpen,
    onMenu: phone ? () => setNavOpen(true) : undefined
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: phone ? '12px 16px 32px' : '12px 28px 40px',
      maxWidth: 1280,
      margin: '0 auto',
      boxSizing: 'border-box',
      minWidth: 0
    }
  }, children)), panel), open && !sheet ? agent : null, open && sheet ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    onClick: () => setOpen(false),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgb(26 23 38 / 0.18)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Agente Persona",
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      bottom: 16,
      width: 'min(400px, calc(100% - 32px))',
      display: 'flex'
    }
  }, agent)) : null, phone && navOpen ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 70
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    onClick: () => setNavOpen(false),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgb(26 23 38 / 0.18)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: navRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Navega\xE7\xE3o",
    tabIndex: -1,
    style: {
      position: 'absolute',
      top: 8,
      left: 8,
      bottom: 8,
      width: 'min(280px, calc(100% - 16px))',
      display: 'flex',
      outline: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Sidebar, {
    active: active,
    onNavigate: id => {
      setNavOpen(false);
      onNavigate && onNavigate(id);
    },
    collapsed: false,
    onToggle: () => setNavOpen(false),
    resume: resume,
    onResume: onResume,
    badges: badges,
    onRegister: onRegister ? () => {
      setNavOpen(false);
      onRegister();
    } : () => {
      setNavOpen(false);
      onNavigate && onNavigate('diario');
    },
    style: {
      width: '100%',
      minHeight: 0
    }
  }))) : null);
}
Object.assign(__ds_scope, { AppShell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/AppShell.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
const SH = {
  none: 'none',
  soft: 'var(--shadow-soft)',
  float: 'var(--shadow-float)',
  slab: 'var(--shadow-slab)'
};
const R = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)'
};
function Card({
  elevation = 'soft',
  radius = 'md',
  padding = 24,
  bordered,
  interactive,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const lift = interactive && hover;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      borderRadius: R[radius] || radius,
      padding,
      boxShadow: lift ? SH.float : SH[elevation],
      border: bordered ? '1px solid var(--border-subtle)' : '1px solid transparent',
      transform: lift ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)',
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/DestinationGrid.jsx
try { (() => {
function useWidth() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// 4 columns when the container is ≥ 900px, otherwise 2 × 2. Rows share one height; a trailing odd tile spans the row (never orphaned).
function DestinationGrid({
  children,
  breakpoint = 900,
  gap = 12,
  style
}) {
  const [ref, w] = useWidth();
  const items = React.Children.toArray(children).filter(Boolean);
  const cols = w >= breakpoint ? 4 : 2;
  const rest = items.length % cols;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-cols": cols,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))',
      gridAutoRows: '1fr',
      gap,
      width: '100%',
      minWidth: 0,
      ...style
    }
  }, items.map((c, i) => {
    const last = rest && i >= items.length - rest;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        minWidth: 0,
        display: 'flex',
        gridColumn: last && i === items.length - 1 ? 'span ' + (cols - rest + 1) : undefined
      }
    }, c);
  }));
}
Object.assign(__ds_scope, { DestinationGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/DestinationGrid.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/DestinationTile.jsx
try { (() => {
const T = {
  indigo: {
    bg: 'var(--tile-indigo)',
    fg: 'var(--indigo-700)'
  },
  blue: {
    bg: 'var(--tile-blue)',
    fg: 'var(--blue-ink)'
  },
  amber: {
    bg: 'var(--tile-amber)',
    fg: 'var(--amber-ink)'
  },
  green: {
    bg: 'var(--tile-green)',
    fg: 'var(--green-ink)'
  },
  rose: {
    bg: 'var(--tile-rose)',
    fg: '#9F1239'
  },
  slate: {
    bg: 'var(--tile-slate)',
    fg: 'var(--n-600)'
  }
};
function DestinationTile({
  tone = 'indigo',
  title,
  status,
  meta,
  icon,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const t = T[tone] || T.indigo;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 14,
      minHeight: 124,
      height: '100%',
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      padding: '16px 16px 14px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgb(255 255 255 / 0.6)',
      background: t.bg,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      boxShadow: hover ? 'var(--shadow-float)' : 'var(--shadow-soft)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: 12,
      background: 'rgb(255 255 255 / 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: t.fg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  })) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      flexShrink: 0,
      borderRadius: 999,
      background: 'rgb(255 255 255 / 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-strong)',
      transform: hover ? 'translate(2px,-2px)' : 'none',
      transition: 'transform var(--dur-normal) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minWidth: 0,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    title: status,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: t.fg,
      minWidth: 0,
      overflowWrap: 'anywhere'
    }
  }, status), /*#__PURE__*/React.createElement("span", {
    title: meta || undefined,
    "aria-hidden": meta ? undefined : true,
    style: {
      fontSize: 12,
      lineHeight: '16px',
      minHeight: 16,
      color: 'var(--text-muted)',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, meta || '\u00a0')));
}
Object.assign(__ds_scope, { DestinationTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/DestinationTile.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/FocalCard.jsx
try { (() => {
function FocalCard({
  padding = 28,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-focal)',
      color: 'var(--text-on-focal)',
      padding,
      boxShadow: 'var(--shadow-slab)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface-focal-glow)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, children));
}
Object.assign(__ds_scope, { FocalCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/FocalCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/JourneyStepper.jsx
try { (() => {
function JourneyStepper({
  steps = [],
  onFocal = true,
  onSelect,
  style
}) {
  const fgStrong = onFocal ? '#FFFFFF' : 'var(--text-strong)';
  const fgMuted = onFocal ? 'var(--indigo-300)' : 'var(--text-muted)';
  const line = onFocal ? 'rgb(255 255 255 / 0.14)' : 'var(--n-100)';
  return /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, steps.map((s, i) => {
    const st = s.state || 'todo';
    const last = i === steps.length - 1;
    const node = st === 'done' ? {
      bg: onFocal ? 'rgb(255 255 255 / 0.10)' : 'var(--green-soft)',
      fg: onFocal ? 'var(--green-on-dark)' : 'var(--green-ink)',
      icon: 'check'
    } : st === 'active' ? {
      bg: 'var(--brand-gradient)',
      fg: '#FFFFFF',
      icon: s.icon || 'sparkles'
    } : st === 'locked' ? {
      bg: onFocal ? 'rgb(255 255 255 / 0.06)' : 'var(--n-50)',
      fg: onFocal ? 'rgb(255 255 255 / 0.45)' : 'var(--n-400)',
      icon: 'lock'
    } : {
      bg: onFocal ? 'rgb(255 255 255 / 0.06)' : 'var(--n-50)',
      fg: fgMuted,
      icon: s.icon || 'clock'
    };
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      onClick: onSelect ? () => onSelect(i) : undefined,
      style: {
        display: 'flex',
        gap: 12,
        cursor: onSelect ? 'pointer' : undefined,
        padding: st === 'active' ? '8px 10px' : '0 10px',
        margin: st === 'active' ? '0 0 4px' : 0,
        borderRadius: 16,
        background: st === 'active' ? onFocal ? 'rgb(255 255 255 / 0.07)' : 'var(--brand-soft)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 999,
        background: node.bg,
        color: node.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: st === 'active' ? '0 0 0 3px rgb(124 58 237 / 0.35)' : 'none',
        animation: st === 'active' ? 'persona-pulse 2.4s var(--ease-out) infinite' : 'none',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: node.icon,
      size: 16
    })), !last && st !== 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 2,
        flex: 1,
        minHeight: 14,
        background: line,
        margin: '4px 0'
      }
    }) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingTop: 7,
        paddingBottom: last ? 0 : 14,
        fontFamily: 'var(--font-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: st === 'locked' ? fgMuted : fgStrong
      }
    }, s.label), s.meta ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: st === 'active' ? onFocal ? '#C4B5FD' : 'var(--brand)' : fgMuted
      }
    }, s.meta) : null));
  }));
}
Object.assign(__ds_scope, { JourneyStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/JourneyStepper.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/FocalJourney.jsx
try { (() => {
function useWidth() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
const FOCAL_STEPS = [{
  label: 'Diagnóstico',
  meta: 'Concluído',
  state: 'done'
}, {
  label: 'Primeiro registro',
  meta: 'Concluído',
  state: 'done'
}, {
  label: '5 evidências confirmadas',
  meta: 'Em andamento · 4 de 5',
  state: 'active',
  icon: 'badge-check'
}, {
  label: 'Score observado',
  meta: 'Bloqueado',
  state: 'locked'
}];

// The ONE dark block of Início. Two columns only when its container is ≥ 1000px (next action ≥ 320px); otherwise stacked.
function FocalJourney({
  title = 'Do score declarado ao observado',
  steps = FOCAL_STEPS,
  nextText = 'Revise as 2 sugestões do Diário',
  ctaLabel = 'Revisar sugestões',
  ctaIcon = 'arrow-right',
  onCta,
  breakpoint = 1000,
  style
}) {
  const [ref, w] = useWidth();
  const wide = w >= breakpoint;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-layout": wide ? 'columns' : 'stacked',
    style: {
      width: '100%',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FocalCard, {
    padding: wide ? 28 : 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(320px, 360px)' : 'minmax(0,1fr)',
      gap: wide ? 32 : 20,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: '#FFFFFF',
      textWrap: 'pretty'
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.JourneyStepper, {
    steps: steps
  })), /*#__PURE__*/React.createElement("section", {
    "aria-label": "Pr\xF3xima a\xE7\xE3o",
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 16,
      minWidth: 0,
      padding: 20,
      borderRadius: 'var(--radius-md)',
      background: 'rgb(255 255 255 / 0.08)',
      border: '1px solid rgb(255 255 255 / 0.12)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--indigo-300)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "target",
    size: 14
  }), "Pr\xF3xima a\xE7\xE3o"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#FFFFFF',
      textWrap: 'pretty'
    }
  }, nextText)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "brand",
    size: "lg",
    iconRight: ctaIcon,
    onClick: onCta,
    style: {
      alignSelf: 'flex-start',
      flexShrink: 0,
      maxWidth: '100%'
    }
  }, ctaLabel)))));
}
Object.assign(__ds_scope, { FOCAL_STEPS, FocalJourney });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/FocalJourney.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/ProgressBar.jsx
try { (() => {
const C = {
  brand: 'var(--brand-gradient)',
  success: 'var(--green-500)',
  warning: 'var(--amber-500)',
  info: 'var(--blue-500)',
  ink: 'var(--ink)'
};
function ProgressBar({
  value = 0,
  tone = 'brand',
  height = 6,
  onFocal,
  label,
  style
}) {
  const v = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      color: onFocal ? 'var(--indigo-300)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFeatureSettings: "'tnum'"
    }
  }, v, "%")) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: 999,
      background: onFocal ? 'rgb(255 255 255 / 0.12)' : 'var(--n-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: v + '%',
      height: '100%',
      borderRadius: 999,
      background: C[tone] || C.brand,
      transition: 'width var(--dur-macro) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/score/DimensionRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ORIGIN = {
  declarada: 'Declarada',
  observada: 'Observada',
  parcial: 'Parcialmente observada'
};
function DimensionRow({
  label,
  value,
  weight,
  origin = 'declarada',
  progress,
  notEvaluated,
  notEvaluatedText = 'Ainda não avaliada',
  note,
  error,
  disabled,
  disabledText = 'Faça o diagnóstico para calcular.',
  onOpen,
  focused,
  style
}) {
  const [kf, fh] = __ds_scope.useFocusVisible();
  const [hover, setHover] = React.useState(false);
  const interactive = !!onOpen && !disabled;
  const Tag = interactive ? 'button' : 'div';
  const state = error ? 'error' : disabled ? 'disabled' : notEvaluated ? 'none' : 'value';
  const valueNode = state === 'value' ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 2,
      fontFeatureSettings: "'tnum'"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "/100")) : state === 'none' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--n-600)',
      whiteSpace: 'nowrap'
    }
  }, notEvaluatedText) : state === 'error' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--red-ink)',
      whiteSpace: 'nowrap'
    }
  }, "Indispon\xEDvel") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-disabled)',
      whiteSpace: 'nowrap'
    }
  }, "Sem dados");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: interactive ? 'button' : undefined,
    onClick: interactive ? onOpen : undefined,
    "aria-disabled": disabled || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, fh, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      padding: '14px 16px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid ' + (state === 'error' ? 'var(--red-500)' : 'var(--border-subtle)'),
      background: disabled ? 'var(--n-25)' : interactive && hover ? 'var(--n-25)' : 'var(--surface-card)',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'background var(--dur-micro)',
      ...__ds_scope.NO_OUTLINE,
      ...(kf || focused ? __ds_scope.FOCUS_RING : {}),
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)'
    }
  }, label), state === 'value' ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral"
  }, ORIGIN[origin] || origin) : null, state === 'none' ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    icon: "info"
  }, "Fora do total") : null, weight != null && state === 'value' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontFeatureSettings: "'tnum'",
      whiteSpace: 'nowrap'
    }
  }, "peso ", weight) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0
    }
  }, valueNode, interactive ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--text-muted)"
  }) : null)), state === 'value' ? /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: value
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      height: 6,
      borderRadius: 999,
      border: '1px dashed var(--n-200)',
      boxSizing: 'border-box'
    }
  }), state === 'value' && progress ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "target",
    size: 14,
    color: "var(--text-muted)"
  }), progress) : null, state === 'none' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-body)',
      lineHeight: 1.45
    }
  }, note || 'Não recebe número enquanto não houver validação real.') : null, state === 'error' ? /*#__PURE__*/React.createElement("span", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--red-ink)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 14
  }), error) : null, state === 'disabled' ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: 'var(--n-600)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 14
  }), disabledText) : null);
}
Object.assign(__ds_scope, { DimensionRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/score/DimensionRow.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/ScoreRing.jsx
try { (() => {
function ScoreRing({
  value = 0,
  size = 96,
  stroke = 8,
  label,
  sublabel,
  onFocal,
  style
}) {
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gid = React.useId ? React.useId().replace(/:/g, '') : 'g';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: 'sr' + gid,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#8B5CF6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#6D28D9"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: onFocal ? 'rgb(255 255 255 / 0.12)' : 'var(--n-100)',
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: 'url(#sr' + gid + ')',
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - shown / 100),
    style: {
      transition: 'stroke-dashoffset var(--dur-macro) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: Math.round(size * 0.27),
      letterSpacing: '-0.03em',
      color: onFocal ? '#FFFFFF' : 'var(--text-strong)',
      lineHeight: 1,
      fontFeatureSettings: "'tnum'"
    }
  }, label ?? value), sublabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: onFocal ? 'var(--indigo-300)' : 'var(--text-muted)',
      marginTop: 3
    }
  }, sublabel) : null));
}
Object.assign(__ds_scope, { ScoreRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/ScoreRing.jsx", error: String((e && e.message) || e) }); }

// components/trace/TraceLine.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TRACE_KINDS = {
  registro: {
    icon: 'notebook-pen',
    label: 'Registro do Diário'
  },
  sugestao: {
    icon: 'sparkles',
    label: 'Sugestão da IA'
  },
  evidencia: {
    icon: 'badge-check',
    label: 'Evidência'
  },
  prova: {
    icon: 'link',
    label: 'Prova'
  },
  uso: {
    icon: 'file-text',
    label: 'Uso'
  }
};
const NODE = {
  done: {
    bg: 'var(--surface-card)',
    fg: 'var(--brand)',
    border: '1px solid var(--indigo-300)',
    line: 'var(--indigo-300)',
    lineStyle: 'solid'
  },
  gap: {
    bg: 'var(--amber-soft)',
    fg: 'var(--amber-ink)',
    border: '1px dashed var(--amber-500)',
    line: 'var(--n-200)',
    lineStyle: 'dashed'
  },
  error: {
    bg: 'var(--red-soft)',
    fg: 'var(--red-ink)',
    border: '1px solid var(--red-500)',
    line: 'var(--n-200)',
    lineStyle: 'dashed'
  },
  off: {
    bg: 'var(--n-50)',
    fg: 'var(--text-disabled)',
    border: '1px solid var(--n-100)',
    line: 'var(--n-100)',
    lineStyle: 'solid'
  }
};
function Node({
  step,
  i,
  last,
  vertical,
  onStep,
  focused,
  archived
}) {
  const [kf, fh] = __ds_scope.useFocusVisible();
  const k = TRACE_KINDS[step.kind] || TRACE_KINDS.registro;
  const n = NODE[archived ? 'off' : step.state || 'done'] || NODE.done;
  const icon = step.state === 'error' ? 'triangle-alert' : step.state === 'gap' ? 'plus' : k.icon;
  const Tag = onStep && !archived ? 'button' : 'div';
  const next = NODE[archived ? 'off' : 'done'];
  return /*#__PURE__*/React.createElement("li", {
    style: {
      position: 'relative',
      listStyle: 'none',
      minWidth: 0,
      display: 'flex',
      flexDirection: vertical ? 'row' : 'column',
      gap: vertical ? 12 : 8,
      paddingBottom: vertical && !last ? 18 : 0,
      paddingRight: vertical ? 0 : 12
    }
  }, !last ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: vertical ? {
      position: 'absolute',
      left: 15,
      top: 34,
      bottom: 2,
      borderLeft: '2px ' + n.lineStyle + ' ' + (step.state && step.state !== 'done' ? n.line : next.line)
    } : {
      position: 'absolute',
      left: 38,
      right: 6,
      top: 15,
      borderTop: '2px ' + n.lineStyle + ' ' + (step.state && step.state !== 'done' ? n.line : next.line)
    }
  }) : null, /*#__PURE__*/React.createElement(Tag, _extends({
    type: Tag === 'button' ? 'button' : undefined,
    onClick: Tag === 'button' ? () => onStep(i, step) : undefined,
    "aria-label": Tag === 'button' ? k.label + ': ' + step.label : undefined
  }, fh, {
    style: {
      position: 'relative',
      zIndex: 1,
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: 999,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: n.bg,
      color: n.fg,
      border: n.border,
      padding: 0,
      cursor: Tag === 'button' ? 'pointer' : 'default',
      ...__ds_scope.NO_OUTLINE,
      ...(kf || focused ? __ds_scope.FOCUS_RING : {})
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, k.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1.35,
      color: archived ? 'var(--text-disabled)' : step.state === 'error' ? 'var(--red-ink)' : step.state === 'gap' ? 'var(--amber-ink)' : 'var(--text-strong)',
      textWrap: 'pretty'
    }
  }, step.label), step.meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.4,
      color: 'var(--text-body)'
    }
  }, step.meta) : null));
}
function TraceLine({
  steps = [],
  orientation = 'horizontal',
  title = 'Rastreabilidade',
  onStep,
  focusedIndex,
  archived,
  style
}) {
  const tlRef = React.useRef(null);
  const [tlW, setTlW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = tlRef.current;
    if (!el) return;
    const f = () => setTlW(el.offsetWidth);
    f();
    const ro = new ResizeObserver(f);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Horizontal só quando cada passo tem ao menos 104 px; abaixo disso vira vertical (rótulos nunca colidem).
  const vertical = orientation === 'vertical' || tlW > 0 && tlW / Math.max(1, steps.length) < 104;
  return /*#__PURE__*/React.createElement("section", {
    ref: tlRef,
    "aria-label": title,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minWidth: 0,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "history",
    size: 14,
    color: "var(--text-muted)"
  }), title), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      padding: 0,
      display: vertical ? 'flex' : 'grid',
      flexDirection: 'column',
      gridTemplateColumns: vertical ? undefined : 'repeat(' + Math.max(1, steps.length) + ', minmax(0,1fr))'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(Node, {
    key: i,
    step: s,
    i: i,
    last: i === steps.length - 1,
    vertical: vertical,
    onStep: onStep,
    focused: focusedIndex === i,
    archived: archived
  }))), archived ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--n-600)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 13
  }), "Evid\xEAncia arquivada \xB7 a rastreabilidade \xE9 preservada.") : null);
}
Object.assign(__ds_scope, { TRACE_KINDS, TraceLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/trace/TraceLine.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AgentPanel = __ds_scope.AgentPanel;

__ds_ns.HOME_SUGGESTIONS = __ds_scope.HOME_SUGGESTIONS;

__ds_ns.AgentPrompt = __ds_scope.AgentPrompt;

__ds_ns.ARTIFACT_TYPES = __ds_scope.ARTIFACT_TYPES;

__ds_ns.ArtifactCard = __ds_scope.ArtifactCard;

__ds_ns.AGENT_FOOTER = __ds_scope.AGENT_FOOTER;

__ds_ns.AGENT_SUGGESTIONS = __ds_scope.AGENT_SUGGESTIONS;

__ds_ns.Composer = __ds_scope.Composer;

__ds_ns.MessageBubble = __ds_scope.MessageBubble;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.STATUSES = __ds_scope.STATUSES;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.FOCUS_RING = __ds_scope.FOCUS_RING;

__ds_ns.FOCUS_RING_DARK = __ds_scope.FOCUS_RING_DARK;

__ds_ns.FIELD_FOCUS = __ds_scope.FIELD_FOCUS;

__ds_ns.NO_OUTLINE = __ds_scope.NO_OUTLINE;

__ds_ns.MIN_CHARS = __ds_scope.MIN_CHARS;

__ds_ns.MAX_CHARS = __ds_scope.MAX_CHARS;

__ds_ns.CaptureEditor = __ds_scope.CaptureEditor;

__ds_ns.EntryCard = __ds_scope.EntryCard;

__ds_ns.EvidenceCard = __ds_scope.EvidenceCard;

__ds_ns.StepFlow = __ds_scope.StepFlow;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.PillTabs = __ds_scope.PillTabs;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.ArgumentPanel = __ds_scope.ArgumentPanel;

__ds_ns.DRAFT_DURATIONS = __ds_scope.DRAFT_DURATIONS;

__ds_ns.DraftPanel = __ds_scope.DraftPanel;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.NAV_DESTINATIONS = __ds_scope.NAV_DESTINATIONS;

__ds_ns.NAV_SETTINGS = __ds_scope.NAV_SETTINGS;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.FloatingPanel = __ds_scope.FloatingPanel;

__ds_ns.SectionIndex = __ds_scope.SectionIndex;

__ds_ns.DimensionRow = __ds_scope.DimensionRow;

__ds_ns.AppShell = __ds_scope.AppShell;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.DestinationGrid = __ds_scope.DestinationGrid;

__ds_ns.DestinationTile = __ds_scope.DestinationTile;

__ds_ns.FocalCard = __ds_scope.FocalCard;

__ds_ns.FOCAL_STEPS = __ds_scope.FOCAL_STEPS;

__ds_ns.FocalJourney = __ds_scope.FocalJourney;

__ds_ns.JourneyStepper = __ds_scope.JourneyStepper;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ScoreRing = __ds_scope.ScoreRing;

__ds_ns.TRACE_KINDS = __ds_scope.TRACE_KINDS;

__ds_ns.TraceLine = __ds_scope.TraceLine;

})();
