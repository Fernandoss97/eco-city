<?php

namespace Tests\Feature\Api\V1;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_persists_message_with_status_novo(): void
    {
        $payload = [
            'name' => 'Maria Silva',
            'email' => 'maria@example.com',
            'phone' => '43999990000',
            'subject' => 'Dúvida sobre coleta',
            'body' => 'Quero saber quando passa a coleta no meu bairro.',
        ];

        $response = $this->postJson('/api/v1/contact-messages', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.message', 'Mensagem enviada. Retornaremos em breve.');

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'maria@example.com',
            'subject' => 'Dúvida sobre coleta',
            'status' => 'novo',
            'user_id' => null,
        ]);
    }

    public function test_store_validates_required_fields(): void
    {
        $this->postJson('/api/v1/contact-messages', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'body']);
    }

    public function test_store_validates_email_format(): void
    {
        $this->postJson('/api/v1/contact-messages', [
            'name' => 'Maria',
            'email' => 'not-an-email',
            'subject' => 'Teste',
            'body' => 'corpo da mensagem aqui',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_store_validates_body_minimum_length(): void
    {
        $this->postJson('/api/v1/contact-messages', [
            'name' => 'Maria',
            'email' => 'maria@example.com',
            'subject' => 'Teste',
            'body' => 'curto',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    public function test_phone_is_optional(): void
    {
        $this->postJson('/api/v1/contact-messages', [
            'name' => 'Maria',
            'email' => 'maria@example.com',
            'subject' => 'Teste sem telefone',
            'body' => 'mensagem suficientemente longa para passar',
        ])->assertStatus(201);

        $this->assertDatabaseCount(ContactMessage::class, 1);
    }
}
