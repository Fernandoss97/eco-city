<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Mensagem')
                ->columnSpanFull()
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('name')
                            ->label('Nome')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('email')
                            ->label('E-mail')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('phone')
                            ->label('Telefone')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('subject')
                            ->label('Assunto')
                            ->disabled()
                            ->dehydrated(false),
                    ]),
                    Textarea::make('body')
                        ->label('Mensagem')
                        ->rows(8)
                        ->disabled()
                        ->dehydrated(false)
                        ->columnSpanFull(),
                ]),

            Section::make('Atendimento')
                ->columnSpanFull()
                ->schema([
                    Select::make('status')
                        ->label('Status')
                        ->options([
                            'novo' => 'Novo',
                            'em_andamento' => 'Em andamento',
                            'resolvido' => 'Resolvido',
                        ])
                        ->required()
                        ->native(false),
                ]),
        ]);
    }
}
