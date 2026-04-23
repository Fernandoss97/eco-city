<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class ResolveCepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'cep' => ['required', 'string', 'regex:/^\d{8}$/'],
        ];
    }

    public function cep(): string
    {
        return (string) $this->validated('cep');
    }
}
