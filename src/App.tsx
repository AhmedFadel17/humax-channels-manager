import { useMemo, useRef, useState } from "react";
import * as pako from "pako";
import { AppHeader } from "./components/layout/AppHeader";
import { Toolbar } from "./components/channel/Toolbar";
import { Sidebar } from "./components/layout/Sidebar";
import { InsertChannelBar } from "./components/channel/InsertChannelBar";
import { GroupSortBar } from "./components/channel/GroupSortBar";
import { ChannelList } from "./components/channel/ChannelList";
import { Dropzone } from "./components/file/Dropzone";
import { ResetConfirmModal } from "./components/modal/ResetConfirmModal";
import { ImportProgressModal } from "./components/file/ImportProgressModal";
import { Toast } from "./components/ui/Toast";
import { useChannelManager } from "./hooks/useChannelManager";
import { useToast } from "./hooks/useToast";
import { parseChannelsWithMap } from "./services/humaxParser";
import { extractProviders } from "./services/providerExtractor";
import { exportModifiedDb } from "./services/humaxExporter";
import { downloadBlob } from "./lib/download";
import type { Channel } from "./types/channel";

function isHd(c: Channel) {
  return c.svcType === "avc_hd_dtv" || c.svcType === "avc-sd-dtv";
}

function isRadio(c: Channel) {
  return c.svcType === "radio" || c.svcType === "fm-radio";
}

function isTv(c: Channel) {
  return !isRadio(c);
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const {
    channels,
    setChannels,
    originalChannels,
    setOriginalChannels,
    originalLcn,
    setOriginalLcn,
    providerMap,
    setProviderMap,
    rawU8,
    setRawU8,
    lcnMap,
    setLcnMap,
    filter,
    setFilter,
    groupProvider,
    setGroupProvider,
    query,
    setQuery,
    groupBy,
    setGroupBy,
    sortBy,
    setSortBy,
    selectedUid,
    setSelectedUid,
    insertUid,
    setInsertUid,
    insertLcn,
    setInsertLcn,
    stats,
  } = useChannelManager();

  const { toast, showToast } = useToast();

  const [resetOpen, setResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importTitle, setImportTitle] = useState("IMPORTING...");
  const [importMessage, setImportMessage] = useState("Reading file...");
  const [progress, setProgress] = useState(0);

  const hasData = channels.length > 0;

  const filteredChannels = useMemo(() => {
    let vis = [...channels];

    if (groupProvider !== null) vis = vis.filter((c) => c.prvuid === groupProvider);

    if (filter === "tv") vis = vis.filter(isTv);
    else if (filter === "rd") vis = vis.filter(isRadio);
    else if (filter === "hd") vis = vis.filter(isHd);
    else if (filter === "ed") vis = vis.filter((c) => c.editable);
    else if (filter === "ch")
      vis = vis.filter((c) => c.editable && c.lcn !== originalLcn[c.uid]);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      vis = vis.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          String(c.lcn).includes(q) ||
          (providerMap[c.prvuid] || "").toLowerCase().includes(q)
      );
    }

    return vis;
  }, [channels, groupProvider, filter, query, originalLcn, providerMap]);

  const resultText =
    query || filter !== "all" || groupProvider !== null
      ? `${filteredChannels.length} / ${channels.length}`
      : `${channels.length} channels`;

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  function handleReset() {
    setChannels([]);
    setOriginalChannels([]);
    setOriginalLcn({});
    setProviderMap({});
    setRawU8(null);
    setLcnMap({});
    setFilter("all");
    setGroupProvider(null);
    setQuery("");
    setSelectedUid(null);
    setInsertUid(null);
    setInsertLcn(1010);
    setResetOpen(false);
    showToast("Reset", "ok");
  }

  function handleSetLcn(uid: number, value: number) {
    if (Number.isNaN(value) || value < 1000) {
      showToast("LCN must be >= 1000", "error");
      return;
    }

    setChannels((prev) =>
      [...prev]
        .map((c) => (c.uid === uid ? { ...c, lcn: value } : c))
        .sort((a, b) => a.lcn - b.lcn)
    );

    showToast(`LCN -> ${value}`, "info");
  }

  function handleMoveChannel(uid: number, dir: -1 | 1) {
    setChannels((prev) => {
      const editable = [...prev].filter((c) => c.editable).sort((a, b) => a.lcn - b.lcn);
      const i = editable.findIndex((c) => c.uid === uid);
      const ni = i + dir;
      if (i < 0 || ni < 0 || ni >= editable.length) return prev;

      const temp = editable[i].lcn;
      editable[i].lcn = editable[ni].lcn;
      editable[ni].lcn = temp;

      const updated = prev.map((c) => {
        const found = editable.find((e) => e.uid === c.uid);
        return found ? found : c;
      });

      return updated.sort((a, b) => a.lcn - b.lcn);
    });
  }

  function handleSelectChannel(uid: number) {
    setSelectedUid(uid);
    setInsertUid(uid);
  }

  function handleInsert() {
    if (!insertUid) {
      showToast("Select a channel first", "error");
      return;
    }

    if (Number.isNaN(insertLcn) || insertLcn < 1000) {
      showToast("Target LCN must be >= 1000", "error");
      return;
    }

    setChannels((prev) => {
      const moving = prev.find((c) => c.uid === insertUid);
      if (!moving || !moving.editable) return prev;

      if (moving.lcn === insertLcn) return prev;

      const rest = prev
        .filter((c) => c.editable && c.uid !== insertUid)
        .sort((a, b) => a.lcn - b.lcn);

      const lcns = rest.map((c) => c.lcn);
      let idx = lcns.findIndex((l) => l >= insertLcn);
      if (idx === -1) idx = lcns.length;

      lcns.splice(idx, 0, insertLcn);

      for (let i = 1; i < lcns.length; i++) {
        if (lcns[i] <= lcns[i - 1]) lcns[i] = lcns[i - 1] + 1;
      }

      const updated = prev.map((c) => {
        if (c.uid === insertUid) {
          return { ...c, lcn: lcns[idx] };
        }

        const restIndex = rest.findIndex((r) => r.uid === c.uid);
        if (restIndex !== -1) {
          const mappedIndex = restIndex < idx ? restIndex : restIndex + 1;
          return { ...c, lcn: lcns[mappedIndex] };
        }

        return c;
      });

      return updated.sort((a, b) => a.lcn - b.lcn);
    });

    showToast("Channel inserted", "ok");
  }

  async function handleImportFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".db")) {
      showToast("Please select a .db file", "error");
      return;
    }

    setImportOpen(true);
    setImportTitle(`IMPORTING: ${file.name}`);
    setImportMessage("Reading file...");
    setProgress(10);

    try {
      const buffer = await file.arrayBuffer();
      const u8 = new Uint8Array(buffer);

      setProgress(30);

      let dec: Uint8Array;
      try {
        dec = pako.inflate(u8);
      } catch {
        dec = u8;
      }

      setProgress(55);

      const result = parseChannelsWithMap(dec);
      if (!result.channels.length) {
        throw new Error("No channels found in this file");
      }

      setProgress(85);

      const providers = extractProviders(dec);

      setProgress(100);

      const origMap: Record<number, number> = {};
      result.channels.forEach((c) => {
        origMap[c.uid] = c.lcn;
      });

      setChannels(result.channels);
      setOriginalChannels(result.channels);
      setOriginalLcn(origMap);
      setProviderMap(providers);
      setRawU8(u8);
      setLcnMap(result.lcnMap);
      setGroupProvider(null);
      setSelectedUid(null);
      setInsertUid(result.channels.find((c) => c.editable)?.uid ?? null);

      setImportMessage(`OK: ${result.channels.length} channels loaded`);
      showToast(`Imported ${result.channels.length} channels`, "ok");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed";
      setImportMessage(`ERROR: ${message}`);
      showToast(`Import failed: ${message}`, "error");
    }
  }

  function handleExportDb() {
    if (!rawU8) {
      showToast("No file loaded", "error");
      return;
    }

    try {
      const blob = exportModifiedDb({
        rawU8,
        channels,
        originalLcn,
        lcnMap,
      });

      downloadBlob(blob, "c1_modified.db");
      showToast("Exported .db", "ok");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export error";
      showToast(message, "error");
    }
  }

  function handleExportCsv() {
    const rows = [
      ["LCN", "Name", "Type", "Provider", "UID", "Editable", "Changed", "OrigLCN"],
      ...channels.map((c) => [
        c.lcn,
        c.name,
        c.svcType,
        providerMap[c.prvuid] || "",
        c.uid,
        c.editable,
        c.editable && c.lcn !== originalLcn[c.uid],
        originalLcn[c.uid] ?? c.lcn,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, "humax_channels.csv");
    showToast(`Exported ${channels.length} rows`, "ok");
  }

  function jumpToRange(range: string) {
    const el = document.querySelector(`[data-r="${range}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        stats={stats}
        hasData={hasData}
        onImport={handleBrowse}
        onExportDb={handleExportDb}
        onExportCsv={handleExportCsv}
        onOpenReset={() => setResetOpen(true)}
      />

      <Toolbar
        disabled={!hasData}
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        resultText={resultText}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          channels={channels}
          providerMap={providerMap}
          groupProvider={groupProvider}
          onSelectProvider={setGroupProvider}
          onJumpRange={jumpToRange}
        />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <InsertChannelBar
            channels={channels}
            disabled={!hasData}
            insertUid={insertUid}
            insertLcn={insertLcn}
            onInsertUidChange={setInsertUid}
            onInsertLcnChange={setInsertLcn}
            onInsert={handleInsert}
          />

          <GroupSortBar
            disabled={!hasData}
            groupBy={groupBy}
            sortBy={sortBy}
            onGroupByChange={setGroupBy}
            onSortByChange={setSortBy}
          />

          <div ref={listRef} className="relative flex-1 overflow-hidden">
            {hasData ? (
              <ChannelList
                channels={filteredChannels}
                providerMap={providerMap}
                originalLcn={originalLcn}
                selectedUid={selectedUid}
                groupBy={groupBy}
                sortBy={sortBy}
                filterText=""
                groupProvider={null}
                onSelectChannel={handleSelectChannel}
                onMoveChannel={handleMoveChannel}
                onSetLcn={handleSetLcn}
              />
            ) : null}

            <Dropzone
              visible={!hasData}
              onBrowse={handleBrowse}
              onDropFile={handleImportFile}
            />
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".db"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.currentTarget.value = "";
        }}
      />

      <ResetConfirmModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
      />

      <ImportProgressModal
        open={importOpen}
        title={importTitle}
        message={importMessage}
        progress={progress}
        onClose={() => setImportOpen(false)}
      />

      <Toast toast={toast} />
    </div>
  );
}