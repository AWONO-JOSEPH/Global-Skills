<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle demande de projet international</title>
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
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
        .alert {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .request-details {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #f5576c;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .btn-secondary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 NOUVELLE DEMANDE</h1>
        <p>Projet International - Global Skills</p>
    </div>

    <div class="content">
        <div class="alert">
            <strong>⚠️ Action requise :</strong> Une nouvelle demande de projet international a été soumise et nécessite votre attention.
        </div>
        
        <h2>Détails de la demande</h2>
        
        <div class="request-details">
            <h3>Informations du client</h3>
            <ul>
                <li><strong>Nom complet :</strong> {{ $request->first_name }} {{ $request->last_name }}</li>
                <li><strong>Email :</strong> {{ $request->email }}</li>
                <li><strong>Téléphone :</strong> {{ $request->phone }}</li>
                @if($request->profession)
                <li><strong>Profession :</strong> {{ $request->profession }}</li>
                @endif
                <li><strong>Date de soumission :</strong> {{ $request->created_at->format('d/m/Y H:i') }}</li>
                <li><strong>Statut :</strong> <span style="color: #f5576c; font-weight: bold;">{{ $request->status_label }}</span></li>
            </ul>
        </div>
        
        <div class="request-details">
            <h3>Description du projet</h3>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-style: italic;">
                "{{ $request->description }}"
            </p>
        </div>
        
        <h3>Actions recommandées</h3>
        <ol>
            <li>Contacter le client dans les 24 heures</li>
            <li>Évaluer la faisabilité du projet</li>
            <li>Proposer un rendez-vous de consultation</li>
            <li>Mettre à jour le statut dans le dashboard</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://globalskills.com/admin/international-requests" class="btn btn-secondary">
                👥 Voir dans le Dashboard
            </a>
            <a href="tel:{{ $request->phone }}" class="btn">
                📞 Appeler maintenant
            </a>
            <a href="mailto:{{ $request->email }}" class="btn">
                ✉️ Envoyer un email
            </a>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>📈 Statistiques du jour</h4>
            <p>Cette demande fait partie des nouvelles opportunités commerciales du jour. Pensez à suivre le processus standard de qualification.</p>
        </div>
    </div>

    <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>&copy; {{ date('Y') }} Global Skills - Système de gestion des demandes</p>
        <p>Cet email a été généré automatiquement par la plateforme Global Skills</p>
    </div>
</body>
</html>
