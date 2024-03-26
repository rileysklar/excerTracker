import { useState } from "react";
import "./calendar.css";

export function Calendar() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth());
  const [workoutDays, setWorkoutDays] = useState([]);
  const [drinkDays, setDrinkDays] = useState([]);
  const [currentActivity, setCurrentActivity] = useState("I exercised");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activities = ["I exercised", "I drank"];
  const startYear = currentYear - 5;
  const endYear = currentYear + 5;
  const yearsArray = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const placeholders = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const daysInMonth = getDaysInMonth(year, month);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value, 10));
  };
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };
  const toggleDay = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (currentActivity === "I exercised") {
      if (workoutDays.includes(dateString)) {
        setWorkoutDays(workoutDays.filter((d) => d !== dateString));
      } else {
        setWorkoutDays([...workoutDays, dateString]);
      }
    } else if (currentActivity === "I drank") {
      if (drinkDays.includes(dateString)) {
        setDrinkDays(drinkDays.filter((d) => d !== dateString));
      } else {
        setDrinkDays([...drinkDays, dateString]);
      }
    }
  };

  const handleActivityChange = (e) => {
    setCurrentActivity(e.target.value);
  };

  return (
    <>
      <div className="main-body">
        <div className="month-yr-selector">
          <div className="date-selector">
            <select value={month} onChange={handleMonthChange}>
              {monthNames.map((name, index) => (
                <option key={index} value={index}>
                  {name}
                </option>
              ))}
            </select>
            <select value={year} onChange={handleYearChange}>
              {yearsArray.map((actualYear) => (
                <option key={actualYear} value={actualYear}>
                  {actualYear}
                </option>
              ))}
            </select>{" "}
          </div>
          <div className="activity-selector">
            <select value={currentActivity} onChange={handleActivityChange}>
              {activities.map((activityItem) => (
                <option key={activityItem} value={activityItem}>
                  {activityItem}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="calendar">
          <div className="row">
            {daysInWeek.map((dayOfWeek) => (
              <li key={dayOfWeek}>{dayOfWeek}</li>
            ))}
          </div>
          <div className="dates-grid">
            {placeholders.map((_, index) => (
              <div
                className="date-cell placeholder"
                key={`placeholder-${index}`}
              ></div>
            ))}

            {daysArray.map((day) => {
              const dayString = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const isWorkoutDay = workoutDays.includes(dayString);
              const isDrinkDay = drinkDays.includes(dayString);
              let dayClass = "";
              if (isWorkoutDay && isDrinkDay) {
                dayClass = "combined-day";
              } else if (isWorkoutDay) {
                dayClass = "workout-day";
              } else if (isDrinkDay) {
                dayClass = "drink-day";
              }
              return (
                <div
                  className={`date-cell ${dayClass}`}
                  key={day}
                  onClick={() => toggleDay(day)}
                  tabIndex="-1"
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="result">
        <p className=" workout-day">
          🏋️ You have exercised {workoutDays.length} days
        </p>
        <p className=" drink-day">🍺 You have drank {drinkDays.length} days</p>
        <p className=" combined-day">
          🤝 You have done both{" "}
          {workoutDays.filter((day) => drinkDays.includes(day)).length} days
        </p>
      </div>
    </>
  );
}
