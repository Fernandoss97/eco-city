"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  fetchCep,
  fetchMonthlySchedule,
  type CepLookup,
  type Collection,
  type DayCollections,
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
  | { kind: "loading"; cep: string }
  | { kind: "error"; cep: string; message: string }
  | {
      kind: "ready";
      cep: string;
      cepLookup: CepLookup;
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
  reciclavel: 0,
  organico: 1,
  rejeito: 2,
  especial: 3,
};

function normalizeCep(input: string): string {
  return input.replace(/\D/g, "");
}

export function ColetasClient() {
  const [month, setMonth] = useState<string>(() => currentMonth());
  const [days, setDays] = useState<DayCollections[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [finder, setFinder] = useState<FinderState>({ kind: "idle" });

  const search = useCallback(
    async (rawCep: string) => {
      const cep = normalizeCep(rawCep);
      if (cep.length !== 8) {
        setFinder({
          kind: "error",
          cep: rawCep,
          message: "Digite um CEP com 8 dígitos.",
        });
        return;
      }

      setFinder({ kind: "loading", cep });
      setCalendarLoading(true);

      try {
        const [cepResponse, monthlyResponse] = await Promise.all([
          fetchCep(cep),
          fetchMonthlySchedule(cep, month),
        ]);

        const weekly = uniqueWeekly(monthlyResponse.data.days);
        setDays(monthlyResponse.data.days);
        setFinder({
          kind: "ready",
          cep,
          cepLookup: cepResponse.data,
          weekly,
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.status === 404
              ? "CEP fora da área de cobertura ou inexistente."
              : err.message
            : "Erro inesperado ao buscar o CEP.";
        setFinder({ kind: "error", cep, message });
        setDays([]);
      } finally {
        setCalendarLoading(false);
      }
    },
    [month],
  );

  // Refetch only the calendar when month changes (keep CEP info).
  useEffect(() => {
    if (finder.kind !== "ready") return;
    let cancelled = false;
    setCalendarLoading(true);
    fetchMonthlySchedule(finder.cep, month)
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

  const goToPrevMonth = useCallback(() => {
    setMonth((m) => shiftMonth(m, -1));
  }, []);
  const goToNextMonth = useCallback(() => {
    setMonth((m) => shiftMonth(m, 1));
  }, []);
  const goToToday = useCallback(() => {
    setMonth(currentMonth());
  }, []);

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
      <ScheduleFinder state={finder} onSearch={search} />
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
