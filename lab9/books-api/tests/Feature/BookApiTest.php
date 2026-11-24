<?php

namespace Tests\Feature;

use App\Models\Book;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_books_can_be_created_listed_and_read(): void
    {
        $this->getJson('/api/books')->assertOk()->assertExactJson([]);
        $books = [
            ['title' => 'Dune', 'author' => 'Frank Herbert', 'year' => 1965],
            ['title' => 'Emma', 'author' => 'Jane Austen', 'year' => 1815],
            ['title' => 'Persuasion', 'author' => 'Jane Austen', 'year' => 1817],
        ];
        foreach ($books as $values) {
            $response = $this->postJson('/api/books', $values)->assertCreated()->assertJsonFragment($values);
            $this->getJson('/api/books/'.$response->json('id'))->assertOk()->assertJsonFragment($values);
            $this->assertDatabaseHas('books', $values);
        }
        $this->getJson('/api/books')->assertOk()->assertJsonCount(3);
    }

    public function test_year_is_optional_and_extra_fields_are_not_mass_assigned(): void
    {
        $this->postJson('/api/books', ['title' => 'Dune', 'author' => 'Frank Herbert', 'id' => 999])
            ->assertCreated()->assertJsonPath('id', 1);
        $this->assertDatabaseHas('books', ['id' => 1, 'year' => null]);
    }

    public function test_missing_or_invalid_fields_return_validation_errors(): void
    {
        $this->postJson('/api/books', ['author' => 'Jane Austen'])->assertUnprocessable()->assertJsonValidationErrors('title');
        $this->postJson('/api/books', ['title' => ' ', 'author' => [], 'year' => 'yesterday'])
            ->assertUnprocessable()->assertJsonValidationErrors(['title', 'author', 'year']);
        $this->assertDatabaseCount('books', 0);
    }

    public function test_a_book_can_be_updated_and_deleted(): void
    {
        $book = Book::create(['title' => 'Dune', 'author' => 'Frank Herbert', 'year' => 1964]);
        $this->patchJson('/api/books/'.$book->id, ['year' => 1965])->assertOk()->assertJsonPath('year', 1965);
        $this->assertDatabaseHas('books', ['id' => $book->id, 'year' => 1965]);
        $this->deleteJson('/api/books/'.$book->id)->assertNoContent();
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
        $this->getJson('/api/books/'.$book->id)->assertNotFound();
    }

    public function test_unknown_books_return_404(): void
    {
        $this->getJson('/api/books/999')->assertNotFound();
        $this->putJson('/api/books/999', ['title' => 'Missing'])->assertNotFound();
        $this->deleteJson('/api/books/999')->assertNotFound();
    }
}
