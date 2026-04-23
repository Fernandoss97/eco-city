<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\NeighborhoodResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CepController extends Controller
{
    public function show(string $cep, NeighborhoodResolver $resolver): JsonResponse
    {
        if (! preg_match('/^\d{8}$/', $cep)) {
            return response()->json([
                'message' => 'CEP inválido. Informe 8 dígitos.',
            ], 422);
        }

        $payload = Cache::remember(
            "cep:$cep",
            now()->addDays(30),
            function () use ($cep): ?array {
                $response = Http::timeout(3)->get("https://viacep.com.br/ws/$cep/json/");

                if (! $response->successful()) {
                    return null;
                }

                $body = $response->json();

                if (! is_array($body) || ($body['erro'] ?? false) === true) {
                    return null;
                }

                return [
                    'cep' => preg_replace('/\D/', '', (string) ($body['cep'] ?? $cep)),
                    'logradouro' => $body['logradouro'] ?? '',
                    'bairro' => $body['bairro'] ?? '',
                    'localidade' => $body['localidade'] ?? '',
                    'uf' => $body['uf'] ?? '',
                ];
            }
        );

        if ($payload === null) {
            Cache::forget("cep:$cep");

            return response()->json([
                'message' => 'CEP não encontrado.',
            ], 404);
        }

        $resolved = $resolver->resolve($payload['cep']);

        $payload['neighborhood'] = $resolved !== null
            ? [
                'id' => $resolved['neighborhood']->id,
                'name' => $resolved['neighborhood']->name,
                'matched_prefix' => $resolved['matched_prefix'],
            ]
            : null;

        return response()->json(['data' => $payload]);
    }
}
