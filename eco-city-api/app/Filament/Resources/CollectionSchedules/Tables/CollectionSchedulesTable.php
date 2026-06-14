<?php

namespace App\Filament\Resources\CollectionSchedules\Tables;

use App\Enums\WasteType;
use App\Enums\Weekday;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CollectionSchedulesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('neighborhood.name')
                    ->label('Bairro')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('waste_type')
                    ->label('Tipo de coleta')
                    ->badge()
                    ->formatStateUsing(fn (WasteType $state): string => $state->label())
                    ->color(fn (WasteType $state): string => match ($state) {
                        WasteType::Convencional => 'gray',
                        WasteType::Seletiva => 'success',
                        WasteType::Especial => 'warning',
                    }),
                TextColumn::make('weekday')
                    ->label('Dia')
                    ->formatStateUsing(fn (int $state): string => Weekday::from($state)->label())
                    ->sortable(),
                TextColumn::make('start_time')
                    ->label('Início')
                    ->time('H:i')
                    ->sortable(),
                TextColumn::make('end_time')
                    ->label('Fim')
                    ->time('H:i')
                    ->sortable(),
            ])
            ->defaultSort('neighborhood_id')
            ->filters([
                SelectFilter::make('neighborhood_id')
                    ->label('Bairro')
                    ->relationship('neighborhood', 'name')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('waste_type')
                    ->label('Tipo de resíduo')
                    ->options(WasteType::options()),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
