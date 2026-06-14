<?php

namespace App\Enums;

enum WasteType: string
{
    case Convencional = 'convencional';
    case Seletiva = 'seletiva';
    case Especial = 'especial';

    public function label(): string
    {
        return match ($this) {
            self::Convencional => 'Convencional',
            self::Seletiva => 'Seletiva',
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
