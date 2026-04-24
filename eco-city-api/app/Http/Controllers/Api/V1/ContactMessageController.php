<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::create([
            ...$request->validated(),
            'user_id' => $request->user()?->id,
            'status' => 'novo',
        ]);

        return response()->json([
            'data' => [
                'id' => $message->id,
                'message' => 'Mensagem enviada. Retornaremos em breve.',
            ],
        ], 201);
    }
}
