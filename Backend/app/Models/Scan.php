<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scan extends Model
{
    use HasFactory;

    protected $table = 'scans';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'food_name',
        'calories',
        'protein',
        'fat',
        'carbs',
        'portion',
        'image_url',
        'scan_time',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
