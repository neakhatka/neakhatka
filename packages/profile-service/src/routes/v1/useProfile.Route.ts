const ROUTE_PATHS = {
  PROFILE: {
    CREATE:"/",
    GET_ALL: "/",
    UPDATE: "/profile", // As an example
    GET_BY_ID: "/profile",
    DELETE: "/profile",
    ADD_FAVORITE: "/profile/:jobid",
    GET_FAVORITE: "/profile/jobs",   // GET JOB THAT COMPANY POST 
    DELETE_FAVORITE: "/profile/:jobid",
    // Add other auth-related routes here
  },
  // Define other route groups as needed
};

export default ROUTE_PATHS;
