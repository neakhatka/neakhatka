import APIError from "../error/api-error";
import { StatusCode } from "../../util/consts/status.code";
import { Post } from "../model/post.repo.model";
import { postcreateschema, postupdateschema } from "./@types/post.repo.type";
import { logger } from "../../util/logger";

class PostJob {
  async Create(postdetail: postcreateschema) {
    try {
      const create = new Post(postdetail);
      const post = await create.save();
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  async GetAll(): Promise<any> {
    try {
      const allpost = await Post.find();
      if (!allpost) {
        return { message: "can not get user" };
      }
      return allpost;
    } catch (error: any) {
      return {
        message: "An error occurred while fetching posting",
        error: error.message,
      };
    }
  }

  async FindById({ id }: { id: string }) {
    try {
      console.log(id);
      const existed = await Post.findOne({
        _id: id,
      });
      console.log("exist:", existed);

      if (!existed) {
        throw new Error("Post not found");
      }

      return existed;
    } catch (error) {
      console.log(error);
      throw new APIError("Post not found");
    }
  }

  async Update({ id, update }: { id: string; update: postupdateschema }) {
    try {
      const existed = await this.FindById({ id });
      if (!existed) {
        // console.log("Unable to Update this post");
        throw new APIError("post  does not exist", StatusCode.NotFound);
      }
      const updatepost = await Post.findByIdAndUpdate(
        id,
        { $set: update },
        {
          new: true,
        }
      );
      return updatepost;
    } catch (error) {
      console.log(error);
      if (error instanceof APIError) {
        throw new APIError("Unable to update that post");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  async FindByCompanyId(companyId: string) {
    try {
      const existed = await Post.find({ companyId: companyId });
      if (!existed) {
        throw new APIError("Unable to find in database", StatusCode.NoContent);
      } else {
        return existed;
      }
    } catch (error) {
      throw new APIError("Unable to find in database");
    }
  }
  async FindByCidAndJobId(companyid: string, jobId: string) {
    try {
      const existed = await Post.findOne({ companyId: companyid, _id: jobId });
      return existed;
    } catch (error) {
      throw new APIError("Unable to find in database");
    }
  }

  async Delete(jobId: string) {
    try {
      const existed = await this.FindById({ id: jobId });
      if (!existed) {
        throw new APIError("Unable to find in database", StatusCode.NoContent);
      }
      return await Post.findByIdAndDelete({ _id: jobId });
    } catch (error) {
      logger.error(`PostRepository Delete() method error: ${error}`);
      if (error instanceof APIError) {
        throw new APIError("Unable to Delete User in database");
      }
      throw new APIError(
        "Internal Server Error",
        StatusCode.InternalServerError
      );
    }
  }
}
export default PostJob;
