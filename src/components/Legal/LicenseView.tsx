import React, { useEffect, useState } from "react";

export const LicenseView: React.FC = () => {
  const [content, setContent] = useState<string>(
    "Cargando protocolo de licencia..."
  );

  const fallbackLicense = `MIT License
Copyright (c) 2026 DeepSaffix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  useEffect(() => {
    fetch("/LICENSE.md")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se encontró LICENSE.md");
        }
        return res.text();
      })
      .then((text) => setContent(text))
      .catch(() => {
        setContent(fallbackLicense);
      });
  }, [fallbackLicense]);

  return (
    <div className="animate-fade-in mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header Técnico */}
        <div className="bg-neutral-850 flex items-center justify-between border-b border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 h-3 w-3 animate-pulse rounded-full"></div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              Legal_System / OpenSource_License
            </span>
          </div>
          <span className="font-mono text-[10px] text-neutral-600">
            v1.0.0-MIT
          </span>
        </div>

        {/* Visor de Licencia */}
        <div className="p-6 md:p-8">
          <pre className="rounded-lg border border-neutral-800 bg-neutral-950 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-neutral-400">
            {content}
          </pre>
        </div>

        <div className="flex justify-end border-t border-neutral-800 bg-neutral-950/50 p-4">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-[10px] font-bold tracking-widest text-neutral-300 uppercase transition-all hover:bg-neutral-800 active:scale-95"
          >
            Cerrar Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
