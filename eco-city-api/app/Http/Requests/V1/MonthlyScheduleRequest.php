<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class MonthlyScheduleRequest extends FormRequest
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
            'month' => ['required', 'string', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
        ];
    }

    public function cep(): string
    {
        return (string) $this->validated('cep');
    }

    public function month(): string
    {
        return (string) $this->validated('month');
    }
}
