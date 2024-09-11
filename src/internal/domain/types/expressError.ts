// ExpressError use for errors in express APIs.
export type ExpressError = Pick<Error, "message" | "stack"> & { status?: number };
