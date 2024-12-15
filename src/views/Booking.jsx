import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.scss";

import BookingInfo from "../components/BookingInfo/BookingInfo";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import Navigation from "../components/Navigation/Navigation";
import Shoes from "../components/Shoes/Shoes";
import Top from "../components/Top/Top";

function Booking() {
  const [booking, setBooking] = useState({
    when: "",
    time: "",
    lanes: 0,
    people: 0,
  });
  const [shoes, setShoes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function updateBookingDetails(event) {
    const { name, value } = event.target;
    setError("");

    setBooking((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function updateSize(event) {
    const { value, name } = event.target;
    setError("");

    if (value.length === 2 || value.length === 0) {
      setShoes((prevState) =>
        prevState.map((shoe) =>
          shoe.id === name ? { ...shoe, size: value } : shoe
        )
      );
    }
  }

  function addShoe(name) {
    setError("");

    setShoes([...shoes, { id: name, size: "" }]);
  }

  function removeShoe(name) {
    setError("");

    setShoes(shoes.filter((shoe) => shoe.id !== name));
  }

  function isShoeSizesFilled() {
    let filled = true;

    shoes.map((shoe) => (shoe.size.length > 0 ? filled : (filled = false)));

    return filled;
  }

  function checkPlayersAndLanes() {
    const MAX_PLAYERS_PER_LANE = 4;
    const maxPlayersAllows = booking.lanes * MAX_PLAYERS_PER_LANE;

    if (booking.people <= maxPlayersAllows) return true;

    return false;
  }

  async function sendBooking(bookingInfo) {
    const response = await fetch(
      "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
      {
        method: "POST",
        headers: {
          "x-api-key": "738c6b9d-24cf-47c3-b688-f4f4c5747662",
        },
        body: JSON.stringify(bookingInfo),
      }
    );
    const data = await response.json();

    return data;
  }

  function comparePeopleAndShoes() {
    return parseInt(booking.people) === shoes.length;
  }

  function saveConfirmation(confirmation) {
    return new Promise((resolve) => {
      sessionStorage.setItem("confirmation", JSON.stringify(confirmation));

      resolve();
    });
  }

  async function book() {
    let errorMessage = "";

    if (!booking.when || !booking.lanes || !booking.time || !booking.people) {
      errorMessage = "Alla fälten måste vara ifyllda";
    } else if (!comparePeopleAndShoes()) {
      errorMessage = "Antalet skor måste stämma överens med antal spelare";
    } else if (!isShoeSizesFilled()) {
      errorMessage = "Alla skor måste vara ifyllda";
    } else if (!checkPlayersAndLanes()) {
      errorMessage = "Det får max vara 4 spelare per bana";
    }

    // Om det finns något fel, sätt error och avsluta funktionen
    if (errorMessage) {
      setError(errorMessage);
      return; // Stoppa här om ett fel inträffar
    }

    const bookingInfo = {
      when: `${booking.when}T${booking.time}`,
      lanes: booking.lanes,
      people: booking.people,
      shoes: shoes.map((shoe) => shoe.size),
    };

    console.log(!error);

    console.log(bookingInfo);

    const confirmation = await sendBooking(bookingInfo);
    await saveConfirmation(confirmation);

    navigate("/confirmation", {
      state: { confirmationDetails: confirmation },
    });
  }

  return (
    <section className="booking">
      <Navigation />
      <Top title="Booking" />
      <BookingInfo updateBookingDetails={updateBookingDetails} />
      <Shoes
        updateSize={updateSize}
        addShoe={addShoe}
        removeShoe={removeShoe}
        shoes={shoes}
      />
      <button className="button booking__button" onClick={book}>
        strIIIIIike!
      </button>
      {error ? <ErrorMessage message={error} /> : ""}
    </section>
  );
}

export default Booking;
