<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('article_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['text', 'image']);
            $table->longText('content')->nullable(); // text content / image URL
            $table->integer('order_x')->default(1); // 1 = left, 2 = right
            $table->integer('order_y')->default(1); // row order
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_contents');
    }
};
