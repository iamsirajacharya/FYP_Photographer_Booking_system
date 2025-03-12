const backEndDomain = "http://localhost:3001";

const ApiLink = {
  signup: {
    url: `${backEndDomain}/api/register`,
    method: "post",
  },
  login: {
    url: `${backEndDomain}/api/login`,
    method: "post",
  },
  logout: {
    url: `${backEndDomain}/api/logout`,
    method: "post",
  },
};

export default ApiLink;
