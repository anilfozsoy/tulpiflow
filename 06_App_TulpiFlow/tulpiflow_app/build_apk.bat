@echo off
chcp 65001 > nul
echo =======================================================================
echo          TULPIFLOW ANDROID APK DERLEME SİHİRBAZI (ÜCRETSİZ / CAPACITOR)
echo =======================================================================
echo.
echo Bu script, TulpiFlow uygulamasını tamamen yerel araçlarla (ücretsiz)
echo Android APK formatına paketlemek için gereken adımları otomatikleştirir.
echo.

cd /d "%~dp0"

echo [1/4] Bağımlılıklar denetleniyor...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Node.js ve npm sisteminizde bulunamadı.
    echo Lütfen https://nodejs.org adresinden ücretsiz LTS sürümünü kurun.
    pause
    exit /b 1
)

echo [2/4] Capacitor çekirdek kütüphaneleri yükleniyor (Local / Free)...
call npm install --save-dev @capacitor/core @capacitor/cli @capacitor/android

echo [3/4] Android projesi oluşturuluyor / senkronize ediliyor...
if not exist "android" (
    echo Android platformu ekleniyor...
    call npx cap add android
) else (
    echo Mevcut Android projesi senkronize ediliyor...
    call npx cap sync android
)

echo [4/4] Android Studio veya Gradle ile APK derleme...
where gradlew >nul 2>nul
if exist "android\gradlew.bat" (
    echo Gradle ile doğrudan Debug APK derleniyor...
    cd android
    call gradlew assembleDebug
    echo.
    echo =======================================================================
    echo [TEBRİKLER] APK başarıyla üretildi!
    echo Dosya Konumu: android\app\build\outputs\apk\debug\app-debug.apk
    echo =======================================================================
    cd ..
) else (
    echo Android Studio'da açılıyor... Lütfen 'Build > Build Bundle(s) / APK(s) > Build APK(s)' seçin.
    call npx cap open android
)

pause
