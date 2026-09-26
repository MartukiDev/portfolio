"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { adminContent } from "@/content/es/admin-content";
import { deleteSkill, moveSkill, saveSkill } from "@/lib/actions/skills";
import type { Tables } from "@/lib/supabase/database.types";
import { areasHabilidad } from "@/lib/validations/entities";
import { EntityDialog } from "./EntityDialog";
import { fieldA11y, FormField } from "./FormField";
import { GroupedSection } from "./GroupedSection";
import { SortableList } from "./SortableList";
import { useEntityEditor } from "./useEntityEditor";

type Skill = Tables<"skills">;
type Area = Skill["area"];

const t = adminContent.skills;
const c = adminContent.common;

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const editor = useEntityEditor<Skill, { area: Area }>();
  const current = editor.state.mode === "edit" ? editor.state.item : null;
  const defaultArea = editor.state.mode === "create" ? editor.state.defaults.area : (current?.area ?? "frontend");

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {areasHabilidad.map((area) => {
          const group = skills.filter((skill) => skill.area === area);
          return (
            <GroupedSection
              key={area}
              title={t.areas[area]}
              count={group.length}
              addLabel={c.add}
              onAdd={() => editor.create({ area })}
              empty={t.emptyGroup}
            >
              <SortableList
                items={group}
                getLabel={(skill) => skill.nombre}
                onMove={moveSkill}
                onDelete={deleteSkill}
                edit={{ onEdit: editor.edit }}
                compact
                renderContent={(skill) => <span className="font-medium">{skill.nombre}</span>}
              />
            </GroupedSection>
          );
        })}
      </div>

      <EntityDialog
        open={editor.open}
        onClose={editor.close}
        title={current ? t.editTitle : t.newTitle}
        id={current?.id ?? null}
        action={saveSkill}
      >
        {(errors) => (
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="nombre" label={t.fields.nombre} errors={errors?.nombre}>
              <Input {...fieldA11y("nombre", errors?.nombre)} name="nombre" defaultValue={current?.nombre ?? ""} maxLength={60} autoFocus />
            </FormField>
            <FormField id="area" label={t.fields.area} errors={errors?.area}>
              <Select {...fieldA11y("area", errors?.area)} name="area" defaultValue={defaultArea}>
                {areasHabilidad.map((area) => (
                  <option key={area} value={area}>
                    {t.areas[area]}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        )}
      </EntityDialog>
    </>
  );
}
