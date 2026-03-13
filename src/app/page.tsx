"use client";

import { useState } from "react";
import { optimizePrompt } from "@/lib/optimizer";
import { OptimizationResult } from "@/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    // Simulate slight delay for realistic UX
    setTimeout(() => {
      const res = optimizePrompt(input);
      setResult(res);
      setLoading(false);
    }, 500);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      alert("Prompt copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-8 font-sans text-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-[#FDE047] tracking-tight">Jules Prompt Optimizer</h1>
          <p className="mt-2 text-lg text-gray-300">Convert your ideas into precise, actionable prompts for Jules.</p>
        </header>

        <main className="bg-slate-800 shadow-xl rounded-2xl p-6 md:p-8 space-y-8 border border-slate-700">
          {/* Input Section */}
          <section>
            <form onSubmit={handleOptimize} className="space-y-4">
              <label htmlFor="user-input" className="block text-sm font-medium text-gray-200">
                Describe your project, feature, or task in plain English:
              </label>
              <textarea
                id="user-input"
                rows={5}
                className="block w-full rounded-md bg-slate-900 border-slate-700 text-gray-100 shadow-sm focus:border-[#FDE047] focus:ring-[#FDE047] sm:text-sm p-3 border placeholder-gray-500"
                placeholder="e.g., I want a Jules app named Jewelz that self-corrects and runs Node scripts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-[#0F172A] bg-[#FDE047] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDE047] disabled:bg-yellow-200 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Optimizing..." : "Optimize Prompt"}
              </button>
            </form>
          </section>

          {/* Results Section */}
          {result && (
            <div className="space-y-8 animate-fade-in-up">
              <hr className="border-slate-700" />

              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#FDE047]">Optimized Jules Prompt</h2>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-600 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDE047]"
                  >
                    <svg className="mr-2 h-4 w-4 text-[#FDE047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy
                  </button>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700">
                  <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono">
                    {result.optimizedPrompt}
                  </pre>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Metadata Section */}
                <section className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold text-[#FDE047] mb-3">Analysis Metadata</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-300">Detected Type:</span>
                      <span className="ml-2 text-gray-100 capitalize">{result.extractedMetadata.outputType}</span>
                    </div>
                    {result.extractedMetadata.frameworks.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-300">Frameworks:</span>
                        <span className="ml-2 text-gray-100">{result.extractedMetadata.frameworks.join(", ")}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-300">Level of Detail:</span>
                      <span className="ml-2 text-gray-100 capitalize">{result.extractedMetadata.levelOfDetail}</span>
                    </div>
                    {result.metadata.suggestedLibraries.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-300">Suggested Libs:</span>
                        <span className="ml-2 text-gray-100">{result.metadata.suggestedLibraries.join(", ")}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <span className="font-medium text-[#FDE047] block mb-1">Estimated Steps:</span>
                      <ol className="list-decimal list-inside text-gray-300 pl-1 space-y-1">
                        {result.metadata.estimatedSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </section>

                {/* Explanations Section */}
                <section className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold text-[#FDE047] mb-3">Why this prompt works</h3>
                  <ul className="space-y-3 text-sm">
                    {Object.entries(result.explanations).map(([key, value], idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="flex-shrink-0 h-5 w-5 text-[#FDE047] mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <div>
                          <span className="font-medium text-gray-200 block">"{key}"</span>
                          <span className="text-gray-400">{value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Structure Section */}
              <section className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                <h3 className="text-lg font-semibold text-[#FDE047] mb-2">Recommended File Structure</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-slate-800 p-3 rounded border border-slate-700">
                  {result.metadata.recommendedStructure}
                </pre>
              </section>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
