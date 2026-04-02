'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useCoverStore, RATIOS, AspectRatio } from '@/store/useCoverStore';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconPicker } from '@/components/cover/IconPicker';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Download, RotateCcw, Maximize, Github, ExternalLink, Upload, Sun, Moon, Monitor, ChevronRight, Palette, Type, Image, Move, Layers, Sparkles, FileText, Square, Zap, Rainbow, Gem } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useSettingsStore, Theme } from '@/store/useSettingsStore';

// ─── Preset Templates ────────────────────────────────────────────
const PRESETS = [
  {
    name: '默认',
    Icon: Palette,
    config: {},
  },
  {
    name: '技术博客',
    Icon: FileText,
    config: {
      selectedRatios: ['16:9'] as AspectRatio[],
      text: { content: '技术博客', font: 'Inter, sans-serif', fontSize: 140, fontWeight: 700, color: '#ffffff', strokeWidth: 0 },
      icon: { name: 'logos:react', size: 100, bgShape: 'rounded-square' as const, bgColor: '#1e293b', padding: 32, radius: 32, shadow: true, bgOpacity: 0.9 },
      background: { type: 'solid' as const, color: '#0f172a' },
    },
  },
  {
    name: '极简白',
    Icon: Square,
    config: {
      selectedRatios: ['1:1'] as AspectRatio[],
      showIcon: false,
      text: { content: 'MINIMAL', font: 'Inter, sans-serif', fontSize: 180, fontWeight: 100, color: '#111111', strokeWidth: 0 },
      icon: { name: '', shadow: false, bgShape: 'none' as const },
      background: { type: 'solid' as const, color: '#ffffff' },
    },
  },
  {
    name: '高对比',
    Icon: Zap,
    config: {
      selectedRatios: ['16:9'] as AspectRatio[],
      text: { content: 'HIGH CONTRAST', font: 'Geist Sans, sans-serif', fontSize: 150, fontWeight: 900, color: '#facc15', strokeWidth: 0 },
      icon: { size: 100, color: '#facc15', bgShape: 'none' as const, shadow: false },
      background: { type: 'solid' as const, color: '#000000' },
    },
  },
  {
    name: '渐变',
    Icon: Rainbow,
    config: {
      selectedRatios: ['16:9'] as AspectRatio[],
      text: { content: 'Gradient', font: 'Inter, sans-serif', fontSize: 160, fontWeight: 700, color: '#ffffff', strokeWidth: 0 },
      icon: { bgShape: 'circle' as const, bgColor: 'rgba(255,255,255,0.2)', bgOpacity: 0.6, shadow: false },
      background: { type: 'solid' as const, color: '#7c3aed' },
    },
  },
  {
    name: '毛玻璃',
    Icon: Gem,
    config: {
      selectedRatios: ['16:9'] as AspectRatio[],
      text: { content: 'Glassmorphism', font: 'Inter, sans-serif', fontSize: 120, fontWeight: 600, color: '#1e293b', strokeWidth: 0 },
      icon: { bgShape: 'rounded-square' as const, bgColor: 'rgba(255,255,255,0.4)', bgOpacity: 0.4, bgBlur: 12, padding: 48, radius: 48, shadow: true, shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.1)', shadowOffsetY: 8 },
      background: { type: 'solid' as const, color: '#e2e8f0' },
    },
  },
];

// ─── Fonts & Weights ─────────────────────────────────────────────
const FONTS = [
  { name: 'Inter (默认)', value: 'Inter, sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'MiSans', value: 'MiSans, sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'HarmonyOS Sans', value: '"HarmonyOS Sans", sans-serif', weights: [100, 400, 700] },
  { name: '得意黑 (Smiley Sans)', value: 'SmileySans, sans-serif', weights: [400] },
  { name: 'OPPO Sans', value: 'OPPOSans, sans-serif', weights: [400] },
  { name: 'Geist Sans', value: 'var(--font-geist-sans), sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'Arial', value: 'Arial, sans-serif', weights: [400, 700] },
  { name: '微软雅黑', value: '"Microsoft YaHei", sans-serif', weights: [300, 400, 700] },
  { name: '黑体', value: 'SimHei, sans-serif', weights: [400] },
  { name: 'Times New Roman', value: '"Times New Roman", serif', weights: [400, 700] },
  { name: '楷体', value: 'KaiTi, serif', weights: [400] },
  { name: '霞鹜文楷', value: '"LXGW WenKai", sans-serif', weights: [300, 400, 700] },
  { name: '霞鹜文楷 Light', value: '"LXGW WenKai Light", sans-serif', weights: [300] },
  { name: '霞鹜文楷 Bold', value: '"LXGW WenKai Bold", sans-serif', weights: [700] },
  { name: '霞鹜文楷 Mono', value: '"LXGW WenKai Mono", monospace', weights: [300, 400, 700] },
  { name: 'Geist Mono', value: 'var(--font-geist-mono), monospace', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace', weights: [400, 700, 800] },
  { name: 'JetBrains Mono Italic', value: '"JetBrains Mono", monospace', weights: [400], italic: true },
  { name: 'Courier New', value: '"Courier New", monospace', weights: [400, 700] },
];

const WEIGHTS: Record<number, string> = {
  100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
  500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black',
};

const SPLIT_PRESETS = [
  { name: '默认', left: { x: 0, y: 0 }, right: { x: 0, y: 0 } },
  { name: '上下错位', left: { x: 0, y: -40 }, right: { x: 0, y: 40 } },
  { name: '左右分离', left: { x: -60, y: 0 }, right: { x: 60, y: 0 } },
  { name: '对角分离', left: { x: -40, y: -40 }, right: { x: 40, y: 40 } },
];

// ─── Shared micro-components ─────────────────────────────────────
const ResetButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="ghost" size="icon" className="h-5 w-5 ml-0.5 shrink-0" onClick={onClick} title="重置">
    <RotateCcw className="h-2.5 w-2.5" />
  </Button>
);

// SliderRow with inline editable value
function SliderRow({ label, value, onChange, min, max, step = 1, reset, unit }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; reset?: () => void; unit?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [value, editing]);

  const commit = useCallback((raw: string) => {
    const n = parseFloat(raw);
    if (!isNaN(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
    }
    setDraft(String(value));
    setEditing(false);
  }, [value, onChange, min, max]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs text-muted-foreground truncate">{label}</Label>
        <div className="flex items-center gap-0.5 shrink-0">
          {editing ? (
            <input
              className="w-14 h-5 text-[10px] text-right tabular-nums bg-background border border-input rounded px-1 outline-none focus:ring-1 focus:ring-ring"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => commit(draft)}
              onKeyDown={(e) => { if (e.key === 'Enter') commit(draft); if (e.key === 'Escape') { setDraft(String(value)); setEditing(false); } }}
            />
          ) : (
            <button
              className="text-[10px] text-muted-foreground hover:text-foreground tabular-nums px-1 py-0.5 rounded hover:bg-muted/50 transition-colors cursor-text min-w-[2rem] text-right"
              onClick={() => setEditing(true)}
            >
              {step < 1 ? (Math.round(value * 100) / 100) : value}{unit}
            </button>
          )}
          {reset && <ResetButton onClick={reset} />}
        </div>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

// ─── Collapsible Section ─────────────────────────────────────────
function Section({ icon: Icon, title, defaultOpen = true, children }: {
  icon: React.ElementType; title: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <CollapsibleTrigger className="w-full group flex items-center justify-between py-0.5">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium tracking-wide">{title}</span>
        </div>
        <span className="text-muted-foreground group-data-[state=open]:rotate-90 transition-transform">
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2.5 pl-0.5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Theme Toggle ────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => root.classList.toggle('dark', (theme === 'system' ? mq.matches : theme) === 'dark');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
  const cycle = () => setTheme((theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light') as Theme);
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? '亮色' : theme === 'dark' ? '暗色' : '跟随系统';
  return <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cycle} title={label}><Icon className="h-4 w-4" /></Button>;
}

// ─── Export ──────────────────────────────────────────────────────
export function useExport() {
  const store = useCoverStore();
  return useCallback(async (transparent: boolean, scale: number, format: 'png' | 'svg') => {
    const node = document.getElementById('canvas-export-target');
    if (!node) return;
    const filter = (n: Node) => {
      if (n.classList?.contains('export-exclude')) return false;
      if (transparent && n.classList?.contains('canvas-bg-layer')) return false;
      return true;
    };
    try {
      if (format === 'svg') {
        const { toSvg } = await import('html-to-image');
        const dataUrl = await toSvg(node as HTMLElement, { pixelRatio: scale, filter, skipFonts: true });
        const link = document.createElement('a');
        link.download = 'easy-cover.svg';
        link.href = dataUrl;
        link.click();
      } else {
        const dataUrl = await toPng(node as HTMLElement, { quality: 0.95, pixelRatio: scale, skipFonts: true, filter });
        const link = document.createElement('a');
        link.download = 'easy-cover.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) { console.error('Export failed', err); }
  }, []);
}

// ─── Export Dialog ───────────────────────────────────────────────
function ExportDialog({ open, onOpenChange, onExport }: {
  open: boolean; onOpenChange: (v: boolean) => void; onExport: (transparent: boolean, scale: number, format: 'png' | 'svg') => Promise<void>;
}) {
  const store = useCoverStore();
  const [transparent, setTransparent] = useState(false);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try { await onExport(transparent, scale, format); onOpenChange(false); }
    finally { setExporting(false); }
  };

  const scaleOptions = [
    { value: 1, label: '1x', desc: '标准' },
    { value: 2, label: '2x', desc: '高清 (推荐)' },
    { value: 3, label: '3x', desc: '超清' },
    { value: 4, label: '4x', desc: '极致' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 gap-5">
        <DialogHeader>
          <DialogTitle className="text-base">导出封面图</DialogTitle>
          <DialogDescription className="text-xs">选择导出参数后点击导出</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">格式</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['png', 'svg'] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`flex items-center justify-center gap-2 h-9 rounded-md border text-xs font-medium transition-colors ${format === f ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted/50'}`}>
                  {f === 'png' ? 'PNG' : 'SVG'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {format === 'png' ? '位图格式，适合直接使用' : '矢量格式，适合二次编辑（图标可能无法嵌入）'}
            </p>
          </div>

          {/* Scale */}
          {format === 'png' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">分辨率</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {scaleOptions.map((s) => (
                  <button key={s.value} onClick={() => setScale(s.value)}
                    className={`flex flex-col items-center py-2 rounded-md border text-[10px] transition-colors ${scale === s.value ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted/50'}`}>
                    <span className="text-xs font-semibold">{s.label}</span>
                    <span className="text-[9px] text-muted-foreground">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transparent */}
          <div className="flex items-center justify-between py-1">
            <div>
              <Label className="text-xs font-medium">透明背景</Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">移除背景色，仅保留内容</p>
            </div>
            <Switch checked={transparent} onCheckedChange={setTransparent} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="h-8 text-xs" onClick={() => onOpenChange(false)}>取消</Button>
          <Button className="h-8 text-xs" onClick={handleExport} disabled={exporting}>
            {exporting ? '导出中...' : <><Download className="w-3.5 h-3.5 mr-1.5" />导出 {format.toUpperCase()}{format === 'png' ? ` ${scale}x` : ''}</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Top Bar (exported for full-width use) ───────────────────────
export function TopBar({ onExport }: { onExport: (transparent: boolean, scale: number, format: 'png' | 'svg') => Promise<void> }) {
  const store = useCoverStore();
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-0.5 whitespace-nowrap">
            <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0" aria-hidden="true">
              <rect x="1" y="1" width="18" height="18" rx="4" fill="currentColor" opacity="0.15" />
              <rect x="3" y="5" width="6" height="2.5" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="3" y="9.5" width="10" height="2.5" rx="1" fill="currentColor" opacity="0.8" />
              <rect x="3" y="14" width="14" height="2.5" rx="1" fill="currentColor" />
            </svg>
            <h1 className="text-sm font-bold">EasyCover</h1>
            <svg width="22" height="22" viewBox="0 0 22 22" className="shrink-0" aria-hidden="true">
              <defs>
                <linearGradient id="rgb-cycle" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%">
                    <animate attributeName="stop-color" values="#f43f5e;#f97316;#eab308;#22c55e;#3b82f6;#a855f7;#ec4899;#f43f5e" dur="2.5s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%">
                    <animate attributeName="stop-color" values="#3b82f6;#a855f7;#ec4899;#f43f5e;#f97316;#eab308;#22c55e;#3b82f6" dur="2.5s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%">
                    <animate attributeName="stop-color" values="#22c55e;#3b82f6;#a855f7;#ec4899;#f43f5e;#f97316;#eab308;#22c55e" dur="2.5s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                <filter id="plus-glow">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <text x="1" y="18" fill="url(#rgb-cycle)" fontWeight="900" fontSize="22" fontFamily="system-ui, sans-serif" filter="url(#plus-glow)">+</text>
            </svg>
          </div>
          <div className="h-4 w-px bg-border shrink-0" />
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {PRESETS.map((p) => (
              <Button key={p.name} variant="ghost" size="sm"
                className="h-7 px-2 text-xs gap-1 shrink-0"
                onClick={() => store.applyPreset(p.config)}>
                <p.Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{p.name}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <ThemeToggle />
          <Button size="sm" className="h-7 px-3 text-xs" onClick={() => setExportOpen(true)}>
            <Download className="w-3.5 h-3.5 mr-1" />导出
          </Button>
        </div>
      </header>
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} onExport={onExport} />
    </>
  );
}

// ─── Left Panel Content ──────────────────────────────────────────
export default function Panel() {
  const store = useCoverStore();
  const [activeTab, setActiveTab] = useState('picker');
  const [syncOffsets, setSyncOffsets] = useState(true);

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) store.updateBackground({ imageUrl: URL.createObjectURL(file), type: 'image' });
  };

  // Clipboard paste
  useEffect(() => {
    const handle = (e: ClipboardEvent) => {
      for (let i = 0; i < (e.clipboardData?.items.length ?? 0); i++) {
        const item = e.clipboardData!.items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) store.updateBackground({ imageUrl: URL.createObjectURL(file), type: 'image' });
          return;
        }
      }
    };
    document.addEventListener('paste', handle);
    return () => document.removeEventListener('paste', handle);
  }, []);

  // Font upload
  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fontName = `CustomFont_${Date.now()}`;
        const url = URL.createObjectURL(file);
        const font = new FontFace(fontName, `url(${url})`);
        await font.load();
        document.fonts.add(font);
        store.updateText({ font: fontName });
      } catch { alert('字体加载失败'); }
    }
  };

  // Icon upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) store.updateIcon({ customIconUrl: URL.createObjectURL(file) });
  };

  // Fit mode
  const handleFit = (mode: 'contain' | 'cover') => {
    const updates: any = { positionX: 50, positionY: 50, rotation: 0 };
    if (mode === 'contain') { updates.scale = 1; }
    else {
      const activeRatios = RATIOS.filter((r) => store.selectedRatios.includes(r.label));
      if (activeRatios.length > 0 && store.background.imageUrl) {
        const maxW = Math.max(...activeRatios.map(r => r.width));
        const maxH = Math.max(...activeRatios.map(r => r.height));
        const img = new Image(); img.src = store.background.imageUrl;
        img.onload = () => {
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const canvasRatio = maxW / maxH;
          store.updateBackground({ ...updates, scale: imgRatio > canvasRatio ? maxW / img.naturalWidth : maxH / img.naturalHeight });
        };
        return;
      }
      updates.scale = 1;
    }
    store.updateBackground(updates);
  };

  // Split offset helpers
  const handleLeftOffset = (axis: 'x' | 'y', val: number) => {
    const updates: any = { [axis === 'x' ? 'leftOffsetX' : 'leftOffsetY']: val };
    if (syncOffsets) updates[axis === 'x' ? 'rightOffsetX' : 'rightOffsetY'] = -val;
    store.updateText(updates);
  };
  const handleRightOffset = (axis: 'x' | 'y', val: number) => {
    const updates: any = { [axis === 'x' ? 'rightOffsetX' : 'rightOffsetY']: val };
    if (syncOffsets) updates[axis === 'x' ? 'leftOffsetX' : 'leftOffsetY'] = -val;
    store.updateText(updates);
  };

  const currentFont = FONTS.find(f => f.value === store.text.font);
  const availableWeights = currentFont?.weights || [100, 200, 300, 400, 500, 600, 700, 800, 900];

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">

        {/* ═══════ 1. 基础 ═══════ */}
        <Section icon={Layers} title="基础">
          <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
            {RATIOS.map((r) => (
              <div key={r.label} className="flex items-center space-x-1.5">
                <Checkbox id={`ratio-${r.label}`} checked={store.selectedRatios.includes(r.label)} onCheckedChange={() => store.toggleRatio(r.label)} className="scale-75" />
                <label htmlFor={`ratio-${r.label}`} className="text-[11px] leading-none cursor-pointer">{r.label}</label>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-ruler" className="text-xs">标尺</Label>
            <Switch id="show-ruler" checked={store.showRuler} onCheckedChange={store.setShowRuler} />
          </div>

          <Separator />

          {/* Background */}
          <Tabs defaultValue={store.background.type} onValueChange={(v) => store.updateBackground({ type: v as 'solid' | 'image' })}>
            <TabsList className="grid w-full grid-cols-2 h-7">
              <TabsTrigger value="solid" className="text-xs">纯色</TabsTrigger>
              <TabsTrigger value="image" className="text-xs">图片</TabsTrigger>
            </TabsList>
            <TabsContent value="solid" className="mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">背景</Label>
                <ColorPicker color={store.background.color} onChange={(c) => store.updateBackground({ color: c })} />
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-2 space-y-2">
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
              <p className="text-[10px] text-muted-foreground text-center">Ctrl+V 粘贴</p>
              {store.background.imageUrl && (
                <>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px]" onClick={() => handleFit('contain')}><Maximize className="w-3 h-3 mr-1" />适应</Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px]" onClick={() => handleFit('cover')}><Maximize className="w-3 h-3 mr-1 rotate-90" />铺满</Button>
                  </div>
                  <SliderRow label="缩放" value={store.background.scale} onChange={(v) => store.updateBackground({ scale: v })} min={0.1} max={10} step={0.1} reset={() => store.updateBackground({ scale: 1 })} unit="x" />
                </>
              )}
            </TabsContent>
          </Tabs>
        </Section>

        <Separator />

        {/* ═══════ 2. 内容 ═══════ */}
        <Section icon={Type} title="内容">
          {/* Text */}
          <div className="space-y-2">
            <Input value={store.text.content} onChange={(e) => store.updateText({ content: e.target.value })} placeholder="输入文本..." className="text-sm h-8" />

            <div className="flex gap-1.5">
              <Select value={store.text.font.startsWith('CustomFont') ? 'custom' : store.text.font + '|' + store.text.fontStyle} onValueChange={(v) => {
                if (v !== 'custom') {
                  const [f, s] = v.split('|');
                  store.updateText({ font: f, fontStyle: (s || 'normal') as 'normal' | 'italic' });
                }
              }}>
                <SelectTrigger className="flex-1 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem key={font.name} value={font.value + '|' + (font.italic ? 'italic' : 'normal')} style={{ fontFamily: font.value, fontStyle: font.italic ? 'italic' : undefined }}>{font.name}</SelectItem>
                  ))}
                  {store.text.font.startsWith('CustomFont') && <SelectItem value="custom">自定义字体</SelectItem>}
                </SelectContent>
              </Select>
              <Select value={String(store.text.fontWeight)} onValueChange={(v) => store.updateText({ fontWeight: parseInt(v) })}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableWeights.map(w => <SelectItem key={w} value={String(w)}>{WEIGHTS[w]}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="relative">
                <Input type="file" accept=".ttf,.otf,.woff,.woff2" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={handleFontUpload} title="上传字体" />
                <Button variant="outline" size="icon" className="w-7 h-7"><Upload className="h-3 w-3" /></Button>
              </div>
            </div>

            <SliderRow label="字号" value={store.text.fontSize} onChange={(v) => store.updateText({ fontSize: v })} min={12} max={2500} reset={() => store.updateText({ fontSize: 160 })} unit="px" />
            <div className="flex items-center justify-between">
              <Label className="text-xs">颜色</Label>
              <ColorPicker color={store.text.color} onChange={(c) => store.updateText({ color: c })} />
            </div>
          </div>

          <Separator />

          {/* Icon */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">图标</Label>
            <Switch checked={store.showIcon} onCheckedChange={store.setShowIcon} />
          </div>

          {store.showIcon && (
            <div className="space-y-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-7">
                  <TabsTrigger value="picker" className="text-[10px]">搜索</TabsTrigger>
                  <TabsTrigger value="advanced" className="text-[10px]">上传 / SVG</TabsTrigger>
                </TabsList>
                <TabsContent value="picker" className="mt-2 space-y-2">
                  <IconPicker value={store.icon.name} onChange={(v) => store.updateIcon({ name: v, customIconUrl: undefined, customSvgCode: undefined })}
                    onSelectUrl={(url) => store.updateIcon({ customIconUrl: url, name: '', customSvgCode: undefined })} />
                  <a href="https://yesicon.app/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground flex items-center hover:text-primary hover:underline">
                    查找图标名称 <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
                </TabsContent>
                <TabsContent value="advanced" className="mt-2 space-y-2">
                  <Input type="file" accept="image/*" onChange={handleIconUpload} className="text-xs h-7" />
                  {store.icon.customIconUrl && (
                    <div className="space-y-1">
                      <SliderRow label="图片圆角" value={store.icon.customIconRadius} onChange={(v) => store.updateIcon({ customIconRadius: v })} min={0} max={1000} step={5} reset={() => store.updateIcon({ customIconRadius: 0 })} unit="px" />
                      <Button variant="outline" size="sm" className="w-full text-[10px] h-6" onClick={() => store.updateIcon({ customIconUrl: undefined })}>清除</Button>
                    </div>
                  )}
                  <textarea className="flex min-h-[56px] w-full rounded-md border border-input bg-background px-2 py-1.5 text-[10px] font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                    placeholder={'<svg viewBox="0 0 24 24">...</svg>'}
                    value={store.icon.customSvgCode || ''} onChange={(e) => store.updateIcon({ customSvgCode: e.target.value || undefined, customIconUrl: undefined, name: '' })} />
                  {store.icon.customSvgCode && <Button variant="outline" size="sm" className="w-full text-[10px] h-6" onClick={() => store.updateIcon({ customSvgCode: undefined })}>清除</Button>}
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between">
                <Label className="text-xs">容器</Label>
                <Switch checked={store.icon.bgShape !== 'none'} onCheckedChange={(on) => store.updateIcon({ bgShape: on ? 'rounded-square' : 'none' })} />
              </div>

              <SliderRow label="图标大小" value={store.icon.size} onChange={(v) => store.updateIcon({ size: v })} min={20} max={2500} step={5} reset={() => store.updateIcon({ size: 120 })} unit="px" />

              {store.icon.bgShape !== 'none' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">形状</Label>
                    <Select value={store.icon.bgShape} onValueChange={(v) => store.updateIcon({ bgShape: v as any })}>
                      <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">圆形</SelectItem>
                        <SelectItem value="square">方形</SelectItem>
                        <SelectItem value="rounded-square">圆角矩形</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between"><Label className="text-xs">容器颜色</Label><ColorPicker color={store.icon.bgColor} onChange={(c) => store.updateIcon({ bgColor: c })} /></div>
                  <SliderRow label="内边距" value={store.icon.padding} onChange={(v) => store.updateIcon({ padding: v })} min={0} max={100} step={5} reset={() => store.updateIcon({ padding: 40 })} unit="px" />
                  {store.icon.bgShape === 'rounded-square' && <SliderRow label="圆角" value={store.icon.radius} onChange={(v) => store.updateIcon({ radius: v })} min={0} max={200} step={5} reset={() => store.updateIcon({ radius: 40 })} unit="px" />}
                  <SliderRow label="透明度" value={Math.round(store.icon.bgOpacity * 100)} onChange={(v) => store.updateIcon({ bgOpacity: v / 100 })} min={0} max={100} reset={() => store.updateIcon({ bgOpacity: 1 })} unit="%" />
                  <SliderRow label="模糊" value={store.icon.bgBlur} onChange={(v) => store.updateIcon({ bgBlur: v })} min={0} max={50} reset={() => store.updateIcon({ bgBlur: 0 })} unit="px" />
                  <SliderRow label={store.icon.containerSize === 0 ? "外框 (自适应)" : "外框大小"} value={store.icon.containerSize} onChange={(v) => store.updateIcon({ containerSize: v })} min={0} max={2500} step={5} reset={() => store.updateIcon({ containerSize: 0 })} unit={store.icon.containerSize === 0 ? '' : 'px'} />
                </>
              )}

              <div className="flex items-center justify-between">
                <Label className="text-xs">着色</Label>
                <ColorPicker color={store.icon.color} onChange={(c) => store.updateIcon({ color: c })} />
              </div>
            </div>
          )}
        </Section>

        <Separator />

        {/* ═══════ 3. 布局 ═══════ */}
        <Section icon={Move} title="布局">
          <SliderRow label="文字旋转" value={store.text.rotation} onChange={(v) => store.updateText({ rotation: v })} min={0} max={360} reset={() => store.updateText({ rotation: 0 })} unit="°" />

          <div className="flex items-center justify-between">
            <Label htmlFor="text-split" className="text-xs">文字分离</Label>
            <Switch id="text-split" checked={store.text.isSplit} onCheckedChange={(c) => store.updateText({ isSplit: c })} />
          </div>

          {store.text.isSplit && (
            <div className="space-y-2 p-2 bg-muted/30 rounded-lg border">
              <div className="grid grid-cols-4 gap-1">
                {SPLIT_PRESETS.map((p) => (
                  <Button key={p.name} variant="outline" size="sm" className="h-6 text-[9px] px-0.5" onClick={() => store.updateText({ leftOffsetX: p.left.x, leftOffsetY: p.left.y, rightOffsetX: p.right.x, rightOffsetY: p.right.y })}>{p.name}</Button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-offsets" className="text-[10px]">对称</Label>
                <Switch id="sync-offsets" checked={syncOffsets} onCheckedChange={setSyncOffsets} className="scale-75 origin-right" />
              </div>
              <SliderRow label="左侧 X" value={store.text.leftOffsetX} onChange={(v) => handleLeftOffset('x', v)} min={-200} max={200} />
              <SliderRow label="左侧 Y" value={store.text.leftOffsetY} onChange={(v) => handleLeftOffset('y', v)} min={-200} max={200} />
              {!syncOffsets && (
                <>
                  <SliderRow label="右侧 X" value={store.text.rightOffsetX} onChange={(v) => handleRightOffset('x', v)} min={-200} max={200} />
                  <SliderRow label="右侧 Y" value={store.text.rightOffsetY} onChange={(v) => handleRightOffset('y', v)} min={-200} max={200} />
                </>
              )}
            </div>
          )}

          {store.showIcon && (
            <>
              <Separator />
              <SliderRow label="图标 X" value={store.icon.x} onChange={(v) => store.updateIcon({ x: v })} min={-500} max={500} reset={() => store.updateIcon({ x: 0 })} unit="px" />
              <SliderRow label="图标 Y" value={store.icon.y} onChange={(v) => store.updateIcon({ y: v })} min={-500} max={500} reset={() => store.updateIcon({ y: 0 })} unit="px" />
              <SliderRow label="图标旋转" value={store.icon.rotation} onChange={(v) => store.updateIcon({ rotation: v })} min={0} max={360} reset={() => store.updateIcon({ rotation: 0 })} unit="°" />
            </>
          )}

          {store.background.type === 'image' && store.background.imageUrl && (
            <>
              <Separator />
              <SliderRow label="图片 X" value={store.background.positionX} onChange={(v) => store.updateBackground({ positionX: v })} min={-500} max={500} reset={() => store.updateBackground({ positionX: 50 })} unit="%" />
              <SliderRow label="图片 Y" value={store.background.positionY} onChange={(v) => store.updateBackground({ positionY: v })} min={-500} max={500} reset={() => store.updateBackground({ positionY: 50 })} unit="%" />
              <SliderRow label="图片旋转" value={store.background.rotation} onChange={(v) => store.updateBackground({ rotation: v })} min={0} max={360} reset={() => store.updateBackground({ rotation: 0 })} unit="°" />
            </>
          )}
        </Section>

        <Separator />

        {/* ═══════ 4. 样式 ═══════ */}
        <Section icon={Palette} title="样式" defaultOpen={false}>
          <SliderRow label="描边宽度" value={store.text.strokeWidth} onChange={(v) => store.updateText({ strokeWidth: v })} min={0} max={10} step={0.5} reset={() => store.updateText({ strokeWidth: 0 })} unit="px" />
          {store.text.strokeWidth > 0 && (
            <div className="flex items-center justify-between">
              <Label className="text-xs">描边颜色</Label>
              <ColorPicker color={store.text.strokeColor} onChange={(c) => store.updateText({ strokeColor: c })} />
            </div>
          )}

          {store.showIcon && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="icon-shadow" className="text-xs">图标阴影</Label>
                <Switch id="icon-shadow" checked={store.icon.shadow} onCheckedChange={(c) => store.updateIcon({ shadow: c })} />
              </div>
              {store.icon.shadow && (
                <div className="p-2 bg-muted/30 rounded-lg border space-y-1.5">
                  <div className="flex items-center justify-between"><Label className="text-[10px]">阴影颜色</Label><ColorPicker color={store.icon.shadowColor} onChange={(c) => store.updateIcon({ shadowColor: c })} /></div>
                  <SliderRow label="模糊" value={store.icon.shadowBlur} onChange={(v) => store.updateIcon({ shadowBlur: v })} min={0} max={100} reset={() => store.updateIcon({ shadowBlur: 6 })} unit="px" />
                  <SliderRow label="偏移" value={store.icon.shadowOffsetY} onChange={(v) => store.updateIcon({ shadowOffsetY: v })} min={-50} max={50} reset={() => store.updateIcon({ shadowOffsetY: 4 })} unit="px" />
                </div>
              )}
            </>
          )}

          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="bg-shadow" className="text-xs">背景阴影</Label>
            <Switch id="bg-shadow" checked={store.background.shadow} onCheckedChange={(c) => store.updateBackground({ shadow: c })} />
          </div>
          {store.background.shadow && (
            <div className="p-2 bg-muted/30 rounded-lg border space-y-1.5">
              <div className="flex items-center justify-between"><Label className="text-[10px]">阴影颜色</Label><ColorPicker color={store.background.shadowColor} onChange={(c) => store.updateBackground({ shadowColor: c })} /></div>
              <SliderRow label="模糊" value={store.background.shadowBlur} onChange={(v) => store.updateBackground({ shadowBlur: v })} min={0} max={200} reset={() => store.updateBackground({ shadowBlur: 30 })} unit="px" />
              <SliderRow label="偏移" value={store.background.shadowOffsetY} onChange={(v) => store.updateBackground({ shadowOffsetY: v })} min={-100} max={100} reset={() => store.updateBackground({ shadowOffsetY: 10 })} unit="px" />
            </div>
          )}

          {store.background.type === 'image' && (
            <SliderRow label="背景模糊" value={store.background.blur} onChange={(v) => store.updateBackground({ blur: v })} min={0} max={50} reset={() => store.updateBackground({ blur: 0 })} unit="px" />
          )}
        </Section>

        <Separator />

        {/* ═══════ 5. 关于 ═══════ */}
        <Section icon={Sparkles} title="关于" defaultOpen={false}>
          <div className="space-y-2 text-xs">
            <a href="https://github.com/afoim/easy_cover" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />afoim/easy_cover (原作)
            </a>
            <a href="https://github.com/mapleawaa/easy_cover" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />mapleawaa/easy_cover (Fork)
            </a>
            <div className="flex items-center gap-1.5 text-muted-foreground pt-1">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              Licensed under AGPL-3.0
            </div>
          </div>
        </Section>

      </div>
    </ScrollArea>
  );
}
