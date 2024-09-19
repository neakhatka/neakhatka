import { Get, Route, SuccessResponse } from "tsoa";
import { StatusCode } from "../utils/consts";

@Route("/gateway-health")
export class Health {
  @SuccessResponse(StatusCode.OK, "Success")
  @Get("/")
  public async checkHealth(): Promise<any> {
    return { message: "API Gateway service is healthy and OK." };
  }
}
