import { IStoreRepository } from "../interfaces/store.interface.ts";
import {
  PostModel,
  CreatePostModel,
  UpdatePostModel,
} from "../types/models.ts";

/**
 *`MemoryPost` is a type that represents the structure of a post in memory.
 * This should not be exposed outside of the repository.
 */
type MemoryPost = {
  id: string;
  post_title: string;
  post_body: string;
  post_description: string;
  post_created: string;
  post_updated: string;
  username: string;
};

/**
 * A repository that stores posts in memory.
 */
export class InMemoryRepository implements IStoreRepository {
  private posts: MemoryPost[] = [
    {
      id: "1",
      post_title: "First Post",
      post_body: "This is the first post",
      post_description: "This is the first post",
      post_created: "2021-01-01",
      post_updated: "2021-01-01",
      username: "johndoe",
    },
    {
      id: "2",
      post_title: "Second Post",
      post_body: "This is the second post",
      post_description: "This is the second post",
      post_created: "2021-01-01",
      post_updated: "2021-01-01",
      username: "janedoe",
    },
  ];

  /**
   * Retrieves all posts from memory.
   *
   * @returns A promise that resolves to an array of PostModel objects.
   */
  getAllPosts(): Promise<PostModel[]> {
    return new Promise((resolve) => {
      resolve(this.posts.map((post) => this.inMemoryPostToPostModel(post)));
    });
  }

  /**
   * Retrieves a post from memory by its ID.
   *
   * @param id - The ID of the post to retrieve.
   * @returns A promise that resolves to the PostModel object if found, or undefined if not found.
   */
  getPostById(id: number): Promise<PostModel | undefined> {
    return new Promise((resolve) => {
      const post = this.posts.find((post) => post.id === String(id));
      resolve(post ? this.inMemoryPostToPostModel(post) : undefined);
    });
  }

  /**
   * Creates a new post in memory.
   *
   * @param post - The post data to create, including title, body, description, and createdBy fields.
   * @returns A promise that resolves to the created PostModel object.
   */
  createPost(post: CreatePostModel): Promise<PostModel> {
    return new Promise((resolve) => {
      const newPost = {
        id: String(this.posts.length + 1),
        post_title: post.title,
        post_body: post.body,
        post_description: post.description,
        post_created: new Date().toISOString(),
        post_updated: new Date().toISOString(),
        username: post.createdBy,
      };
      this.posts.push(newPost);
      resolve(this.inMemoryPostToPostModel(newPost));
    });
  }

  /**
   * Updates a post in memory.
   *
   * @param post - The post data to update, including title, body, description, and ID fields.
   * @returns A promise that resolves to the updated PostModel object if found, or throws an error if not found.
   */
  updatePost(post: UpdatePostModel): Promise<PostModel> {
    return new Promise((resolve) => {
      const index = this.posts.findIndex((post) => post.id === String(post.id));
      if (index !== -1) {
        this.posts[index] = {
          ...this.posts[index],
          post_title: post.title,
          post_body: post.body,
          post_description: post.description,
          post_updated: new Date().toISOString(),
        };
        resolve(this.inMemoryPostToPostModel(this.posts[index]));
      }
    });
  }

  /**
   * Deletes a post from memory.
   *
   * @param id - The ID of the post to delete.
   * @returns A promise that resolves to the ID of the deleted post if found, or throws an error if not found.
   */
  deletePost(id: number): Promise<number> {
    return new Promise((resolve) => {
      const index = this.posts.findIndex((post) => post.id === String(id));
      if (index !== -1) {
        this.posts.splice(index, 1);
        resolve(id);
      }
    });
  }

  /**
   * Converts a MemoryPost object to a PostModel object.
   *
   * @param post - The MemoryPost object to convert.
   * @returns A PostModel object.
   */
  private inMemoryPostToPostModel(post: MemoryPost): PostModel {
    return {
      id: Number(post.id),
      title: post.post_title,
      description: post.post_description,
      body: post.post_body,
      created: new Date(post.post_created),
      updated: new Date(post.post_updated),
      createdBy: post.username,
    };
  }
}
