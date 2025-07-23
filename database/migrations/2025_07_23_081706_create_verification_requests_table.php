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
        Schema::create('verification_requests', function (Blueprint $table) {
            $table->id(); // Primary key

            // Foreign key to the users table (the user requesting verification)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade'); 
            $table->string('id_type');
            $table->string('selfie_with_id'); 
            $table->string('status')->default('pending'); 
            $table->foreignId('reviewed_by')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null'); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_requests');
    }
};
