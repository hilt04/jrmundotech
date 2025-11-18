<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Product;

use Illuminate\Http\Request;

class LojaController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render('Loja', ['products' => $products]);

    }
}
