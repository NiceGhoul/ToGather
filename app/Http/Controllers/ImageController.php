<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        //
    }

    public function uploadImage(Request $request)
    {
        try {
            // Handle both 'image' and 'files' field names for different editors
            $file = null;

            if ($request->hasFile('image')) {
                $file = $request->file('image');
            } elseif ($request->hasFile('files') && is_array($request->file('files'))) {
                $file = $request->file('files')[0];
            } elseif ($request->hasFile('files')) {
                $file = $request->file('files');
            }

            if (!$file || !$file->isValid()) {
                return response()->json(['error' => 'No valid file uploaded'], 400);
            }

            $path = $file->store('article-images', 'public');

            $image = Image::create([
                'path' => $path,
                'imageable_id' => null,
                'imageable_type' => null
            ]);

            $imageUrl = url('/storage/' . $path);

            return response()->json([
                'success' => 1,
                'data' => [
                    'files' => [$imageUrl]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Image upload error: ' . $e->getMessage());
            return response()->json(['error' => 'Upload failed'], 500);
        }
    }
}
