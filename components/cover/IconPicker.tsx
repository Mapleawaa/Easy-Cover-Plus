'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Loader2, Star, Trash2 } from 'lucide-react';
import { useIconFavorites } from '@/store/useIconFavorites';

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Provider = 'iconify' | 'simple-icons' | 'lobehub';

const PROVIDER_LABELS: Record<Provider, string> = {
  'iconify': '全部',
  'simple-icons': 'Simple Icons',
  'lobehub': 'LobeHub Icons',
};

const LOBEHUB_CDN = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons';

const lobehubIcons = [
  { label: 'OpenAI', key: 'openai' },
  { label: 'Claude', key: 'claude' },
  { label: 'Anthropic', key: 'anthropic' },
  { label: 'Google', key: 'google' },
  { label: 'Gemini', key: 'gemini' },
  { label: 'DeepSeek', key: 'deepseek' },
  { label: 'Meta', key: 'meta' },
  { label: 'Llama', key: 'llama' },
  { label: 'Mistral', key: 'mistral' },
  { label: 'Perplexity', key: 'perplexity' },
  { label: 'Cohere', key: 'cohere' },
  { label: 'AWS', key: 'aws' },
  { label: 'Azure', key: 'azure' },
  { label: 'Microsoft', key: 'microsoft' },
  { label: 'Alibaba Cloud', key: 'alibabacloud' },
  { label: 'ByteDance', key: 'bytedance' },
  { label: 'LobeHub', key: 'lobehub' },
  { label: 'GitHub', key: 'github' },
  { label: 'Zhipu', key: 'zhipu' },
  { label: 'HuggingFace', key: 'huggingface' },
];

const providerFeatured: Record<Exclude<Provider, 'lobehub'>, string[]> = {
  iconify: [
    'logos:react', 'logos:nextjs-icon', 'logos:typescript-icon', 'logos:tailwindcss-icon',
    'logos:github-icon', 'logos:twitter', 'logos:google-icon', 'logos:apple',
    'ph:star-fill', 'ph:heart-fill', 'ph:check-circle-fill', 'ph:warning-fill',
    'mdi:home', 'mdi:account', 'mdi:cog', 'mdi:bell',
  ],
  'simple-icons': [
    'simple-icons:vercel', 'simple-icons:shadcnui', 'simple-icons:vuedotjs',
    'simple-icons:angular', 'simple-icons:svelte', 'simple-icons:nuxtdotjs',
    'simple-icons:javascript', 'simple-icons:typescript', 'simple-icons:python',
    'simple-icons:rust', 'simple-icons:go', 'simple-icons:docker',
    'simple-icons:gitlab', 'simple-icons:visualstudiocode', 'simple-icons:figma',
    'simple-icons:notion', 'simple-icons:netlify', 'simple-icons:supabase',
    'simple-icons:cloudflare', 'simple-icons:stripe',
  ],
};

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  onSelectUrl?: (url: string) => void;
}

export function IconPicker({ value, onChange, onSelectUrl }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<Provider>('iconify');
  const [query, setQuery] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { favorites, toggleFavorite, clearFavorites } = useIconFavorites();

  const debouncedQuery = useDebounceValue(query, 500);

  const searchIcons = useCallback(async (q: string, p: Provider) => {
    if (!q) {
      setIcons(providerFeatured[p as keyof typeof providerFeatured] || []);
      return;
    }
    setLoading(true);
    try {
      let url = `https://api.iconify.design/search?query=${encodeURIComponent(q)}&limit=50`;
      if (p === 'simple-icons') url += '&collection=simple-icons';
      const res = await fetch(url);
      const data = await res.json();
      setIcons(data.icons || []);
    } catch (error) {
      console.error('Failed to fetch icons:', error);
      setIcons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (provider === 'lobehub') return;
    searchIcons(debouncedQuery, provider);
  }, [debouncedQuery, provider, searchIcons]);

  useEffect(() => {
    if (provider !== 'lobehub') setIcons(providerFeatured[provider as keyof typeof providerFeatured] || []);
  }, [provider]);

  const filteredLobehub = query
    ? lobehubIcons.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()) || i.key.includes(query.toLowerCase()))
    : lobehubIcons;

  const IconItem = ({ iconName }: { iconName: string }) => {
    const isFav = favorites.includes(iconName);
    return (
      <button
        key={iconName}
        className={`p-2 rounded-md hover:bg-accent flex items-center justify-center transition-colors aspect-square relative group ${value === iconName ? 'bg-accent ring-2 ring-primary' : ''}`}
        onClick={() => {
          onChange(iconName);
          setOpen(false);
        }}
        title={iconName}
      >
        <Icon icon={iconName} className="w-6 h-6" />
        <span
          role="button"
          className={`absolute top-0.5 right-0.5 p-0.5 rounded-full transition-opacity cursor-pointer ${isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(iconName); }}
          title={isFav ? '取消收藏' : '收藏'}
        >
          <Star className={`w-3 h-3 ${isFav ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
        </span>
      </button>
    );
  };

  const LobehubItem = ({ icon }: { icon: typeof lobehubIcons[number] }) => {
    const url = `${LOBEHUB_CDN}/${icon.key}-color.svg`;
    return (
      <button
        key={icon.key}
        className="p-1 rounded-md hover:bg-accent flex flex-col items-center justify-center transition-colors aspect-square relative group"
        onClick={() => {
          onSelectUrl?.(url);
          setOpen(false);
        }}
        title={icon.label}
      >
        <img src={url} alt={icon.label} className="w-6 h-6 object-contain" />
        <span className="text-[8px] text-muted-foreground truncate w-full text-center mt-0.5 leading-tight">{icon.label}</span>
      </button>
    );
  };

  // Favorites filtering
  const favIcons = favorites.filter((f) =>
    provider === 'lobehub' ? false : !((providerFeatured[provider as keyof typeof providerFeatured] || []).includes(f))
  );
  const displayIcons = query
    ? icons
    : [...favIcons, ...(providerFeatured[provider as keyof typeof providerFeatured] || [])];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal px-3">
          <div className="flex items-center gap-2 overflow-hidden">
             <Icon icon={value} className="w-5 h-5 flex-shrink-0" />
             <span className="truncate">{value || "选择图标..."}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        {/* Provider tabs */}
        <div className="flex border-b">
          {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
            <button
              key={p}
              className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                provider === p ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => { setProvider(p); setQuery(''); }}
            >
              {PROVIDER_LABELS[p]}
            </button>
          ))}
        </div>

        {provider === 'lobehub' ? (
          <>
            <div className="p-3 pb-0">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索 AI 图标..."
                  className="pl-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[300px] p-3">
              {filteredLobehub.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {filteredLobehub.map((icon) => <LobehubItem key={icon.key} icon={icon} />)}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">未找到图标</div>
              )}
            </ScrollArea>
          </>
        ) : (
          <>
            <div className="p-3 pb-0">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`搜索${PROVIDER_LABELS[provider]}图标...`}
                  className="pl-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[300px] p-3">
              {loading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />加载中...
                </div>
              ) : displayIcons.length > 0 ? (
                <>
                  {!query && favIcons.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">我的收藏 ({favorites.length})</span>
                        <button
                          className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5 transition-colors"
                          onClick={clearFavorites}
                        >
                          <Trash2 className="w-3 h-3" />清空
                        </button>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {favIcons.map((iconName) => <IconItem key={iconName} iconName={iconName} />)}
                      </div>
                    </div>
                  )}
                  {!query && favIcons.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-muted-foreground">推荐图标</span>
                    </div>
                  )}
                  <div className="grid grid-cols-5 gap-2">
                    {(query ? displayIcons : displayIcons.filter(i => !favorites.includes(i))).map((iconName) => (
                      <IconItem key={iconName} iconName={iconName} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">未找到图标</div>
              )}
            </ScrollArea>
          </>
        )}
        <div className="p-2 border-t text-xs text-center text-muted-foreground bg-muted/50">
          {provider === 'lobehub' ? '@lobehub/icons' : 'Powered by Iconify'}
        </div>
      </PopoverContent>
    </Popover>
  );
}
