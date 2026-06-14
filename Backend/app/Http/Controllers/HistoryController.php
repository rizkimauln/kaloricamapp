<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scan;
use Carbon\Carbon;

class HistoryController extends Controller
{
    public function getHomeData(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['message' => 'User ID required'], 400);
        }

        $today = Carbon::today()->toDateString();

        // Get all scans for today
        $todayScans = Scan::where('user_id', $userId)
            ->whereDate('scan_time', $today)
            ->get();

        $todayCalories = $todayScans->sum('calories');
        $todayCount = $todayScans->count();

        // Get all scans for all time stats
        $allScans = Scan::where('user_id', $userId)->get();
        $totalScans = $allScans->count();
        $totalFoods = $allScans->unique('food_name')->count();
        // Calculate active days (unique days)
        $activeDays = $allScans->map(function($scan) {
            return Carbon::parse($scan->scan_time)->toDateString();
        })->unique()->count();

        // Calculate this week's stats
        $startOfWeek = Carbon::now()->startOfWeek();
        $weekScans = Scan::where('user_id', $userId)
            ->where('scan_time', '>=', $startOfWeek)
            ->get();
        $weekCalories = $weekScans->sum('calories');
        $weekScansCount = $weekScans->count();

        // Get 3 most recent scans
        $recentScans = Scan::where('user_id', $userId)
            ->orderBy('scan_time', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'today' => [
                'calories' => $todayCalories,
                'scan_count' => $todayCount,
            ],
            'stats' => [
                'total_scans' => $totalScans,
                'total_foods' => $totalFoods,
                'active_days' => $activeDays,
                'week_calories' => $weekCalories,
                'week_scans_count' => $weekScansCount
            ],
            'recent_scans' => $recentScans
        ]);
    }

    public function getHistoryData(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['message' => 'User ID required'], 400);
        }

        // Get all scans, ordered by newest first
        $scans = Scan::where('user_id', $userId)
            ->orderBy('scan_time', 'desc')
            ->get();

        // Group by date
        $grouped = [];
        foreach ($scans as $scan) {
            $date = Carbon::parse($scan->scan_time)->format('Y-m-d');
            if (!isset($grouped[$date])) {
                $grouped[$date] = [
                    'date' => $date,
                    'total_calories' => 0,
                    'items' => []
                ];
            }
            $grouped[$date]['total_calories'] += $scan->calories;
            $grouped[$date]['items'][] = $scan;
        }

        return response()->json([
            'history' => array_values($grouped)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'food_name' => 'required|string',
            'calories' => 'required|integer',
            'protein' => 'required|integer',
            'fat' => 'required|integer',
            'carbs' => 'required|integer',
            'portion' => 'required|string',
            'image_url' => 'nullable|string'
        ]);

        $scan = new Scan();
        $scan->user_id = $request->user_id;
        $scan->food_name = $request->food_name;
        $scan->calories = $request->calories;
        $scan->protein = $request->protein;
        $scan->fat = $request->fat;
        $scan->carbs = $request->carbs;
        $scan->portion = $request->portion;
        $scan->image_url = $request->image_url;
        $scan->scan_time = Carbon::now();
        $scan->save();

        return response()->json(['message' => 'Scan saved successfully', 'data' => $scan], 201);
    }
}
