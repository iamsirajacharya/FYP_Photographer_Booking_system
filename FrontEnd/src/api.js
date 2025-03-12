const backEndDomain = "http://localhost:3001";

const ApiLink = {
  register: {
    url: `${backEndDomain}/user/register`,
    method: "post",
  },
  login: {
    url: `${backEndDomain}/user/login`,
    method: "post",
  },
  logout: {
    url: `${backEndDomain}/user/logout`,
    method: "post",
  },
  uploadImage: {
    url: `${backEndDomain}/user/upload`,
    method: "post",
  },
  submitPhotographerDetails: {
    url: `${backEndDomain}/user/submit_photographer_details`,
    method: "patch",
  },
  photographersWithImages: {
    url: `${backEndDomain}/user/images`,
    method: "get",
  },
  sortPhotographers: {
    url: `${backEndDomain}/user/SortByPrice`,
    method: "get",
  },
  photographerDetails: {
    url: (id) => `${backEndDomain}/user/images/${id}`,
    method: "get",
  },
  getAllUsers: {
    url: `${backEndDomain}/user`,
    method: "get",
  },
  applyPhotographer: {
    url: `${backEndDomain}/user/apply`,
    method: "post",
  },
  pendingApplications: {
    url: `${backEndDomain}/user/pending`,
    method: "get",
  },
  updateApplicationStatus: {
    url: (email) => `${backEndDomain}/user/applications/${email}`,
    method: "put",
  },
  userDetailsById: {
    url: (id) => `${backEndDomain}/user/${id}`,
    method: "get",
  },
  blockUser: {
    url: (userId) => `${backEndDomain}/user/block/${userId}`,
    method: "post",
  },
  getAllPhotographers: {
    url: `${backEndDomain}/user/allPhotographers`,
    method: "get",
  },
  getPhotographer: {
    url: (userId) => `${backEndDomain}/photographer/${userId}`,
    method: "get",
  },
  // Booking related endpoints
  getAllBookings: {
    url: `${backEndDomain}/booking`,
    method: "get",
  },
  bookPhotographer: {
    url: `${backEndDomain}/booking/book`,
    method: "post",
  },
  getBookingRequestsByStatus: {
    url: (status) => `${backEndDomain}/booking/requests/${status}`,
    method: "get",
  },
  getClientBookingRequests: {
    url: `${backEndDomain}/booking/requests`,
    method: "get",
  },
  respondToBookingRequest: {
    url: (bookingId) => `${backEndDomain}/booking/requests/${bookingId}`,
    method: "post",
  },
  createBookingNotification: {
    url: (bookingId) => `${backEndDomain}/booking/${bookingId}/notifications`,
    method: "post",
  },
  getUserNotifications: {
    url: `${backEndDomain}/booking/notifications`,
    method: "get",
  },
  createOrUpdateMeeting: {
    url: `${backEndDomain}/booking/meeting/create`,
    method: "post",
  },
  getPhotographerMeetings: {
    url: (photographerId) => `${backEndDomain}/booking/${photographerId}`,
    method: "get",
  },
};

export default ApiLink;
