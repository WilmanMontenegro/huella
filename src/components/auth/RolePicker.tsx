"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ROLE_OPTIONS, type HuellaRole } from "@/lib/auth/roles";

interface RolePickerProps {
  value: HuellaRole | null;
  onChange: (role: HuellaRole) => void;
}

export function RolePicker({ value, onChange }: RolePickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-3 block w-full text-center font-body text-label-sm text-on-surface-variant">
        ¿Cómo quieres usar Huella?
      </legend>
      <div className="grid gap-2">
        {ROLE_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-primary bg-primary-container/15"
                  : "border-outline-variant bg-surface hover:bg-surface-container-high"
              }`}
            >
              <MaterialIcon
                name={option.icon}
                className={`mt-0.5 shrink-0 text-xl ${selected ? "text-primary" : "text-outline"}`}
              />
              <span>
                <span className="block font-body text-label-md text-primary">{option.title}</span>
                <span className="mt-0.5 block font-body text-label-sm text-outline">{option.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
