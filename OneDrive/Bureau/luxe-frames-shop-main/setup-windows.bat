@echo off
echo ========================================
echo LuxVision - Configuration Initiale
echo ========================================
echo.

echo [1/5] Verification du fichier server/.env...
if not exist server\.env (
    echo Fichier server/.env non trouve. Creation...
    copy .env.example server\.env
    echo.
    echo IMPORTANT: Editez le fichier server/.env et modifiez DATABASE_URL avec vos identifiants PostgreSQL
    echo Appuyez sur une touche apres avoir modifie server/.env...
    pause
) else (
    echo Fichier server/.env existe deja.
)
echo.

echo [2/5] Installation des dependances principales...
call npm install
echo.

echo [3/5] Installation des dependances du serveur...
cd server
call npm install
cd ..
echo.

echo [4/5] Generation du client Prisma...
call npm run prisma:generate
echo.

echo [5/5] Configuration de la base de donnees...
echo.
echo Assurez-vous que PostgreSQL est demarre et que la base de donnees 'luxvision_db' existe.
echo.
echo Voulez-vous executer les migrations maintenant? (O/N)
set /p choice=
if /i "%choice%"=="O" (
    call npm run db:setup
    echo.
    echo ========================================
    echo Configuration terminee avec succes!
    echo ========================================
    echo.
    echo Vous pouvez maintenant lancer l'application avec:
    echo   npm run dev:all
    echo.
) else (
    echo.
    echo Configuration partielle terminee.
    echo.
    echo Pour terminer la configuration, executez:
    echo   npm run db:setup
    echo.
    echo Puis lancez l'application avec:
    echo   npm run dev:all
    echo.
)

pause
