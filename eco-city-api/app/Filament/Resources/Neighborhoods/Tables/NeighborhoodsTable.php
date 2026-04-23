<?php

namespace App\Filament\Resources\Neighborhoods\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NeighborhoodsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('city')
                    ->label('Cidade')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->label('Bairro')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('cep_prefixes_count')
                    ->label('Prefixos CEP')
                    ->counts('cepPrefixes')
                    ->badge(),
                TextColumn::make('schedules_count')
                    ->label('Cronogramas')
                    ->counts('schedules')
                    ->badge(),
                TextColumn::make('created_at')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name')
            ->filters([
                //
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
