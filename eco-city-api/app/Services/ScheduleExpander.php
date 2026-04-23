<?php

namespace App\Services;

use App\Models\Neighborhood;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;

class ScheduleExpander
{
    /**
     * Expand a neighborhood's weekly schedule into concrete daily collections
     * for the given month (YYYY-MM).
     *
     * @return array<int, array{date: string, collections: array<int, array<string, mixed>>}>
     */
    public function expandMonth(Neighborhood $neighborhood, string $month): array
    {
        $start = CarbonImmutable::createFromFormat('Y-m-d', $month.'-01')->startOfMonth();
        $end = $start->endOfMonth();

        $schedules = $neighborhood->schedules()
            ->orderBy('weekday')
            ->orderBy('start_time')
            ->get()
            ->groupBy(fn ($s) => (int) $s->weekday);

        $days = [];

        foreach (CarbonPeriod::create($start, $end) as $date) {
            $weekday = (int) $date->dayOfWeek;
            $collections = [];

            foreach ($schedules->get($weekday, collect()) as $schedule) {
                $collections[] = [
                    'id' => $schedule->id,
                    'waste_type' => $schedule->waste_type->value,
                    'waste_type_label' => $schedule->waste_type->label(),
                    'start_time' => substr((string) $schedule->start_time, 0, 5),
                    'end_time' => substr((string) $schedule->end_time, 0, 5),
                ];
            }

            $days[] = [
                'date' => $date->format('Y-m-d'),
                'weekday' => $weekday,
                'collections' => $collections,
            ];
        }

        return $days;
    }
}
