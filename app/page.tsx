'use client';

import { TopBar, default as Panel, useExport } from "@/components/cover/Controls";
import Canvas from "@/components/cover/Canvas";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  const handleExport = useExport();

  return (
<<<<<<< HEAD
    <main className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <TopBar onExport={handleExport} />
      <div className="flex-1 min-h-0 flex">
        <aside className="w-72 flex-shrink-0 border-r border-border overflow-hidden">
          <Panel />
        </aside>
        <div className="flex-1 min-h-0 min-w-0">
          <Canvas />
        </div>
      </div>
=======
    <main className="flex flex-col-reverse md:flex-row h-screen w-full bg-background overflow-hidden">
      <ClientOnly>
        <Controls />
        <Canvas />
      </ClientOnly>
>>>>>>> 2e58f94e5e89f2b4d0b5d99323425c1d294d2841
    </main>
  );
}
