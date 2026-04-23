<?php

namespace App\Models;

use App\Enums\WasteType;
use Database\Factories\CollectionScheduleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['neighborhood_id', 'waste_type', 'weekday', 'start_time', 'end_time'])]
class CollectionSchedule extends Model
{
    /** @use HasFactory<CollectionScheduleFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'waste_type' => WasteType::class,
            'weekday' => 'integer',
        ];
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }
}
