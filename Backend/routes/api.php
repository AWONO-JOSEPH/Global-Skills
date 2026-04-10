<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminOverviewController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\InternationalRequestController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StudentControllerSimple;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TeacherFormationController;
use App\Http\Controllers\Api\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Public endpoints
Route::get('/test', fn () => response()->json(['message' => 'API works!']));
Route::get('/simple-test', fn () => response()->json(['status' => 'ok']));
Route::get('/ping', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));

Route::apiResource('news', NewsController::class)->only(['index', 'show']);
Route::post('/international-requests', [InternationalRequestController::class, 'store']);
Route::post('/contact-messages', [ContactMessageController::class, 'store']);
Route::post('/forgot-password', [UserManagementController::class, 'forgotPassword']);
Route::post('/change-password', [UserManagementController::class, 'changePassword']);

// Authenticated (any role)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);

    // Program tracking routes (teacher/admin)
    Route::middleware('role:teacher,admin')->group(function () {
        Route::get('/program-trackings', [\App\Http\Controllers\Api\ProgramTrackingController::class, 'index']);
        Route::post('/program-trackings', [\App\Http\Controllers\Api\ProgramTrackingController::class, 'store']);
        Route::put('/program-trackings/{programTracking}', [\App\Http\Controllers\Api\ProgramTrackingController::class, 'update']);
        Route::delete('/program-trackings/{programTracking}', [\App\Http\Controllers\Api\ProgramTrackingController::class, 'destroy']);
    });
    Route::post('/program-trackings/{programTracking}/sign', [\App\Http\Controllers\Api\ProgramTrackingController::class, 'sign'])
        ->middleware('role:admin');

    // Teacher routes
    Route::prefix('teacher')->middleware('role:teacher')->group(function () {
        Route::get('/profile', [TeacherController::class, 'profile']);
        Route::get('/formations', [TeacherController::class, 'formations']);
        Route::post('/presence', [TeacherController::class, 'savePresence']);
        Route::post('/notes', [TeacherController::class, 'saveNotes']);
        Route::post('/profile-picture', [TeacherController::class, 'uploadProfilePicture']);
    });

    // Teacher endpoints used by the existing frontend routes
    Route::middleware('role:teacher')->group(function () {
        Route::get('/formation/{formation}/students', [TeacherController::class, 'formationStudents']);
        Route::put('/students/{student}', [TeacherController::class, 'updateStudent']);
    });

    // Student routes
    Route::prefix('student')->middleware('role:student')->group(function () {
        Route::get('/test', fn () => response()->json(['message' => 'Student API works!']));
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

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::get('/students', [UserManagementController::class, 'indexStudents']);
        Route::put('/students/{user}', [UserManagementController::class, 'updateStudent']);
        Route::delete('/students/{user}', [UserManagementController::class, 'destroyStudent']);
        Route::get('/teachers', [UserManagementController::class, 'indexTeachers']);
        Route::put('/teachers/{user}', [UserManagementController::class, 'updateTeacher']);
        Route::delete('/teachers/{user}', [UserManagementController::class, 'destroyTeacher']);

        Route::get('/overview', AdminOverviewController::class);
        Route::get('/notifications/count', [AdminOverviewController::class, 'getNotificationsCount']);
        Route::get('/reports/annual', [ReportController::class, 'generateAnnualReport']);
        Route::get('/reports/tracking', [ReportController::class, 'generateTrackingReport']);

        Route::get('/formations', [FormationController::class, 'index']);
        Route::post('/formations', [FormationController::class, 'store']);
        Route::put('/formations/{formation}', [FormationController::class, 'update']);
        Route::delete('/formations/{formation}', [FormationController::class, 'destroy']);
        Route::get('/formations/{formation}/students', [FormationController::class, 'students']);

        Route::get('/payments', [PaymentController::class, 'index']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);

        Route::get('/international-requests', [InternationalRequestController::class, 'index']);
        Route::get('/international-requests/{internationalRequest}', [InternationalRequestController::class, 'show']);
        Route::put('/international-requests/{internationalRequest}/status', [InternationalRequestController::class, 'updateStatus']);
        Route::delete('/international-requests/{internationalRequest}', [InternationalRequestController::class, 'destroy']);

        Route::get('/contact-messages', [ContactMessageController::class, 'index']);
        Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
        Route::put('/contact-messages/{contactMessage}/status', [ContactMessageController::class, 'updateStatus']);
        Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);

        // Backward-compat for existing frontend paths
        Route::apiResource('news', NewsController::class)->only(['store', 'update', 'destroy']);
    });

    // News write endpoints (teacher/admin)
    // The public `/api/news` resource is read-only; writes were previously only under `/api/admin/news`.
    // Expose write routes at `/api/news` too so both admin & teacher can publish.
    Route::middleware('role:teacher,admin')->group(function () {
        Route::post('/news', [NewsController::class, 'store']);
        Route::match(['put', 'patch'], '/news/{news}', [NewsController::class, 'update']);
        Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    });
});

