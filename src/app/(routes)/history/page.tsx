"use client";

import React from "react";
import { History } from "lucide-react";
import { HistoryContent } from "./content";

export default function HistoryPage() {
  return (
    <div className="container p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Listening History</h1>
        <History className="h-6 w-6" />
      </div>
      <HistoryContent />
    </div>
  );
}