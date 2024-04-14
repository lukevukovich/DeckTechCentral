//Format number to include K or M suffix
//Ensures number is not too large
export function formatNumber(number) {
  let wholeNumberSlice;
  let suffix;
  let numberString;
  let decimal;

  //Determine slice index and suffix
  if (number >= 1000000) {
    wholeNumberSlice = -6;
    suffix = "M";
  } else if (number >= 1000) {
    wholeNumberSlice = -3;
    suffix = "K";
  } else {
    wholeNumberSlice = null;
    suffix = null;
  }

  //If number needs formatted
  if (wholeNumberSlice != null && suffix != null) {
    numberString = number.toString().slice(0, wholeNumberSlice);

    //If there is decimal
    decimal = number.toString().slice(wholeNumberSlice, wholeNumberSlice + 1);
    if (decimal > 0) {
      numberString += "." + decimal;
    }

    numberString += suffix;
  } else {
    numberString = number.toString();
  }

  return numberString;
}
