<?php

namespace App\Filament\Resources\CollectionSchedules\Schemas;

use App\Enums\WasteType;
use App\Enums\Weekday;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;

class CollectionScheduleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('neighborhood_id')
                    ->label('Bairro')
                    ->relationship('neighborhood', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('waste_type')
                    ->label('Tipo de resíduo')
                    ->options(WasteType::options())
                    ->required(),
                Select::make('weekday')
                    ->label('Dia da semana')
                    ->options(Weekday::options())
                    ->required(),
                Grid::make(2)
                    ->schema([
                        TimePicker::make('start_time')
                            ->label('Início da janela')
                            ->seconds(false)
                            ->required(),
                        TimePicker::make('end_time')
                            ->label('Fim da janela')
                            ->seconds(false)
                            ->required()
                            ->after('start_time'),
                    ]),
            ]);
    }
}
