<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthEndpointTest extends TestCase
{
    use RefreshDatabase;

    /** Simulates a stateful request from the SPA so Sanctum starts the session middleware. */
    private function fromSpa(): static
    {
        return $this->withHeader('Origin', 'http://localhost:3000');
    }

    public function test_register_creates_user_and_returns_201(): void
    {
        $response = $this->fromSpa()->postJson('/api/v1/auth/register', [
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'password' => 'senha12345',
            'password_confirmation' => 'senha12345',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.email', 'joao@example.com')
            ->assertJsonPath('data.name', 'João Silva');

        $this->assertDatabaseHas('users', ['email' => 'joao@example.com']);
    }

    public function test_register_validates_duplicate_email(): void
    {
        User::factory()->create(['email' => 'joao@example.com']);

        $this->fromSpa()->postJson('/api/v1/auth/register', [
            'name' => 'João',
            'email' => 'joao@example.com',
            'password' => 'senha12345',
            'password_confirmation' => 'senha12345',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_validates_password_confirmation(): void
    {
        $this->fromSpa()->postJson('/api/v1/auth/register', [
            'name' => 'João',
            'email' => 'joao@example.com',
            'password' => 'senha12345',
            'password_confirmation' => 'outrasenha',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_returns_user_on_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'joao@example.com',
            'password' => bcrypt('senha12345'),
        ]);

        $this->fromSpa()->postJson('/api/v1/auth/login', [
            'email' => 'joao@example.com',
            'password' => 'senha12345',
        ])->assertStatus(200)
            ->assertJsonPath('data.email', 'joao@example.com');
    }

    public function test_login_returns_401_on_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'joao@example.com']);

        $this->fromSpa()->postJson('/api/v1/auth/login', [
            'email' => 'joao@example.com',
            'password' => 'senhaerrada',
        ])->assertStatus(401);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/auth/me')
            ->assertStatus(200)
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_me_returns_401_when_unauthenticated(): void
    {
        $this->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_logout_terminates_session(): void
    {
        $user = User::factory()->create();

        $this->fromSpa()->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/logout')
            ->assertStatus(200);
    }
}
