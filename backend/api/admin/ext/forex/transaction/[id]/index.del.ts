// /server/api/admin/wallets/transactions/index.delete.ts

import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a transaction",
  operationId: "deleteTransaction",
  tags: ["Admin", "Transaction"],
  parameters: deleteRecordParams("transaction"),
  responses: deleteRecordResponses("Transaction"),
  requiresAuth: true,
  permission: "Access Forex Signal Management",
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "transaction",
    id: params.id,
    query,
  });
};
