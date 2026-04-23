export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://eco-city-api.test/api/v1";

export type WasteType = "reciclavel" | "organico" | "rejeito" | "especial";

export type Collection = {
  id: number;
  waste_type: WasteType;
  waste_type_label: string;
  start_time: string;
  end_time: string;
};

export type Schedule = Collection & {
  neighborhood_id: number;
  weekday: number;
};

export type Neighborhood = {
  id: number;
  city: string;
  name: string;
  matched_prefix?: string;
  schedules?: Schedule[];
  cep_prefixes?: string[];
};

export type CepLookup = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  neighborhood: {
    id: number;
    name: string;
    matched_prefix: string;
  } | null;
};

export type DayCollections = {
  date: string;
  weekday: number;
  collections: Collection[];
};

export type MonthlySchedule = {
  neighborhood: {
    id: number;
    city: string;
    name: string;
    matched_prefix: string;
  };
  month: string;
  days: DayCollections[];
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch (cause) {
    throw new ApiError(0, "Não foi possível contatar o servidor.");
  }

  if (!response.ok) {
    let message = `Falha na requisição (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body?.message === "string") {
        message = body.message;
      }
    } catch {
      // Ignore JSON parse errors; keep generic message.
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export function fetchCep(cep: string): Promise<{ data: CepLookup }> {
  return request(`/cep/${cep}`);
}

export function fetchMonthlySchedule(
  cep: string,
  month: string,
): Promise<{ data: MonthlySchedule }> {
  const params = new URLSearchParams({ cep, month });
  return request(`/schedule?${params.toString()}`);
}

export function fetchNeighborhoodSchedule(
  id: number,
): Promise<{
  data: {
    neighborhood: { id: number; city: string; name: string };
    schedule: Schedule[];
  };
}> {
  return request(`/neighborhoods/${id}/schedule`);
}
