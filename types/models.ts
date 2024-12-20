export type PostModel = {
  id: number;
  title: string;
  description: string;
  body: string;
  createdBy: string;
  created: Date;
  updated: Date;
};

export type CreatePostModel = Omit<PostModel, "created" | "id" | "updated">;
export type UpdatePostModel = Omit<
  PostModel,
  "created" | "updated" | "createdBy"
>;
