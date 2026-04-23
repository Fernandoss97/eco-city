<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\NotificationTemplate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'template_id' => NotificationTemplate::factory(),
            'payload' => ['waste_type' => 'reciclavel'],
            'scheduled_for' => now()->addDay(),
            'sent_at' => null,
            'status' => 'pending',
            'provider_message_id' => null,
        ];
    }
}
