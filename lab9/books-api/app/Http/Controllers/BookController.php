<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BookController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Book::orderBy('id')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $values = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'between:1,9999'],
        ]);

        return response()->json(Book::create($values), 201);
    }

    public function show(Book $book): JsonResponse
    {
        return response()->json($book);
    }

    public function update(Request $request, Book $book): JsonResponse
    {
        $values = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'author' => ['sometimes', 'required', 'string', 'max:255'],
            'year' => ['sometimes', 'nullable', 'integer', 'between:1,9999'],
        ]);
        $book->update($values);

        return response()->json($book);
    }

    public function destroy(Book $book): Response
    {
        $book->delete();

        return response()->noContent();
    }
}
