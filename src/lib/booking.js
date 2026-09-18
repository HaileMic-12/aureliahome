export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const [inY, inM, inD] = checkIn.split("-").map(Number);
  const [outY, outM, outD] = checkOut.split("-").map(Number);

  if (!inY || !inM || !inD || !outY || !outM || !outD) return 0;

  const startUtc = Date.UTC(inY, inM - 1, inD);
  const endUtc = Date.UTC(outY, outM - 1, outD);

  const diffDays = Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
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
  const safeRoomPrice = Number(roomPrice) || 0;
  const safeNights = Number(nights) || 0;
  const safeAdults = Math.max(1, Number(adults) || 1);

  const roomTotal = safeRoomPrice * safeNights;
  const breakfastTotal = breakfastSelected
    ? (Number(breakfastPerAdult) || 0) * safeAdults * safeNights
    : 0;
  const transferTotal = airportTransferSelected
    ? Number(airportTransferPrice) || 0
    : 0;

  return {
    roomTotal,
    breakfastTotal,
    transferTotal,
    total: roomTotal + breakfastTotal + transferTotal,
  };
}

export function generateSecureReference(prefix = "REF") {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const randomHex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const timeSlice = Date.now().toString().slice(-4);
  return `${prefix}-${timeSlice}-${randomHex}`;
}