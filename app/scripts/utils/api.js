import Global from 'utils/global';

class API {
  static callAPI(url, query) {
    $.ajax({
      url: url +
        (typeof query.param === 'undefined' ? '' : '/' + query.param),
      type: 'GET',
      xhrFields: {
        withCredentials: true
      },
      dataType: 'jsonp',
      processData: true,
      contentType: 'application/json',
      data: query.data,
    })
    .done(typeof query.successCallback === 'function' ?
      query.successCallback : data, status) => {
        console.log(status);
        console.log(data);
      })
    .fail((jqXHR, status, error) => {
      console.error(status, url);
      console.error(error);
      if (typeof jqXHR.responseJSON !== 'undefined') {
        if (typeof query.errorCallback === 'function') {
          query.errorCallback(jqXHR.responseJSON.message ||
                              [jqXHR.responseJSON.error]);
        }
      } else if (typeof query.errorCallback === 'function') {
        query.errorCallback('');
      }
    });
  }
}


export default API;
