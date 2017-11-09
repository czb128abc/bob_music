const HttpMethods = {
  POST: 'POST',
  GET: 'GET',
};


async function fetchRequest(HttpMethod, url, params = {}, options) {
  const defaultOptions = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'x-requested-with': 'XMLHttpRequest'
    }
  };

  if (params) {
    defaultOptions.body = { ...params };
  }

  const requestOptions = Object.assign({}, defaultOptions, options);
  const contentType = requestOptions.headers['Content-Type'];

  if (contentType && contentType === 'application/json' && requestOptions.body) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  const res = await fetch(url, requestOptions);
}

/**
 * 提供 post jsonPost get jsonGet 数据请求
 */
const api = {
  post(url, params = {}, options = {}) {
    return fetchRequest(HttpMethods.POST, url, params, options);
  },
  jsonPost(url, params = {}, options = {}) {
    const headers = {
      'Content-Type': 'application/json'
    };
    return fetchRequest(HttpMethods.POST, url, params, Object.assign({ headers }, options));
  },
  get(url, params = {}, options = {}) {
    return fetchRequest(HttpMethods.GET, url, params, options);
  },
  jsonGet(url, params = {}, options = {}) {
    const headers = {
      'Content-Type': 'application/json'
    };
    return fetchRequest(HttpMethods.GET, url, params, Object.assign({ headers }, options));
  }
};

export default api;

