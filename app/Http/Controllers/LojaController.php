<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;

use Illuminate\Http\Request;

class LojaController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        $productsQuery = Product::query();
        $currentCategoryName = null;

        // Filtra produtos se um slug de categoria for passado na URL
        if ($request->filled('category')) {
            $categorySlug = $request->category;
            
            $productsQuery->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            });

            // Encontra o nome da categoria atual para destacar o link no frontend
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                $currentCategoryName = $category->name;
            }
        }

        $products = $productsQuery->get();

        return Inertia::render('Loja', [
            'products' => $products,
            'categories' => $categories,
            'currentCategory' => $currentCategoryName,
        ]);
    }
}
