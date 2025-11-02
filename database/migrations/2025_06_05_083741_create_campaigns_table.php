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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('verified_by')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            $table->string('title');
            $table->string('category');
            $table->decimal('goal_amount', 10, 2);
            $table->enum('status', ['pending', 'active', 'completed', 'rejected', 'banned'])->default('pending');
            $table->dateTime('start_campaign')->nullable();
            $table->dateTime('end_campaign')->nullable();
            $table->string('address');
            $table->string('duration');
            $table->text('description');
            $table->decimal('collected_amount', 10, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
