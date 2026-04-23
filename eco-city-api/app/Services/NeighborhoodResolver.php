<?php

namespace App\Services;

use App\Models\Neighborhood;
use Illuminate\Support\Facades\DB;

class NeighborhoodResolver
{
    /**
     * Resolve a neighborhood from an 8-digit Brazilian CEP using the longest
     * matching prefix registered in `neighborhood_cep_prefixes`.
     *
     * Returns `null` when no prefix matches (e.g. CEP outside the city).
     *
     * @return array{neighborhood: Neighborhood, matched_prefix: string}|null
     */
    public function resolve(string $cep): ?array
    {
        $cep = preg_replace('/\D/', '', $cep) ?? '';

        if (strlen($cep) !== 8) {
            return null;
        }

        $row = DB::table('neighborhood_cep_prefixes as p')
            ->join('neighborhoods as n', 'n.id', '=', 'p.neighborhood_id')
            ->whereRaw('? LIKE p.prefix || \'%\'', [$cep])
            ->orderByRaw('LENGTH(p.prefix) DESC')
            ->select('p.prefix', 'n.id as neighborhood_id')
            ->first();

        if ($row === null) {
            return null;
        }

        $neighborhood = Neighborhood::query()->find($row->neighborhood_id);

        if ($neighborhood === null) {
            return null;
        }

        return [
            'neighborhood' => $neighborhood,
            'matched_prefix' => $row->prefix,
        ];
    }
}
