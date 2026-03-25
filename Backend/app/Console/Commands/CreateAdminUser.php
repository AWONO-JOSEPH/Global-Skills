<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'user:create-admin {email} {password}';
    protected $description = 'Create a new admin user';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = User::create([
            'name' => 'Admin User',
            'first_name' => 'Admin',
            'last_name' => 'Global Skills',
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
            'must_change_password' => false,
        ]);

        $this->info("Admin user created successfully with email: {$email}");
    }
}
