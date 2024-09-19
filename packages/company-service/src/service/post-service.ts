import APIError from "../database/error/api-error";
import { Post } from "../database/model/post.repo.model";
import {
  postcreateschema,
  postupdateschema,
} from "../database/repository/@types/post.repo.type";
import PostJob from "../database/repository/post.repository";
import { logger } from "../util/logger";
class PostService {
  private postrepo: PostJob;
  constructor() {
    this.postrepo = new PostJob();
  }
  async Create(postdetail: postcreateschema) {
    try {
      const create = await this.postrepo.Create(postdetail);
      return create;
    } catch (error) {
      console.log(error);
    }
  }
  async GetAllPost(): Promise<any> {
    try {
      const posts = await this.postrepo.GetAll();

      return posts;
    } catch (error) {
      throw new Error("Unable to retrieve posts");
    }
  }
  async FindById({ id }: { id: string }) {
    try {
      return await this.postrepo.FindById({ id });
    } catch (error) {
      throw new APIError("Unable to get post job with this ID");
    }
  }
  async FindByCidAndJobId(companyid: string, jobid: string) {
    try {
      return await this.postrepo.FindByCidAndJobId(companyid, jobid); //
    } catch (error) {
      throw new APIError("Unable to get post job with this ID");
    }
  }
  async FindByCompanyId(companyid: string) {
    try {
      return await this.postrepo.FindByCompanyId(companyid);
    } catch (error) {
      throw new APIError("Unable to get post job with this ID");
    }
  }

  async UpdatePost({ id, update }: { id: string; update: postupdateschema }) {
    try {
      return await this.postrepo.Update({ id, update });
    } catch (error) {
      console.log(error);
      throw new APIError("Unable to update job!");
    }
  }
  async DeletePost(jobid: string) {
    try {
      return await this.postrepo.Delete(jobid);
    } catch (error) {
      logger.error(`PostService - DeletePost() method error: ${error}`);
      throw new APIError(" Unable to Delete Job in database");
    }
  }
  //  implementation for get all post job that company posted
  async getPostsByCompanyId(companyId: string): Promise<any[]> {
    try {
      const posts = await Post.find({ companyId });
      return posts;
    } catch (error) {
      console.error("Error retrieving posts by company ID:", error);
      throw new Error("Unable to retrieve posts");
    }
  }
}
export default PostService;

// }

// export default PostService;
