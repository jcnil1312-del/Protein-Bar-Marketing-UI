import { DriveItem, StorageStats } from '../types/drive';

export const CURRENT_USER = {
  name: 'Alex Rivera',
  email: 'alex.rivera@workspace.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
  role: 'owner' as const,
};

export const INITIAL_STORAGE: StorageStats = {
  usedBytes: 11_432_000_000, // 11.4 GB
  totalBytes: 15_000_000_000, // 15 GB
  driveBytes: 7_820_000_000,  // 7.8 GB
  gmailBytes: 2_150_000_000,  // 2.1 GB
  photosBytes: 1_462_000_000, // 1.5 GB
};

export const INITIAL_ITEMS: DriveItem[] = [
  // --- Folders in Root ---
  {
    id: 'folder-1',
    name: 'Design System & Assets',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: null,
    createdAt: '2026-08-14T10:00:00Z',
    modifiedAt: '2026-11-05T14:22:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Marcus Chen', email: 'marcus@workspace.io', role: 'editor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
      { name: 'Elena Rostova', email: 'elena@workspace.io', role: 'viewer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' },
    ],
    color: '#3b82f6', // blue
    description: 'Component library, design tokens, brand icons, and visual UI assets for v3 release.',
    tags: ['Design', 'Core', 'V3'],
  },
  {
    id: 'folder-2',
    name: 'Financial Reports 2026',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: null,
    createdAt: '2026-01-10T08:30:00Z',
    modifiedAt: '2026-11-04T09:15:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Sofia Rodriguez', email: 'sofia.cfo@workspace.io', role: 'editor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    color: '#10b981', // emerald green
    description: 'Quarterly financial statements, tax documentation, cash flow forecasts, and audit schedules.',
    tags: ['Finance', 'Confidential'],
  },
  {
    id: 'folder-3',
    name: 'Marketing Campaigns Q4',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: null,
    createdAt: '2026-09-01T12:00:00Z',
    modifiedAt: '2026-11-06T18:40:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Marcus Chen', email: 'marcus@workspace.io', role: 'editor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    color: '#f59e0b', // amber
    description: 'Product launches, social media ad copy, billboard creative, and newsletter series.',
    tags: ['Marketing', 'Q4'],
  },
  {
    id: 'folder-4',
    name: 'Engineering Architecture',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: null,
    createdAt: '2026-05-18T16:00:00Z',
    modifiedAt: '2026-10-28T11:20:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    color: '#8b5cf6', // purple
    description: 'Technical specs, database ER diagrams, API schemas, and deployment topologies.',
    tags: ['Engineering', 'Backend'],
  },
  {
    id: 'folder-5',
    name: 'Photography & Creative Shoots',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: null,
    createdAt: '2026-07-22T09:00:00Z',
    modifiedAt: '2026-11-02T16:05:00Z',
    starred: false,
    trashed: false,
    owner: {
      name: 'Elena Rostova',
      email: 'elena@workspace.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'owner',
    },
    sharedWith: [CURRENT_USER],
    color: '#ec4899', // pink
    description: 'Studio photography of hardware devices, outdoor portrait shoots, and editorial crops.',
    tags: ['Photos', 'Shared'],
  },

  // --- Subfolders in Design System (folder-1) ---
  {
    id: 'subfolder-1',
    name: 'Brand Guidelines & Icons',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: 'folder-1',
    createdAt: '2026-08-15T11:00:00Z',
    modifiedAt: '2026-10-20T14:10:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    color: '#3b82f6',
    description: 'Official logos, SVG icon sets, typography scales.',
  },
  {
    id: 'subfolder-2',
    name: 'UI Mockups & Prototypes',
    type: 'folder',
    mimeType: 'application/vnd.google-apps.folder',
    size: 0,
    parentId: 'folder-1',
    createdAt: '2026-08-16T12:00:00Z',
    modifiedAt: '2026-11-03T10:30:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    color: '#06b6d4',
    description: 'High fidelity mobile and desktop screens.',
  },

  // --- Files in Root ("My Drive") ---
  {
    id: 'file-1',
    name: 'Q4 Product Strategy & Roadmap 2026.gdoc',
    type: 'document',
    mimeType: 'application/vnd.google-apps.document',
    size: 2_450_000,
    parentId: null,
    createdAt: '2026-10-01T09:00:00Z',
    modifiedAt: '2026-11-06T21:15:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Marcus Chen', email: 'marcus@workspace.io', role: 'editor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
      { name: 'Sofia Rodriguez', email: 'sofia.cfo@workspace.io', role: 'commenter', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=500&h=300&q=80',
    content: `# Q4 Product Strategy & Strategic Roadmap (2026)

## Executive Summary
This document outlines our core engineering and product milestones for Q4 2026. The primary focus is unified enterprise storage, cross-platform file sync acceleration, and intuitive collaboration workflows.

### 1. Key Objectives & Key Results (OKRs)
- **Objective 1**: Reduce file upload latency by 45% through chunked edge streaming.
- **Objective 2**: Increase Weekly Active Collaborators (WAC) from 120k to 350k.
- **Objective 3**: Implement multi-tenant end-to-end client encryption.

### 2. Feature Timeline
- **Sprint 22 (Nov 1 - Nov 15)**: Enhanced search indexing with instant full-text filtering.
- **Sprint 23 (Nov 16 - Nov 30)**: Live presentation previews and collaborative cell locking.
- **Sprint 24 (Dec 1 - Dec 15)**: Public beta launch for mobile web offline sync.

### 3. Cross-functional Requirements
Engineering will coordinate with Design for zero-friction file transitions and seamless breadcrumb navigation.
`,
    description: 'Comprehensive strategic roadmap detailing OKRs, engineering timelines, and cross-functional deliverables.',
    tags: ['Roadmap', 'Strategy', 'Q4'],
  },
  {
    id: 'file-2',
    name: 'Annual Budget & Financial Model 2026.gsheet',
    type: 'spreadsheet',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    size: 5_120_000,
    parentId: null,
    createdAt: '2026-01-15T11:00:00Z',
    modifiedAt: '2026-11-06T15:30:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Sofia Rodriguez', email: 'sofia.cfo@workspace.io', role: 'editor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&h=300&q=80',
    sheetData: [
      ['Department', 'Q1 Actual', 'Q2 Actual', 'Q3 Projected', 'Q4 Target', 'Variance %'],
      ['Engineering & R&D', '$420,000', '$445,000', '$460,000', '$480,000', '+4.2%'],
      ['Product & Design', '$140,000', '$148,000', '$155,000', '$162,000', '+1.8%'],
      ['Marketing & Growth', '$280,000', '$310,000', '$345,000', '$390,000', '+8.5%'],
      ['Sales & Partnerships', '$315,000', '$335,000', '$360,000', '$385,000', '+3.1%'],
      ['Cloud Infrastructure', '$195,000', '$210,000', '$225,000', '$240,000', '+2.4%'],
      ['Operations & Legal', '$90,000', '$92,000', '$95,000', '$98,000', '-0.5%'],
      ['TOTAL EXPENDITURE', '$1,440,000', '$1,540,000', '$1,640,000', '$1,755,000', '+3.8%'],
    ],
    description: 'Consolidated fiscal model with quarterly department allocations and variance tracking.',
    tags: ['Finance', 'Budget', 'Model'],
  },
  {
    id: 'file-3',
    name: 'Investor Pitch Deck Series B.gslides',
    type: 'presentation',
    mimeType: 'application/vnd.google-apps.presentation',
    size: 18_400_000,
    parentId: null,
    createdAt: '2026-09-12T14:00:00Z',
    modifiedAt: '2026-11-05T19:45:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Sofia Rodriguez', email: 'sofia.cfo@workspace.io', role: 'editor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80' },
      { name: 'Elena Rostova', email: 'elena@workspace.io', role: 'viewer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=300&q=80',
    slideTitles: [
      '1. Title: Scaling the Modern Intelligent Cloud Drive',
      '2. The Core Problem: Fragmented Data & Siloed File Storage',
      '3. Our Solution: Unified High-Speed Workspace Hub',
      '4. Market Opportunity: $68B Enterprise Cloud Storage by 2028',
      '5. Traction & Growth: 400% YoY ARR Growth ($14M ARR)',
      '6. Unit Economics & Gross Margins (82% Gross Margin)',
      '7. Competitive Advantage: Realtime Multi-User Engine',
      '8. The Ask: $25M Series B for Global Edge Expansion',
    ],
    description: '18-slide pitch deck for venture capital partners detailing product vision and unit metrics.',
    tags: ['Pitch', 'Investors', 'Series B'],
  },
  {
    id: 'file-4',
    name: 'Nordic Architecture Photo Shoot.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 4_890_000,
    parentId: null,
    createdAt: '2026-10-24T16:20:00Z',
    modifiedAt: '2026-10-24T16:20:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'High-res architectural photography asset for hero banner and landing page marketing.',
    tags: ['Photos', 'Assets'],
  },
  {
    id: 'file-5',
    name: 'Cloud Infrastructure Whitepaper v2.4.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 7_340_000,
    parentId: null,
    createdAt: '2026-07-19T10:15:00Z',
    modifiedAt: '2026-10-18T13:40:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [
      { name: 'Marcus Chen', email: 'marcus@workspace.io', role: 'viewer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=300&q=80',
    description: 'In-depth technical whitepaper on resilient multi-region database failover and blob caching.',
    tags: ['Whitepaper', 'PDF'],
  },
  {
    id: 'file-6',
    name: 'Brand Identity Guidelines & Typography.pdf',
    type: 'pdf',
    mimeType: 'application/pdf',
    size: 14_200_000,
    parentId: 'folder-1',
    createdAt: '2026-08-20T14:00:00Z',
    modifiedAt: '2026-10-15T09:12:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&h=300&q=80',
    description: 'Color palettes, font weights, logo padding, and brand voice guidelines.',
    tags: ['Design', 'Brand'],
  },
  {
    id: 'file-7',
    name: 'Design Tokens & Theme Variables.json',
    type: 'code',
    mimeType: 'application/json',
    size: 42_000,
    parentId: 'folder-1',
    createdAt: '2026-09-02T11:45:00Z',
    modifiedAt: '2026-11-04T17:20:00Z',
    starred: true,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&h=300&q=80',
    content: `{\n  "color": {\n    "primary": "#1a73e8",\n    "primaryHover": "#1557b0",\n    "surface": "#ffffff",\n    "surfaceSubtle": "#f8fafd",\n    "textPrimary": "#1f2937",\n    "textSecondary": "#6b7280",\n    "border": "#e5e7eb"\n  },\n  "radius": {\n    "sm": "6px",\n    "md": "12px",\n    "lg": "16px",\n    "pill": "9999px"\n  },\n  "elevation": {\n    "card": "0 1px 3px 0 rgba(0, 0, 0, 0.08)",\n    "dropdown": "0 4px 16px 0 rgba(0, 0, 0, 0.12)"\n  }\n}`,
    description: 'Raw JSON tokens consumed by web and mobile client codebases for unified styling.',
    tags: ['Tokens', 'Code'],
  },
  {
    id: 'file-8',
    name: 'Product Mockup - Dark Mode Dashboard.png',
    type: 'image',
    mimeType: 'image/png',
    size: 3_820_000,
    parentId: 'folder-1',
    createdAt: '2026-09-15T15:30:00Z',
    modifiedAt: '2026-11-01T12:00:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'High fidelity UI rendering of analytics panel in dark mode.',
    tags: ['Design', 'UI'],
  },
  {
    id: 'file-9',
    name: 'Quarterly OKR Review & Retrospective.gdoc',
    type: 'document',
    mimeType: 'application/vnd.google-apps.document',
    size: 1_840_000,
    parentId: 'folder-3',
    createdAt: '2026-10-15T09:30:00Z',
    modifiedAt: '2026-11-06T11:00:00Z',
    starred: false,
    trashed: false,
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=500&h=300&q=80',
    content: `# Marketing Q3 Retrospective & Q4 Action Plan

## 1. What Went Well
- Product Hunt launch generated over 4,500 upvotes and 18k signups in 48 hours.
- Conversion rate from guest viewer to signed-up team increased by 3.2%.

## 2. Growth Opportunities
- Video demo walkthroughs had 85% completion rate; need 4 more short clips.
- Paid acquisition cost was slightly elevated on search ads ($42 CAC vs $35 target).
`,
    description: 'Retrospective notes and learnings from the past quarter launch campaign.',
    tags: ['Marketing', 'Retrospective'],
  },
  // --- Trash Items ---
  {
    id: 'trash-1',
    name: 'Old Deprecated Roadmap 2025.gdoc',
    type: 'document',
    mimeType: 'application/vnd.google-apps.document',
    size: 920_000,
    parentId: null,
    createdAt: '2025-06-10T10:00:00Z',
    modifiedAt: '2026-09-01T08:00:00Z',
    starred: false,
    trashed: true,
    trashedAt: '2026-11-04T12:00:00Z',
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=500&h=300&q=80',
    content: 'Archived draft from previous year roadmap.',
    description: 'Outdated roadmap document moved to trash.',
  },
  {
    id: 'trash-2',
    name: 'Unused Banner Mockup Draft.png',
    type: 'image',
    mimeType: 'image/png',
    size: 2_100_000,
    parentId: null,
    createdAt: '2026-08-01T14:20:00Z',
    modifiedAt: '2026-10-12T16:40:00Z',
    starred: false,
    trashed: true,
    trashedAt: '2026-11-05T10:15:00Z',
    owner: CURRENT_USER,
    sharedWith: [],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Draft graphic discarded after brand revision.',
  },
];
