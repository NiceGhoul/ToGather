<?php

namespace App\Http\Controllers;

use App\Models\Lookup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LookupController extends Controller
{
    public function index(Request $request)
    {
        $lookups = Lookup::all();
        return Inertia::render('Admin/Lookup', [
            'lookups' => $lookups,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'lookup_type' => 'required|string|max:100',
            'lookup_code' => 'required|string|max:50|unique:lookups,lookup_code,',
            'lookup_value' => 'required|string|max:255',
            'lookup_description' => 'required|string|max:255',
        ]);

        Lookup::create($request->all());

        return redirect()->route('admin.lookups.index')->with('success', 'Lookup added successfully.');
    }


        public function update(Request $request, $id)
    {
        $request->validate([
            'lookup_type' => 'required|string|max:100',
            'lookup_code' => 'required|string|max:50|unique:lookups,lookup_code,' . $id,
            'lookup_value' => 'required|string|max:255',
            'lookup_description' => 'required|string|max:255',
        ]);

        $lookup = Lookup::findOrFail($id);
        $lookup->update($request->all());

        return redirect()->route('admin.lookups.index')->with('success', 'Lookup updated successfully.');
    }

    public function destroy($id)
    {
        $lookup = Lookup::findOrFail($id);
        $lookup->delete();

        return redirect()->route('admin.lookups.index')->with('success', 'Lookup deleted successfully.');
    }
}
