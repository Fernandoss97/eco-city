<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Cast for native PostgreSQL TEXT[] / VARCHAR[] columns.
 *
 * Storage format: '{a,b,c}'. Empty array is '{}'.
 * Values containing commas, quotes, or backslashes are wrapped in
 * double quotes with internal escapes.
 */
class PostgresArray implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     * @return array<int, string>
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): array
    {
        if ($value === null || $value === '' || $value === '{}') {
            return [];
        }

        if (is_array($value)) {
            return array_values($value);
        }

        $inner = substr((string) $value, 1, -1);

        if ($inner === '') {
            return [];
        }

        $items = [];
        $buffer = '';
        $inQuotes = false;
        $length = strlen($inner);

        for ($i = 0; $i < $length; $i++) {
            $char = $inner[$i];

            if ($char === '\\' && $i + 1 < $length) {
                $buffer .= $inner[++$i];

                continue;
            }

            if ($char === '"') {
                $inQuotes = ! $inQuotes;

                continue;
            }

            if ($char === ',' && ! $inQuotes) {
                $items[] = $buffer;
                $buffer = '';

                continue;
            }

            $buffer .= $char;
        }

        $items[] = $buffer;

        return $items;
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null) {
            return null;
        }

        if (! is_array($value)) {
            $value = [$value];
        }

        $escaped = array_map(function ($item): string {
            $string = (string) $item;

            if ($string === '' || preg_match('/[,"\\\\\s{}]/', $string) === 1) {
                return '"'.str_replace(['\\', '"'], ['\\\\', '\\"'], $string).'"';
            }

            return $string;
        }, $value);

        return '{'.implode(',', $escaped).'}';
    }
}
