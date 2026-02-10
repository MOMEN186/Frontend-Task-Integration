"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { Switch } from "../ui/switch";
import CollapsibleSection from "./CollapsibleSection";
import { AgentFormValues } from "@/types/agent";

function Tools() {
  const { control } = useFormContext<AgentFormValues>();

  return (
    <CollapsibleSection
      title="Tools"
      description="Tools that allow the AI agent to perform call-handling actions and manage session control."
    >
      <FieldGroup className="w-full">
        {/* Allow hang up */}
        <FieldLabel htmlFor="switch-hangup">
          <Field orientation="horizontal" className="items-center">
            <FieldContent>
              <FieldTitle>Allow hang up</FieldTitle>
              <FieldDescription>
                Select if you would like to allow the agent to hang up the call
              </FieldDescription>
            </FieldContent>

            <Controller
              name="tools.allowHangUp"
              control={control}
              render={({ field }) => (
                <Switch
                  id="switch-hangup"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Field>
        </FieldLabel>

        {/* Allow callback */}
        <FieldLabel htmlFor="switch-callback">
          <Field orientation="horizontal" className="items-center">
            <FieldContent>
              <FieldTitle>Allow callback</FieldTitle>
              <FieldDescription>
                Select if you would like to allow the agent to make callbacks
              </FieldDescription>
            </FieldContent>

            <Controller
              name="tools.allowCallback"
              control={control}
              render={({ field }) => (
                <Switch
                  id="switch-callback"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Field>
        </FieldLabel>

        {/* Live transfer */}
        <FieldLabel htmlFor="switch-transfer">
          <Field orientation="horizontal" className="items-center">
            <FieldContent>
              <FieldTitle>Live transfer</FieldTitle>
              <FieldDescription>
                Select if you want to transfer the call to a human agent
              </FieldDescription>
            </FieldContent>

            <Controller
              name="tools.liveTransfer"
              control={control}
              render={({ field }) => (
                <Switch
                  id="switch-transfer"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Field>
        </FieldLabel>
      </FieldGroup>
    </CollapsibleSection>
  );
}

export default Tools;
