<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class UpdateUserPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:update-password {email} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update user password by email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Utilisateur avec l'email '{$email}' non trouvé.");
            return 1;
        }

        $user->update([
            'password' => Hash::make($password),
            'must_change_password' => false,
        ]);

        $this->info("Mot de passe mis à jour avec succès pour l'utilisateur '{$user->name}' ({$email}).");
        
        return 0;
    }
}
