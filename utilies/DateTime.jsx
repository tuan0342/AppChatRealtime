import moment from 'moment';

// convert to DD/MM/YYYY
const convertDateTime = datetime => {
    return moment(datetime).format('DD/MM/YYYY');
};

// Thêm chữ số 0 vào đầu
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

// Định dạng hh:mm, dd/mm/yyyy
function formatDate(date) {
    return (
        [
          padTo2Digits(date.getHours()),
          padTo2Digits(date.getMinutes()),
        ].join(':') +
        ', ' +
        [
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getMonth() + 1),
          date.getFullYear(),
        ].join('/')
    );
}

// hàm cộng giờ (đổi từ múi giờ tiêu chuẩn sang múi giờ Đông Dương (+7h))
function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
}

// hàm chuyển định dạng
const convertTimeStampToDate = timestamp => {
    return formatDate(new Date(timestamp));
}

export {convertDateTime, convertTimeStampToDate, addHours}