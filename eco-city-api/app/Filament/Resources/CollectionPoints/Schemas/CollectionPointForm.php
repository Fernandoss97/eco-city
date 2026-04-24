<?php

namespace App\Filament\Resources\CollectionPoints\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CollectionPointForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identificação')
                    ->columns(2)
                    ->schema([
                        Select::make('type')
                            ->label('Tipo')
                            ->options([
                                'reciclagem' => 'Ponto de Reciclagem',
                                'especial' => 'Resíduo Especial',
                            ])
                            ->required(),
                        Select::make('neighborhood_id')
                            ->relationship('neighborhood', 'name')
                            ->label('Bairro')
                            ->searchable()
                            ->preload(),
                        TextInput::make('name')
                            ->label('Nome')
                            ->required()
                            ->maxLength(200)
                            ->columnSpanFull(),
                        TextInput::make('address')
                            ->label('Endereço')
                            ->required()
                            ->maxLength(300)
                            ->columnSpanFull(),
                    ]),

                Section::make('Coordenadas')
                    ->columns(2)
                    ->schema([
                        TextInput::make('lat')
                            ->label('Latitude')
                            ->required()
                            ->numeric()
                            ->step(0.0000001),
                        TextInput::make('lng')
                            ->label('Longitude')
                            ->required()
                            ->numeric()
                            ->step(0.0000001),
                    ]),

                Section::make('Detalhes')
                    ->schema([
                        TagsInput::make('accepted_materials')
                            ->label('Materiais aceitos')
                            ->suggestions([
                                'papel', 'plastico', 'vidro', 'metal',
                                'eletronico', 'pilha_bateria', 'oleo_cozinha', 'lampadas',
                            ])
                            ->columnSpanFull(),
                        KeyValue::make('hours')
                            ->label('Horários de funcionamento')
                            ->keyLabel('Dia / período')
                            ->valueLabel('Horário')
                            ->columnSpanFull(),
                        Textarea::make('description')
                            ->label('Descrição')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
