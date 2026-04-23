<?php

namespace App\Models;

use Database\Factories\NeighborhoodCepPrefixFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['neighborhood_id', 'prefix'])]
class NeighborhoodCepPrefix extends Model
{
    /** @use HasFactory<NeighborhoodCepPrefixFactory> */
    use HasFactory;

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }
}
