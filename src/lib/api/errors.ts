import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorBody = {
  code: string;
  message: string;
};

export function apiError(
  status: number,
  code: string,
  message: string,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ code, message }, { status });
}

export function validationError(
  error: ZodError,
): NextResponse<ApiErrorBody> {
  const first = error.issues[0];
  return apiError(
    400,
    "VALIDATION_ERROR",
    first?.message ?? "Invalid request body",
  );
}
