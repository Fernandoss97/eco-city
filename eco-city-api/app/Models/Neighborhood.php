<?php

namespace App\Models;

use Database\Factories\NeighborhoodFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['city', 'name'])]
class Neighborhood extends Model
{
    /** @use HasFactory<NeighborhoodFactory> */
    use HasFactory;

    public function cepPrefixes(): HasMany
    {
        return $this->hasMany(NeighborhoodCepPrefix::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(CollectionSchedule::class);
    }

    public function points(): HasMany
    {
        return $this->hasMany(CollectionPoint::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
