<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('verification_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verification_request_id')
                ->constrained('verification_requests')
                ->onDelete('cascade');
            $table->string('id_photo_path');
            $table->string('selfie_with_id_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_images');
    }
};
