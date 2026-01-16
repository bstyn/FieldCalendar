# 🔧 Konfiguracja Środowiska

## Backend - .env

Utwórz plik `backend/.env`:

```env
# Konfiguracja Serwera
PORT=5000
NODE_ENV=development

# Konfiguracja Bazy Danych
# Zmień 'postgres' i 'haslo' na swoje dane
DATABASE_URL=postgresql://postgres:haslo@localhost:5432/boiska

# Konfiguracja JWT
# WAŻNE: Zmień to na losowy ciąg minimum 32 znaków!
JWT_SECRET=super_tajny_klucz_jwt_min_32_znakow_zmien_to_w_produkcji
JWT_EXPIRE=7d

# Konfiguracja Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=twoj_email@gmail.com
EMAIL_PASSWORD=haslo_aplikacji_gmail_16_znakow
EMAIL_FROM=Rezerwacja Boisk <noreply@boiska.pl>

# URL Frontend
FRONTEND_URL=http://localhost:3000
```

### 📧 Jak Uzyskać Hasło Aplikacji Gmail:

1. Przejdź do https://myaccount.google.com/security
2. Włącz **"Weryfikacja dwuetapowa"**
3. Wróć do ustawień bezpieczeństwa
4. Kliknij **"Hasła aplikacji"**
5. Wybierz:
   - Aplikacja: **Poczta**
   - Urządzenie: **Inne** (wpisz "Rezerwacja Boisk")
6. Kliknij **Generuj**
7. Skopiuj 16-znakowe hasło (bez spacji)
8. Wklej do `.env` jako `EMAIL_PASSWORD`

## Frontend - .env

Utwórz plik `frontend/.env`:

```env
# URL do Backend API
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄️ PostgreSQL - Tworzenie Bazy Danych

### Metoda 1: pgAdmin

1. Otwórz pgAdmin
2. Kliknij prawym na "Databases"
3. Wybierz "Create" → "Database"
4. Nazwa: `boiska`
5. Kliknij "Save"

### Metoda 2: Linia Komend

```bash
# Zaloguj się do PostgreSQL
psql -U postgres

# Utwórz bazę danych
CREATE DATABASE boiska;

# Sprawdź czy została utworzona
\l

# Wyjdź
\q
```

### Metoda 3: SQL Shell (psql)

```powershell
# Otwórz SQL Shell (psql) z menu Start
# Naciśnij Enter dla domyślnych wartości
# Wpisz hasło postgres

CREATE DATABASE boiska;
```

## 🚀 Pierwsze Uruchomienie

### 1. Zainstaluj Node.js

Pobierz z https://nodejs.org/ (wersja LTS)

### 2. Zainstaluj PostgreSQL

Pobierz z https://www.postgresql.org/download/windows/

### 3. Sklonuj/Pobierz Projekt

```powershell
cd C:\Users\Bartek\Desktop\oliwier\projekt
```

### 4. Zainstaluj Zależności

**Backend:**

```powershell
cd backend
npm install
```

**Frontend:**

```powershell
cd ..\frontend
npm install
```

### 5. Konfiguracja

**Backend:**

```powershell
cd ..\backend
copy .env.example .env
# Edytuj plik .env w notatniku lub VS Code
```

**Frontend:**

```powershell
cd ..\frontend
copy .env.example .env
```

### 6. Utwórz Bazę Danych

```powershell
# W SQL Shell lub pgAdmin utwórz bazę 'boiska'
```

### 7. Uruchom Migracje

```powershell
cd ..\backend
npm run migrate
npm run seed
```

### 8. Uruchom Aplikację

**Terminal 1 - Backend:**

```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```powershell
cd frontend
npm start
```

### 9. Otwórz w Przeglądarce

http://localhost:3000

## ✅ Weryfikacja

### Sprawdź Backend:

Otwórz http://localhost:5000/api/health

Powinieneś zobaczyć:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Sprawdź Połączenie z Bazą:

W konsoli backendu powinieneś zobaczyć:

```
Database connected successfully
Server running on port 5000
```

### Sprawdź Boiska:

Otwórz http://localhost:5000/api/fields

Powinieneś zobaczyć listę 4 boisk.

## 🐛 Rozwiązywanie Problemów

### Problem: "Cannot connect to database"

**Rozwiązanie:**

- Sprawdź czy PostgreSQL jest uruchomiony
- Sprawdź `DATABASE_URL` w `.env`
- Sprawdź czy baza `boiska` istnieje
- Sprawdź hasło PostgreSQL

### Problem: "Port 5000 already in use"

**Rozwiązanie:**

```powershell
# Znajdź proces używający portu
netstat -ano | findstr :5000

# Zabij proces (zamień PID)
taskkill /PID <numer_pid> /F

# Lub zmień port w backend/.env
PORT=5001
```

### Problem: "Email not sending"

**Rozwiązanie:**

- Upewnij się że używasz hasła aplikacji (nie zwykłego hasła Gmail)
- Sprawdź czy weryfikacja dwuetapowa jest włączona
- Sprawdź `EMAIL_USER` i `EMAIL_PASSWORD` w `.env`
- Sprawdź czy email nie trafia do SPAM

### Problem: "npm install" nie działa

**Rozwiązanie:**

```powershell
# Wyczyść cache npm
npm cache clean --force

# Usuń node_modules i package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Zainstaluj ponownie
npm install
```

### Problem: Frontend nie łączy się z Backend

**Rozwiązanie:**

- Sprawdź czy backend działa na porcie 5000
- Sprawdź `proxy` w `frontend/package.json`:
  ```json
  "proxy": "http://localhost:5000"
  ```
- Uruchom ponownie frontend

## 📝 Tworzenie Pierwszego Admina

1. Zarejestruj się przez interfejs: http://localhost:3000/register

2. Otwórz SQL Shell lub pgAdmin

3. Wykonaj zapytanie:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'twoj_email@example.com';
```

4. Zaloguj się ponownie

5. Pojawi się link "Panel Administratora" w menu

## 🎯 Następne Kroki

Po pomyślnej konfiguracji:

1. **Dodaj boiska** (jeśli seed nie zadziałał):

   - Zaloguj się jako admin
   - Przejdź do panelu administratora
   - Zakładka "Boiska" → "Dodaj Nowe Boisko"

2. **Utwórz dostępne terminy**:

   - Panel administratora → "Kalendarz"
   - "Dodaj Nowe Wydarzenie"
   - Wybierz boisko, datę i godziny

3. **Przetestuj rezerwację**:
   - Wyloguj się
   - Przejdź na stronę główną
   - Wybierz boisko i datę
   - Kliknij "Zarezerwuj Boisko"

## 🌐 Wdrożenie Produkcyjne

Zobacz szczegółowe instrukcje w `README.md` sekcja "Wdrożenie na Heroku"

Podstawowe kroki:

1. Utwórz konto na Heroku
2. Zainstaluj Heroku CLI
3. Wdróż backend z PostgreSQL
4. Wdróż frontend
5. Ustaw zmienne środowiskowe
6. Uruchom migracje

---

**Powodzenia!** 🚀

Jeśli masz problemy, sprawdź:

- `README.md` - pełna dokumentacja
- `QUICKSTART.md` - szybki start
- `PODSUMOWANIE.md` - przegląd funkcji
