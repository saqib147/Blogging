export const SEED_PASSWORD = 'Password123!';

export const adminUser = {
  name: 'Site Admin',
  email: 'admin@ink-echo.app',
  password: SEED_PASSWORD,
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  bio: 'Platform administrator for Ink & Echo.',
};

export const users = [
  {
    name: 'Elena Vasquez',
    email: 'elena@seed.ink-echo.app',
    password: SEED_PASSWORD,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'Essayist and slow-living advocate. I write about attention, craft, and the quiet art of noticing.',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@seed.ink-echo.app',
    password: SEED_PASSWORD,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Software engineer by day, systems thinker always. Exploring how we build tools that respect human pace.',
  },
  {
    name: 'Amara Okafor',
    email: 'amara@seed.ink-echo.app',
    password: SEED_PASSWORD,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    bio: 'Travel writer and photographer. Chasing golden hour on every continent.',
  },
  {
    name: 'James Whitfield',
    email: 'james@seed.ink-echo.app',
    password: SEED_PASSWORD,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Former librarian. I review books, interview authors, and argue that reading is a form of travel.',
  },
];

export const blogs = [
  {
    authorEmail: 'elena@seed.ink-echo.app',
    title: 'The Case for Writing by Hand in a Digital Age',
    category: 'Writing',
    tags: ['writing', 'creativity', 'mindfulness'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1455398979734-638b19723162?w=1200&h=630&fit=crop',
    content: `
      <p>There is a particular friction to pen on paper that keyboards have engineered away. The slight drag of a nib, the micro-pause between letters — these tiny resistances force the mind to slow down. And slowness, I've found, is where clarity lives.</p>
      <h2>Why friction helps thinking</h2>
      <p>When I switched back to a notebook for first drafts, my sentences grew shorter and my arguments sharper. I wasn't typing faster than I could think. I was thinking at the speed of my hand.</p>
      <blockquote><p>The best ideas rarely arrive fully formed. They need time to unfold — and handwriting grants that time.</p></blockquote>
      <h3>A simple practice to try</h3>
      <ul>
        <li>Keep a dedicated notebook for morning pages — three pages, no editing.</li>
        <li>Transfer only the strongest paragraphs to your digital draft.</li>
        <li>Notice which ideas survive the translation; those are worth keeping.</li>
      </ul>
      <p>You don't need to abandon your laptop. Use handwriting as a filter, not a replacement. The screen is for shaping; the page is for discovering.</p>
    `,
  },
  {
    authorEmail: 'elena@seed.ink-echo.app',
    title: 'Building a Reading Ritual That Actually Sticks',
    category: 'Culture',
    tags: ['reading', 'habits', 'slow-living'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb794f0e?w=1200&h=630&fit=crop',
    content: `
      <p>We treat reading like a virtue to aspire to rather than a pleasure to protect. No wonder our book lists grow while our finished count stays flat.</p>
      <h2>Anchor reading to an existing habit</h2>
      <p>I read for twenty minutes after making coffee on weekdays. The kettle boils; I open a book. The ritual doesn't depend on motivation — it depends on sequence.</p>
      <h2>Lower the barrier</h2>
      <p>Keep one book on your nightstand, one in your bag, one on the kitchen counter. Visibility beats willpower. A book you can't see is a book you won't read.</p>
      <p>Start with ten pages. Most nights you'll read more. Some nights you won't. Both outcomes are fine.</p>
    `,
  },
  {
    authorEmail: 'marcus@seed.ink-echo.app',
    title: 'Why Your Side Project Needs Boring Technology',
    category: 'Technology',
    tags: ['programming', 'startups', 'architecture'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
    content: `
      <p>Every year there's a new framework promising to revolutionize how we build. Most side projects die not from technical limits but from the energy spent learning tools instead of solving problems.</p>
      <h2>The stack I keep returning to</h2>
      <p>PostgreSQL or MongoDB. Express or a minimal API layer. React if I need a UI. That's it. I know these tools well enough to debug at 11 p.m. when nothing works.</p>
      <blockquote><p>Exciting technology is a tax on focus. Pay it only when the problem demands it.</p></blockquote>
      <h3>Questions before you reach for something new</h3>
      <ol>
        <li>Have I shipped something with my current stack in the last six months?</li>
        <li>Will this tool save me time after the learning curve, or just delay launch?</li>
        <li>Can I hire or collaborate with someone who already knows it?</li>
      </ol>
      <p>Boring technology lets you stay in problem-solving mode. For a side project, that's the only mode that matters.</p>
    `,
  },
  {
    authorEmail: 'marcus@seed.ink-echo.app',
    title: 'Designing APIs for Humans, Not Just Clients',
    category: 'Technology',
    tags: ['api', 'developer-experience', 'backend'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    content: `
      <p>RESTful conventions are a starting point, not a finish line. The developers integrating with your API are users too — and their experience determines adoption as much as any feature list.</p>
      <h2>Name things consistently</h2>
      <p>Pick plural nouns for collections, singular IDs for resources, and stick to them. <code>/api/blogs/:id/comments</code> beats a dozen one-off endpoints that made sense in isolation.</p>
      <h2>Errors should teach</h2>
      <p>Return messages that explain what went wrong and how to fix it. "Validation failed: email is required" beats "400 Bad Request" every time.</p>
      <p>Good API design is empathy encoded in HTTP status codes. Your future self — debugging at 2 a.m. — will thank you.</p>
    `,
  },
  {
    authorEmail: 'amara@seed.ink-echo.app',
    title: '48 Hours in Lisbon: A Photographer\'s Field Guide',
    category: 'Travel',
    tags: ['travel', 'photography', 'europe'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&h=630&fit=crop',
    content: `
      <p>Lisbon rewards early mornings. The tram lines are empty, the light is soft on the azulejo tiles, and the miradouros belong to you alone.</p>
      <h2>Day one: Alfama and Graça</h2>
      <p>Start at Miradouro da Senhora do Monte before breakfast. Walk downhill through Alfama's narrow lanes — shoot vertically, embrace the shadows. End at Time Out Market for lunch, not dinner; the crowds are manageable at noon.</p>
      <h2>Day two: Belém and the river</h2>
      <p>The Jerónimos Monastery facade is best in late afternoon sidelight. Walk the riverfront toward the Discoveries Monument. Golden hour here reflects off the Tagus like liquid amber.</p>
      <blockquote><p>Travel photography isn't about capturing everything. It's about capturing the feeling of being there.</p></blockquote>
      <p>Pack light. One body, one prime lens. Lisbon's hills will remind you why.</p>
    `,
  },
  {
    authorEmail: 'amara@seed.ink-echo.app',
    title: 'The Art of Packing One Carry-On for a Month Abroad',
    category: 'Travel',
    tags: ['travel', 'minimalism', 'packing'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=630&fit=crop',
    content: `
      <p>I spent three years traveling with a 40-liter backpack and a hard rule: if I can't carry it up four flights of stairs alone, it doesn't come.</p>
      <h2>The capsule wardrobe formula</h2>
      <p>Three tops, two bottoms, one layer, one dress or alternative — all in a cohesive palette. Wash sink-side every few days. Nobody remembers that you wore the same jacket in Prague and Porto.</p>
      <h3>What stays home</h3>
      <ul>
        <li>"Just in case" items — you can buy them there.</li>
        <li>More than two pairs of shoes.</li>
        <li>Full-size toiletries in the age of travel minis.</li>
      </ul>
      <p>Freedom isn't having everything you might need. It's needing only what you have.</p>
    `,
  },
  {
    authorEmail: 'james@seed.ink-echo.app',
    title: 'Ten Novels That Changed How I Read',
    category: 'Books',
    tags: ['books', 'literature', 'reading-list'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&h=630&fit=crop',
    content: `
      <p>Some books entertain. Others rearrange the furniture in your mind. These ten did the latter for me — not a definitive canon, but a personal map of how my taste evolved.</p>
      <h2>Where I'd start if I were you</h2>
      <p><strong>Beloved</strong> by Toni Morrison taught me that prose can hold grief and beauty in the same sentence. <strong>2666</strong> by Roberto Bolaño showed me that scale itself can be a narrative device.</p>
      <h2>The overlooked middle</h2>
      <p>Don't skip mid-career works in favor of debuts and masterpieces. <strong>The Evening and the Morning</strong> isn't Follett's best-known book, but it's where I learned how research can breathe without showing off.</p>
      <p>Make your own list. Argue with mine. That's the point.</p>
    `,
  },
  {
    authorEmail: 'james@seed.ink-echo.app',
    title: 'Interview Notes: On the Future of Public Libraries',
    category: 'Culture',
    tags: ['libraries', 'community', 'books'],
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=630&fit=crop',
    content: `
      <p>I sat down with Dr. Helen Marsh, director of the Riverside Public Library system, to ask a question that sounds simple and isn't: what is a library for in 2026?</p>
      <h2>More than books on shelves</h2>
      <p>"We're the last truly democratic indoor space in many neighborhoods," she said. "No purchase required. No membership tier. Just walk in."</p>
      <p>Riverside now hosts job-search clinics, ESL conversation groups, and a seed library for urban gardeners. Circulation of physical books is steady; digital lending is up forty percent.</p>
      <blockquote><p>People don't come only for information. They come to be around other people who value it.</p></blockquote>
      <p>Support your local branch. Use it. The metrics that keep the lights on start with foot traffic.</p>
    `,
  },
  {
    authorEmail: 'marcus@seed.ink-echo.app',
    title: 'Draft: Rethinking Authentication Flows (Unpublished)',
    category: 'Technology',
    tags: ['security', 'draft'],
    status: 'draft',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=630&fit=crop',
    content: `
      <p>This is a work-in-progress draft exploring passwordless auth, session management, and cookie security patterns for modern SPAs.</p>
      <h2>Outline</h2>
      <ul>
        <li>httpOnly cookies vs. localStorage tokens</li>
        <li>Refresh token rotation</li>
        <li>CSRF considerations with SameSite policies</li>
      </ul>
      <p>More to come...</p>
    `,
  },
];

/** Index by author email: which other user emails they follow */
export const followGraph = {
  'elena@seed.ink-echo.app': ['james@seed.ink-echo.app', 'amara@seed.ink-echo.app'],
  'marcus@seed.ink-echo.app': ['elena@seed.ink-echo.app'],
  'amara@seed.ink-echo.app': ['elena@seed.ink-echo.app', 'james@seed.ink-echo.app'],
  'james@seed.ink-echo.app': ['amara@seed.ink-echo.app', 'marcus@seed.ink-echo.app'],
};

/** Likes: user email -> blog titles they liked */
export const likes = {
  'elena@seed.ink-echo.app': ['48 Hours in Lisbon: A Photographer\'s Field Guide', 'Ten Novels That Changed How I Read'],
  'marcus@seed.ink-echo.app': ['The Case for Writing by Hand in a Digital Age', 'Interview Notes: On the Future of Public Libraries'],
  'amara@seed.ink-echo.app': ['Building a Reading Ritual That Actually Sticks', 'Why Your Side Project Needs Boring Technology'],
  'james@seed.ink-echo.app': ['The Art of Packing One Carry-On for a Month Abroad', 'Designing APIs for Humans, Not Just Clients'],
};

/** Bookmarks: user email -> blog titles */
export const bookmarks = {
  'elena@seed.ink-echo.app': ['Ten Novels That Changed How I Read'],
  'marcus@seed.ink-echo.app': ['Designing APIs for Humans, Not Just Clients'],
  'amara@seed.ink-echo.app': ['48 Hours in Lisbon: A Photographer\'s Field Guide', 'The Art of Packing One Carry-On for a Month Abroad'],
  'james@seed.ink-echo.app': ['Building a Reading Ritual That Actually Sticks', 'Interview Notes: On the Future of Public Libraries'],
};

export const SEED_EMAIL_DOMAIN = '@seed.ink-echo.app';
