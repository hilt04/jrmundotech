<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpa a tabela antes de adicionar (opcional)
        Product::truncate();

        Product::create([
            'name' => 'Monitor Gamer UltraWide 29"',
            'price' => 1299.90,
            'image_url' => '[https://placehold.co/300x200/000/FFF?text=Monitor](https://placehold.co/300x200/000/FFF?text=Monitor)'
        ]);
        // (Adicione os outros produtos aqui... copiei do seu arquivo)
        Product::create(['name' => 'Teclado Mecânico RGB', 'price' => 349.90, 'image_url' => '[https://placehold.co/300x200/333/FFF?text=Teclado](https://placehold.co/300x200/333/FFF?text=Teclado)']);
        Product::create(['name' => 'Mouse Óptico sem Fio', 'price' => 120.00, 'image_url' => '[https://placehold.co/300x200/555/FFF?text=Mouse](https://placehold.co/300x200/555/FFF?text=Mouse)']);
        Product::create(['name' => 'Headset Gamer 7.1', 'price' => 499.50, 'image_url' => '[https://placehold.co/300x200/777/FFF?text=Headset](https://placehold.co/300x200/777/FFF?text=Headset)']);

    }
}
