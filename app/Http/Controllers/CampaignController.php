<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Models\Campaign;
use Illuminate\Container\Attributes\Log;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as FacadesLog;
use Inertia\Inertia;

/*Bakal tambah 1 table untuk yg campaign sma verification request yaitu rejection reason
 tapi harus buat create untuk campaign dlu bru lanjut buat yang it */


class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Home');
    }

    public function AdminCampaign(Request $request)
    {
        $baseStatuses = ['active', 'completed', 'rejected', 'banned'];
        $campaigns = Campaign::with(['user', 'verifier'])
            ->whereIn('status', $baseStatuses)
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->get();

        return Inertia::render('Admin/Campaign/Campaign_List', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['status'])
        ]);
    }
    public function AdminVerification()
    {
        $campaigns = Campaign::with(['user', 'verifier'])->where('status', 'pending')->get();
        return Inertia::render('Admin/Campaign/Campaign_Verification', [
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        $verificationRequest = $user->verificationRequests()->latest()->first();

        if (!$verificationRequest) {
            // No verification request - show verification form
            return inertia('Verification/Create');
        }

        if ($verificationRequest->status->value === 'pending') {
            // Pending verification - show pending status
            return inertia('Verification/Pending');
        }

        if ($verificationRequest->status->value === 'rejected') {
            // Rejected verification - show rejection message
            return inertia('Verification/Rejected');
        }

        if ($verificationRequest->status->value === 'accepted') {
            // Accepted verification - show campaign create form
            return inertia('Campaign/Create');
        }

        return inertia('Verification/Create');
    }

    public function showList()
    {
        return inertia('Campaign/CampaignList');
    }

    public function showCreate()
    {
        return inertia::render('Campaign/Create', [
            'user_Id' => Auth::user()->id,
        ]);
    }

    public function createNewCampaign(Request $request) {
    //      $data = $request->validate([
    //     'title' => 'required|string',
    //     'description' => 'required|string',
    //     'goal_amount' => 'required|numeric',
    //     'start_date' => 'required|date',
    //     'end_date' => 'required|date',
    //     // ...other fields
    // ]);
        $data = $request->all();
        $data['user_id'] = Auth::id();
        $data['status'] = 'pending';

    Campaign::create($data);
    return redirect()->back()->with('success', 'Campaign created successfully!');
    }

    public function getCampaignListData(Request $request)
    {
        $category = $request->input('category');

        // get campaigns where they are not banned or rejected and is still pending
        if(!$category){
            return response()->json(['error' => 'Category parameter is required'], 400);
        }
        if ($category === 'All') {
            $campaigns = Campaign::where('status', ['active'])->get();
            // dd($campaigns);
        }else{
            $campaigns = Campaign::where('category', $request->input('category'))->where('status', ['active'])->get();

        }
        return response()->json($campaigns);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCampaignRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Campaign $campaign)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCampaignRequest $request, Campaign $campaign)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign)
    {
        //
    }
}
