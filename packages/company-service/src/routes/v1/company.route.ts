const ROUTE_PATHS = {
  COMPANY: {
    CREATE: "/",
    GETALL: "/",
    GET_BY_ID: "/profile",
    DELETE: "/profile",
    UPDATE: "/profile",
  },
  POSTING: {
    POST: "/", //   POST JOBS
    GET_ALL_POST: "/", // GET ALL POST
    GET_BY_ID: "/:id", // GET SPECIFIC JOB WITH COMPANY AND JOB ID
    DELETE: "/:id", // DELETE SPECIFIC JOB WITH COMPANY AND JOB ID
    UPDATE: "/:id", // UPDATE SPECIFIC JOB WITH COMPANY AND JOB ID
    GET_JOBS_BY_CID: "/profile/jobs", // GET ALL JOB THAT COMPANY POSTED
  },
};
export default ROUTE_PATHS;
