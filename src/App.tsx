import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowRight, BadgeCheck, BarChart3, Beaker, BookOpen, Box, BrainCircuit, Check,
  ChevronRight, CircleHelp, Clock3, Download, FileCheck2, FileText,
  Flame, Gauge, History, Leaf, Menu, PackageCheck, Printer,
  RefreshCw, Search, ShieldCheck, Sparkles, Sprout, Truck, User, Wind, X,
} from 'lucide-react';

type Page = 'dashboard' | 'recommend' | 'result' | 'materials' | 'guidance' | 'comparison' | 'history' | 'about';
type ProductId = 'chips' | 'mango';
type Level = 'Excellent' | 'High' | 'Medium' | 'Low' | 'Medium–High' | 'Controlled / Moderate';

type FoodProfile = {
  id?: ProductId;
  product: string;
  category: string;
  moisture: string;
  fat: string;
  ph: string;
  respiration: string;
  shelfLife: string;
  storage: string;
  temperature: string;
  humidity: string;
  transportation: string;
  packaging: string;
  priority: string[];
};

type Recommendation = {
  profile: FoodProfile;
  material: string;
  structure: string;
  thickness: string;
  otr: string;
  wvtr: string;
  sealability: Level;
  strength: Level;
  map: string;
  mapTarget?: { o2: string; co2: string; note: string };
  score: number;
  sustainability: number;
  cost: Level;
  reason: string;
  alternative: string;
  protectionRequirement: string;
  factors: { label: string; detail: string; icon: ReactNode }[];
  respiration?: { rate: string; steps: string[] };
};

type HistoryItem = { id: string; product: string; recommended_material: string; score: number; storage: string; status: string; created_at: string };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Internal seeded profiles — used only when the user explicitly selects one from the product selector.
// These never appear as "demo" or "sample" in the UI.
const productProfiles: Record<ProductId, FoodProfile> = {
  chips: { id: 'chips', product: 'Potato Chips', category: 'Packaged Snack', moisture: '2', fat: '35', ph: '6.0', respiration: 'Not Applicable', shelfLife: '180', storage: 'Ambient', temperature: '25', humidity: '50', transportation: 'Long Distance', packaging: 'Pouch', priority: ['Shelf Life', 'Food Safety', 'Cost'] },
  mango: { id: 'mango', product: 'Fresh Mango', category: 'Fresh Fruit', moisture: '83', fat: '0.4', ph: '4.0', respiration: 'High', shelfLife: '14', storage: 'Chilled', temperature: '10', humidity: '85', transportation: 'Long Distance', packaging: 'Perforated / ventilated produce pack', priority: ['Shelf Life', 'Food Safety', 'Sustainability'] },
};

const materials = [
  { name: 'LDPE', application: 'Produce liners, frozen foods', otr: 'Low', wvtr: 'Low', strength: 'Medium', seal: 'Excellent', transparency: 'High', sustainability: 'Medium', cost: 'Low', tag: 'Flexible' },
  { name: 'HDPE', application: 'Bottles, trays, dry goods', otr: 'Medium', wvtr: 'Medium', strength: 'High', seal: 'High', transparency: 'Medium', sustainability: 'Medium', cost: 'Low', tag: 'Durable' },
  { name: 'PET', application: 'Bottles, lidding, trays', otr: 'Low', wvtr: 'Medium', strength: 'Excellent', seal: 'Medium', transparency: 'Excellent', sustainability: 'Medium', cost: 'Medium', tag: 'Rigid / clear' },
  { name: 'Metallized PET', application: 'Snacks, coffee, dry foods', otr: 'Excellent', wvtr: 'Excellent', strength: 'High', seal: 'High', transparency: 'Low', sustainability: 'Low', cost: 'Medium', tag: 'High barrier' },
  { name: 'Aluminum Foil Laminate', application: 'Retort, pharma-style barriers', otr: 'Excellent', wvtr: 'Excellent', strength: 'High', seal: 'High', transparency: 'Low', sustainability: 'Low', cost: 'High', tag: 'Maximum barrier' },
  { name: 'PP', application: 'Trays, cups, hot-fill packs', otr: 'Medium', wvtr: 'Medium', strength: 'High', seal: 'Excellent', transparency: 'High', sustainability: 'Medium', cost: 'Low', tag: 'Heat tolerant' },
  { name: 'Biodegradable Film', application: 'Dry goods, short-life packs', otr: 'Medium', wvtr: 'Medium', strength: 'Medium', seal: 'Medium', transparency: 'High', sustainability: 'Excellent', cost: 'High', tag: 'Emerging' },
  { name: 'Breathable / Micro-perforated Film', application: 'Fresh produce, respiration control', otr: 'Controlled', wvtr: 'Medium', strength: 'Medium–High', seal: 'Medium–High', transparency: 'High', sustainability: 'Medium', cost: 'Medium', tag: 'Fresh produce' },
];

function recommend(profile: FoodProfile): Recommendation {
  const fat = Number(profile.fat) || 0;
  const moisture = Number(profile.moisture) || 0;
  const shelfLife = Number(profile.shelfLife) || 0;
  const isFresh = profile.category === 'Fresh Fruit' || profile.category === 'Fresh Vegetable';
  const highRespiration = profile.respiration === 'High' || profile.respiration === 'Medium';

  if (isFresh && highRespiration) {
    return {
      profile,
      material: 'Breathable / Micro-perforated Food-grade Film',
      structure: 'Food-grade breathable film / micro-perforation',
      thickness: 'Approximately 30–50 μm',
      otr: 'Controlled / Moderate',
      wvtr: 'Moderate',
      sealability: 'Medium–High',
      strength: 'Medium–High',
      map: 'Recommended for controlled-atmosphere applications',
      mapTarget: { o2: '3–5%', co2: '5–10%', note: 'Target range for decision support; commodity-specific MAP conditions require experimental validation.' },
      score: 89,
      sustainability: 84,
      cost: 'Medium',
      reason: `${profile.product} continues respiration after harvest. Completely impermeable packaging can cause undesirable gas accumulation, so controlled gas exchange through breathable or micro-perforated packaging is required.`,
      alternative: 'Compostable breathable film, subject to humidity, seal and performance validation.',
      protectionRequirement: 'Controlled gas exchange with moderate moisture management.',
      factors: [
        { label: `${profile.respiration} respiration`, detail: 'Controlled gas exchange required', icon: <Sprout /> },
        { label: `${moisture}% moisture`, detail: 'Moisture management required', icon: <Gauge /> },
        { label: `${shelfLife}-day shelf life`, detail: 'Shelf-life protection required', icon: <ShieldCheck /> },
        { label: `${profile.storage} storage`, detail: 'Temperature compatibility required', icon: <Clock3 /> },
      ],
      respiration: {
        rate: profile.respiration,
        steps: [
          `${profile.respiration} respiration commodity`,
          'Requires controlled gas exchange',
          'Breathable / micro-perforated packaging',
          'MAP suitability considered',
        ],
      },
    };
  }

  // High-barrier pathway for snacks, grains, dry goods, etc.
  const factors: { label: string; detail: string; icon: ReactNode }[] = [];
  if (fat >= 15) factors.push({ label: `${fat}% fat content`, detail: 'Oxygen protection required', icon: <Flame /> });
  if (moisture <= 10) factors.push({ label: `${moisture}% moisture`, detail: 'Moisture barrier required', icon: <Beaker /> });
  if (shelfLife >= 90) factors.push({ label: `${shelfLife}-day shelf life`, detail: 'High barrier performance required', icon: <ShieldCheck /> });
  if (profile.transportation === 'Long Distance') factors.push({ label: 'Long-distance transport', detail: 'Mechanical strength required', icon: <Truck /> });
  if (factors.length < 3) factors.push({ label: `${profile.storage} storage`, detail: 'Storage compatibility required', icon: <Clock3 /> });

  return {
    profile,
    material: 'Metallized PET/PE Laminate',
    structure: 'PET / MET-PET / PE',
    thickness: 'Approximately 80–100 μm',
    otr: 'Very Low',
    wvtr: 'Very Low',
    sealability: 'High',
    strength: 'High',
    map: 'Optional / product dependent',
    score: 92,
    sustainability: 78,
    cost: 'Medium',
    reason: `${profile.product} contains fat and is sensitive to oxygen-driven rancidity and moisture-driven loss of crispness. A high-barrier metallized laminate provides strong oxygen and moisture protection with suitable mechanical strength and sealability.`,
    alternative: 'Recycle-oriented mono-material high-barrier structure, subject to recycling compatibility and performance validation.',
    protectionRequirement: 'High oxygen and moisture barrier.',
    factors,
  };
}

const initialProfile: FoodProfile = {
  product: '', category: 'Packaged Snack', moisture: '', fat: '', ph: '', respiration: 'Not Applicable',
  shelfLife: '', storage: 'Ambient', temperature: '', humidity: '', transportation: 'Regional',
  packaging: 'Pouch', priority: ['Shelf Life', 'Food Safety'],
};

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [profile, setProfile] = useState<FoodProfile>(initialProfile);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => { void loadHistory(); }, []);
  useEffect(() => { if (toast) { const timer = window.setTimeout(() => setToast(''), 3000); return () => window.clearTimeout(timer); } }, [toast]);

  async function loadHistory() {
    if (supabase) {
      const { data } = await supabase.from('packintel_recommendation_history').select('*').order('created_at', { ascending: false }).limit(12);
      if (data) { setHistoryItems(data as HistoryItem[]); return; }
    }
    const saved = window.localStorage.getItem('packintel-history');
    setHistoryItems(saved ? JSON.parse(saved) as HistoryItem[] : []);
  }

  async function saveHistory(result: Recommendation) {
    const item: HistoryItem = { id: crypto.randomUUID(), product: result.profile.product || 'Custom Food Profile', recommended_material: result.material, score: result.score, storage: result.profile.storage, status: 'Recommended', created_at: new Date().toISOString() };
    const updated = [item, ...historyItems].slice(0, 12);
    setHistoryItems(updated);
    window.localStorage.setItem('packintel-history', JSON.stringify(updated));
    if (supabase) await supabase.from('packintel_recommendation_history').insert({ product: item.product, recommended_material: item.recommended_material, score: item.score, storage: item.storage, status: item.status });
  }

  function loadProfile(id: ProductId) { setProfile({ ...productProfiles[id] }); setRecommendation(null); setPage('recommend'); }
  function startNew() { setProfile({ ...initialProfile }); setRecommendation(null); setPage('recommend'); }
  function analyze(nextProfile = profile) { const result = recommend(nextProfile); setRecommendation(result); void saveHistory(result); setPage('result'); }
  function go(next: Page) { setPage(next); setMobileNav(false); }

  return <div className="app-shell">
    <Sidebar page={page} go={go} mobileOpen={mobileNav} close={() => setMobileNav(false)} />
    <main className="main-area">
      <Topbar onMenu={() => setMobileNav(true)} onNew={startNew} />
      {page === 'dashboard' && <Dashboard go={go} />}
      {page === 'recommend' && <RecommendationForm profile={profile} setProfile={setProfile} analyze={analyze} loadProfile={loadProfile} />}
      {page === 'result' && recommendation && <ResultView result={recommendation} go={go} onNew={startNew} />}
      {page === 'materials' && <MaterialsView />}
      {page === 'guidance' && <GuidanceView />}
      {page === 'comparison' && <ComparisonView />}
      {page === 'history' && <HistoryView items={historyItems} loadProfile={loadProfile} />}
      {page === 'about' && <AboutView />}
    </main>
    {toast && <div className="toast"><BadgeCheck size={18} />{toast}</div>}
  </div>;
}

function Sidebar({ page, go, mobileOpen, close }: { page: Page; go: (page: Page) => void; mobileOpen: boolean; close: () => void }) {
  const nav = [{ id: 'dashboard', label: 'Dashboard', icon: <BarChart3 /> }, { id: 'recommend', label: 'New recommendation', icon: <Sparkles /> }, { id: 'materials', label: 'Material library', icon: <Box /> }, { id: 'guidance', label: 'FSSAI guidance', icon: <FileCheck2 /> }, { id: 'history', label: 'History', icon: <History /> }];
  return <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
    <div className="brand"><div className="brand-mark"><PackageCheck size={22} /></div><div><strong>PackIntel <span>AI</span></strong><small>Food packaging intelligence</small></div><button className="close-mobile" onClick={close}><X size={18} /></button></div>
    <div className="status-pill-sidebar"><span className="live-dot" /> System ready <span>Decision support</span></div>
    <nav>{nav.map(item => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => go(item.id as Page)}>{item.icon}<span>{item.label}</span>{page === item.id && <ChevronRight size={15} />}</button>)}</nav>
    <div className="sidebar-bottom"><div className="sidebar-help"><CircleHelp size={18} /><div><strong>Need a starting point?</strong><span>Load a common food profile to begin.</span></div></div><button className="sidebar-about" onClick={() => go('about')}><BookOpen size={16} /> About PackIntel AI</button><div className="sidebar-foot">Decision support for better shelf life<br />and less food waste</div></div>
  </aside>;
}

function Topbar({ onMenu, onNew }: { onMenu: () => void; onNew: () => void }) { return <header className="topbar"><button className="mobile-menu" onClick={onMenu}><Menu size={22} /></button><div className="topbar-brand"><PackageCheck size={20} /><span>PackIntel AI</span></div><div className="top-actions"><button className="icon-button user-icon" title="Account"><User size={18} /></button><button className="top-cta" onClick={onNew}><Sparkles size={16} /> New recommendation</button></div></header>; }

function Dashboard({ go }: { go: (p: Page) => void }) {
  const intelSteps: { num: string; title: string; copy: string; icon: ReactNode }[] = [
    { num: '01', title: 'Food Properties', copy: 'Moisture • Fat • pH • Respiration', icon: <Beaker /> },
    { num: '02', title: 'Storage Conditions', copy: 'Temperature • Humidity • Shelf Life', icon: <Clock3 /> },
    { num: '03', title: 'Material Matching', copy: 'Food compatibility • Format • Strength', icon: <Box /> },
    { num: '04', title: 'Barrier Optimization', copy: 'OTR • WVTR • Thickness • Sealability', icon: <ShieldCheck /> },
    { num: '05', title: 'Final Guidance', copy: 'Recommendation • Sustainability • FSSAI', icon: <FileCheck2 /> },
  ];
  const engineItems: { title: string; copy: string; icon: ReactNode }[] = [
    { title: 'Food Compatibility', copy: 'Matches food properties with suitable materials', icon: <Sparkles /> },
    { title: 'Barrier Requirements', copy: 'Evaluates oxygen and moisture protection needs', icon: <ShieldCheck /> },
    { title: 'Storage Conditions', copy: 'Considers temperature, humidity and shelf life', icon: <Clock3 /> },
    { title: 'Regulatory Guidance', copy: 'Provides applicable FSSAI packaging guidance', icon: <FileCheck2 /> },
  ];
  return <div className="page-content dashboard-page">
    <section className="hero-section"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> AI-powered food packaging intelligence</div><h1>Smart packaging<br /><em>recommendations</em> with AI.</h1><p>Analyze food properties, storage conditions and shelf-life requirements to identify suitable packaging materials and specifications.</p><div className="hero-actions"><button className="primary-button" onClick={() => go('recommend')}>Start recommendation <ArrowRight size={17} /></button><button className="secondary-button" onClick={() => go('materials')}><Box size={16} /> Explore materials</button></div><div className="hero-trust"><div className="avatar-stack"><span>F</span><span>Q</span><span>R</span><span>+</span></div><span>Built for food-tech decisions<br /><b>Validation-ready guidance</b></span></div></div><HeroVisual /></section>
    <section className="stats-row">{[['12+', 'Food profiles', 'Supported categories'], ['8', 'Packaging materials', 'Curated library'], ['10+', 'Decision factors', 'Explainable rules'], ['6', 'Barrier specs', 'OTR · WVTR · MAP']].map(([num, label, sub]) => <div className="stat-card" key={label}><strong>{num}</strong><div><b>{label}</b><span>{sub}</span></div></div>)}</section>
    <section className="section-block intelligence-section"><div className="section-heading"><span className="section-kicker">PACKAGING INTELLIGENCE</span><h2>From food properties to packaging decisions</h2><p>PackIntel AI evaluates food characteristics, storage conditions and packaging requirements to identify a suitable material and explain the recommendation.</p></div><div className="intel-steps">{intelSteps.map((step, i) => <div className="intel-step" key={step.num}><div className="intel-step-top"><span className="intel-icon">{step.icon}</span><span className="intel-num">{step.num}</span></div><strong>{step.title}</strong><p>{step.copy}</p>{i < intelSteps.length - 1 && <span className="intel-connector" />}</div>)}</div></section>
    <section className="engine-strip">{engineItems.map(item => <div className="engine-item" key={item.title}><span className="engine-icon">{item.icon}</span><div><b>{item.title}</b><small>{item.copy}</small></div></div>)}</section>
    <section className="feature-band"><div><span className="section-kicker mint">WHY IT MATTERS</span><h2>Better barrier decisions.<br />Less food waste.</h2><p>PackIntel AI connects product science, packaging performance and sustainability into one decision-ready view.</p></div><div className="feature-points"><div><Leaf size={19} /><span><b>Sustainability-aware</b><small>See better alternatives, not just the highest barrier.</small></span></div><div><ShieldCheck size={19} /><span><b>Regulatory context</b><small>Guidance that keeps verification visible.</small></span></div><div><BrainCircuit size={19} /><span><b>Explainable by design</b><small>Every score comes with a "why".</small></span></div></div></section>
    <footer className="footer"><div><strong>PackIntel <span>AI</span></strong><p>Intelligent Packaging Decisions. Better Shelf Life. Less Food Waste.</p></div><span>Decision-support system · SIH PS 26236</span></footer>
  </div>;
}

function HeroVisual() { return <div className="hero-visual"><div className="glow glow-one" /><div className="glow glow-two" /><div className="scan-orbit orbit-one" /><div className="scan-orbit orbit-two" /><div className="hero-platform" /><div className="chip-pouch"><div className="pouch-top" /><div className="pouch-logo"><Leaf size={16} /><span>PACKINTEL</span></div><strong>POTATO<br />CHIPS</strong><small>classic salted</small><div className="chips-art"><i /><i /><i /></div></div><div className="mango-pack"><div className="mango mango-a">🥭</div><div className="mango mango-b">🥭</div><div className="pack-label"><Leaf size={12} /> FRESH MANGO</div></div><div className="ai-device"><div className="device-camera" /><div className="device-top"><span>◈</span><b>PackIntel <i>AI</i></b><span>◉</span></div><div className="device-card"><small>LIVE ANALYSIS</small><strong>Potato Chips</strong><div className="mini-bars"><span /><span /><span /><span /></div><label>Barrier fit <b>92%</b></label></div><div className="device-reco"><span><LayersIcon /></span><div><small>RECOMMENDED</small><b>Metallized PET/PE</b></div><Check size={14} /></div><div className="device-nav"><span>⌂</span><span>◎</span><span>▣</span><span>◌</span></div></div><FloatTag className="tag-props" icon={<Beaker />} title="Food properties" text="Moisture · pH · Oil" /><FloatTag className="tag-barrier" icon={<ShieldCheck />} title="Barrier analysis" text="OTR · WVTR" /><FloatTag className="tag-green" icon={<Leaf />} title="Sustainability" text="78 / 100" /><div className="hero-label"><span className="live-dot" /> Intelligent material matching</div></div>; }
function LayersIcon() { return <span className="layers-icon"><span /><span /><span /></span>; }
function FloatTag({ className, icon, title, text }: { className: string; icon: ReactNode; title: string; text: string }) { return <div className={`float-tag ${className}`}><span className="float-icon">{icon}</span><span><b>{title}</b><small>{text}</small></span><ChevronRight size={14} /></div>; }
function SectionHeading({ kicker, title, copy }: { kicker: string; title: string; copy: string }) { return <div className="section-heading"><span className="section-kicker">{kicker}</span><h2>{title}</h2><p>{copy}</p></div>; }
function RecommendationForm({ profile, setProfile, analyze, loadProfile }: { profile: FoodProfile; setProfile: (p: FoodProfile) => void; analyze: (p?: FoodProfile) => void; loadProfile: (id: ProductId) => void }) {
  const [error, setError] = useState('');
  const update = (key: keyof FoodProfile, value: string | string[]) => setProfile({ ...profile, [key]: value });
  function submit(e: FormEvent) {
    e.preventDefault();
    const required = ['product', 'moisture', 'fat', 'ph', 'shelfLife', 'temperature', 'humidity'];
    if (required.some(key => !String(profile[key as keyof FoodProfile]))) { setError('Please complete all required fields before analyzing.'); return; }
    if (Number(profile.ph) < 0 || Number(profile.ph) > 14) { setError('pH must be between 0 and 14.'); return; }
    if (Number(profile.moisture) < 0 || Number(profile.moisture) > 100) { setError('Moisture must be between 0 and 100%.'); return; }
    if (Number(profile.humidity) < 0 || Number(profile.humidity) > 100) { setError('Relative humidity must be between 0 and 100%.'); return; }
    if (Number(profile.shelfLife) < 1) { setError('Shelf life must be a positive number of days.'); return; }
    if (Number(profile.temperature) < -50 || Number(profile.temperature) > 100) { setError('Please enter a realistic storage temperature.'); return; }
    setError('');
    analyze();
  }
  return <div className="page-content form-page"><div className="page-intro"><div><span className="section-kicker">RECOMMENDATION WORKSPACE</span><h1>Tell us about the food.</h1><p>Enter the food properties and storage conditions to generate a packaging recommendation.</p></div><div className="form-demo-actions"><span>Load a profile</span><button onClick={() => loadProfile('chips')}><span className="tiny-food chips-dot" /> Potato Chips</button><button onClick={() => loadProfile('mango')}><span className="tiny-food mango-dot">🥭</span> Fresh Mango</button></div></div><form className="recommendation-form" onSubmit={submit}><FormSection number="01" title="Food information" copy="Properties that shape barrier and respiration needs."><div className="form-grid four"><Field label="Commodity name" required><input value={profile.product} onChange={e => update('product', e.target.value)} placeholder="Enter commodity name" /></Field><Field label="Food category" required><select value={profile.category} onChange={e => update('category', e.target.value)}>{['Packaged Snack', 'Fresh Fruit', 'Fresh Vegetable', 'Grain', 'Dairy', 'Beverage', 'Other'].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Moisture content" suffix="%" required><input type="number" min="0" max="100" value={profile.moisture} onChange={e => update('moisture', e.target.value)} placeholder="0–100" /></Field><Field label="Oil / fat content" suffix="%" required><input type="number" min="0" max="100" value={profile.fat} onChange={e => update('fat', e.target.value)} placeholder="0–100" /></Field><Field label="pH" required><input type="number" min="0" max="14" step="0.1" value={profile.ph} onChange={e => update('ph', e.target.value)} placeholder="0–14" /></Field><Field label="Respiration rate"><select value={profile.respiration} onChange={e => update('respiration', e.target.value)}>{['Not Applicable', 'Low', 'Medium', 'High'].map(v => <option key={v}>{v}</option>)}</select></Field></div></FormSection><FormSection number="02" title="Storage requirements" copy="The journey your package needs to protect against."><div className="form-grid four"><Field label="Desired shelf life" suffix="days" required><input type="number" min="1" value={profile.shelfLife} onChange={e => update('shelfLife', e.target.value)} placeholder="Number of days" /></Field><Field label="Storage type"><select value={profile.storage} onChange={e => update('storage', e.target.value)}>{['Ambient', 'Chilled', 'Frozen'].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Storage temperature" suffix="°C" required><input type="number" value={profile.temperature} onChange={e => update('temperature', e.target.value)} placeholder="°C" /></Field><Field label="Relative humidity" suffix="%" required><input type="number" min="0" max="100" value={profile.humidity} onChange={e => update('humidity', e.target.value)} placeholder="0–100" /></Field><Field label="Transportation"><select value={profile.transportation} onChange={e => update('transportation', e.target.value)}>{['Local', 'Regional', 'Long Distance'].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Packaging format"><select value={profile.packaging} onChange={e => update('packaging', e.target.value)}>{['Pouch', 'Tray', 'Bottle', 'Container', 'Bag', 'Perforated / ventilated produce pack', 'Other'].map(v => <option key={v}>{v}</option>)}</select></Field></div></FormSection><FormSection number="03" title="Decision priorities" copy="Tune the recommendation toward what matters most."><div className="priority-grid">{['Shelf Life', 'Cost', 'Sustainability', 'Food Safety', 'Barrier Protection'].map(priority => <button type="button" className={profile.priority.includes(priority) ? 'selected' : ''} onClick={() => update('priority', profile.priority.includes(priority) ? profile.priority.filter(x => x !== priority) : [...profile.priority, priority])} key={priority}>{profile.priority.includes(priority) && <Check size={15} />}{priority}</button>)}</div></FormSection><div className="form-footer"><div>{error && <span className="form-error"><X size={15} /> {error}</span>}<span className="form-note"><ShieldCheck size={16} /> Analysis runs locally — no external AI key required.</span></div><button className="primary-button large" type="submit"><Sparkles size={17} /> Analyze with PackIntel AI <ArrowRight size={17} /></button></div></form></div>;
}
function FormSection({ number, title, copy, children }: { number: string; title: string; copy: string; children: ReactNode }) { return <section className="form-section"><div className="form-section-heading"><span className="step-number">{number}</span><div><h2>{title}</h2><p>{copy}</p></div></div>{children}</section>; }
function Field({ label, suffix, required, children }: { label: string; suffix?: string; required?: boolean; children: ReactNode }) { return <label className="field"><span>{label}{required && <i>*</i>}</span><div className="input-wrap">{children}{suffix && <em>{suffix}</em>}</div></label>; }

function ResultView({ result, go, onNew }: { result: Recommendation; go: (p: Page) => void; onNew: () => void }) {
  const [report, setReport] = useState(false);
  return <div className="page-content result-page"><div className="result-top"><div><button className="back-link" onClick={() => go('recommend')}><ChevronRight size={15} className="back-icon" /> Back to inputs</button><span className="section-kicker">PACKAGING RECOMMENDATION</span><h1>Your packaging decision is ready.</h1><p>Based on the properties and priorities in your profile, PackIntel AI recommends a high-fit material pathway.</p></div><div className="result-actions"><button className="secondary-button" onClick={onNew}><RefreshCw size={16} /> New analysis</button><button className="primary-button" onClick={() => setReport(true)}><FileText size={16} /> Generate report</button></div></div><div className="recommendation-hero"><div className="result-score"><div className="score-ring"><strong>{result.score}</strong><span>/100</span></div><span>Prototype recommendation<br /><b>Compatibility score</b></span></div><div className="result-material"><span className="status-pill"><Check size={13} /> Recommended</span><h2>{result.material}</h2><p>{result.structure}</p><div className="result-meta"><span><strong>{result.profile.product || 'Custom profile'}</strong> Product</span><span><strong>{result.profile.storage}</strong> Storage</span><span><strong>{result.profile.shelfLife} days</strong> Shelf-life target</span></div></div><div className="result-badge"><PackageCheck size={24} /><span>Best fit<br /><b>for this profile</b></span></div></div>
  {result.respiration && <RespirationAnalysis rate={result.respiration.rate} steps={result.respiration.steps} />}
  <section className="result-section"><SectionHeading kicker="PACKAGING SPECIFICATIONS" title="Barrier performance at a glance." copy="Recommended specifications for validation against supplier data and testing." /><div className="spec-grid"><SpecCard icon={<WindIcon />} label="OTR" value={result.otr} copy="Oxygen transmission rate" tooltip="Indicates the rate at which oxygen passes through the packaging material." /><SpecCard icon={<DropletsIcon />} label="WVTR" value={result.wvtr} copy="Water vapor transmission rate" tooltip="Indicates the rate at which water vapor passes through the packaging material." /><SpecCard icon={<Gauge />} label="Thickness" value={result.thickness} copy="Suggested film range" /><SpecCard icon={<PackageCheck />} label="Sealability" value={result.sealability} copy="Packaging integrity" /><SpecCard icon={<Truck />} label="Mechanical strength" value={result.strength} copy="Handling & transport" /><SpecCard icon={<Sprout />} label="MAP suitability" value={result.map} copy="Atmosphere guidance" wide /></div></section>
  {result.mapTarget && <MAPRecommendation o2={result.mapTarget.o2} co2={result.mapTarget.co2} note={result.mapTarget.note} />}
  <section className="result-section explain-section"><div className="explain-copy"><span className="section-kicker">EXPLAINABLE AI</span><h2>Why PackIntel AI recommended this.</h2><p>{result.reason}</p><div className="reason-list">{result.factors.map((factor, i) => <div className="reason-row" key={factor.label}><span className="reason-icon">{factor.icon}</span><div><b>{factor.label}</b><ArrowRight size={15} /><strong>{factor.detail}</strong></div>{i < result.factors.length - 1 && <span className="reason-connector" />}</div>)}</div><div className="protection-req"><ShieldCheck size={16} /> <span>Protection requirement: <b>{result.protectionRequirement}</b></span></div></div><div className="reason-visual"><div className="reason-visual-card"><div className="radar"><span /><span /><span /><span /><i /></div><div><small>DECISION SIGNALS</small><b>Barrier fit is strong</b><span>Matched across {result.factors.length} key factors</span></div></div><div className="signal-list"><span><i className="signal-dot teal" /> Food properties</span><span><i className="signal-dot amber" /> Storage profile</span><span><i className="signal-dot green" /> Sustainability</span></div></div></section><section className="result-section split-cards"><FSSAIComplianceCard category={result.profile.category} /><SustainabilityCard result={result} /></section><section className="validation-note"><ShieldCheck size={20} /><div><b>Recommended for validation</b><p>PackIntel AI provides decision-support guidance. Final packaging performance, compliance and MAP values should be verified against applicable regulations, standards and testing requirements.</p></div></section>{report && <ReportPreview result={result} close={() => setReport(false)} />}</div>;
}
function WindIcon() { return <span className="wind-icon">↝</span>; } function DropletsIcon() { return <span className="drop-icon">◒</span>; }
function SpecCard({ icon, label, value, copy, tooltip, wide }: { icon: ReactNode; label: string; value: string; copy: string; tooltip?: string; wide?: boolean }) { return <div className={`spec-card ${wide ? 'wide' : ''}`}><span className="spec-icon">{icon}</span><div><small>{label}{tooltip && <span className="spec-tooltip" title={tooltip}><CircleHelp size={11} /></span>}</small><b>{value}</b><span>{copy}</span></div></div>; }

function RespirationAnalysis({ rate, steps }: { rate: string; steps: string[] }) {
  return <section className="result-section respiration-section"><div className="respiration-card"><div className="respiration-head"><span className="respiration-icon"><Wind size={20} /></span><div><span className="section-kicker">RESPIRATION ANALYSIS</span><h2>Controlled gas exchange required</h2><p>This commodity has <b>{rate.toLowerCase()}</b> respiration. Completely impermeable packaging would trap respiratory gases and degrade quality.</p></div></div><div className="respiration-flow">{steps.map((step, i) => <div className="respiration-step" key={step}><span className="respiration-num">{i + 1}</span><b>{step}</b>{i < steps.length - 1 && <ArrowRight size={16} className="respiration-arrow" />}</div>)}</div></div></section>;
}

function MAPRecommendation({ o2, co2, note }: { o2: string; co2: string; note: string }) {
  return <section className="result-section map-section"><div className="map-card"><div className="map-head"><span className="map-icon"><Sprout size={20} /></span><div><span className="section-kicker">MAP RECOMMENDATION</span><h2>Modified atmosphere packaging target</h2><p>Recommended gas composition for controlled-atmosphere applications.</p></div></div><div className="map-targets"><div className="map-gas"><small>O₂ Target</small><b>{o2}</b></div><div className="map-divider" /><div className="map-gas"><small>CO₂ Target</small><b>{co2}</b></div></div><p className="map-note">{note}</p></div></section>;
}

function FSSAIComplianceCard({ category }: { category: string }) {
  const fresh = category === 'Fresh Fruit' || category === 'Fresh Vegetable';
  const packagedItems = ['Product name', 'Ingredients', 'Nutrition information', 'Net quantity', 'Batch / lot number', 'Date marking', 'MRP', 'Manufacturer / packer details', 'Applicable FSSAI license information', 'Vegetarian / non-vegetarian declaration'];
  const freshItems = ['Food-contact packaging guidance', 'Food safety & hygiene', 'Storage conditions', 'Transport conditions'];
  const items = fresh ? freshItems : packagedItems;
  return <div className="info-card guidance-card"><div className="card-title"><span className="card-icon"><FileCheck2 size={18} /></span><div><span className="section-kicker">REGULATORY GUIDANCE</span><h3>FSSAI Compliance Guidance</h3></div></div><div className="guidance-status"><span><Check size={14} /> Food contact material</span><b>Guidance available</b></div><div className="guidance-status"><span><Check size={14} /> Packaging suitability</span><b>Verification required</b></div><div className="guidance-status"><span><Check size={14} /> {fresh ? 'Food safety & hygiene' : 'Labeling checklist'}</span><b>Available</b></div><div className="guidance-checklist-mini">{items.slice(0, 5).map(item => <span key={item}><Check size={11} /> {item}</span>)}{items.length > 5 && <span className="more-items">+{items.length - 5} more</span>}</div><div className="guidance-disclaimer">Guidance — Verification Required</div><p className="tiny-disclaimer">PackIntel AI provides decision-support and regulatory guidance. It does not constitute official FSSAI certification. Final compliance should be verified against applicable regulations, standards and testing requirements.</p></div>;
}
function SustainabilityCard({ result }: { result: Recommendation }) { return <div className="info-card sustainability-card"><div className="card-title"><span className="card-icon green"><Leaf size={18} /></span><div><span className="section-kicker">MATERIAL PATHWAYS</span><h3>Sustainability snapshot</h3></div></div><div className="sustainability-score"><div><strong>{result.sustainability}</strong><span>/100</span></div><span>Prototype sustainability score</span></div><div className="compare-line"><span>Recommended material</span><b>{result.material}</b></div><div className="compare-line"><span>Sustainable alternative</span><b>{result.alternative}</b></div><div className="compare-line"><span>Recyclability</span><b>{result.sustainability >= 80 ? 'Good potential' : 'Review required'}</b></div><div className="compare-line"><span>Barrier performance</span><b>{result.otr}</b></div><div className="cost-line"><span>Relative cost</span><span className={`cost-tag ${result.cost.toLowerCase()}`}>{result.cost}</span></div></div>; }
function ReportPreview({ result, close }: { result: Recommendation; close: () => void }) {
  const reportText = [
    'PACKINTEL AI',
    'AI-Based Intelligent Food Packaging Material Recommendation System',
    '',
    `Food Commodity: ${result.profile.product}`,
    `Category: ${result.profile.category}`,
    `Moisture: ${result.profile.moisture}% | Oil/Fat: ${result.profile.fat}% | pH: ${result.profile.ph}`,
    `Respiration: ${result.profile.respiration}`,
    `Shelf Life: ${result.profile.shelfLife} days | Storage: ${result.profile.storage} | Temperature: ${result.profile.temperature}°C`,
    `Humidity: ${result.profile.humidity}% | Transport: ${result.profile.transportation} | Format: ${result.profile.packaging}`,
    `Priorities: ${result.profile.priority.join(', ')}`,
    '',
    `Recommended Material: ${result.material}`,
    `Structure: ${result.structure}`,
    `OTR: ${result.otr}`,
    `WVTR: ${result.wvtr}`,
    `Thickness: ${result.thickness}`,
    `Sealability: ${result.sealability}`,
    `Mechanical Strength: ${result.strength}`,
    `MAP: ${result.map}`,
    result.mapTarget ? `MAP Target — O₂: ${result.mapTarget.o2}, CO₂: ${result.mapTarget.co2}` : '',
    '',
    `Why This Material: ${result.reason}`,
    `Protection Requirement: ${result.protectionRequirement}`,
    '',
    `FSSAI Guidance: Included — verification required`,
    `Sustainability Score: ${result.sustainability}/100`,
    `Cost Category: ${result.cost}`,
    `Recommendation Score: ${result.score}/100`,
    '',
    'Disclaimer: This report is for decision support only. It does not constitute official FSSAI certification, laboratory-certified validation or universal packaging values. Final compliance and performance should be verified through applicable regulations and testing.',
  ].filter(Boolean).join('\n');
  return <div className="modal-backdrop"><div className="report-modal"><div className="report-head"><div><span className="section-kicker">PACKINTEL AI · REPORT</span><h2>Packaging recommendation report</h2></div><button className="icon-button" onClick={close}><X size={18} /></button></div><div className="report-body"><div className="report-brand"><PackageCheck size={20} /><b>PackIntel <span>AI</span></b><span>Decision-support report</span></div><h1>{result.profile.product || 'Food profile'}</h1><span className="status-pill"><Check size={13} /> {result.score}/100 recommendation score</span><div className="report-table">{[['Recommended material', result.material], ['Packaging structure', result.structure], ['OTR', result.otr], ['WVTR', result.wvtr], ['Thickness', result.thickness], ['Sealability', result.sealability], ['Mechanical strength', result.strength], ['MAP recommendation', result.map], ['Relative cost', result.cost]].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div><h3>Why this material</h3><p>{result.reason}</p><h3>FSSAI compliance guidance</h3><p>Guidance included — verification required. PackIntel AI does not constitute official FSSAI certification.</p><div className="report-warning"><ShieldCheck size={16} /> Verification required against applicable regulations and testing</div><p className="report-disclaimer">This report is for decision support only. It does not constitute official FSSAI certification, laboratory-certified validation or universal packaging values. Final compliance and performance should be verified through applicable regulations and testing.</p></div><div className="report-actions"><button className="secondary-button" onClick={() => window.print()}><Printer size={16} /> Print report</button><button className="primary-button" onClick={() => { const blob = new Blob([reportText], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'packintel-recommendation.txt'; link.click(); URL.revokeObjectURL(url); }}><Download size={16} /> Download report</button></div></div></div>;
}

function MaterialsView() { const [search, setSearch] = useState(''); const filtered = materials.filter(item => `${item.name} ${item.application} ${item.tag}`.toLowerCase().includes(search.toLowerCase())); return <div className="page-content library-page"><div className="page-intro"><div><span className="section-kicker">MATERIAL INTELLIGENCE</span><h1>Packaging material library.</h1><p>Explore the material behaviors used by the recommendation engine.</p></div><div className="library-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials" /></div></div><div className="library-note"><Beaker size={18} /><span><b>Qualitative guidance data.</b> Relative performance levels are directional and should be confirmed with supplier specifications and testing.</span></div><div className="material-table"><div className="material-table-head"><span>Material</span><span>Best-fit applications</span><span>OTR / WVTR</span><span>Strength</span><span>Sealability</span><span>Sustainability</span><span>Cost</span></div>{filtered.map(material => <div className="material-row" key={material.name}><div className="material-name"><span className="material-symbol"><LayersIcon /></span><div><b>{material.name}</b><small>{material.tag}</small></div></div><span>{material.application}</span><span><b>{material.otr}</b> / {material.wvtr}</span><span>{material.strength}</span><span>{material.seal}</span><span><span className={`sustainability-label ${material.sustainability === 'Excellent' ? 'excellent' : ''}`}>{material.sustainability}</span></span><span className={`cost-tag ${material.cost.toLowerCase()}`}>{material.cost}</span></div>)}</div></div>; }
function GuidanceView() { const packaged = ['Product name', 'Ingredients', 'Nutrition information', 'Net quantity', 'Batch / lot number', 'Date marking', 'MRP', 'Manufacturer / packer details', 'Applicable FSSAI license information', 'Vegetarian / non-vegetarian declaration']; return <div className="page-content guidance-page"><div className="page-intro"><div><span className="section-kicker">REGULATORY CONTEXT</span><h1>FSSAI compliance guidance.</h1><p>A practical checklist to keep packaging and labeling conversations grounded.</p></div><div className="guidance-seal"><ShieldCheck size={25} /><span><b>Guidance</b><small>Verification required</small></span></div></div><div className="guidance-layout"><div className="guidance-main"><div className="guidance-banner"><FileCheck2 size={22} /><div><b>Decision-support guidance, not certification.</b><p>Use this view to prepare your packaging review. Final compliance should be verified against applicable regulations, standards and testing requirements.</p></div></div><div className="checklist-card"><div className="checklist-head"><div><span className="section-kicker">PACKAGED FOOD</span><h2>Labeling checklist</h2></div><span>10 items</span></div><div className="checklist-grid">{packaged.map(item => <div key={item}><Check size={15} /> {item}</div>)}</div></div><div className="checklist-card"><div className="checklist-head"><div><span className="section-kicker">FRESH PRODUCE</span><h2>Food-contact & handling</h2></div><span>4 areas</span></div><div className="checklist-grid two">{['Food-contact packaging guidance', 'Food safety & hygiene', 'Storage conditions', 'Transport conditions'].map(item => <div key={item}><Check size={15} /> {item}</div>)}</div></div></div><aside className="guidance-aside"><h3>Review before launch</h3><p>Packaging suitability depends on the food, intended use, contact conditions and actual manufacturing process.</p>{['Food-contact suitability', 'Labeling completeness', 'Shelf-life validation', 'Transport & storage'].map((x, i) => <div className="review-item" key={x}><span>0{i + 1}</span><b>{x}</b><ChevronRight size={15} /></div>)}<div className="aside-quote">"Make the verification step visible early — it is part of a better recommendation."</div></aside></div></div>; }
function ComparisonView() { const [product, setProduct] = useState<ProductId>('chips'); const chipRows = [['LDPE', 'Low', 'Low', 'Medium', 'Excellent', 'Medium', 'Low', 'Partial'], ['PET / PE', 'Low', 'Medium', 'High', 'High', 'Medium', 'Medium', 'Good'], ['Metallized PET / PE', 'Very Low', 'Very Low', 'High', 'High', 'Low', 'Medium', 'Best fit']]; const mangoRows = [['Standard film', 'High', 'Medium', 'Medium', 'High', 'Medium', 'Low', 'Partial'], ['Breathable film', 'Controlled', 'Medium', 'Medium–High', 'Medium–High', 'Medium', 'Medium', 'Good'], ['Micro-perforated film', 'Controlled', 'Moderate', 'Medium–High', 'Medium–High', 'Medium', 'Medium', 'Best fit']]; const rows = product === 'chips' ? chipRows : mangoRows; return <div className="page-content comparison-page"><div className="page-intro"><div><span className="section-kicker">DECISION VIEW</span><h1>Compare the pathways.</h1><p>See how the recommendation balances protection, practicality and sustainability.</p></div><div className="segmented"><button className={product === 'chips' ? 'active' : ''} onClick={() => setProduct('chips')}>Potato Chips</button><button className={product === 'mango' ? 'active' : ''} onClick={() => setProduct('mango')}>Fresh Mango</button></div></div><div className="comparison-card"><div className="comparison-card-head"><div><h2>{product === 'chips' ? 'Barrier materials for potato chips' : 'Freshness pathways for mango'}</h2><p>Comparison for validation · best-fit pathway highlighted</p></div><span className="legend"><i /> Recommended</span></div><div className="comparison-table"><div className="comparison-row header"><span>Material</span><span>OTR</span><span>WVTR</span><span>Strength</span><span>Sealability</span><span>Sustainability</span><span>Cost</span><span>Compatibility</span></div>{rows.map((row, index) => <div className={`comparison-row ${index === 2 ? 'recommended' : ''}`} key={row[0]}>{row.map((cell, i) => i === 0 ? <span className="comparison-material" key={cell}>{index === 2 && <Check size={14} />}{cell}</span> : <span key={cell}>{cell}</span>)}</div>)}</div></div><div className="comparison-insight"><Sparkles size={19} /><div><b>What changes the decision?</b><span>{product === 'chips' ? 'For chips, oxygen and moisture protection dominate because fat oxidation and crispness loss are the main risks.' : 'For mango, packaging must breathe. Controlled gas exchange is more important than simply maximizing barrier performance.'}</span></div></div></div>; }
function HistoryView({ items, loadProfile }: { items: HistoryItem[]; loadProfile: (id: ProductId) => void }) { return <div className="page-content history-page"><div className="page-intro"><div><span className="section-kicker">DECISION TRAIL</span><h1>Recommendation history.</h1><p>Your latest analyses, ready to revisit.</p></div><div className="history-total"><strong>{items.length}</strong><span>saved analyses</span></div></div><div className="history-card"><div className="history-head"><h2>Recent analyses</h2><span>Most recent first</span></div><div className="history-table"><div className="history-row header"><span>Product</span><span>Date</span><span>Recommended material</span><span>Score</span><span>Storage</span><span>Status</span><span /></div>{items.map(item => <div className="history-row" key={item.id}><span className="history-product"><span className={`history-icon ${item.product.includes('Mango') ? 'mango' : 'chips'}`}>{item.product.includes('Mango') ? '🥭' : '◒'}</span><b>{item.product}</b></span><span>{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span><span>{item.recommended_material}</span><span><b className="score-text">{item.score}</b> /100</span><span>{item.storage}</span><span><span className="status-pill compact"><Check size={11} /> {item.status}</span></span><button className="row-action" onClick={() => loadProfile(item.product.includes('Mango') ? 'mango' : 'chips')}><ArrowRight size={15} /></button></div>)}</div>{!items.length && <div className="empty-history"><History size={25} /><b>No recommendations yet.</b><span>Run an analysis to start your decision trail.</span></div>}</div></div>; }
function AboutView() { return <div className="page-content about-page"><div className="about-hero"><span className="section-kicker">ABOUT</span><h1>Packaging intelligence,<br /><em>made explainable.</em></h1><p>PackIntel AI is a decision-support system built around one clear idea: better packaging decisions happen when product properties, barrier science and sustainability are viewed together.</p><button className="primary-button" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>Explore the approach <ArrowRight size={17} /></button></div><div className="about-grid"><div className="about-card"><BrainCircuit size={22} /><h3>Rules before black boxes</h3><p>The recommendation engine uses deterministic compatibility rules so every recommendation can be inspected, explained and improved.</p></div><div className="about-card"><Leaf size={22} /><h3>Protection with perspective</h3><p>High barrier is not automatically the best answer. Alternative pathways keep material use and sustainability in the conversation.</p></div><div className="about-card"><ShieldCheck size={22} /><h3>Guidance, not approval</h3><p>FSSAI context is included to help teams prepare reviews. Compliance and performance remain verification steps.</p></div></div><div className="about-method"><span className="section-kicker">ARCHITECTURE</span><h2>Ready for the next layer of intelligence.</h2><div className="method-flow">{['Structured food profile', 'Compatibility rules', 'Material score', 'Explainable output', 'Validation workflow'].map((x, i) => <div key={x}><span>0{i + 1}</span><b>{x}</b>{i < 4 && <ArrowRight size={16} />}</div>)}</div></div></div>; }

export default App;
