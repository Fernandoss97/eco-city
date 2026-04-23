<?php

namespace App\Models;

use App\Casts\PostgresArray;
use Database\Factories\CollectionPointFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'type',
    'name',
    'address',
    'lat',
    'lng',
    'neighborhood_id',
    'hours',
    'accepted_materials',
    'description',
])]
class CollectionPoint extends Model
{
    /** @use HasFactory<CollectionPointFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
            'hours' => 'array',
            'accepted_materials' => PostgresArray::class,
        ];
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }
}
