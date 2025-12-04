<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function create()
    {
        return inertia::render('Admin/AdicionarProduto', [
            'categories' => Category::all(),
        ]);
    }

    // Salva o produto
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'nullable|existis:categories.id',
            'image' => 'nullable|image|mimes:jpeg.png.jpg.gif|max:2048'
        ]);

        $data = $validated;

        /// imagem
        if($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images'),$name);
            $data['image'] = 'images/' . $name;
        }

        Product::create($data);

        return redirect()->route('loja.index');
    }
}