import { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  MutationResponse,
  MutationResponseSchema,
  NewRow,
  TreeRow,
  TreeRowSchema,
  UpdateRow,
} from "schema";

const E_ID = 128707;
const BASE_URL = "http://185.244.172.108:8081/v1/outlay-rows/entity/";

export const queryClient = new QueryClient();

export const QUERY_KEYS = { getTreeRows: "getTreeRows" } as const;

export const MUTATION_KEYS = {
  createRow: "createRow",
  updateRow: "updateRow",
  deleteRow: "deleteRow",
} as const;

export const getTreeRows = async () => {
  const response = await fetch(`${BASE_URL}${E_ID}/row/list`);
  const data = (await response.json()) as TreeRow[];

  return z.array(TreeRowSchema).parse(data);
};

export const createRow = async (newRow: NewRow) => {
  const response = await fetch(`${BASE_URL}${E_ID}/row/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRow),
  });

  const data = (await response.json()) as MutationResponse;
  return MutationResponseSchema.parse(data);
};

export const updateRow = async ({ id, ...row }: UpdateRow) => {
  const response = await fetch(`${BASE_URL}${E_ID}/row/${id}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(row),
  });
  const data = (await response.json()) as MutationResponse;

  return MutationResponseSchema.parse(data);
};

export const deleteRow = async (id: number) => {
  const response = await fetch(`${BASE_URL}${E_ID}/row/${id}/delete`, {
    method: "DELETE",
  });
  const data = (await response.json()) as MutationResponse;

  return MutationResponseSchema.parse(data);
};
