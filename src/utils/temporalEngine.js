// src/utils/temporalEngine.js

/**
 * Evaluates the current system hour and maps it to a strict temporal taxonomy phase.
 * @param {number} hour - Current hour (0-23)
 * @returns {string} Morning, Afternoon, Evening, or Night
 */
export const getDayPeriod = (hour = new Date().getHours()) => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 22) return "Evening";
  return "Night";
};

/**
 * Automatically generates a structured node title based on category and time metadata.
 * @param {string} category - moment, vibe, spark, reminder
 * @returns {Object} { autoTitle: string, dayPeriod: string, year: number, dateString: string }
 */
export const generateTemporalMetadata = (category) => {
  const now = new Date();
  const currentHour = now.getHours();
  const year = now.getFullYear();

  // Get standardized date string: YYYY-MM-DD safely in local time
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  const dateString = localDate.toISOString().split("T")[0];

  const dayPeriod = getDayPeriod(currentHour);
  const categoryTag = category ? category.toUpperCase() : "NODE";

  // Create the sleek automated title stamp
  const autoTitle = `${categoryTag}_${dateString.replace(/-/g, "")}_${dayPeriod.toUpperCase()}`;

  return {
    autoTitle,
    dayPeriod,
    year,
    dateString,
  };
};
