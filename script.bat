@echo off
echo ========================================
echo Creando estructura del proyecto MVT - News
echo ========================================

REM Carpetas principales
mkdir src
mkdir src\news\model
mkdir src\news\router
mkdir src\news\types
mkdir src\news\view
mkdir src\error\router
mkdir src\error\view
mkdir src\public\css
mkdir src\template
mkdir database
mkdir test

REM Archivos base
echo [] > database\news.json
type nul > .gitignore
type nul > package.json
type nul > tsconfig.json
type nul > src\index.ts
type nul > src\public\css\app.css
type nul > src\template\news-list.ejs
type nul > src\template\news-detail.ejs
type nul > src\template\news-form.ejs
type nul > src\template\menu.ejs
type nul > src\template\error.ejs

REM Crear archivo News.ts
(
echo export interface News {
echo.  id: number;
echo.  title: string;
echo.  content: string;
echo.  author: string;
echo.  date: string;
echo }
) > src\news\types\News.ts

echo ✅ Proyecto MVT - News creado exitosamente.
pause
