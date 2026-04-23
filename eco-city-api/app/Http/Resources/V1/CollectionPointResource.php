<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionPointResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'address' => $this->address,
            'lat' => (float) $this->lat,
            'lng' => (float) $this->lng,
            'accepted_materials' => $this->accepted_materials ?? [],
            'hours' => $this->hours,
            'description' => $this->description,
            'neighborhood' => $this->whenLoaded('neighborhood', fn () => [
                'id' => $this->neighborhood->id,
                'name' => $this->neighborhood->name,
                'city' => $this->neighborhood->city,
            ]),
        ];
    }
}
