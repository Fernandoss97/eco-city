<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\ResolveCepRequest;
use App\Http\Resources\V1\NeighborhoodResource;
use App\Models\Neighborhood;
use App\Services\NeighborhoodResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NeighborhoodController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) min(max((int) $request->integer('per_page', 15), 1), 100);

        $neighborhoods = Neighborhood::query()
            ->orderBy('name')
            ->paginate($perPage);

        return NeighborhoodResource::collection($neighborhoods);
    }

    public function show(Neighborhood $neighborhood): NeighborhoodResource
    {
        $neighborhood->load(['schedules', 'cepPrefixes']);

        return new NeighborhoodResource($neighborhood);
    }

    public function resolve(ResolveCepRequest $request, NeighborhoodResolver $resolver): JsonResponse|NeighborhoodResource
    {
        $result = $resolver->resolve($request->cep());

        if ($result === null) {
            return response()->json([
                'message' => 'CEP fora da área de cobertura.',
            ], 404);
        }

        $neighborhood = $result['neighborhood'];
        $neighborhood->matched_prefix = $result['matched_prefix'];

        return new NeighborhoodResource($neighborhood);
    }
}
