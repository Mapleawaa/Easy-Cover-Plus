'use client';

import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 h-7 px-1.5 rounded-md border border-border hover:bg-muted/50 transition-colors cursor-pointer">
          <span
            className="w-4 h-4 rounded-sm shrink-0 ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] text-muted-foreground font-mono tabular-nums max-w-[4.5rem] truncate">
            {color.length > 7 ? color.slice(0, 7) : color}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 space-y-2" align="end">
        <HexColorPicker color={color.length === 7 ? color : '#000000'} onChange={onChange} style={{ width: 200, height: 180 }} />
        <div className="flex items-center gap-1">
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-7 text-xs font-mono text-center"
          />
          <button
            className="h-7 w-7 flex items-center justify-center rounded-md border border-border hover:bg-muted/50 transition-colors shrink-0"
            onClick={handleCopy}
            title="复制颜色值"
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
