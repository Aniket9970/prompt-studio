import { PromptItem, Category } from '../types';

export const categories: Category[] = [
  { id: 'all', name: 'All', count: '16 Templates', iconName: 'Sparkles' },
  { id: 'popular', name: 'Popular', count: '8 Templates', iconName: 'Flame' },
  { id: 'apps', name: 'Apps', count: '4 Apps', iconName: 'Smartphone' },
  { id: 'sections', name: 'Sections', count: '5 Sections', iconName: 'Layers' },
  { id: 'hero', name: 'Hero', count: '3 Heroes', iconName: 'LayoutTemplate' },
  { id: 'landing-page', name: 'Landing Page', count: '5 Pages', iconName: 'Monitor' },
  { id: 'saas', name: 'Saas', count: '5 Platforms', iconName: 'Cloud' },
  { id: 'agency', name: 'Agency', count: '3 Agencies', iconName: 'Briefcase' },
  { id: 'creative', name: 'Creative', count: '6 Projects', iconName: 'Palette' },
  { id: 'portfolio', name: 'Portfolio', count: '2 Portfolios', iconName: 'UserCheck' },
  { id: '3d', name: '3d', count: '4 Experiences', iconName: 'Box' },
  { id: 'ai', name: 'Ai', count: '6 Systems', iconName: 'Bot' },
  { id: 'fintech', name: 'Fintech', count: '3 Dashboards', iconName: 'DollarSign' },
  { id: 'technology', name: 'Technology', count: '5 Platforms', iconName: 'Cpu' },
  { id: 'travel', name: 'Travel', count: '2 Explorers', iconName: 'Compass' },
  { id: 'wellness', name: 'Wellness', count: '2 Experiences', iconName: 'Heart' },
  { id: '3d-website', name: '3d Website', count: '3 WebGL Sites', iconName: 'Globe' },
  { id: 'ecommerce', name: 'Ecommerce', count: '3 Stores', iconName: 'ShoppingBag' },
  { id: 'carousel', name: 'Carousel', count: '3 Carousels', iconName: 'Sliders' },
];

export const promptItems: PromptItem[] = [
  // 1. Agent Grove (New from prompt preview)
  {
    id: 'preview-agent-grove',
    title: 'Agent Grove - Autonomous AI Workflows & Ecosystem App',
    description: 'Dynamic canvas application for orchestrating autonomous AI agents, multi-model execution pipelines, and real-time event telemetry.',
    model: 'AI APP',
    typeLabel: 'Interactive App',
    creator: {
      name: 'Grove Labs',
      handle: 'grovelabs',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grove',
      followers: '5.2k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Apps',
    previewVideo: '/previews/Agent Grove.mp4',
    rating: 5.0,
    reviewsCount: 342,
    downloads: '8.4k',
    uses: '29k+',
    likes: 1840,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Agent Graph Canvas', subtitle: 'Draggable multi-agent execution pipeline nodes.', icon: 'Bot' },
      { title: 'Dark Mode Glass UI', subtitle: 'Modern obsidian finish with electric emerald telemetry.', icon: 'Sparkles' },
      { title: 'Live Event Stream', subtitle: 'Real-time WebSocket event logs and execution states.', icon: 'Zap' },
    ],
    promptTemplate: `Build a cutting-edge web application called "Agent Grove" for orchestrating autonomous AI agents.
- Dark theme (#0B0C10) with frosted glass panels and electric emerald accents (#10B981).
- Main interactive canvas featuring connected agent workflow cards with status indicators (idle, thinking, executing).
- Sidebar with agent marketplace, token consumption metrics, and prompt template injector.
- Responsive toolbar with run simulation, export JSON graph, and environment switch controls.`,
  },

  // 2. Cast-N-Render (New from prompt preview)
  {
    id: 'preview-cast-n-render',
    title: 'Cast-N-Render - Real-Time 3D Raytracing & Creative Engine',
    description: 'High-performance creative application for 3D staging, live lighting studio controls, material shaders, and cinematic render exports.',
    model: '3D WEB',
    typeLabel: '3D Studio',
    creator: {
      name: 'Render Flow',
      handle: 'renderflow',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=render',
      followers: '4.6k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: '3d Website',
    previewVideo: '/previews/cast-n-render.mp4',
    rating: 4.9,
    reviewsCount: 289,
    downloads: '6.1k',
    uses: '19k+',
    likes: 1390,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Viewport Studio', subtitle: 'Interactive 3D scene controls with orbiting camera.', icon: 'Box' },
      { title: 'Lighting Preset Pills', subtitle: 'Golden hour, studio softbox, and cyberpunk neon setups.', icon: 'Sun' },
      { title: 'Instant Shader Switch', subtitle: 'Swap metallic, glass refraction, and clay textures.', icon: 'Palette' },
    ],
    promptTemplate: `Create a WebGL 3D design studio called "Cast-N-Render".
- Sleek minimalist creative interface with floating frosted glass control HUD.
- Three.js / WebGL central canvas with orbit controls, interactive shadow casting, and depth-of-field sliders.
- Floating parameter pills at the bottom for quick camera angles (Perspective, Isometric, Front, Top).
- Export modal for GLTF, 4K PNG renders, and embeddable WebGL code snippets.`,
  },

  // 3. Circlish Dots Area (New from prompt preview)
  {
    id: 'preview-circlish-dots',
    title: 'Circlish Dots - Generative Kinetic Particle Grid & Hero',
    description: 'Mesmerizing generative background & landing hero with cursor-reactive dot matrices, spring ripple waves, and smooth audio reactive pulses.',
    model: 'CREATIVE UI',
    typeLabel: 'Interactive Hero',
    creator: {
      name: 'Aura Interactive',
      handle: 'aura_interactive',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aura',
      followers: '3.9k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Hero',
    previewVideo: '/previews/circlishdotsArea.mp4',
    rating: 5.0,
    reviewsCount: 412,
    downloads: '9.6k',
    uses: '35k+',
    likes: 2150,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Interactive Particle Matrix', subtitle: 'Dynamic dot grid reacting to pointer velocity.', icon: 'Sparkles' },
      { title: 'Kinetic Hero Typography', subtitle: 'Brutalist display font with staggered word reveal.', icon: 'Layout' },
      { title: 'Fluid Wave Physics', subtitle: 'Spring-damped wave oscillations running at 60 FPS.', icon: 'Zap' },
    ],
    promptTemplate: `Develop an award-winning creative hero section with an interactive canvas particle grid named "Circlish Dots".
- Full viewport canvas rendering a high-density matrix of radial dots that expand and repel on cursor hover.
- Bold kinetic serif display title in the center with staggered entrance animation.
- Minimal luxury agency header with logo, sound toggle, and menu trigger.
- Color palette: Warm bone background (#FFFEFB), dark ink typography (#1A1A18), periwinkle hover accent (#8AAAFF).`,
  },

  // 4. Intelligence Layer (New from prompt preview)
  {
    id: 'preview-intelligence-layer',
    title: 'Intelligence Layer - Enterprise AI Infrastructure Platform',
    description: 'Enterprise AI infrastructure architecture interface showing foundation model routing, latency monitors, cost telemetry, and API tokens.',
    model: 'SAAS PLATFORM',
    typeLabel: 'Enterprise SaaS',
    creator: {
      name: 'Deep Core',
      handle: 'deepcore_ai',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepcore',
      followers: '6.1k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Saas',
    previewVideo: '/previews/intelligencelayer.mp4',
    rating: 4.9,
    reviewsCount: 275,
    downloads: '7.3k',
    uses: '24k+',
    likes: 1620,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Multi-LLM Gateway', subtitle: 'Live model failover routing and latency benchmarks.', icon: 'Cpu' },
      { title: 'Cost & Token Telemetry', subtitle: 'Real-time throughput metrics and budget thresholds.', icon: 'DollarSign' },
      { title: 'Security Perimeter', subtitle: 'PII redacting sandbox and prompt injection shield.', icon: 'ShieldCheck' },
    ],
    promptTemplate: `Design an enterprise SaaS platform page for "Intelligence Layer - Universal AI Gateway".
- Modern high-density technical dashboard with dark obsidian theme.
- Visual routing diagram showing requests distributing across foundation models with live latency ms counters.
- Telemetry widget with spend per token, caching hit rates, and request throughput graphs.
- Clean Bento-box grid structure with crisp monospace code previews and status badges.`,
  },

  // 5. Orbit Flora (New from prompt preview)
  {
    id: 'preview-orbit-flora',
    title: 'Orbit Flora - Spatial Botanical Experience & 3D Web',
    description: 'Atmospheric interactive web experience showcasing 3D plant specimens in orbital display cases with botanical taxonomy and audio ambience.',
    model: 'SPATIAL WEB',
    typeLabel: '3D Experience',
    creator: {
      name: 'Flora Spatial',
      handle: 'flora_spatial',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=floraspatial',
      followers: '3.4k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Creative',
    previewVideo: '/previews/Orbit Flora.mp4',
    rating: 4.8,
    reviewsCount: 198,
    downloads: '5.5k',
    uses: '16k+',
    likes: 1180,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Orbital 3D Specimen', subtitle: 'Smooth continuous camera orbit around detailed 3D flora.', icon: 'Box' },
      { title: 'Botanical Data Sheet', subtitle: 'Slide-out taxonomy card with care guides and origins.', icon: 'Layout' },
      { title: 'Ambient Soundscape', subtitle: 'Subtle generative nature sound triggers.', icon: 'Music' },
    ],
    promptTemplate: `Create an editorial 3D botanical website titled "Orbit Flora".
- Full-screen WebGL viewport with a floating 3D botanical plant in zero-gravity orbit.
- Clean typography using elegant serif headlines and minimalist sans captions.
- Interactive hotspots on plant leaves revealing biological facts and water requirements.
- Earthy minimalist color palette: stone grey background, dark forest text, muted sage green accents.`,
  },

  // 6. Preview Showcase (New from prompt preview)
  {
    id: 'preview-showcase-app',
    title: 'Nexus Studio - Micro-Interactions & Component Preview Suite',
    description: 'Dynamic interaction showcase testing component states, spring physics toggles, modal dialogs, and fluid gestures.',
    model: 'UI KIT',
    typeLabel: 'Component Suite',
    creator: {
      name: 'Motion Labs',
      handle: 'motionlabs',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=motion',
      followers: '4.1k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Sections',
    previewVideo: '/previews/preview.mp4',
    rating: 4.9,
    reviewsCount: 224,
    downloads: '6.7k',
    uses: '21k+',
    likes: 1470,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Gesture Library', subtitle: 'Framer Motion spring physics and drag bounds.', icon: 'Sliders' },
      { title: 'Theme Switcher', subtitle: 'Live token toggles between Light, Dark, and Contrast.', icon: 'Sun' },
      { title: 'Copy Ready Code', subtitle: 'One-click copy for React, Tailwind, and Vue.', icon: 'Zap' },
    ],
    promptTemplate: `Build an interactive design system showcase application.
- Live canvas displaying interactive UI widgets: animated buttons, fluid tabs, expandable cards, and toast notifications.
- Side inspector allowing real-time adjustments of spring stiffness, damping, and border radius.
- Code preview tab displaying cleanly formatted Tailwind CSS and React JSX snippets.`,
  },

  // 7. Anchor AI Landing
  {
    id: 'preview-anchor-ai',
    title: 'Anchor AI - Next-Gen Autonomous Agent Landing Page',
    description: 'Complete high-converting AI SaaS landing page with dark futuristic glassmorphism, glowing neural graphs, and interactive demo sections.',
    model: 'LANDING PAGE',
    typeLabel: 'Full Landing Page',
    creator: {
      name: 'Kairo Studio',
      handle: 'kairo_studio',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kairo',
      followers: '4.8k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Landing Page',
    previewVideo: '/previews/anchor-ai-landing.mp4',
    rating: 4.9,
    reviewsCount: 312,
    downloads: '5.2k',
    uses: '18k+',
    likes: 1420,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Full Web Flow', subtitle: 'Hero, feature grid, testimonial carousel & live CTA', icon: 'Zap' },
      { title: 'Dark Mode Glass UI', subtitle: 'Modern periwinkle glow & subtle backdrop blur', icon: 'Layout' },
      { title: 'Interactive Components', subtitle: 'Micro-animations and animated badges included', icon: 'Sparkles' },
    ],
    promptTemplate: `Design a hyper-modern SaaS AI landing page titled "Anchor AI".
- Deep obsidian dark background (#0B0C10), electric neon indigo accents (#8AAAFF).
- Floating 3D neural network orb hero visual with glassmorphic cards and live benchmark metric graphs.
- Bento grid feature section highlighting agent memory, multi-tool actions, and safety guardrails.
- High-converting pricing comparison table and interactive FAQ accordion.`,
  },

  // 8. Space Planet Technology
  {
    id: 'preview-space-planet',
    title: 'Space Planet 3D Interactive Technology Experience',
    description: 'Immersive 3D celestial web environment featuring orbit navigation, astronomical telemetry data HUD, and interactive planetary exploration.',
    model: '3D WEB',
    typeLabel: '3D Exploration',
    creator: {
      name: 'Cosmo Tech',
      handle: 'cosmo_visuals',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmo',
      followers: '3.5k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: '3d Website',
    previewVideo: '/previews/space_planet_technology.mp4',
    rating: 5.0,
    reviewsCount: 189,
    downloads: '3.1k',
    uses: '9.8k+',
    likes: 980,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: '3D Planet Physics', subtitle: 'Interactive rotational canvas with orbit rings', icon: 'Box' },
      { title: 'Telemetry HUD', subtitle: 'Sci-fi futuristic data overlays and coordinates', icon: 'Cpu' },
    ],
    promptTemplate: `Create an interactive 3D WebGL website exploring deep space and planetary systems.
- Cinematic cosmic lighting with starfield shaders and glowing planetary rings.
- Orbit controls allowing full 360-degree examination of astronomical bodies.
- Sci-fi telemetry HUD displaying real-time atmospheric density, surface temperature, and orbital velocity.
- Minimal navigation header with smooth page transitions and audio toggle.`,
  },

  // 9. Kairo Studio Hero
  {
    id: 'preview-kairo-hero',
    title: 'Kairo Creative Studio - Editorial Kinetic Hero',
    description: 'Award-winning creative agency hero header featuring bold typography, dynamic video mask reveal, and smooth cursor parallax.',
    model: 'AGENCY HERO',
    typeLabel: 'Hero Section',
    creator: {
      name: 'Kairo Studio',
      handle: 'kairo_studio',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kairo',
      followers: '4.8k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Hero',
    previewVideo: '/previews/kairo-studio-hero.mp4',
    rating: 4.8,
    reviewsCount: 142,
    downloads: '2.4k',
    uses: '7.5k+',
    likes: 830,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Kinetic Typography', subtitle: 'Oversized display font with stagger word reveal', icon: 'Layout' },
      { title: 'Video Texture Mask', subtitle: 'Rich architectural clips mapped inside letterforms', icon: 'Camera' },
    ],
    promptTemplate: `Develop an Awwwards-caliber hero section for luxury design studio "Kairo Studio".
- Massive brutalist serif headline dominating the upper viewport with interactive letter tracking.
- Video mask overlay revealing architectural footage on hover.
- Smooth cursor parallax effect with floating badges and client logos.
- Minimalist navigation with live time indicator (Tokyo, London, NYC).`,
  },

  // 10. Jack Portfolio
  {
    id: 'preview-jack-portfolio',
    title: 'Jack Portfolio - Minimal Creative Designer Showcase',
    description: 'Clean personal designer portfolio with sticky project case study cards, interactive skill pills, and smooth magnetic buttons.',
    model: 'PORTFOLIO',
    typeLabel: 'Portfolio Site',
    creator: {
      name: 'Jack Miller',
      handle: 'jack_miller_design',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack',
      followers: '2.1k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Portfolio',
    previewVideo: '/previews/jackportofplio.mp4',
    rating: 4.9,
    reviewsCount: 260,
    downloads: '6.8k',
    uses: '22k+',
    likes: 1680,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Zero Clutter', subtitle: 'Maximum focus on client deliverables & metrics', icon: 'Layout' },
      { title: 'Quick Contact Hook', subtitle: 'One-click copy email & scheduling modal trigger', icon: 'Zap' },
    ],
    promptTemplate: `Design a clean, minimal portfolio website for a senior product designer named Jack Miller.
- Warm cream background (#FFFEFB) with elegant typography and crisp spacing.
- Stacked case study cards that scale down smoothly as the user scrolls.
- Interactive skills section with hover pill effects and project metric badges.
- Footer with one-click email copy button and social links.`,
  },

  // 11. Custom Spaces Area
  {
    id: 'preview-custom-spaces',
    title: 'Custom Spaces - Architectural 3D Configurator Section',
    description: 'Modular interior design & 3D space planner section with real-time lighting switches, material palette selectors, and dimension markers.',
    model: '3D CONFIGURATOR',
    typeLabel: '3D Configurator',
    creator: {
      name: 'Arch Space',
      handle: 'arch_space_labs',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arch',
      followers: '1.9k Followers',
      isVerified: false,
    },
    price: 'Free',
    category: '3d',
    previewVideo: '/previews/Custom SpacesArea.mp4',
    rating: 4.7,
    reviewsCount: 98,
    downloads: '1.8k',
    uses: '5.1k+',
    likes: 540,
    isPopular: false,
    isRecent: true,
    keyFeatures: [
      { title: 'Room Configurator', subtitle: 'Interactive 3D model with camera presets', icon: 'Box' },
      { title: 'Material Selector', subtitle: 'Live texture swapping (Oak, Marble, Matte Black)', icon: 'Palette' },
    ],
    promptTemplate: `Build an interactive architectural configurator section for modern living spaces.
- Real-time 3D room preview with natural daylight angle controls (Morning, Noon, Sunset).
- Material swap toolbar to toggle between Italian Marble, Smoked Oak, and Matte Black finishes.
- Dimension markers overlay toggling exact millimeter specifications on hover.`,
  },

  // 12. Stop Followup Area
  {
    id: 'preview-stop-followup',
    title: 'Stop Follow-up - SaaS Product Feature Section',
    description: 'High-converting SaaS feature section highlighting automated email workflows, CRM sync stats, and interactive before/after timeline.',
    model: 'SAAS SECTION',
    typeLabel: 'Feature Section',
    creator: {
      name: 'Growth Flow',
      handle: 'growthflow_app',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=growth',
      followers: '2.4k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Sections',
    previewVideo: '/previews/stopfollowupArea.mp4',
    rating: 4.8,
    reviewsCount: 114,
    downloads: '3.9k',
    uses: '14k+',
    likes: 720,
    isPopular: false,
    isRecent: true,
    keyFeatures: [
      { title: 'Timeline Comparison', subtitle: 'Before vs After workflow comparison cards', icon: 'Layout' },
      { title: 'Automated Triggers', subtitle: 'Shows automated CRM webhook reactions in real time', icon: 'Zap' },
    ],
    promptTemplate: `Design a high-converting B2B SaaS product feature section titled "Stop Manual Follow-ups".
- Split layout: punchy headline, subheadline, and key metric pill on the left.
- Animated workflow card on the right displaying trigger events, automated follow-up sequences, and CRM status updates.
- Interactive toggle showing time saved: "Before (4.2 hrs/day)" vs "With AI (8 mins/day)".`,
  },

  // 13. Urban Jungle Area
  {
    id: 'preview-urban-jungle',
    title: 'Urban Jungle - Ecommerce Botanical Brand Experience',
    description: 'Vibrant e-commerce storefront section for sustainable lifestyle brands, with micro-interactions, drag-to-scroll plant carousel, and cart drawer.',
    model: 'ECOMMERCE',
    typeLabel: 'Ecommerce Store',
    creator: {
      name: 'Flora Design',
      handle: 'flora_studios',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=flora',
      followers: '3.1k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Ecommerce',
    previewVideo: '/previews/urbanjungleArea.mp4',
    rating: 4.9,
    reviewsCount: 156,
    downloads: '2.7k',
    uses: '8.4k+',
    likes: 890,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Smooth Carousel', subtitle: 'Drag gesture and kinetic snap carousel slider', icon: 'Sliders' },
      { title: 'Quick Buy Pill', subtitle: 'Inline price tag with add-to-bag microinteraction', icon: 'ShoppingBag' },
    ],
    promptTemplate: `Create an editorial e-commerce product collection section titled "Urban Jungle".
- Earthy organic color palette with lush photography of tropical indoor plants.
- Touch/drag fluid carousel with snap pagination and item count tracker.
- Minimalist product cards showing botanical name, light requirement icons, price tag, and quick-add button.`,
  },

  // 14. Wayfinder Hero (Newly added)
  {
    id: 'preview-wayfinder-hero',
    title: 'Wayfinder - Kinetic Typography & Spatial Agency Hero',
    description: 'Dynamic editorial landing page hero with kinetic magnetic text, cursor-driven 3D tilt perspective, and fluid audio-visual reactive transitions.',
    model: 'AGENCY HERO',
    typeLabel: 'Editorial Hero',
    creator: {
      name: 'Wayfinder Studio',
      handle: 'wayfinder_co',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wayfinder',
      followers: '4.5k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Hero',
    previewVideo: '/previews/Wayfinder-hero.mp4',
    rating: 5.0,
    reviewsCount: 284,
    downloads: '7.8k',
    uses: '26k+',
    likes: 1910,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Kinetic Letterforms', subtitle: 'Spring-driven typography reacting to pointer inertia.', icon: 'Layout' },
      { title: 'Spatial Depth Layers', subtitle: 'Multi-layer foreground and background parallax shift.', icon: 'Layers' },
      { title: 'Audio Reactive Toggles', subtitle: 'Micro-sound fx triggers on button click and hover.', icon: 'Sparkles' },
    ],
    promptTemplate: `Develop an award-winning agency hero section for "Wayfinder Creative".
- Minimal luxury brutalist typography with massive headline typography filling the upper half.
- Cursor-following spatial depth layers that tilt organically on mouse move.
- Sticky interactive navigation bar with live local time, client reel modal trigger, and inquiry CTA.
- Cream canvas backdrop (#FFFEFB), deep black typography (#1A1A18), and soft lavender glow.`,
  },

  // 15. Vectrus Energy (Newly added)
  {
    id: 'preview-vectrus-energy',
    title: 'Vectrus Energy - Sustainable Grid & CleanTech Landing Page',
    description: 'Futuristic CleanTech enterprise platform showcase featuring live energy grid telemetry, kilowatt generation graphs, and dark mode neon HUD.',
    model: 'CLEANTECH SAAS',
    typeLabel: 'CleanTech Platform',
    creator: {
      name: 'Vectrus Power',
      handle: 'vectrus_energy',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vectrus',
      followers: '3.8k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: 'Technology',
    previewVideo: '/previews/_   Vectrus Energynew.mp4',
    rating: 4.9,
    reviewsCount: 192,
    downloads: '5.9k',
    uses: '18.4k+',
    likes: 1430,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Live Grid Telemetry', subtitle: 'Real-time solar, wind, and storage battery stats.', icon: 'Cpu' },
      { title: 'Bento Dashboard Grid', subtitle: 'Interactive power distribution map with nodes.', icon: 'Zap' },
      { title: 'CleanTech Visuals', subtitle: 'High-contrast cyan and emerald energy metrics.', icon: 'Sparkles' },
    ],
    promptTemplate: `Build an enterprise CleanTech web application landing page for "Vectrus Energy".
- Dark obsidian aesthetic with neon teal (#00F2FE) and electric emerald (#10B981) data visualizations.
- Central interactive energy grid telemetry monitor showing live megawatt flow and storage levels.
- High-density Bento grid section detailing battery storage efficiency, carbon offset metrics, and API connectors.
- Clean header with live status ticker ("Grid Status: 99.98% Optimized").`,
  },

  // 16. Butterflies Purple Area (Newly added)
  {
    id: 'preview-butterflies-purple',
    title: 'Metamorphosis - Ethereal Spatial 3D & Purple Particle Area',
    description: 'Breathtaking 3D generative particle system with glowing purple butterflies in zero gravity, ambient bioluminescence, and fluid camera navigation.',
    model: '3D SPATIAL',
    typeLabel: 'Spatial 3D',
    creator: {
      name: 'Aether Labs',
      handle: 'aether_visuals',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aether',
      followers: '5.7k Followers',
      isVerified: true,
    },
    price: 'Free',
    category: '3d',
    previewVideo: '/previews/buttterflies purpleArea.mp4',
    rating: 5.0,
    reviewsCount: 367,
    downloads: '9.2k',
    uses: '31k+',
    likes: 2280,
    isPopular: true,
    isRecent: true,
    keyFeatures: [
      { title: 'Bioluminescent 3D Swarm', subtitle: 'Procedural wing flutter physics and glowing trails.', icon: 'Box' },
      { title: 'Interactive Focus Depth', subtitle: 'Dynamic bokeh blur focusing on hovered butterflies.', icon: 'Camera' },
      { title: 'Atmospheric Glow', subtitle: 'Rich purple and ultraviolet volumetric light shaders.', icon: 'Sparkles' },
    ],
    promptTemplate: `Design a mesmerizing 3D WebGL web section called "Metamorphosis".
- Full viewport Three.js canvas featuring a procedural swarm of glowing violet and purple butterflies.
- Dynamic camera tracking responding to pointer movement with depth-of-field bokeh blur.
- Minimalist overlay typography with ethereal serif headings and subtle floating audio controls.
- Color palette: Deep midnight violet (#0A0612), neon amethyst (#A855F7), and soft lilac glow.`,
  },
];
