<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre demande a été reçue</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Global Skills</h1>
        <p>Votre Partenaire pour l'Éducation Internationale</p>
    </div>

    <div class="content">
        <h2>Votre demande a été reçue !</h2>
        
        <p>Cher/Chère {{ $request->first_name }} {{ $request->last_name }},</p>
        
        <p>Nous avons bien reçu votre demande de projet international. Merci de votre intérêt pour Global Skills !</p>
        
        <p>Un conseiller spécialisé va étudier votre dossier et vous contactera dans les plus brefs délais pour discuter de votre projet.</p>
        
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Récapitulatif de votre demande :</h3>
            <ul>
                <li><strong>Nom :</strong> {{ $request->first_name }} {{ $request->last_name }}</li>
                <li><strong>Email :</strong> {{ $request->email }}</li>
                <li><strong>Téléphone :</strong> {{ $request->phone }}</li>
                @if($request->profession)
                <li><strong>Profession :</strong> {{ $request->profession }}</li>
                @endif
                <li><strong>Description du projet :</strong> {{ $request->description }}</li>
            </ul>
        </div>
        
        <p><strong>Prochaines étapes :</strong></p>
        <ol>
            <li>Analyse de votre dossier par notre équipe</li>
            <li>Contact téléphonique ou email dans les 24-48h</li>
            <li>Proposition de rendez-vous personnalisé</li>
            <li>Élaboration de votre projet sur mesure</li>
        </ol>
        
        <p>Pour toute question urgente, n'hésitez pas à nous contacter :</p>
        <ul>
            <li><strong>Téléphone :</strong> +237 640 204 112</li>
            <li><strong>Email :</strong> globalskills524@gmail.com</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="https://globalskills.com" class="btn">Visiter notre site</a>
        </div>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} Global Skills. Tous droits réservés.</p>
        <p>Cet email a été envoyé automatiquement. Merci de ne pas répondre directement à cet email.</p>
    </div>
</body>
</html>
