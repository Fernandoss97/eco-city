"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  ApiError,
  fetchCollectionPoints,
  fetchNeighborhoods,
  type CollectionPoint,
  type CollectionPointType,
  type Neighborhood,
  type Paginated,
} from "@/lib/api";
import { CategoryFilters } from "./CategoryFilters";
import { FiltersSidebar } from "./FiltersSidebar";
import { PointsList } from "./PointsList";

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-surface-alt text-[13px] text-ink-soft">
        Carregando mapa…
      </div>
    ),
  },
);

export type FiltersState = {
  type: CollectionPointType | null;
  neighborhoodId: number | null;
  materials: string[];
};

const INITIAL: FiltersState = {
  type: null,
  neighborhoodId: null,
  materials: [],
};

export function MapaClient() {
  const [filters, setFilters] = useState<FiltersState>(INITIAL);
  const [page, setPage] = useState(1);
  const [points, setPoints] = useState<Paginated<CollectionPoint> | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNeighborhoods()
      .then((res) => setNeighborhoods(res.data))
      .catch(() => setNeighborhoods([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCollectionPoints({
      type: filters.type ?? undefined,
      neighborhood_id: filters.neighborhoodId ?? undefined,
      materials: filters.materials.length > 0 ? filters.materials : undefined,
      page,
      per_page: 10,
    })
      .then((res) => {
        if (cancelled) return;
        setPoints(res);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Erro inesperado ao buscar pontos.",
        );
        setPoints(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const setType = useCallback((type: CollectionPointType | null) => {
    setPage(1);
    setFilters((f) => ({ ...f, type }));
  }, []);

  const applySidebar = useCallback(
    (next: Pick<FiltersState, "materials" | "neighborhoodId">) => {
      setPage(1);
      setFilters((f) => ({ ...f, ...next }));
    },
    [],
  );

  return (
    <>
      <CategoryFilters activeType={filters.type} onChange={setType} />

      <div className="mt-6">
        <MapView points={points?.data ?? []} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <FiltersSidebar
            neighborhoods={neighborhoods}
            initial={{
              materials: filters.materials,
              neighborhoodId: filters.neighborhoodId,
            }}
            onApply={applySidebar}
          />
        </aside>
        <div className="lg:col-span-9">
          <PointsList
            points={points?.data ?? []}
            total={points?.meta.total ?? 0}
            currentPage={points?.meta.current_page ?? page}
            lastPage={points?.meta.last_page ?? 1}
            loading={loading}
            error={error}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
