import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionState<T = any> = {
  status?: "SUCCESS" | "ERROR";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  payload?: FormData;
  timestamp: number;
  data?: T;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

export const fromErrorToActionState = (
  error: unknown,
  formData?: FormData,
): ActionState => {
  if (error instanceof ZodError) {
    return {
      status: "ERROR",
      message: error.flatten().formErrors.pop() ?? "",
      fieldErrors: error.flatten().fieldErrors,
      payload: formData,
      timestamp: Date.now(),
    };
  } else if (error instanceof Error) {
    return {
      status: "ERROR",
      message: error.message,
      fieldErrors: {},
      payload: formData,
      timestamp: Date.now(),
    };
  } else {
    return {
      status: "ERROR",
      message: "An unknown error ocurred!",
      fieldErrors: {},
      payload: formData,
      timestamp: Date.now(),
    };
  }
};

export const toActionState = (
  status: ActionState["status"],
  message: string,
  formData?: FormData,
  data?: unknown,
): ActionState => {
  return {
    status,
    message,
    fieldErrors: {},
    payload: formData,
    timestamp: Date.now(),
    data,
  };
};
