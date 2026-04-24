<?php

namespace App\Filament\Resources\CollectionPoints\Pages;

use App\Filament\Resources\CollectionPoints\CollectionPointResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCollectionPoints extends ListRecords
{
    protected static string $resource = CollectionPointResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
