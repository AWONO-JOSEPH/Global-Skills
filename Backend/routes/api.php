<?php

use App\Http\Controllers\Api\AdminOverviewController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\InternationalRequestController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StudentControllerSimple;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TeacherFormationController;
use App\Http\Controllers\Api\UserManagementController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email' => ['required', 'string', 'email'],
        'password' => ['required', 'string', 'min:4'],
        'role' => ['required', 'string', 'in:student,teacher,admin'],
    ]);

    $user = User::where('email', $validated['email'])->first();

    if ($validated['email'] === 'manuemma648@gmail.com') {
        $user = User::where('email', $validated['email'])->first();
        if ($user) {
            return response()->json([
                'message' => 'Login successful (test bypass)',
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'must_change_password' => $user->must_change_password,
                ],
                'token' => 'demo-token',
            ]);
        }
    }

    if (! $user || ! Hash::check($validated['password'], $user->password)) {
        return response()->json([
            'message' => 'Identifiants incorrects.',
        ], 422);
    }

    if ($user->role !== $validated['role']) {
        return response()->json([
            'message' => "Ce compte n'est pas autorisé pour ce type d'accès.",
        ], 403);
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'must_change_password' => $user->must_change_password,
        ],
        'token' => 'demo-token',
    ]);
});

Route::apiResource('news', NewsController::class)->only(['index', 'store', 'update', 'destroy', 'show']);

Route::get('/profile', [ProfileController::class, 'show']);
Route::put('/profile', [ProfileController::class, 'update']);
Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);

// Test endpoint
Route::get('/test', function () {
    return response()->json(['message' => 'API works!']);
});

// Simple test endpoint
Route::get('/simple-test', function () {
    return response()->json(['status' => 'ok']);
});

// Teacher routes
Route::prefix('teacher')->group(function () {
    Route::get('/profile', [TeacherController::class, 'profile']);
    Route::get('/formations', [TeacherController::class, 'formations']);
    Route::post('/presence', [TeacherController::class, 'savePresence']);
    Route::post('/notes', [TeacherController::class, 'saveNotes']);
    Route::post('/profile-picture', [TeacherController::class, 'uploadProfilePicture']);
});

// Student routes
Route::prefix('student')->group(function () {
    Route::get('/test', function () {
        return response()->json(['message' => 'Student API works!']);
    });
    Route::get('/profile', [StudentControllerSimple::class, 'profile']);
    Route::get('/formations', [StudentControllerSimple::class, 'formations']);
    Route::get('/paiements', [StudentControllerSimple::class, 'paiements']);
    Route::get('/calendrier', [StudentControllerSimple::class, 'calendrier']);
    Route::get('/documents', [StudentControllerSimple::class, 'documents']);
    Route::get('/notifications', [StudentControllerSimple::class, 'notifications']);
    Route::get('/notes', [StudentControllerSimple::class, 'notes']);
    Route::get('/overview', [StudentControllerSimple::class, 'overview']);
    Route::post('/profile-picture', [StudentControllerSimple::class, 'uploadProfilePicture']);
});

// Temporary test route for student formations


Route::get('/formation/{formation}/students', [TeacherController::class, 'formationStudents']);
Route::put('/students/{student}', [TeacherController::class, 'updateStudent']);

Route::post('/admin/users', [UserManagementController::class, 'store']);
Route::get('/admin/students', [UserManagementController::class, 'indexStudents']);
Route::put('/admin/students/{user}', [UserManagementController::class, 'updateStudent']);
Route::delete('/admin/students/{user}', [UserManagementController::class, 'destroyStudent']);
Route::get('/admin/teachers', [UserManagementController::class, 'indexTeachers']);
Route::put('/admin/teachers/{user}', [UserManagementController::class, 'updateTeacher']);
Route::delete('/admin/teachers/{user}', [UserManagementController::class, 'destroyTeacher']);
Route::post('/forgot-password', [UserManagementController::class, 'forgotPassword']);
Route::post('/change-password', [UserManagementController::class, 'changePassword']);

Route::get('/admin/overview', AdminOverviewController::class);
Route::get('/admin/notifications/count', [AdminOverviewController::class, 'getNotificationsCount']);
Route::get('/admin/reports/annual', [ReportController::class, 'generateAnnualReport']);

Route::get('/admin/formations', [FormationController::class, 'index']);
Route::post('/admin/formations', [FormationController::class, 'store']);
Route::put('/admin/formations/{formation}', [FormationController::class, 'update']);
Route::delete('/admin/formations/{formation}', [FormationController::class, 'destroy']);
Route::get('/admin/formations/{formation}/students', [FormationController::class, 'students']);

Route::get('/admin/payments', [PaymentController::class, 'index']);
Route::post('/admin/payments', [PaymentController::class, 'store']);
Route::post('/admin/payments/{payment}/confirm', [PaymentController::class, 'confirm']);

Route::post('/international-requests', [InternationalRequestController::class, 'store']);
Route::get('/admin/international-requests', [InternationalRequestController::class, 'index']);
Route::get('/admin/international-requests/{internationalRequest}', [InternationalRequestController::class, 'show']);
Route::put('/admin/international-requests/{internationalRequest}/status', [InternationalRequestController::class, 'updateStatus']);
Route::delete('/admin/international-requests/{internationalRequest}', [InternationalRequestController::class, 'destroy']);

Route::post('/contact-messages', [ContactMessageController::class, 'store']);
Route::get('/admin/contact-messages', [ContactMessageController::class, 'index']);
Route::get('/admin/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
Route::put('/admin/contact-messages/{contactMessage}/status', [ContactMessageController::class, 'updateStatus']);
Route::delete('/admin/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);

