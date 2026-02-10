"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import CollapsibleSection from "./CollapsibleSection";
import { AgentFormValues } from "@/types/agent";

type UploadStatus = "queued" | "uploading" | "registering" | "done" | "error";

type UploadedFile = {
  localId: string;
  name: string;
  size: number;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  key?: string;
  attachmentId?: string;
};

const ACCEPTED_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
  ".xlsx",
  ".xls",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong";
}

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (p: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      onProgress(pct);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

function ReferenceData() {
  const { setValue, watch } = useFormContext<AgentFormValues>();

  // RHF field (the one you submit)
  const attachments = watch("attachments") ?? [];

  // UI state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patchFile = (localId: string, patch: Partial<UploadedFile>) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.localId === localId ? { ...f, ...patch } : f)),
    );
  };

  // keep RHF in sync with completed attachment IDs
  useEffect(() => {
    const doneIds = uploadedFiles
      .map((f) => f.attachmentId)
      .filter(Boolean) as string[];

    // only update if changed (avoid rerender loops)
    const a = JSON.stringify(doneIds);
    const b = JSON.stringify(attachments);
    if (a !== b) setValue("attachments", doneIds, { shouldDirty: true });
  }, [uploadedFiles, attachments, setValue]);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const added: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ACCEPTED_TYPES.includes(ext)) continue;

      const localId =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      added.push({
        localId,
        name: file.name,
        size: file.size,
        file,
        progress: 0,
        status: "queued",
      });
    }

    if (added.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...added]);

    for (const f of added) {
      try {
        patchFile(f.localId, { status: "uploading", progress: 0 });

        // 1) signed url
        const r1 = await fetch("/api/attachments/upload-url", {
          method: "POST",
        });
        const { key, signedUrl } = await r1.json();
        patchFile(f.localId, { key });

        // 2) upload
        await uploadWithProgress(signedUrl, f.file, (pct) => {
          patchFile(f.localId, { progress: pct });
        });

        patchFile(f.localId, { status: "registering" });

        // 3) register attachment
        const r3 = await fetch("/api/attachments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            fileName: f.name,
            fileSize: f.size,
            mimeType: f.file.type || "application/octet-stream",
          }),
        });

        const att = await r3.json();

        patchFile(f.localId, {
          status: "done",
          attachmentId: att.id,
          progress: 100,
        });
      } catch (err: unknown) {
        patchFile(f.localId, { status: "error", error: getErrorMessage(err) });
      }
    }
  }, []);

  const removeFile = (localId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.localId !== localId));
    // RHF updates automatically via useEffect sync above
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <CollapsibleSection
      title="Reference Data"
      description="Enhance your agent's knowledge base with uploaded files."
    >
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
          />

          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />

          <p className="mt-2 text-sm font-medium">
            Drag & drop files here, or{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Accepted: .pdf, .doc, .docx, .txt, .csv, .xlsx, .xls
          </p>
        </div>

        {/* File list */}
        {uploadedFiles.length > 0 ? (
          <div className="space-y-3">
            {uploadedFiles.map((f) => (
              <div
                key={f.localId}
                className="rounded-md border px-3 py-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">{f.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatFileSize(f.size)}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => removeFile(f.localId)}
                    disabled={
                      f.status === "uploading" || f.status === "registering"
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {f.status !== "done" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {f.status === "queued" && "Queued"}
                        {f.status === "uploading" && "Uploading..."}
                        {f.status === "registering" &&
                          "Registering attachment..."}
                        {f.status === "error" && (f.error ?? "Upload failed")}
                      </span>
                      <span>{f.progress ?? 0}%</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${f.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {f.status === "done" && (
                  <p className="text-xs text-green-600 font-medium">
                    ✅ Uploaded successfully
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <FileText className="h-10 w-10 mb-2" />
            <p className="text-sm">No Files Available</p>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}

export default ReferenceData;
