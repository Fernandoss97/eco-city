<?php

namespace App\Filament\Resources\CollectionSchedules\Pages;

use App\Filament\Resources\CollectionSchedules\CollectionScheduleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCollectionSchedules extends ListRecords
{
    protected static string $resource = CollectionScheduleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
