import { IStoreRepository } from "../interfaces/store.interface.ts";
import {
  PostModel,
  CreatePostModel,
  UpdatePostModel,
} from "../types/models.ts";

/**
 *`FilePost` is a type that represents the structure of a post in a file.
 * This should not be exposed outside of the repository.
 */
type FilePost = {
  id: number;
  title: string;
  desc: string;
  body: string;
  author: string;
  added: Date;
  updated: Date;
};

/**
 * A repository that stores posts in a file named `db.json`.
 */
export class FileRepository implements IStoreRepository {
  private FilePosts!: FilePost[];

  /**
   * Reads the posts from the file `db.json` and stores them in `FilePosts`.
   * This is a one-time operation and is only done when `FilePosts` is first
   * accessed.
   */
  private async loadPosts(): Promise<void> {
    if (!this.FilePosts) {
      const data = await Deno.readTextFile("db.json");
      this.FilePosts = JSON.parse(data);
    }
  }

  /**
   * Retrieves all posts from the file storage.
   *
   * @returns A promise that resolves to an array of PostModel objects.
   */

  async getAllPosts(): Promise<PostModel[]> {
    await this.loadPosts();

    return this.FilePosts.map((filePost) => this.filePostToPostModel(filePost));
  }

  /**
   * Retrieves a post by its ID from the file storage.
   *
   * @param id - The ID of the post to retrieve.
   * @returns A promise that resolves to a PostModel object if found, or undefined if not found.
   */

  async getPostById(id: number): Promise<PostModel | undefined> {
    await this.loadPosts();
    const post = this.FilePosts.find((filePost) => filePost.id === id);
    return post ? this.filePostToPostModel(post) : undefined;
  }
  /**
   * Creates a new post and adds it to the file storage.
   *
   * @param post - The post data to create.
   * @returns A promise that resolves to the created PostModel object.
   */

  async createPost(post: CreatePostModel): Promise<PostModel> {
    await this.loadPosts();

    const newPost = {
      id: this.FilePosts.length + 1,
      title: post.title,
      desc: post.description,
      body: post.body,
      author: post.createdBy,
      added: new Date(),
      updated: new Date(),
    };
    this.FilePosts.push(newPost);
    await Deno.writeTextFile("db.json", JSON.stringify(this.FilePosts));
    return this.filePostToPostModel(newPost);
  }

  /**
   * Updates a post in the file storage.
   *
   * @param post - The post data to update, with the ID of the post to update.
   * @returns A promise that resolves to the updated PostModel object if found, or throws an error if not found.
   */
  async updatePost(post: UpdatePostModel): Promise<PostModel> {
    await this.loadPosts();
    const index = this.FilePosts.findIndex(
      (filePost) => filePost.id === post.id
    );
    if (index !== -1) {
      const updatedPost = {
        ...this.FilePosts[index],
        title: post.title,
        desc: post.description,
        body: post.body,
        updated: new Date(),
      };
      this.FilePosts[index] = updatedPost;
      await Deno.writeTextFile("db.json", JSON.stringify(this.FilePosts));
      return this.filePostToPostModel(updatedPost);
    }

    throw new Error("Post not found");
  }

  /**
   * Deletes a post from the file storage.
   *
   * @param id - The ID of the post to delete.
   * @returns A promise that resolves to the ID of the deleted post if found, or throws an error if not found.
   */
  async deletePost(id: number): Promise<number> {
    await this.loadPosts();
    const index = this.FilePosts.findIndex((filePost) => filePost.id === id);
    if (index !== -1) {
      const deletedPost = this.FilePosts.splice(index, 1)[0];
      await Deno.writeTextFile("db.json", JSON.stringify(this.FilePosts));
      return deletedPost.id;
    }

    throw new Error("Post not found");
  }

  /**
   * Converts a FilePost to a PostModel.
   *
   * @param filePost - The FilePost to convert.
   * @returns A PostModel object.
   */
  private filePostToPostModel(filePost: FilePost): PostModel {
    return {
      id: filePost.id,
      title: filePost.title,
      description: filePost.desc,
      body: filePost.body,
      createdBy: filePost.author,
      created: filePost.added,
      updated: filePost.updated,
    };
  }
}
