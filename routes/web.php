<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LojaController;
use App\Http\Controllers\AdminProductController; // Importe o novo controller

// Redireciona raiz para a loja
Route::get('/', function () {
    return redirect()->route('loja.index');
});

// Página Pública
Route::get('/loja', [LojaController::class, 'index'])->name('loja.index');

// Dashboard (Padrão Breeze)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- ROTAS DE ADMINISTRAÇÃO (Protegidas) ---
Route::middleware('auth')->group(function () {
    
    // Formulário de novo produto
    Route::get('/admin/produtos/novo', [AdminProductController::class, 'create'])
        ->name('admin.products.create');

    // Salvar produto
    Route::post('/admin/produtos', [AdminProductController::class, 'store'])
        ->name('admin.products.store');

    // Rotas de perfil (Padrão Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';