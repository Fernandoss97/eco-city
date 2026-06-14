<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
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
                        FileUpload::make('cover_path')
                            ->label('Imagem de capa')
                            ->image()
                            ->disk('public')
                            ->directory('articles')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('16:9')
                            ->imageResizeTargetWidth('1200')
                            ->imageResizeTargetHeight('675')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp']),
                        TagsInput::make('tags')
                            ->label('Tags')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
