<?php

namespace App\Filament\Resources\Neighborhoods\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NeighborhoodForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('city')
                    ->label('Cidade')
                    ->default('Cornélio Procópio')
                    ->required()
                    ->maxLength(120),
                TextInput::make('name')
                    ->label('Bairro')
                    ->required()
                    ->maxLength(120),
            ]);
    }
}
