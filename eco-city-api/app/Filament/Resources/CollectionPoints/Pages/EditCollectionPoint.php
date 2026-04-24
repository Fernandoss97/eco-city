<?php

namespace App\Filament\Resources\CollectionPoints\Pages;

use App\Filament\Resources\CollectionPoints\CollectionPointResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCollectionPoint extends EditRecord
{
    protected static string $resource = CollectionPointResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
