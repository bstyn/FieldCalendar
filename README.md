# System Rezerwacji Boisk Piłkarskich

Pełna aplikacja webowa do zarządzania rezerwacjami boisk piłkarskich, zbudowana w Node.js, Express, React i PostgreSQL.

## Funkcje

### Wyświetlanie Kalendarza
- Kalendarz pokazujący przejrzystą listę dni, tygodni lub miesięcy
- Możliwość przełączania między różnymi widokami (dzień, tydzień, miesiąc)
- Wyświetlanie zajętych i wolnych terminów
- Wybór konkretnego boiska do rezerwacji

### Rezerwacja Terminów
- Użytkownik może zaznaczyć konkretny termin i dodać go do kalendarza
- Podczas rezerwacji zbierane są niezbędne informacje (imię, nazwisko, email, telefon)
- Liczba graczy dla planowanego meczu
- System sprawdza dostępność terminu przed potwierdzeniem rezerwacji
- Automatyczne powiadomienia email o potwierdzeniu rezerwacji

### Zarządzanie Rezerwacjami
- Administrator ma możliwość przeglądania wszystkich rezerwacji
- Powinna istnieć możliwość edycji lub anulowania rezerwacji
- System powinien wysyłać automatyczne potwierdzenia rezerwacji
- Panel administracyjny do zarządzania boiskami
- Tworzenie i edycja terminów dostępności boisk

## Technologie

### Backend
- **Node.js** z Express.js
- **PostgreSQL** baza danych
- **JWT** uwierzytelnianie
- **Nodemailer** do powiadomień email
- **bcryptjs** do hashowania haseł

### Frontend  
- **React** 18 (język polski)
- **React Router** do nawigacji
- **React Calendar** do interfejsu kalendarza
- **Axios** do zapytań API
- **date-fns** do formatowania dat (z lokalizacją pl-PL)

### Wdrożenie
- **Render.com** z PostgreSQL (darmowy tier - bez karty kredytowej)
- Email przez Gmail SMTP (darmowy)

## Instalacja

### Wymagania
- Node.js 18+ zainstalowany
- PostgreSQL zainstalowany lokalnie (lub użyj Heroku PostgreSQL)
- Konto Gmail do wysyłania emaili

### Konfiguracja Backend

1. Przejdź do katalogu backend:
```bash
cd backend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj plik `.env.example` do `.env`:
```bash
copy .env.example .env
```

4. Zaktualizuj `.env` swoją konfiguracją:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/reservation_calendar
JWT_SECRET=twoj_sekretny_klucz
EMAIL_USER=twoj_email@gmail.com
EMAIL_PASSWORD=haslo_aplikacji
```

5. Uruchom migracje bazy danych:
```bash
npm run migrate
```

6. Uruchom serwer:
```bash
npm run dev
```

Backend będzie działał na http://localhost:5000

### Konfiguracja Frontend

1. Przejdź do katalogu frontend:
```bash
cd frontend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj plik `.env.example` do `.env`:
```bash
copy .env.example .env
```

4. Uruchom serwer deweloperski:
```bash
npm start
```

Frontend będzie działał na http://localhost:3000

## Konfiguracja Email

Aby użyć Gmail do wysyłania emaili:

1. Przejdź do ustawień konta Google
2. Włącz weryfikację dwuetapową
3. Wygeneruj hasło aplikacji:
   - Przejdź do Bezpieczeństwo → Weryfikacja dwuetapowa → Hasła aplikacji
   - Wybierz "Poczta" i "Inne (nazwa niestandardowa)"
   - Skopiuj wygenerowane hasło
4. Użyj tego hasła w pliku `.env` jako `EMAIL_PASSWORD`

## Schemat Bazy Danych

### Tabela users
- id (Klucz główny)
- name - imię i nazwisko
- email (unikalny)
- password (hashowany)
- role (user/admin)
- created_at, updated_at

### Tabela football_fields (Boiska)
- id (Klucz główny)
- name - nazwa boiska
- description - opis
- field_type - typ boiska (pełne/połowa/małe)
- surface_type - nawierzchnia (sztuczna/naturalna/hala)
- max_players - maksymalna liczba graczy
- hourly_rate - cena za godzinę (PLN)
- is_active - czy boisko jest aktywne
- created_at, updated_at

### Tabela calendar_events (Terminy)
- id (Klucz główny)
- field_id (Klucz obcy → football_fields)
- title - tytuł
- description - opis
- start_date - data rozpoczęcia
- end_date - data zakończenia
- event_type - typ (dostępne/zablokowane/specjalne)
- created_by (Klucz obcy → users)
- created_at, updated_at

### Tabela reservations (Rezerwacje)
- id (Klucz główny)
- field_id (Klucz obcy → football_fields)
- user_id (Klucz obcy → users)
- event_id (Klucz obcy → calendar_events)
- guest_name - imię gościa
- guest_email - email gościa
- guest_phone - telefon gościa
- start_time - czas rozpoczęcia
- end_time - czas zakończenia
- status - status (oczekująca/potwierdzona/anulowana)
- number_of_players - liczba graczy
- notes - uwagi
- confirmed_at - data potwierdzenia
- created_at, updated_at

## Endpointy API

### Uwierzytelnianie
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie

### Boiska
- `GET /api/fields` - Pobierz wszystkie boiska
- `GET /api/fields/:id` - Pobierz pojedyncze boisko

### Kalendarz
- `GET /api/calendar` - Pobierz wszystkie wydarzenia
- `GET /api/calendar/:id` - Pobierz pojedyncze wydarzenie
- `GET /api/calendar/available/slots?date=YYYY-MM-DD&field_id=X` - Pobierz dostępne sloty

### Rezerwacje
- `POST /api/reservations` - Utwórz rezerwację (publiczne)
- `GET /api/reservations` - Pobierz wszystkie rezerwacje (wymaga autoryzacji)
- `GET /api/reservations/:id` - Pobierz pojedynczą rezerwację
- `PATCH /api/reservations/:id/status` - Zaktualizuj status (wymaga autoryzacji)
- `DELETE /api/reservations/:id` - Usuń rezerwację (wymaga autoryzacji)

### Administrator
- `GET /api/admin/reservations` - Pobierz wszystkie rezerwacje z informacjami
- `GET /api/admin/fields` - Zarządzaj boiskami
- `POST /api/admin/fields` - Dodaj nowe boisko
- `PUT /api/admin/fields/:id` - Zaktualizuj boisko
- `DELETE /api/admin/fields/:id` - Usuń boisko
- `POST /api/admin/calendar` - Utwórz wydarzenie kalendarzowe
- `PUT /api/admin/calendar/:id` - Zaktualizuj wydarzenie
- `DELETE /api/admin/calendar/:id` - Usuń wydarzenie
- `GET /api/admin/stats` - Pobierz statystyki

## Wdrożenie na Render.com

### Wymagania
- Konto Render.com (darmowy tier, bez karty kredytowej)
- Konto GitHub do połączenia z Render

### Przygotowanie Kodu

1. Utwórz **jedno** repozytorium Git dla całego projektu (jeśli jeszcze nie masz):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Wgraj kod do GitHub:
```bash
git remote add origin https://github.com/twoja-nazwa/nazwa-repo.git
git push -u origin main
```

**Uwaga**: Używamy jednego repozytorium dla frontend i backend. Render automatycznie wykryje strukturę projektu.

### Wdrożenie Backend

1. Zaloguj się na [Render.com](https://render.com)

2. Kliknij "New +" → "Web Service"

3. Połącz swoje repozytorium GitHub (to samo repo dla obu serwisów)

4. Skonfiguruj serwis:
   - **Name**: `nazwa-twojej-aplikacji-backend`
   - **Root Directory**: `backend` *(ważne - wskaż folder backend)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Dodaj zmienne środowiskowe (Environment Variables):
   ```
   JWT_SECRET=twoj_sekretny_klucz_min_32_znaki
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=twoj_email@gmail.com
   EMAIL_PASSWORD=haslo_aplikacji_gmail
   EMAIL_FROM=noreply@twojaaplikacja.com
   FRONTEND_URL=https://twoj-frontend.onrender.com
   NODE_ENV=production
   ```

6. Kliknij "Create Web Service"

### Dodanie PostgreSQL do Backend

1. W panelu Render, kliknij "New +" → "PostgreSQL"

2. Skonfiguruj bazę danych:
   - **Name**: `nazwa-bazy-danych`
   - **Database**: `reservation_calendar`
   - **User**: (zostaw domyślne)
   - **Region**: (wybierz najbliższy region)
   - **Plan**: Free

3. Kliknij "Create Database"

4. Po utworzeniu bazy, skopiuj "Internal Database URL"

5. Wróć do swojego Web Service (backend) → Settings → Environment Variables

6. Dodaj zmienną:
   ```
   DATABASE_URL=skopiowany_internal_database_url
   ```

7. Zapisz zmiany - backend automatycznie się zrestartuje

### Uruchomienie Migracji

**Metoda 1: Przez Render Dashboard (Najłatwiejsza - Zalecana)**

1. W panelu Render, przejdź do swojej PostgreSQL Database
2. Kliknij **"Query"** w górnym menu (obok Connect, Info)
3. Otwórz plik `backend/migrations/schema.sql` na swoim komputerze
4. Skopiuj całą zawartość i wklej do Query editora w Render
5. Kliknij **"Run Query"**
6. Następnie otwórz plik `backend/migrations/seed.sql`
7. Skopiuj zawartość i wklej do Query editora
8. Kliknij **"Run Query"**

**Metoda 2: Przez psql lokalnie (jeśli masz zainstalowany PostgreSQL)**

1. W panelu Render Database, kliknij **"Connect"** → skopiuj "External Database URL"
2. W terminalu uruchom:
```bash
psql "skopiowany_external_database_url"
```
3. W psql uruchom:
```sql
\i backend/migrations/schema.sql
\i backend/migrations/seed.sql
```
4. Sprawdź utworzone tabele:
```sql
\dt
```

**Metoda 3: Przez Upload pliku (jeśli Render to wspiera)**

Możesz też skopiować zawartość plików SQL bezpośrednio do Query interface w Render Dashboard.

### Wdrożenie Frontend

1. W Render, kliknij "New +" → "Static Site"

2. Połącz **to samo repozytorium GitHub** (Render pozwala używać tego samego repo wielokrotnie)

3. Skonfiguruj:
   - **Name**: `nazwa-twojej-aplikacji-frontend`
   - **Root Directory**: `frontend` *(ważne - wskaż folder frontend)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Dodaj zmienną środowiskową:
   ```
   REACT_APP_API_URL=https://nazwa-twojej-aplikacji-backend.onrender.com/api
   ```

5. Kliknij "Create Static Site"

6. Po wdrożeniu, wróć do backend Environment Variables i zaktualizuj:
   ```
   FRONTEND_URL=https://twoj-faktyczny-url-frontend.onrender.com
   ```

### Ważne Informacje o Darmowym Tierze Render

- **Backend Web Service**: Usypia się po 15 minutach braku aktywności
- **Pierwsze uruchomienie**: Może zająć 30-50 sekund (cold start)
- **PostgreSQL**: 90 dni ważności dla darmowej bazy (możesz utworzyć nową po wygaśnięciu)
- **Automatyczne wdrożenie**: Każdy push do GitHub automatycznie wdraża nową wersję

### Rozwiązywanie Problemów

**Backend nie startuje?**
- Sprawdź logi w panelu Render
- Upewnij się, że wszystkie zmienne środowiskowe są ustawione
- Zweryfikuj, że `DATABASE_URL` jest poprawny

**CORS errors?**
- Upewnij się, że `FRONTEND_URL` w backend zawiera prawidłowy URL frontendu
- Sprawdź, czy w `server.js` CORS jest poprawnie skonfigurowany

**Baza danych nie działa?**
- Sprawdź, czy migracje zostały uruchomione
- Połącz się przez Shell i sprawdź tabele: `\dt`

## Tworzenie Użytkownika Administratora

Po wdrożeniu musisz ręcznie utworzyć użytkownika administratora w bazie danych:

1. W panelu Render, przejdź do PostgreSQL Database → "Connect" → skopiuj komendę PSQL

2. Połącz się z bazą lokalnie lub przez Render Shell:
```bash
psql -h [host] -U [user] -d [database]
```

3. Najpierw zarejestruj użytkownika przez frontend aplikacji

4. Następnie zaktualizuj użytkownika do roli administratora:
```sql
UPDATE users SET role = 'admin' WHERE email = 'twoj_email@example.com';
```

5. Wyloguj się i zaloguj ponownie, aby zobaczyć panel administratora

## Użytkowanie

1. **Użytkownicy publiczni**: Mogą przeglądać kalendarz i dokonywać rezerwacji boisk
2. **Zarejestrowani użytkownicy**: Mogą się zalogować i śledzić swoją historię rezerwacji
3. **Administratorzy**: Mogą zarządzać wszystkimi rezerwacjami, tworzyć/edytować/usuwać boiska i wydarzenia kalendarzowe, przeglądać statystyki

## Dodawanie Przykładowych Boisk

Po pierwszym uruchomieniu, możesz dodać przykładowe boiska:

```bash
npm run seed
```

To doda 4 przykładowe boiska:
- Boisko Główne (pełnowymiarowe, sztuczna trawa)
- Boisko Treningowe (połowa boiska)
- Orlik (małe boisko 5 na 5)
- Hala Sportowa (boisko halowe)

## Rozwój

- Backend działa na porcie 5000
- Frontend działa na porcie 3000
- Frontend proxy przekierowuje zapytania API do backendu w trybie deweloperskim

## Licencja

MIT
