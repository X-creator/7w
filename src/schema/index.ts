import { z } from "zod";

export const RowSchema = z
  .object({
    equipmentCosts: z.number().nonnegative(),
    estimatedProfit: z.number().nonnegative(),
    id: z.number().positive(),
    machineOperatorSalary: z.number().nonnegative(),
    mainCosts: z.number().nonnegative(),
    materials: z.number().nonnegative(),
    mimExploitation: z.number().nonnegative(),
    overheads: z.number().nonnegative(),
    rowName: z.string().trim().min(1),
    salary: z.number(),
    supportCosts: z.number().nonnegative(),
    total: z.number().nonnegative(),
  })
  .strict();

export const UpdateRowSchema = RowSchema.omit({ total: true });

export const NewRowSchema = UpdateRowSchema.omit({ id: true }).extend({
  parentId: z.number().positive().nullable(),
});

export const TreeRowSchema: z.ZodType<TreeRow> = RowSchema.extend({
  child: z.lazy(() => TreeRowSchema.array()),
});

export const MutationResponseSchema = z
  .object({
    current: RowSchema.nullable(),
    changed: z.array(RowSchema),
  })
  .strict();

export type Row = z.infer<typeof RowSchema>;
export type UpdateRow = z.infer<typeof UpdateRowSchema>;
export type NewRow = z.infer<typeof NewRowSchema>;
export type TreeRow = z.infer<typeof RowSchema> & {
  child: TreeRow[];
};
export type MutationResponse = z.infer<typeof MutationResponseSchema>;
