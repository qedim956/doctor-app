import type {
  CreateLabInput,
  CreatePatientInput,
  LabType,
} from "@clinic/domain";
import { ApiError, NetworkError, type FieldError } from "./errors.js";
import type { LabResult, Patient } from "./types.js";

export function createApiClient(baseUrl: string) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
      });
    } catch (error) {
      throw new NetworkError("Serverə qoşulmaq olmadı");
    }
    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as {
        message: string;
        errors?: FieldError[];
      } | null;
      throw new ApiError(
        response.status,
        errorData?.message || "Unknown error",
        errorData?.errors,
      );
    }
    if (response.status === 204) {
      return undefined as unknown as T;
    }
    return (await response.json()) as T;
  }

  return {
    patients: {
      list: (init?: RequestInit) => request<Patient[]>("/patients", init),
      create: (input: CreatePatientInput) => {
        return request<Patient>("/patients", {
          method: "POST",
          body: JSON.stringify(input),
        });
      },
      remove: (id: string) => {
        return request<void>(`/patients/${id}`, {
          method: "DELETE",
        });
      },
    },
    labs: {
      list: (patientId: string, type?: LabType) => {
        const query = type ? `?type=${type}` : "";
        return request<LabResult[]>(`/patients/${patientId}/labs${query}`);
      },
      create: (patientId: string, input: CreateLabInput) =>
        request<LabResult>(`/patients/${patientId}/labs`, {
          method: "POST",
          body: JSON.stringify(input),
        }),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
