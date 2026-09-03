export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.max(0, Math.round((end - start) / millisecondsPerDay));
}

export function calculateBookingTotal({
  roomPrice,
  nights,
  adults,
  breakfastSelected,
  airportTransferSelected,
  breakfastPerAdult,
  airportTransferPrice,
}) {
  const roomTotal = roomPrice * nights;
  const breakfastTotal = breakfastSelected
    ? breakfastPerAdult * adults * nights
    : 0;
  const transferTotal = airportTransferSelected ? airportTransferPrice : 0;

  return {
    roomTotal,
    breakfastTotal,
    transferTotal,
    total: roomTotal + breakfastTotal + transferTotal,
  };
}

export function makeReference(prefix, id) {
  return `${prefix}-${id.slice(0, 8).toUpperCase()}`;
}
