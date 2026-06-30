@echo off
chcp 65001 >nul
echo RE:MUSE Vercel 배포
echo.
echo GitHub 저장소: https://github.com/minsu7805/remuse
echo.
echo 1. Vercel 로그인
echo 2. Import Git Repository 에서 remuse 선택
echo 3. Framework Preset: Other
echo 4. Root Directory: ./
echo 5. Build Command / Output Directory: 비워두기
echo 6. Deploy 후 Settings - Deployment Protection 끄기
echo.
start https://vercel.com/new/import?s=https://github.com/minsu7805/remuse
pause
