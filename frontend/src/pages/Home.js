import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import ReservationForm from "../components/ReservationForm";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    loadFootballFields();
  }, []);

  useEffect(() => {
    if (selectedField) {
      loadAvailableSlots(selectedDate, selectedField);
    }
  }, [selectedDate, selectedField]);

  const loadFootballFields = async () => {
    try {
      const response = await axios.get("/api/fields");
      setFields(response.data);
      if (response.data.length > 0) {
        setSelectedField(response.data[0].id);
      }
    } catch (error) {
      console.error("Błąd ładowania boisk:", error);
    }
  };

  const loadAvailableSlots = async (date, fieldId) => {
    setLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(
        `/api/calendar/available/slots?date=${formattedDate}&field_id=${fieldId}`
      );
      setEvents(response.data.events || []);
      setReservations(response.data.reservations || []);
    } catch (error) {
      console.error("Błąd ładowania terminów:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFieldChange = (e) => {
    setSelectedField(parseInt(e.target.value));
  };

  const handleReservationSuccess = () => {
    setShowReservationForm(false);
    if (selectedField) {
      loadAvailableSlots(selectedDate, selectedField);
    }
  };

  const selectedFieldData = fields.find((f) => f.id === selectedField);

  return (
    <div className="container">
      <div className="card">
        <h1>Rezerwacja Boisk Piłkarskich</h1>
        <p>
          Wybierz boisko i datę, aby zobaczyć dostępne terminy i dokonać
          rezerwacji.
        </p>
      </div>

      {fields.length > 0 && (
        <div className="card">
          <h2>Wybierz Boisko</h2>
          <select
            value={selectedField || ""}
            onChange={handleFieldChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          >
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name} -{" "}
                {field.field_type === "full"
                  ? "Pełnowymiarowe"
                  : field.field_type === "half"
                  ? "Połowa boiska"
                  : field.field_type === "small"
                  ? "Małe boisko"
                  : field.field_type}
                {field.surface_type &&
                  ` (${
                    field.surface_type === "artificial"
                      ? "Sztuczna trawa"
                      : field.surface_type === "natural"
                      ? "Trawa naturalna"
                      : field.surface_type
                  })`}
              </option>
            ))}
          </select>

          {selectedFieldData && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
              }}
            >
              <h3>{selectedFieldData.name}</h3>
              {selectedFieldData.description && (
                <p>{selectedFieldData.description}</p>
              )}
              <p>
                <strong>Maksymalna liczba graczy:</strong>{" "}
                {selectedFieldData.max_players}
              </p>
              {selectedFieldData.hourly_rate && (
                <p>
                  <strong>Cena za godzinę:</strong>{" "}
                  {selectedFieldData.hourly_rate} PLN
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div className="card">
          <h2>Wybierz Datę</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            locale="pl-PL"
          />
        </div>

        <div className="card">
          <h2>
            Dostępne terminy na{" "}
            {format(selectedDate, "d MMMM yyyy", { locale: pl })}
          </h2>

          {loading ? (
            <div className="loading">Ładowanie...</div>
          ) : !selectedField ? (
            <p>Proszę wybrać boisko.</p>
          ) : (
            <>
              {events.length === 0 ? (
                <p>Brak dostępnych terminów na ten dzień.</p>
              ) : (
                <div>
                  <p>Dostępne godziny:</p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      maxHeight: "500px",
                      overflowY: "auto",
                      marginBottom: "20px",
                    }}
                  >
                    {events.map((event) => (
                      <li
                        key={event.id}
                        style={{
                          padding: "10px",
                          margin: "10px 0",
                          backgroundColor: "#e8f5e9",
                          borderRadius: "5px",
                          border: "1px solid #4caf50",
                        }}
                      >
                        <strong>{event.title}</strong>
                        <br />
                        {format(new Date(event.start_date), "HH:mm")} -{" "}
                        {format(new Date(event.end_date), "HH:mm")}
                        {event.description && (
                          <>
                            <br />
                            <small>{event.description}</small>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="button button-primary"
                    onClick={() => setShowReservationForm(true)}
                    style={{ width: "100%" }}
                  >
                    Zarezerwuj Boisko
                  </button>
                </div>
              )}

              {reservations.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Już zarezerwowane:</h3>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {reservations.map((reservation) => (
                      <li
                        key={reservation.id}
                        style={{
                          padding: "10px",
                          margin: "10px 0",
                          backgroundColor: "#ffebee",
                          borderRadius: "5px",
                          border: "1px solid #f44336",
                        }}
                      >
                        {format(new Date(reservation.start_time), "HH:mm")} -{" "}
                        {format(new Date(reservation.end_time), "HH:mm")}
                        <span
                          className={`badge badge-${reservation.status}`}
                          style={{ marginLeft: "10px" }}
                        >
                          {reservation.status === "confirmed"
                            ? "Potwierdzona"
                            : reservation.status === "pending"
                            ? "Oczekująca"
                            : "Anulowana"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showReservationForm && selectedFieldData && (
        <ReservationForm
          selectedDate={selectedDate}
          selectedField={selectedFieldData}
          onClose={() => setShowReservationForm(false)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
};

export default Home;
