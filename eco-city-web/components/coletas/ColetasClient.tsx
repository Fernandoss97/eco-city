"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  fetchMonthlySchedule,
  fetchNeighborhoods,
  type DayCollections,
  type Neighborhood,
  type WasteType,
} from "@/lib/api";
import { ScheduleFinder } from "./ScheduleFinder";
import { MonthlyCalendar } from "./MonthlyCalendar";

type WeeklyEntry = {
  weekday: number;
  waste_type: WasteType;
  waste_type_label: string;
  start_time: string;
  end_time: string;
};

export type FinderState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | {
      kind: "ready";
      neighborhood: { id: number; name: string; city: string };
      weekly: WeeklyEntry[];
    };

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number): string {
  const [yy, mm] = month.split("-").map(Number);
  const date = new Date(Date.UTC(yy, mm - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function uniqueWeekly(days: DayCollections[]): WeeklyEntry[] {
  const seen = new Map<string, WeeklyEntry>();
  for (const day of days) {
    for (const c of day.collections) {
      const key = `${c.waste_type}|${day.weekday}|${c.start_time}|${c.end_time}`;
      if (!seen.has(key)) {
        seen.set(key, {
          weekday: day.weekday,
          waste_type: c.waste_type,
          waste_type_label: c.waste_type_label,
          start_time: c.start_time,
          end_time: c.end_time,
        });
      }
    }
  }
  return [...seen.values()].sort(
    (a, b) =>
      WASTE_ORDER[a.waste_type] - WASTE_ORDER[b.waste_type] ||
      a.weekday - b.weekday,
  );
}

const WASTE_ORDER: Record<WasteType, number> = {
  convencional: 0,
  seletiva: 1,
  especial: 2,
};

export function ColetasClient() {
  const [month, setMonth] = useState<string>(() => currentMonth());
  const [days, setDays] = useState<DayCollections[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [finder, setFinder] = useState<FinderState>({ kind: "idle" });
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    fetchNeighborhoods()
      .then((res) => setNeighborhoods(res.data))
      .catch(() => {});
  }, []);

  const search = useCallback(
    async (neighborhoodId: number) => {
      setFinder({ kind: "loading" });
      setCalendarLoading(true);

      try {
        const response = await fetchMonthlySchedule(neighborhoodId, month);
        const weekly = uniqueWeekly(response.data.days);
        setDays(response.data.days);
        setFinder({
          kind: "ready",
          neighborhood: response.data.neighborhood,
          weekly,
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Erro inesperado ao buscar o cronograma.";
        setFinder({ kind: "error", message });
        setDays([]);
      } finally {
        setCalendarLoading(false);
      }
    },
    [month],
  );

  useEffect(() => {
    if (finder.kind !== "ready") return;
    let cancelled = false;
    setCalendarLoading(true);
    fetchMonthlySchedule(finder.neighborhood.id, month)
      .then((response) => {
        if (cancelled) return;
        setDays(response.data.days);
      })
      .catch(() => {
        if (cancelled) return;
        setDays([]);
      })
      .finally(() => {
        if (!cancelled) setCalendarLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const goToPrevMonth = useCallback(() => setMonth((m) => shiftMonth(m, -1)), []);
  const goToNextMonth = useCallback(() => setMonth((m) => shiftMonth(m, 1)), []);
  const goToToday = useCallback(() => setMonth(currentMonth()), []);

  const monthLabel = useMemo(() => {
    const [yy, mm] = month.split("-").map(Number);
    const date = new Date(yy, mm - 1, 1);
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(date);
  }, [month]);

  return (
    <>
      <ScheduleFinder
        state={finder}
        neighborhoods={neighborhoods}
        onSearch={search}
      />
      <div className="mt-8">
        <MonthlyCalendar
          month={month}
          monthLabel={monthLabel}
          days={days}
          loading={calendarLoading}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
          isCurrentMonth={month === currentMonth()}
        />
      </div>
    </>
  );
}
