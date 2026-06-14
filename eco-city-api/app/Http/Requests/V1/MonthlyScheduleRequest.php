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
            'neighborhood_id' => ['nullable', 'required_without:cep', 'integer', 'exists:neighborhoods,id'],
            'cep'             => ['nullable', 'required_without:neighborhood_id', 'string', 'regex:/^\d{8}$/'],
            'month'           => ['required', 'string', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
        ];
    }

    public function neighborhoodId(): ?int
    {
        $val = $this->validated('neighborhood_id');
        return $val !== null ? (int) $val : null;
    }

    public function cep(): ?string
    {
        $val = $this->validated('cep');
        return $val !== null ? (string) $val : null;
    }

    public function month(): string
    {
        return (string) $this->validated('month');
    }
}
