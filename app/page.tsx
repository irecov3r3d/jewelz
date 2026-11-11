"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, BrainCircuit, Activity } from "lucide-react";
import { motion } from "framer-motion";

// ⚡ Bolt: Memoized ThoughtItem to prevent O(N) re-renders on keystrokes
// Expected impact: Typing in the objective input will no longer re-render the entire thought history
const ThoughtItem = React.memo(({ thought }: { thought: { id: number; text: string; time: string } }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="border-l-2 border-[#FDE047] pl-3 py-1"
  >
    <span className="text-xs text-gray-500 block mb-1">{thought.time}</span>
    <p className="text-sm text-gray-300">{thought.text}</p>
  </motion.div>
));
ThoughtItem.displayName = "ThoughtItem";

// ⚡ Bolt: Memoized TerminalLine to prevent O(N) re-renders on keystrokes
// Expected impact: Typing in the objective input will no longer re-render the entire terminal history
const TerminalLine = React.memo(({ line }: { line: string }) => (
  <div className="mb-1 leading-relaxed break-all">
    <span className="text-gray-500 mr-2">$</span>
    {line}
  </div>
));
TerminalLine.displayName = "TerminalLine";

export default function Home() {
  const [thoughts, setThoughts] = useState<{ id: number; text: string; time: string }[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [objective, setObjective] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const startAgent = () => {
    if (!objective) return;

    // Initial mock data to demonstrate UI
    const now = new Date().toLocaleTimeString();
    setThoughts(prev => [...prev, { id: Date.now(), text: `Objective set: ${objective}`, time: now }]);
    setTerminalOutput(prev => [...prev, `[${now}] Starting Jewelz Agent...`]);
    setObjective("");
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 p-6 flex flex-col font-mono">
      <header className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
        <BrainCircuit className="text-[#FDE047] w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-wider text-white">JEWELZ <span className="text-[#FDE047] text-sm font-normal">v1.0</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Column: Thought Stream & Controls */}
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">

          {/* Controls */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-[#FDE047] text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
               <Activity className="w-4 h-4" /> Mission Control
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter new objective..."
                className="flex-1 bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FDE047] transition-colors"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startAgent()}
              />
              <button
                onClick={startAgent}
                className="bg-[#FDE047] text-gray-950 px-4 py-2 rounded font-bold text-sm hover:bg-yellow-300 transition-colors"
              >
                EXECUTE
              </button>
            </div>
          </div>

          {/* Thought Stream */}
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
             <div className="bg-gray-950 p-3 border-b border-gray-800">
                <h2 className="text-[#FDE047] text-sm uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> Thought Stream
                </h2>
             </div>
             <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {thoughts.length === 0 ? (
                  <div className="text-gray-600 text-sm italic text-center mt-10">Awaiting input...</div>
                ) : (
                  thoughts.map((thought) => (
                    <ThoughtItem key={thought.id} thought={thought} />
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Terminal */}
        <div className="bg-black border border-gray-800 rounded-lg flex flex-col h-[calc(100vh-140px)] overflow-hidden">
          <div className="bg-gray-950 p-3 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-[#FDE047] text-sm uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Shell Activity
            </h2>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-sm text-green-400">
            {terminalOutput.length === 0 ? (
               <div className="text-gray-600 italic">Terminal ready.</div>
            ) : (
              terminalOutput.map((line, i) => (
                <TerminalLine key={i} line={line} />
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
