<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['image_url'];

    /**
     * Get the full URL for the product image.
     *
     * @return string|null
     */
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // O helper asset() cria a URL correta para arquivos na pasta public.
            // O str_replace garante que a URL funcione mesmo com o caminho antigo "public/images/...".
            $imagePath = str_replace('public/', '', $this->image);
            return asset($imagePath);
        }

        return null;
    }

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
