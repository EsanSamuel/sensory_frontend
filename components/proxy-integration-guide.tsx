"use client";

import React, { useState } from "react";

const codeSamples = {
  javascript: `// Initialize Axios with Sensory Proxy
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://sensory-reverse-proxy.onrender.com',
  headers: {
    "Content-Type": "application/json",
    'X-API-KEY': 'YOUR_PROJECT_API_KEY'
  },
});

// Example usage
const fetchData = async () => {
  const res = await api.post('/v1/data', { 
    query: "metrics" 
  });
  return res.data;
};`,
  go: `package main

import (
    "bytes"
    "net/http"
)

func main() {
    url := "https://sensory-reverse-proxy.onrender.com/endpoint"
    payload := []byte(\`{"query": "metrics"}\`)
    
    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-API-KEY", "YOUR_PROJECT_API_KEY")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`,
  python: `import requests

url = "https://sensory-reverse-proxy.onrender.com/endpoint"
headers = {
    "Content-Type": "application/json",
    "X-API-KEY": "YOUR_PROJECT_API_KEY"
}
data = {"query": "metrics"}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
  curl: `curl -X POST https://sensory-reverse-proxy.onrender.com/endpoint \\
     -H "Content-Type: application/json" \\
     -H "X-API-KEY: YOUR_PROJECT_API_KEY" \\
     -d '{"query": "metrics"}'`
};

export function ProxyIntegrationGuide() {
  const [activeLang, setActiveLang] = useState("javascript");

  return (
    <section className="container mx-auto max-w-5xl px-4 py-20 lg:px-8 border-t">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Integrate the Proxy
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Connect your applications to the Sensory Reverse Proxy in seconds using your preferred language and library.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Instructions Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold">Base Configuration</h3>
            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="block text-xs font-medium text-muted-foreground uppercase mb-1">Base URL</span>
                <code className="text-primary font-mono select-all">https://sensory-reverse-proxy.onrender.com</code>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="block text-xs font-medium text-muted-foreground uppercase mb-1">Required Headers</span>
                <ul className="space-y-1 font-mono text-[11px]">
                  <li>Content-Type: application/json</li>
                  <li>X-API-KEY: [Your API Key]</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-amber-600 dark:text-amber-400">Security Note</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Always keep your API key secure. Use environment variables to inject sensitive keys into your production services.
            </p>
          </div>
        </div>

        {/* Code Samples Column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-[#0d1117] shadow-xl overflow-hidden">
             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#161b22]">
                <div className="flex gap-4">
                  {[
                    { id: "javascript", label: "JavaScript" },
                    { id: "go", label: "Go" },
                    { id: "python", label: "Python" },
                    { id: "curl", label: "cURL" }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setActiveLang(lang.id)}
                      className={`text-xs font-medium transition-all pb-1 border-b-2 ${
                        activeLang === lang.id 
                          ? "text-blue-400 border-blue-400" 
                          : "text-gray-500 border-transparent hover:text-gray-300"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 grayscale opacity-50">
                  <div className="size-2 rounded-full bg-red-500" />
                  <div className="size-2 rounded-full bg-yellow-500" />
                  <div className="size-2 rounded-full bg-green-500" />
                </div>
             </div>
             <div className="p-6 overflow-x-auto min-h-[280px]">
               <pre className="font-mono text-sm leading-relaxed text-gray-300">
                 <code>{codeSamples[activeLang as keyof typeof codeSamples]}</code>
               </pre>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
