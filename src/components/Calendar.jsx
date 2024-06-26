import { useState, useEffect } from "react";
import "./calendar.css";
import { PieChart } from "@mui/x-charts";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import supabase from "../supabase";
import { format } from "date-fns";

export default function Calendar() {
  const today = new Date();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth());
  const [workoutDays, setWorkoutDays] = useState([]);
  const [drinkDays, setDrinkDays] = useState([]);
  const [currentActivity, setCurrentActivity] = useState("I exercised");
  const [viewMode, setViewMode] = useState("calendar"); // Default view
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
  const placeholders = Array.from({ length: firstDayOfMonth }, () => null);

  const daysInMonth = getDaysInMonth(year, month);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value, 10));
  };
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  const toggleDay = async (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const activityType =
      currentActivity === "I exercised" ? "Exercised" : "Drank";
    let newActivityDays;

    if (currentActivity === "I exercised") {
      if (workoutDays.includes(dateString)) {
        await removeDay(dateString, activityType);
        newActivityDays = workoutDays.filter((d) => d !== dateString);
        setWorkoutDays(newActivityDays);
      } else {
        await postDay(activityType, dateString); // Modified here
        newActivityDays = [...workoutDays, dateString];
        setWorkoutDays(newActivityDays);
      }
    } else if (currentActivity === "I drank") {
      if (drinkDays.includes(dateString)) {
        await removeDay(dateString, activityType);
        newActivityDays = drinkDays.filter((d) => d !== dateString);
        setDrinkDays(newActivityDays);
      } else {
        await postDay(activityType, dateString); // Modified here
        newActivityDays = [...drinkDays, dateString];
        setDrinkDays(newActivityDays);
      }
    }
  };

  const handleActivityChange = (e) => {
    setCurrentActivity(e.target.value);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const fetchDays = async () => {
    console.log("fetchDays is being called"); // Add this line

    if (!userId) {
      // Don't try to fetch activities if userId is undefined
      return;
    }

    const { data, error } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching days:", error);
    } else {
      setWorkoutDays(
        data
          .filter((day) => day.activity_type === "Exercised")
          .map((day) => day.date)
      );
      setDrinkDays(
        data
          .filter((day) => day.activity_type === "Drank")
          .map((day) => day.date)
      );
    }
  };

  // Get the user object from the current session
  const user = supabase.auth.user;

  // Use the user's ID for fetching activities
  const userId = user?.id;

  const combinedDaysCount = workoutDays.filter((day) =>
    drinkDays.includes(day)
  ).length;

  useEffect(() => {
    const fetchDays = async (user) => {
      if (!user) {
        // Don't try to fetch activities if user is undefined
        return;
      }

      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching days:", error);
      } else {
        console.log("Fetched data:", data); // Log the fetched data

        setWorkoutDays(
          data
            .filter((day) => day.activity_type === "Exercised")
            .map((day) => day.date)
        );
        setDrinkDays(
          data
            .filter((day) => day.activity_type === "Drank")
            .map((day) => day.date)
        );
      }
    };

    // Listen for changes in the authentication state
    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        fetchDays(session.user);
      }
    });

    // Call fetchDays immediately after defining it
    if (supabase.auth.user) {
      fetchDays(supabase.auth.user);
    }

    // Unsubscribe from the auth state change listener when the component unmounts
    console.log(unsubscribe); // Add this line to see what unsubscribe is
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      } else {
        console.error("unsubscribe is not a function", unsubscribe);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const removeDay = async (dateString, activity_type) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("user_activities")
      .delete()
      .eq("user_id", user.id)
      .eq("date", dateString)
      .eq("activity_type", activity_type);

    if (error) {
      console.error("Error removing day:", error);
    } else {
      fetchDays();
    }
  };

  const postDay = async (activityType, dateString) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("user_activities")
      .insert([
        { date: dateString, activity_type: activityType, user_id: user.id },
      ]);

    if (error) {
      console.error("Error posting day:", error);
    } else {
      console.log("Day posted:", data);
    }
  };

  return (
    <>
      <div className="calendar-content">
        <div className="calendar-content">
          <ToggleButtonGroup
            className="centeredToggleGroup"
            color="primary"
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="Platform"
          >
            <ToggleButton sx={{ color: "white" }} value="calendar">
              Calendar
            </ToggleButton>
            <ToggleButton sx={{ color: "white" }} value="stats">
              Stats
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {viewMode === "calendar" && (
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
                  if (dayString === today.toISOString().split("T")[0]) {
                    dayClass += " today";
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
        )}
        {viewMode === "stats" && (
          <div className="result">
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: `${workoutDays.length}`,
                      label: "Exercised",
                      color: "#25d8e4",
                    },
                    {
                      id: 1,
                      value: `${drinkDays.length}`,
                      label: "Drank",
                      color: "#ffe845",
                    },
                    {
                      id: 2,
                      value: `${combinedDaysCount}`,
                      label: "Both",
                      color: "#ff6e40",
                    },
                  ],
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={200}
              width={400}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </div>
        )}
        <div className="stats">
          <div className="stat-box">
            <p className=" workout-day">{workoutDays.length} </p>
            Exercise days
          </div>
          <div className="stat-box">
            <p className=" drink-day"> {drinkDays.length} </p>
            Drank days
          </div>
          <div className="stat-box">
            <p className=" combined-day">{combinedDaysCount} </p>
            Combined days
          </div>
        </div>
      </div>
      <div className="today-date">
        Today is {format(today, "EEEE, MMMM do, yyyy")} at{" "}
        {new Date().toLocaleTimeString()}
      </div>
    </>
  );
}
