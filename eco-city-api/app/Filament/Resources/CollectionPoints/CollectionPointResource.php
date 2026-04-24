<?php

namespace App\Filament\Resources\CollectionPoints;

use App\Filament\Resources\CollectionPoints\Pages\CreateCollectionPoint;
use App\Filament\Resources\CollectionPoints\Pages\EditCollectionPoint;
use App\Filament\Resources\CollectionPoints\Pages\ListCollectionPoints;
use App\Filament\Resources\CollectionPoints\Schemas\CollectionPointForm;
use App\Filament\Resources\CollectionPoints\Tables\CollectionPointsTable;
use App\Models\CollectionPoint;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CollectionPointResource extends Resource
{
    protected static ?string $model = CollectionPoint::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMapPin;

    protected static ?string $navigationLabel = 'Pontos de Coleta';

    protected static ?string $modelLabel = 'Ponto de Coleta';

    protected static ?string $pluralModelLabel = 'Pontos de Coleta';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return CollectionPointForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CollectionPointsTable::configure($table);
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
            'index' => ListCollectionPoints::route('/'),
            'create' => CreateCollectionPoint::route('/create'),
            'edit' => EditCollectionPoint::route('/{record}/edit'),
        ];
    }
}
