import {
  PostModel,
  CreatePostModel,
  UpdatePostModel,
} from "../types/models.ts";

export interface IStoreRepository {
  getAllPosts(): Promise<PostModel[]>;
  getPostById(id: number): Promise<PostModel | undefined>;
  createPost(post: CreatePostModel): Promise<PostModel>;
  updatePost(post: UpdatePostModel): Promise<PostModel>;
  deletePost(id: number): Promise<number>;
}
