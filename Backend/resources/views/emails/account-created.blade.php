<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre compte Global Skills</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #1e293b;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header img {
            height: 60px;
            margin-bottom: 16px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-text {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #1e293b;
        }
        .info-box {
            background-color: #f1f5f9;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 24px 0;
            border-radius: 4px;
        }
        .info-item {
            margin: 12px 0;
            display: flex;
            align-items: center;
        }
        .info-label {
            font-weight: 600;
            color: #475569;
            min-width: 140px;
        }
        .info-value {
            color: #1e293b;
            font-family: 'Courier New', monospace;
            background-color: #ffffff;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        .password-highlight {
            background-color: #fef3c7;
            border-color: #f59e0b;
            font-weight: 600;
            color: #92400e;
        }
        .login-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            margin: 24px 0;
            text-align: center;
        }
        .login-button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text {
            color: #64748b;
            font-size: 14px;
            margin: 0;
        }
        .security-note {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
            color: #991b1b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://raw.githubusercontent.com/AWONO-JOSEPH/Global-Skills/main/Frontend/src/assets/84498a56cb9356abc2f9404869c93b519e727718.png" alt="Global Skills Logo" onerror="this.style.display='none'">
            <h1>GLOBAL SKILLS</h1>
        </div>
        
        <div class="content">
            <p class="welcome-text">Bonjour {{ $user->name }},</p>
            
            <p>Votre compte Global Skills a été créé avec succès. Voici vos informations de connexion :</p>
            
            <div class="info-box">
                <div class="info-item">
                    <span class="info-label">Email :</span>
                    <span class="info-value">{{ $user->email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Mot de passe :</span>
                    <span class="info-value password-highlight">{{ $password }}</span>
                </div>
            </div>
            
            <div class="security-note">
                <strong>⚠️ Important :</strong> Ce mot de passe est temporaire. Vous devrez le changer lors de votre première connexion pour sécuriser votre compte.
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/login') }}" class="login-button">
                    Se connecter maintenant
                </a>
            </p>
            
            <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br>L'équipe Global Skills</p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2026 Global Skills - Plateforme de Formation Professionnelle<br>
                Cet email a été envoyé automatiquement. Merci de ne pas répondre à cet email.
            </p>
        </div>
    </div>
</body>
</html>

