const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const withOrdinalSuffix = (i) => {
  let j = i % 10;
  let k = i % 100;
  if (j === 1 && k != 11) return i + 'st';
  if (j === 2 && k != 12) return i + 'nd';
  if (j === 3 && k != 13) return i + 'rd';
  return i + 'th';
}

export const DateConfig = {
  format: (date) => {
    let dayOfWeek = DAYS[date.getDay()];
    let dayOfMonth = date.getDate();
    let month = MONTHS[date.getMonth()];
    // becuz javascript
    let year = 1900 + date.getYear();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    let hours = date.getHours();
    let amPm = 'am';
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      amPm = 'pm';
      hours -= 12;
    }
    return `${ dayOfWeek }, ${ month } ${ withOrdinalSuffix(dayOfMonth) }, ${ year }\n${ hours }:${ minutes }${ amPm }`;
  }
}