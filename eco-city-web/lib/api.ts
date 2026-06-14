// In the browser, always use relative URLs so the Next.js rewrite proxy
// serves both the SPA and API from the same origin — required for Sanctum
// SPA auth (XSRF-TOKEN cookie must be readable via document.cookie).
// In server-side contexts (RSC / Route Handlers) an absolute URL is needed.
export const API_BASE =
  typeof window !== "undefined"
    ? "/api/v1"
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://eco-city-api.test/api/v1");

function getXsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie
    .split("; ")
    .find((r) => r.startsWith("XSRF-TOKEN="));
  return row ? decodeURIComponent(row.split("=")[1]) : null;
}

async function initCsrf(): Promise<void> {
  await fetch("/sanctum/csrf-cookie", { credentials: "include" });
}

export type WasteType = "convencional" | "seletiva" | "especial";

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
  const method = (init?.method ?? "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const xsrfToken = isMutating ? getXsrfToken() : null;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
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
  neighborhoodId: number,
  month: string,
): Promise<{ data: MonthlySchedule }> {
  const params = new URLSearchParams({ neighborhood_id: String(neighborhoodId), month });
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

export type CollectionPointType = "reciclagem" | "especial";

export type CollectionPoint = {
  id: number;
  type: CollectionPointType;
  name: string;
  address: string;
  lat: number;
  lng: number;
  accepted_materials: string[];
  hours: Record<string, string> | null;
  description: string | null;
  neighborhood: {
    id: number;
    name: string;
    city: string;
  } | null;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type CollectionPointFilters = {
  type?: CollectionPointType;
  neighborhood_id?: number;
  materials?: string[];
  page?: number;
  per_page?: number;
};

export function fetchCollectionPoints(
  filters: CollectionPointFilters = {},
): Promise<Paginated<CollectionPoint>> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.neighborhood_id != null)
    params.set("neighborhood_id", String(filters.neighborhood_id));
  if (filters.materials && filters.materials.length > 0)
    params.set("materials", filters.materials.join(","));
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));
  const qs = params.toString();
  return request(`/collection-points${qs ? `?${qs}` : ""}`);
}

export function fetchNeighborhoods(): Promise<Paginated<Neighborhood>> {
  return request("/neighborhoods?per_page=100");
}

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  body: string;
};

export function submitContactMessage(
  payload: ContactPayload,
): Promise<{ data: { id: number; message: string } }> {
  return request("/contact-messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
};

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function fetchMe(): Promise<AuthUser> {
  const res = await request<{ data: AuthUser }>("/auth/me");
  return res.data;
}

export async function apiLogin(payload: LoginPayload): Promise<AuthUser> {
  await initCsrf();
  const res = await request<{ data: AuthUser }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthUser> {
  await initCsrf();
  const res = await request<{ data: AuthUser }>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function apiLogout(): Promise<void> {
  await request("/auth/logout", { method: "POST" });
}

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body_md?: string;
  cover_path: string | null;
  published_at: string;
  tags: string[];
};

export type ArticleFilters = {
  tag?: string;
  page?: number;
  per_page?: number;
};

export function fetchArticles(
  filters: ArticleFilters = {},
): Promise<Paginated<Article>> {
  const params = new URLSearchParams();
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));
  const qs = params.toString();
  return request(`/articles${qs ? `?${qs}` : ""}`);
}

export function fetchArticle(slug: string): Promise<{ data: Article }> {
  return request(`/articles/${slug}`);
}
