# ⚽ System Rezerwacji Boisk Piłkarskich

## 🎯 Co zostało zrobione

Utworzyłem pełny system rezerwacji boisk piłkarskich z następującymi funkcjami:

### ✅ Funkcjonalności Zaimplementowane

#### 📅 Kalendarz
- Wyświetlanie kalendarza z przejrzystą listą dni, tygodni i miesięcy
- Możliwość przełączania między różnymi widokami
- Wyświetlanie zajętych i wolnych terminów
- Polski interfejs z lokalizacją dat

#### ⚽ Boiska Piłkarskie
- **4 typy boisk:**
  - Pełnowymiarowe (11 na 11)
  - Połowa boiska (7 na 7)
  - Małe boisko / Orlik (5 na 5)
  - Boisko halowe
- **Informacje o boisku:**
  - Nazwa i opis
  - Typ nawierzchni (sztuczna trawa, naturalna, hala)
  - Maksymalna liczba graczy
  - Cena za godzinę w PLN
- Wybór konkretnego boiska przed rezerwacją

#### 📝 Rezerwacje
- Użytkownik może zaznaczyć konkretny termin i zarezerwować boisko
- **Zbierane informacje:**
  - Imię i nazwisko
  - Email
  - Numer telefonu (wymagany)
  - Godzina rozpoczęcia i zakończenia
  - Liczba graczy
  - Dodatkowe uwagi
- System sprawdza dostępność przed potwierdzeniem
- **Automatyczne powiadomienia email** po utworzeniu rezerwacji

#### 🔐 Uwierzytelnianie
- Rejestracja użytkowników
- Logowanie z JWT
- Dwa poziomy dostępu: użytkownik i administrator

#### 👨‍💼 Panel Administratora
- **Zarządzanie rezerwacjami:**
  - Przegląd wszystkich rezerwacji
  - Potwierdzanie oczekujących rezerwacji
  - Anulowanie rezerwacji
  - Usuwanie rezerwacji
  - Automatyczne wysyłanie emaili przy zmianie statusu
  
- **Zarządzanie boiskami:**
  - Dodawanie nowych boisk
  - Edycja informacji o boisku
  - Dezaktywacja/aktywacja boisk
  - Usuwanie boisk
  
- **Zarządzanie kalendarzem:**
  - Tworzenie dostępnych slotów czasowych
  - Blokowanie terminów
  - Tworzenie specjalnych wydarzeń
  - Przypisywanie terminów do konkretnych boisk
  
- **Statystyki:**
  - Liczba oczekujących rezerwacji
  - Liczba potwierdzonych rezerwacji
  - Liczba anulowanych rezerwacji
  - Liczba wydarzeń w kalendarzu
  - Liczba zarejestrowanych użytkowników

#### 📧 System Email (Darmowy)
- Konfiguracja z Gmail SMTP
- **Powiadomienia wysyłane:**
  - Potwierdzenie rezerwacji
  - Anulowanie rezerwacji
- Szablony email w języku polskim
- Szczegóły rezerwacji w emailu

### 🛠️ Technologie Użyte

#### Backend
- **Node.js** + Express.js
- **PostgreSQL** - baza danych
- **JWT** - bezpieczne uwierzytelnianie
- **Nodemailer** - wysyłanie emaili
- **bcryptjs** - hashowanie haseł
- **express-validator** - walidacja danych

#### Frontend
- **React 18** - cały interfejs w języku polskim
- **React Router** - nawigacja
- **React Calendar** - komponent kalendarza
- **date-fns** z lokalizacją `pl-PL`
- **Axios** - komunikacja z API
- Responsywny design

#### Deployment
- **Heroku** (darmowy tier)
- **PostgreSQL addon** (mini - darmowy)
- **Gmail SMTP** (darmowy)

### 📊 Struktura Bazy Danych

#### Tabele:
1. **users** - użytkownicy (role: user/admin)
2. **football_fields** - boiska piłkarskie
3. **calendar_events** - dostępne terminy
4. **reservations** - rezerwacje

#### Relacje:
- Rezerwacja → Boisko
- Rezerwacja → Użytkownik (opcjonalnie)
- Wydarzenie → Boisko
- Wydarzenie → Użytkownik (kto utworzył)

### 🌍 Język Polski

**Cała aplikacja jest w języku polskim:**
- ✅ Interfejs frontend
- ✅ Komunikaty błędów
- ✅ Powiadomienia email
- ✅ Nazwy statusów rezerwacji
- ✅ Formularze i etykiety
- ✅ Dokumentacja

### 📁 Pliki Projektu

#### Backend:
```
backend/
├── config/database.js           # Konfiguracja PostgreSQL
├── middleware/auth.js           # JWT middleware
├── migrations/
│   ├── migrate.js              # Tworzenie tabel
│   └── seed.js                 # Przykładowe boiska
├── routes/
│   ├── auth.js                 # Rejestracja/logowanie
│   ├── fields.js               # API boisk
│   ├── calendar.js             # API kalendarza
│   ├── reservations.js         # API rezerwacji
│   └── admin.js                # API administratora
├── utils/email.js              # Funkcje email
├── server.js                   # Główny serwer
├── package.json
├── .env.example
└── Procfile                    # Dla Heroku
```

#### Frontend:
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Nawigacja
│   │   └── ReservationForm.js  # Formularz rezerwacji
│   ├── context/
│   │   └── AuthContext.js      # Zarządzanie autoryzacją
│   ├── pages/
│   │   ├── Home.js             # Strona główna z kalendarzem
│   │   ├── Login.js            # Logowanie
│   │   ├── Register.js         # Rejestracja
│   │   └── AdminDashboard.js   # Panel admina
│   ├── App.js
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
├── package.json
└── .env.example
```

### 🚀 Jak Uruchomić

1. **Instalacja:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Konfiguracja:**
   - Skopiuj `.env.example` do `.env` w obu folderach
   - Ustaw dane PostgreSQL i Gmail

3. **Baza danych:**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

4. **Uruchomienie:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Otwórz:** http://localhost:3000

### 📖 Dokumentacja

- **README.md** - Pełna dokumentacja po polsku
- **QUICKSTART.md** - Szybki start
- Instrukcje wdrożenia na Heroku
- Konfiguracja Gmail
- API endpoints
- Schemat bazy danych

### 🎁 Dodatkowe Funkcje

- **Seed data** - 4 przykładowe boiska
- **Walidacja danych** - na frontendzie i backendzie
- **Obsługa błędów** - przyjazne komunikaty po polsku
- **Responsywność** - działa na desktop i mobile
- **Bezpieczeństwo:**
  - Hashowane hasła
  - JWT tokens
  - CORS
  - SQL injection protection

### 🆓 Całkowicie Darmowe Rozwiązanie

- ✅ Heroku (tier mini)
- ✅ PostgreSQL (mini plan)
- ✅ Gmail SMTP (bez limitów dla małych aplikacji)
- ✅ Wszystkie biblioteki open-source

### 📞 Wsparcie

Wszystkie instrukcje są w:
- `README.md` - pełna dokumentacja
- `QUICKSTART.md` - szybki start
- Komentarze w kodzie

---

**Gotowe do użycia!** 🎉

System jest w pełni funkcjonalny, w języku polskim, z wszystkimi wymaganymi funkcjami do rezerwacji boisk piłkarskich.
