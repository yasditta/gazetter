export default function getData(url, data, success) {
  $.ajax({
    type: 'POST',
    url: url,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    crossDomain: true,
    dataType: 'json',
    data: data
  })
    .done(success)
    .fail(function (error) {
      console.log(error.statusText);
    });
}
