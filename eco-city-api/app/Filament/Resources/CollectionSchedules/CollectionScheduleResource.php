<?php

namespace App\Filament\Resources\CollectionSchedules;

use App\Filament\Resources\CollectionSchedules\Pages\CreateCollectionSchedule;
use App\Filament\Resources\CollectionSchedules\Pages\EditCollectionSchedule;
use App\Filament\Resources\CollectionSchedules\Pages\ListCollectionSchedules;
use App\Filament\Resources\CollectionSchedules\Schemas\CollectionScheduleForm;
use App\Filament\Resources\CollectionSchedules\Tables\CollectionSchedulesTable;
use App\Models\CollectionSchedule;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CollectionScheduleResource extends Resource
{
    protected static ?string $model = CollectionSchedule::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static ?string $navigationLabel = 'Cronogramas';

    protected static ?string $modelLabel = 'Cronograma';

    protected static ?string $pluralModelLabel = 'Cronogramas';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return CollectionScheduleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CollectionSchedulesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCollectionSchedules::route('/'),
            'create' => CreateCollectionSchedule::route('/create'),
            'edit' => EditCollectionSchedule::route('/{record}/edit'),
        ];
    }
}
