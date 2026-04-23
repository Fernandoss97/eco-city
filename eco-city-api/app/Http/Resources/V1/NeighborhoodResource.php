<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NeighborhoodResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'city' => $this->city,
            'name' => $this->name,
            'matched_prefix' => $this->when(
                isset($this->resource->matched_prefix),
                fn () => $this->resource->matched_prefix
            ),
            'schedules' => CollectionScheduleResource::collection(
                $this->whenLoaded('schedules')
            ),
            'cep_prefixes' => $this->whenLoaded(
                'cepPrefixes',
                fn () => $this->cepPrefixes->pluck('prefix')->all()
            ),
        ];
    }
}
