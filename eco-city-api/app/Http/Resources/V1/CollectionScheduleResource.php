<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionScheduleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'neighborhood_id' => $this->neighborhood_id,
            'waste_type' => $this->waste_type->value,
            'waste_type_label' => $this->waste_type->label(),
            'weekday' => (int) $this->weekday,
            'start_time' => substr((string) $this->start_time, 0, 5),
            'end_time' => substr((string) $this->end_time, 0, 5),
        ];
    }
}
