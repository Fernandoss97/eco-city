<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Conteúdo')
                    ->schema([
                        TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                }
                            })
                            ->columnSpanFull(),
                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->columnSpanFull(),
                        MarkdownEditor::make('body_md')
                            ->label('Conteúdo (Markdown)')
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('Publicação')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('published_at')
                            ->label('Publicado em')
                            ->helperText('Deixe vazio para salvar como rascunho.')
                            ->nullable(),
                        TextInput::make('cover_path')
                            ->label('Caminho da capa')
                            ->maxLength(500)
                            ->placeholder('images/artigos/exemplo.jpg'),
                        TagsInput::make('tags')
                            ->label('Tags')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
