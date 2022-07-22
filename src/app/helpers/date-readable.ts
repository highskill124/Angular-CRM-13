function dateReadable(dateTime) {
  if (dateTime) {
    const dateObject = new Date(Date.parse(dateTime));
    return dateObject.getMonth() + 1 + '/' + dateObject.getDate() + '/' + dateObject.getFullYear();
  } else {
    return '';
  }
}

export default dateReadable;
