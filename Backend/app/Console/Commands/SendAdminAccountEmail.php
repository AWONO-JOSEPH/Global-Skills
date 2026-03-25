<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\AccountCreated;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SendAdminAccountEmail extends Command
{
    protected $signature = 'user:send-admin-email {email}';
    protected $description = 'Reset password and send account creation email to admin';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'first_name' => 'Admin',
                'last_name' => 'Global Skills',
                'email' => $email,
                'password' => Hash::make('temp_password'), // will be updated
                'role' => 'admin',
                'must_change_password' => true,
            ]);
        } else {
            $user->role = 'admin';
            $user->save();
        }

        $newPassword = 'MKFRcnzX4J8xFLV'; // A secure password found in render.txt
        $user->password = Hash::make($newPassword);
        $user->must_change_password = true;
        $user->save();

        Mail::to($user->email)->send(new AccountCreated($user, $newPassword));

        $this->info("Password reset and email sent to {$email}. New password: {$newPassword}");
    }
}
