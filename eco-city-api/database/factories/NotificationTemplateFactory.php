<?php

namespace Database\Factories;

use App\Models\NotificationTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotificationTemplate>
 */
class NotificationTemplateFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event' => 'collection_reminder',
            'meta_name' => 'lembrete_coleta',
            'locale' => 'pt_BR',
            'variables' => ['waste_type', 'date', 'time_window'],
        ];
    }
}
