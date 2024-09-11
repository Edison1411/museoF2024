import Head from "next/head";
import Navbar from "../components/navbar";
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { enUS, es } from 'date-fns/locale';
import Footer from "../components/footer";
import PopupWidget from "../components/popupWidget";

const ReservationForm = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState(enUS); // Default to English

  useEffect(() => {
    // Detect the locale on the client side
    const userLocale = navigator.language.startsWith('es') ? es : enUS;
    setLocale(userLocale);
  }, []);

  const handleDateChange = (value) => {
    setDate(value);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }
    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }

    const formData = {
      date,
      selectedTimeSlot,
      name,
      email,
      phone,
    };

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowDialog(true);
        setName('');
        setEmail('');
        setPhone('');
        setSelectedTimeSlot('');
        setDate(new Date());
      } else {
        setError('Failed to send the reservation. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const availableTimeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  return (
    <>
      <Head>
      <title>Yachay Archaeological Museum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className="flex justify-center items-center h-full p-4 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="form-group">
            <label htmlFor="name" className="dark:text-white">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="dark:text-white">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="dark:text-white">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="form-control dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="form-group">
            <label htmlFor="date" className="dark:text-white">Pick a date:</label>
            <Calendar
              onChange={handleDateChange}
              value={date}
              locale={locale}
              className="mx-auto p-4 rounded-lg calendar-custom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="time" className="dark:text-white">Pick the hour for your visit:</label>
            <div className="time-slots-container bg-blue-200 dark:bg-gray-700 p-4 rounded-lg">
              {availableTimeSlots.map((timeSlot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSlotSelect(timeSlot)}
                  className={`time-slot ${selectedTimeSlot === timeSlot ? 'selected-time-slot' : ''} dark:text-black`}
                >
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-700 dark:hover:bg-blue-900"
          >
            Reserve   (orking on)
          </button>
        </form>

      </div>
      <Footer />
      
      {showDialog && (
        <div className="dialog dark:bg-gray-800 dark:text-white">
          <p>Reservation Successful!</p>
          <button onClick={() => setShowDialog(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-700 dark:hover:bg-blue-900">Close</button>
        </div>



      )}

      <style jsx>{`
        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .form-control {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }

        .form-control.dark\:bg-gray-700 {
          background-color: #4a5568; /* Tailwind's gray-700 */
        }

        .form-control.dark\:text-white {
          color: white;
        }

        .dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .dialog.dark\:bg-gray-800 {
          background-color: #2d3748; /* Tailwind's gray-800 */
        }

        .dialog.dark\:text-white {
          color: white;
        }

        .time-slots-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        
        .time-slot, .selected-time-slot {
          background-color: white;
          color: #333;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .time-slot.dark\:text-white {
          color: white;
        }

        .selected-time-slot {
          background-color: #cfe2ff;
        }

        .calendar-custom .react-calendar__navigation button:enabled:hover {
          background-color: #004494;
          color: white;
        }
      `}</style>
    </>
  );
};

export default ReservationForm;
