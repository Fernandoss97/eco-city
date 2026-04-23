<?php

namespace App\Filament\Resources\Neighborhoods\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CepPrefixesRelationManager extends RelationManager
{
    protected static string $relationship = 'cepPrefixes';

    protected static ?string $title = 'Prefixos de CEP';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('prefix')
                    ->label('Prefixo (3 a 8 dígitos)')
                    ->required()
                    ->regex('/^\d{3,8}$/')
                    ->helperText('Use apenas dígitos. Ex.: 86300, 863001, 86300123.')
                    ->maxLength(8),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('prefix')
            ->columns([
                TextColumn::make('prefix')
                    ->label('Prefixo CEP')
                    ->searchable()
                    ->sortable(),
            ])
            ->defaultSort('prefix')
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
