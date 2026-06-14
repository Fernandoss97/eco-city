<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\MonthlyScheduleRequest;
use App\Http\Resources\V1\CollectionScheduleResource;
use App\Models\Neighborhood;
use App\Services\NeighborhoodResolver;
use App\Services\ScheduleExpander;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    public function byNeighborhood(Neighborhood $neighborhood): JsonResponse
    {
        $schedules = $neighborhood->schedules()
            ->orderBy('weekday')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => [
                'neighborhood' => [
                    'id' => $neighborhood->id,
                    'city' => $neighborhood->city,
                    'name' => $neighborhood->name,
                ],
                'schedule' => CollectionScheduleResource::collection($schedules)->resolve(),
            ],
        ]);
    }

    public function monthly(MonthlyScheduleRequest $request, NeighborhoodResolver $resolver, ScheduleExpander $expander): JsonResponse
    {
        if ($request->neighborhoodId() !== null) {
            $neighborhood = Neighborhood::find($request->neighborhoodId());

            if ($neighborhood === null) {
                return response()->json(['message' => 'Bairro não encontrado.'], 404);
            }
        } else {
            $result = $resolver->resolve((string) $request->cep());

            if ($result === null) {
                return response()->json(['message' => 'CEP fora da área de cobertura.'], 404);
            }

            $neighborhood = $result['neighborhood'];
        }

        return response()->json([
            'data' => [
                'neighborhood' => [
                    'id' => $neighborhood->id,
                    'city' => $neighborhood->city,
                    'name' => $neighborhood->name,
                ],
                'month' => $request->month(),
                'days' => $expander->expandMonth($neighborhood, $request->month()),
            ],
        ]);
    }
}
