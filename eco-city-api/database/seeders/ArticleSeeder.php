<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'slug' => 'como-separar-residuos-em-casa',
                'title' => 'Como separar resíduos recicláveis em casa',
                'tags' => ['reciclagem'],
                'body_md' => <<<'MD'
Separar o lixo em casa é o primeiro passo para que a coleta seletiva funcione. Com poucos hábitos novos, você facilita o trabalho das cooperativas e aumenta a quantidade de material que volta para a cadeia produtiva.

## O que vai na coleta seletiva

- **Papel e papelão:** caixas, jornais e revistas secos.
- **Plástico:** garrafas PET, embalagens e potes limpos.
- **Vidro:** garrafas e frascos, sem tampa.
- **Metal:** latas de alumínio e aço.

## Dicas práticas

1. Lave rapidamente as embalagens para evitar mau cheiro.
2. Amasse garrafas e caixas para ocupar menos espaço.
3. Mantenha o material seco — papel molhado não é reciclável.

Confira o dia da coleta seletiva no seu bairro pela busca de CEP e deixe o material na calçada na véspera.
MD,
            ],
            [
                'slug' => 'compostagem-domestica-primeiros-passos',
                'title' => 'Compostagem doméstica: primeiros passos',
                'tags' => ['compostagem'],
                'body_md' => <<<'MD'
Cerca de metade do lixo de uma casa é resíduo orgânico. A compostagem transforma cascas, borra de café e restos de comida em adubo de qualidade — e reduz bastante o que você manda para o aterro.

## O que pode ser compostado

- Cascas de frutas e legumes
- Borra e filtro de café
- Folhas secas e podas pequenas

## O que evitar

- Carnes, laticínios e óleos
- Fezes de animais

Com uma composteira simples e algumas semanas de paciência, você produz adubo para hortas e vasos sem custo nenhum.
MD,
            ],
            [
                'slug' => 'descarte-correto-de-eletronicos',
                'title' => 'Descarte correto de eletrônicos e pilhas',
                'tags' => ['eletronico'],
                'body_md' => <<<'MD'
Eletrônicos, pilhas e baterias contêm metais pesados que **não podem** ir para o lixo comum. Descartados de forma errada, contaminam o solo e a água.

## Onde descartar

Procure os pontos de coleta de resíduos especiais no mapa do aplicativo. Eles recebem:

- Celulares, carregadores e cabos
- Pilhas e baterias
- Pequenos eletrodomésticos

## Antes de descartar

- Apague seus dados pessoais do aparelho.
- Não desmonte pilhas ou baterias.

Dar o destino certo a esses itens evita poluição e permite recuperar materiais valiosos.
MD,
            ],
        ];

        foreach ($articles as $data) {
            Article::firstOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'body_md' => $data['body_md'],
                    'cover_path' => null,
                    'published_at' => now(),
                    'tags' => $data['tags'],
                ],
            );
        }
    }
}
