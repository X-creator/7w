import { UseMutationOptions } from "@tanstack/react-query";
import { MutationResponse, NewRow, UpdateRow } from "schema";
import { createRow, deleteRow, MUTATION_KEYS, updateRow } from "api";

export const createRowMutation: UseMutationOptions<
  MutationResponse,
  Error,
  { id: string; newRow: NewRow },
  void
> = {
  mutationKey: [MUTATION_KEYS.createRow],
  mutationFn: ({ newRow }) => createRow(newRow),
  throwOnError: true,
};

export const updateRowMutation: UseMutationOptions<MutationResponse, Error, UpdateRow, void> = {
  mutationKey: [MUTATION_KEYS.createRow],
  mutationFn: updateRow,
  throwOnError: true,
};

export const deleteRowMutation: UseMutationOptions<MutationResponse, Error, number, void> = {
  mutationKey: [MUTATION_KEYS.createRow],
  mutationFn: deleteRow,
  throwOnError: true,
};
