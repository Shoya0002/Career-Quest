"use client";

import React, { useState } from "react";
import {
  FolderSearch,
  FileText,
  Users,
  ScrollText,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { EvidenceAsset } from "@/types/experience";

interface EvidenceInspectorProps {
  assets: EvidenceAsset[];
}

export function EvidenceInspector({ assets }: EvidenceInspectorProps) {
  const [activeTab, setActiveTab] = useState<"evidence" | "witnesses" | "clauses">("evidence");
  const [fullChainOpen, setFullChainOpen] = useState(false);
  const [selectedAssetModal, setSelectedAssetModal] = useState<EvidenceAsset | null>(null);

  const evidenceItems = assets.filter((a) => a.category === "evidence");
  const witnessItems = assets.filter((a) => a.category === "witnesses");
  const clauseItems = assets.filter((a) => a.category === "clauses");

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <FolderSearch className="h-5 w-5 text-primary" />
          <h2 className="text-sm md:text-base font-semibold text-foreground">
            Evidence Inspector
          </h2>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {assets.length} Assets
        </span>
      </div>

      {/* Inspector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setActiveTab("evidence")}
          className={`w-1/3 py-1 text-center text-xs font-semibold rounded transition-all ${
            activeTab === "evidence"
              ? "bg-card shadow-xs text-primary border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Evidence ({evidenceItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("witnesses")}
          className={`w-1/3 py-1 text-center text-xs font-semibold rounded transition-all ${
            activeTab === "witnesses"
              ? "bg-card shadow-xs text-primary border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Witnesses ({witnessItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("clauses")}
          className={`w-1/3 py-1 text-center text-xs font-semibold rounded transition-all ${
            activeTab === "clauses"
              ? "bg-card shadow-xs text-primary border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Clauses ({clauseItems.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex flex-col gap-3">
        {activeTab === "evidence" && (
          <>
            {/* Active Expanded Evidence: Doc 03 Slack Thread */}
            {evidenceItems.find((e) => e.id === "doc-03") && (
              <div className="rounded-xl border-2 border-primary/40 bg-muted/30 dark:bg-muted/10 p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[11px] font-bold uppercase tracking-wide">
                    Critical Leak
                  </span>
                  <span className="text-[11px] text-muted-foreground">June 14, 2:18 PM</span>
                </div>

                <h3 className="text-xs md:text-sm font-bold text-foreground">
                  Doc 03: Slack Thread Export #eng-leadership
                </h3>

                {/* Authentic Document Preview Box */}
                <div className="bg-card p-3 rounded-lg border border-border font-mono text-xs text-foreground flex flex-col gap-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border pb-1">
                    <span>From: Marcus Wright (VP Eng, Nova)</span>
                    <span className="bg-muted px-1.5 py-0.2 rounded text-[10px]">Direct Export</span>
                  </div>
                  <p className="italic text-foreground leading-relaxed my-1">
                    &ldquo;Apex&apos;s perception model is fully ingested into our staging cluster. Can we cite SLA latency to freeze payments before the Q3 investor call?&rdquo;
                  </p>
                  <div className="text-[10px] text-muted-foreground pt-1 border-t border-border flex justify-between items-center">
                    <span>Replies: 4 hidden</span>
                    <span>2 attachments (.py weights)</span>
                  </div>
                </div>

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    Source: Confidential Whistleblower
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-medium">
                    Admissibility: Contested (Rule 408)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Flagged for Hearing
                  </span>
                  <button
                    type="button"
                    onClick={() => setFullChainOpen(true)}
                    className="text-primary hover:underline text-xs font-semibold flex items-center gap-1"
                  >
                    View Full Chain <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Other Evidence Items */}
            {evidenceItems
              .filter((e) => e.id !== "doc-03")
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-card p-3 flex flex-col gap-1.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      {item.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Document</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-muted-foreground">{item.statusLabel}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedAssetModal(item)}
                      className="text-primary hover:underline text-xs font-medium"
                    >
                      {item.actionLabel || "Inspect"}
                    </button>
                  </div>
                </div>
              ))}
          </>
        )}

        {activeTab === "witnesses" && (
          <>
            {witnessItems.map((witness) => (
              <div
                key={witness.id}
                className="rounded-lg border border-border bg-card p-3 flex flex-col gap-1.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {witness.title}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      witness.badgeType === "success"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    }`}
                  >
                    {witness.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{witness.description}</p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedAssetModal(witness)}
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    {witness.actionLabel || "Review Deposition"}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "clauses" && (
          <>
            {clauseItems.map((clause) => (
              <div
                key={clause.id}
                className="rounded-lg border border-border bg-card p-3 flex flex-col gap-1.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ScrollText className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                    {clause.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {clause.statusLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{clause.description}</p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedAssetModal(clause)}
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    {clause.actionLabel || "Read Clause Text"}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal / Full Chain View */}
      {fullChainOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-bold text-sm text-foreground">
                Slack Thread Full Export #eng-leadership
              </h3>
              <button
                type="button"
                onClick={() => setFullChainOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold px-2 py-1"
              >
                Close
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono bg-muted/40 p-3 rounded border border-border max-h-60 overflow-y-auto">
              <div className="text-muted-foreground">[2025-06-14 14:18:02] Marcus Wright: Apex perception model is fully ingested into our staging cluster. Can we cite SLA latency to freeze payments before the Q3 investor call?</div>
              <div className="text-sky-600 dark:text-sky-400">[2025-06-14 14:22:15] Legal Counsel (In-House): We need documented defect tickets first. Milestone 3 has 12 benchmark criteria.</div>
              <div className="text-muted-foreground">[2025-06-14 14:25:40] Marcus Wright: We have the sensor weights working on our custom pipeline anyway. Milestone 3 tests passed internal benchmark yesterday.</div>
            </div>
            <p className="text-xs text-muted-foreground">
              This evidentiary thread directly satisfies the intentional pretext threshold for bad-faith breach under California Commercial Code.
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setFullChainOpen(false)}
                className="px-4 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAssetModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-bold text-sm text-foreground">{selectedAssetModal.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedAssetModal(null)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold px-2 py-1"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {selectedAssetModal.description || "Detailed audit record verified by litigation clerk."}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssetModal(null)}
                className="px-4 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
