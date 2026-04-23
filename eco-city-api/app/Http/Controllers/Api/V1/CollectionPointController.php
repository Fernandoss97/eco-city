<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CollectionPointResource;
use App\Models\CollectionPoint;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CollectionPointController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'type' => ['nullable', 'in:reciclagem,especial'],
            'neighborhood_id' => ['nullable', 'integer', 'exists:neighborhoods,id'],
            'materials' => ['nullable'],
            'materials.*' => ['string'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 15);

        $materials = $request->input('materials');
        if (is_string($materials)) {
            $materials = array_filter(array_map('trim', explode(',', $materials)));
        }

        $query = CollectionPoint::query()
            ->with('neighborhood')
            ->orderBy('name');

        if (! empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        if (! empty($validated['neighborhood_id'])) {
            $query->where('neighborhood_id', $validated['neighborhood_id']);
        }

        if (! empty($materials)) {
            $query->whereRaw('accepted_materials && ?::text[]', [
                '{'.implode(',', $materials).'}',
            ]);
        }

        return CollectionPointResource::collection($query->paginate($perPage));
    }
}
