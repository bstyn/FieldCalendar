# Szybki Start - System Rezerwacji Boisk Piłkarskich

## 🚀 Instalacja i Uruchomienie

### 1. Zainstaluj zależności

**Backend:**

```powershell
cd backend
npm install
```

**Frontend:**

```powershell
cd frontend
npm install
```

### 2. Konfiguracja Bazy Danych

Skopiuj i edytuj plik konfiguracyjny:

```powershell
cd backend
copy .env.example .env
```

Edytuj plik `.env` i ustaw:

```env
DATABASE_URL=postgresql://postgres:haslo@localhost:5432/boiska
JWT_SECRET=jakis_bezpieczny_sekret_min_32_znaki
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=twoj_email@gmail.com
EMAIL_PASSWORD=haslo_aplikacji_gmail
EMAIL_FROM=noreply@boiska.pl
FRONTEND_URL=http://localhost:3000
```

### 3. Utwórz bazę danych

W PostgreSQL:

```sql
CREATE DATABASE boiska;
```

### 4. Uruchom migracje

```powershell
cd backend
npm run migrate
npm run seed
```

### 5. Uruchom aplikację

**Backend (terminal 1):**

```powershell
cd backend
npm run dev
```

**Frontend (terminal 2):**

```powershell
cd frontend
copy .env.example .env
npm start
```

### 6. Otwórz w przeglądarce

Frontend: http://localhost:3000
Backend API: http://localhost:5000

## 👤 Tworzenie konta administratora

1. Zarejestruj nowe konto przez interfejs
2. W PostgreSQL zmień rolę na admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'twoj_email@example.com';
```

## 📧 Konfiguracja Gmail

1. Przejdź do https://myaccount.google.com/security
2. Włącz "Weryfikacja dwuetapowa"
3. Wejdź w "Hasła aplikacji"
4. Wybierz "Poczta" i "Inne"
5. Skopiuj wygenerowane hasło do `.env` jako `EMAIL_PASSWORD`

## 🎮 Funkcje

### Użytkownicy:

- ✅ Przeglądanie dostępnych boisk
- ✅ Wybór daty i godziny
- ✅ Rezerwacja boiska (bez logowania)
- ✅ Automatyczne powiadomienia email

### Administratorzy:

- ✅ Panel administracyjny
- ✅ Zarządzanie boiskami (dodawanie, edycja, usuwanie)
- ✅ Zarządzanie rezerwacjami (potwierdzanie, anulowanie)
- ✅ Tworzenie dostępnych terminów w kalendarzu
- ✅ Statystyki rezerwacji

## 📋 Struktura Projektu

```
projekt/
├── backend/
│   ├── config/          # Konfiguracja bazy danych
│   ├── middleware/      # Autoryzacja JWT
│   ├── migrations/      # Migracje i seed
│   ├── routes/          # Endpointy API
│   │   ├── auth.js      # Logowanie/rejestracja
│   │   ├── fields.js    # Boiska
│   │   ├── calendar.js  # Kalendarz
│   │   ├── reservations.js  # Rezerwacje
│   │   └── admin.js     # Panel admin
│   ├── utils/           # Email
│   └── server.js        # Główny plik serwera
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Komponenty React
│   │   │   ├── Navbar.js
│   │   │   └── ReservationForm.js
│   │   ├── context/     # Kontekst autoryzacji
│   │   ├── pages/       # Strony
│   │   │   ├── Home.js  # Strona główna z kalendarzem
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── AdminDashboard.js  # Panel admina
│   │   └── App.js
│   └── public/
│
└── README.md
```

## 🔧 Najczęstsze Problemy

### Błąd połączenia z bazą danych

- Upewnij się, że PostgreSQL jest uruchomiony
- Sprawdź czy `DATABASE_URL` w `.env` jest poprawny

### Email nie jest wysyłany

- Sprawdź czy używasz hasła aplikacji Gmail (nie zwykłego hasła)
- Upewnij się, że weryfikacja dwuetapowa jest włączona

### Frontend nie widzi API

- Sprawdź czy backend działa na porcie 5000
- Sprawdź konfigurację proxy w `package.json` frontendu

## 📝 Przykładowe Dane

Po uruchomieniu `npm run seed` w bazie będą 4 boiska:

1. **Boisko Główne** - pełnowymiarowe, 22 graczy, 200 PLN/h
2. **Boisko Treningowe** - połowa, 14 graczy, 120 PLN/h
3. **Orlik** - małe 5x5, 10 graczy, 80 PLN/h
4. **Hala Sportowa** - halowe, 10 graczy, 150 PLN/h

## 🌐 Wdrożenie na Heroku

Zobacz szczegółowe instrukcje w README.md

Podstawowe kroki:

1. `heroku create nazwa-backend`
2. `heroku addons:create heroku-postgresql:mini`
3. Ustaw zmienne środowiskowe
4. Push kodu
5. `heroku run npm run migrate && npm run seed`

## 📞 Wsparcie

Jeśli masz pytania lub problemy, sprawdź:

- README.md - pełna dokumentacja
- Schemat bazy danych w README.md
- Lista endpointów API w README.md
