"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CollapsibleSection from "./CollapsibleSection";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";

import type {
  AgentFormValues,
  LanguagesDropdown,
  ModelsDropdown,
  PromptsDropdown,
  VoicesDropdown,
} from "@/types/agent";

type Props = { badge: number };

export default function BasicSettings({ badge }: Props) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<AgentFormValues>();

  const latencyValue = watch("latency") ?? 0.5;
  const speedValue = watch("speed") ?? 110;

  const [languages, setLanguages] = useState<LanguagesDropdown[]>([]);
  const [voices, setVoices] = useState<VoicesDropdown[]>([]);
  const [models, setModels] = useState<ModelsDropdown[]>([]);
  const [prompts, setPrompts] = useState<PromptsDropdown[]>([]);

  // Loading + error per dropdown (nice UX: independent states)
  const [loading, setLoading] = useState({
    languages: false,
    voices: false,
    prompts: false,
    models: false,
  });

  const [loadError, setLoadError] = useState({
    languages: "",
    voices: "",
    prompts: "",
    models: "",
  });

  const anyLoading = useMemo(
    () =>
      loading.languages || loading.voices || loading.prompts || loading.models,
    [loading],
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchJson<T>(url: string): Promise<T> {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
      return res.json();
    }

    const loadOne = async <T,>(
      key: keyof typeof loading,
      url: string,
      setter: (data: T) => void,
    ) => {
      try {
        setLoading((prev) => ({ ...prev, [key]: true }));
        setLoadError((prev) => ({ ...prev, [key]: "" }));

        const data = await fetchJson<T>(url);
        if (!signal.aborted) setter(data);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error(e);

        // Keep previous values if you prefer; here we clear to avoid stale data.
        if (!signal.aborted) setter([] as unknown as T);

        setLoadError((prev) => ({
          ...prev,
          [key]: "Failed to load data. Please try again.",
        }));
      } finally {
        if (!signal.aborted) setLoading((prev) => ({ ...prev, [key]: false }));
      }
    };

    // Fetch in parallel but keep individual loading states
    void Promise.all([
      loadOne<LanguagesDropdown[]>("languages", "/api/languages", setLanguages),
      loadOne<VoicesDropdown[]>("voices", "/api/voices", setVoices),
      loadOne<PromptsDropdown[]>("prompts", "/api/prompts", setPrompts),
      loadOne<ModelsDropdown[]>("models", "/api/models", setModels),
    ]);

    return () => controller.abort();
  }, []);

  const fieldError = (msg?: string) =>
    msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;

  const loadErrorText = (msg?: string) =>
    msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;

  // Small helper to show spinner inside the trigger
  const LoadingTrigger = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <CollapsibleSection
      title="Basic Settings"
      description="Add some information about your agent to get started."
      badge={badge}
      defaultOpen
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agent Name */}
        <div className="space-y-2">
          <Label htmlFor="agentName">
            Agent Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="agentName"
            placeholder="e.g. Sales Assistant"
            {...register("agentName", { required: "Agent name is required" })}
          />
          {fieldError(errors.agentName?.message)}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Describe what this agent does..."
            {...register("description")}
          />
          {fieldError(errors.description?.message)}
        </div>

        {/* Call Type */}
        <div className="space-y-2">
          <Label>
            Call Type <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="callType"
            rules={{ required: "Call type is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select call type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbound">
                    Inbound (Receive Calls)
                  </SelectItem>
                  <SelectItem value="outbound">
                    Outbound (Make Calls)
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {fieldError(errors.callType?.message as string | undefined)}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>
            Language <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="language"
            rules={{ required: "Language is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  disabled={loading.languages}
                  aria-busy={loading.languages}
                >
                  {loading.languages ? (
                    <LoadingTrigger text="Loading languages..." />
                  ) : (
                    <SelectValue placeholder="Select language" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {languages.length === 0 && !loading.languages ? (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No languages found
                    </div>
                  ) : (
                    languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {fieldError(errors.language?.message)}
          {loadErrorText(loadError.languages)}
        </div>

        {/* Voice */}
        <div className="space-y-2">
          <Label>
            Voice <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="voice"
            rules={{ required: "Voice is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  disabled={loading.voices}
                  aria-busy={loading.voices}
                >
                  {loading.voices ? (
                    <LoadingTrigger text="Loading voices..." />
                  ) : (
                    <SelectValue placeholder="Select voice" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {voices.length === 0 && !loading.voices ? (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No voices found
                    </div>
                  ) : (
                    voices.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        <div className="flex items-center gap-2">
                          <span>{v.name}</span>
                          <Badge>{v.tag}</Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {fieldError(errors.voice?.message)}
          {loadErrorText(loadError.voices)}
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <Label>
            Prompt <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="prompt"
            rules={{ required: "Prompt is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  disabled={loading.prompts}
                  aria-busy={loading.prompts}
                >
                  {loading.prompts ? (
                    <LoadingTrigger text="Loading prompts..." />
                  ) : (
                    <SelectValue placeholder="Select prompt" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {prompts.length === 0 && !loading.prompts ? (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No prompts found
                    </div>
                  ) : (
                    prompts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {fieldError(errors.prompt?.message)}
          {loadErrorText(loadError.prompts)}
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label>
            Model <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="model"
            rules={{ required: "Model is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  disabled={loading.models}
                  aria-busy={loading.models}
                >
                  {loading.models ? (
                    <LoadingTrigger text="Loading models..." />
                  ) : (
                    <SelectValue placeholder="Select model" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {models.length === 0 && !loading.models ? (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No models found
                    </div>
                  ) : (
                    models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {fieldError(errors.model?.message)}
          {loadErrorText(loadError.models)}
        </div>

        {/* Latency + Speed */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latency ({latencyValue.toFixed(1)}s)</Label>
            <Controller
              control={control}
              name="latency"
              render={({ field }) => (
                <>
                  <Slider
                    value={[field.value ?? 0.5]}
                    onValueChange={(v) => field.onChange(v[0])}
                    min={0.3}
                    max={1}
                    step={0.1}
                    disabled={anyLoading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.3s</span>
                    <span>1.0s</span>
                  </div>
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Speed ({speedValue}%)</Label>
            <Controller
              control={control}
              name="speed"
              render={({ field }) => (
                <>
                  <Slider
                    value={[field.value ?? 110]}
                    onValueChange={(v) => field.onChange(v[0])}
                    min={90}
                    max={130}
                    step={1}
                    disabled={anyLoading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>90%</span>
                    <span>130%</span>
                  </div>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
