<?php

namespace App\Http\Controllers;

use App\Services\MinioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    protected $minioService;

    public function __construct(MinioService $minioService)
    {
        $this->minioService = $minioService;
    }

    public function uploadVideo(Request $request)
    {
        $request->validate([
            'video' => 'required|file|mimes:mp4,avi,mov,wmv|max:512000' // 500MB max
        ]);

        try {
            $path = $this->minioService->uploadVideo($request->file('video'));
            $url = $this->minioService->getFileUrl($path);

            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => $url
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Upload failed'], 500);
        }
    }

    public function uploadDocument(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,doc,docx,txt,xlsx,xls|max:10240' // 10MB max
        ]);

        try {
            $path = $this->minioService->uploadDocument($request->file('document'));
            $url = $this->minioService->getFileUrl($path);

            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => $url
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Upload failed'], 500);
        }
    }

    public function listVideos()
    {
        try {
            $disk = Storage::disk('minio');
            $files = $disk->files('videos');
            
            $videos = [];
            foreach ($files as $file) {
                $videos[] = [
                    'path' => $file,
                    'url' => $this->minioService->getFileUrl($file)
                ];
            }
            
            return response()->json([
                'success' => true,
                'videos' => $videos
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to list videos'], 500);
        }
    }

    public function getVideo(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            if (!$this->minioService->fileExists($request->path)) {
                return response()->json(['error' => 'Video not found'], 404);
            }

            $url = $this->minioService->getFileUrl($request->path);
            
            return response()->json([
                'success' => true,
                'path' => $request->path,
                'url' => $url
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get video'], 500);
        }
    }

    public function deleteFile(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            $deleted = $this->minioService->deleteFile($request->path);
            
            return response()->json([
                'success' => $deleted
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Delete failed'], 500);
        }
    }
}