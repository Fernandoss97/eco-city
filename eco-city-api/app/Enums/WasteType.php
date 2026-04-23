<?php

namespace App\Enums;

enum WasteType: string
{
    case Reciclavel = 'reciclavel';
    case Rejeito = 'rejeito';
    case Organico = 'organico';
    case Especial = 'especial';

    public function label(): string
    {
        return match ($this) {
            self::Reciclavel => 'Recicláveis',
            self::Rejeito => 'Rejeito',
            self::Organico => 'Orgânicos',
            self::Especial => 'Especial',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        $options = [];

        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }

        return $options;
    }
}
