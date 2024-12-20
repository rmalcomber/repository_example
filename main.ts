import { PostModel } from "./interfaces/models.ts";
import { IStoreRepository } from "./interfaces/store.interface.ts";
import { FileRepository } from "./repositories/file.repo.ts";
import { InMemoryRepository } from "./repositories/in-memory.repo.ts";

/**
 * We don't care what concreate class we are using here. As long as it implements the IStoreRepository interface, we are good to go.
 */
let repo: IStoreRepository;

// Lets set up which repository we want to use based on the command line argument.
if (Deno.args[0] === "in-memory") {
  repo = new InMemoryRepository();
} else {
  repo = new FileRepository();
}

// Now we can use the repository without worrying about the implementation details.
// This is the power of interfaces and the dependency inversion principle.
// Repository pattern is a great example of this principle.
// We can also use the same repository interface in our application code.
// This is a very common pattern in many frameworks and libraries.
console.log(await repo.getAllPosts());

// We can also loop through repositories and use them in a similar way.
const repos: IStoreRepository[] = [
  new InMemoryRepository(),
  new FileRepository(),
];

for (const repo of repos) {
  console.log(await repo.getAllPosts());
}

// We can quickly create a mock implementation of the repository for testing purposes.
const mockRepo: IStoreRepository = {
  getAllPosts() {
    return new Promise((resolve) => {
      resolve([]);
    });
  },
  getPostById() {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  },
  createPost() {
    return new Promise((resolve) => {
      resolve({} as PostModel);
    });
  },
  updatePost() {
    return new Promise((resolve) => {
      resolve({} as PostModel);
    });
  },
  deletePost() {
    return new Promise((resolve) => {
      resolve(1);
    });
  },
};

console.log(await mockRepo.getAllPosts());

// Say we have a service which uses the repository to get the data.

export class MyAwesomeSerive {
  constructor(private repo: IStoreRepository) {}

  public async DoSomething() {
    const posts = await this.repo.getAllPosts();
    if (posts.length > 0) {
      const post = await this.repo.getPostById(posts[0].id);
      console.log(post);
    }
  }
}

// Now we can pass any repository implementation to the service.
const service = new MyAwesomeSerive(repo);
await service.DoSomething();

// If we create a new repository implementation, we can easily switch it out.
const newService = new MyAwesomeSerive(new FileRepository());
await newService.DoSomething();

// Back to mocking, we can easily create a mock repository for testing and use within the service.
// This can be very useful for testing and development without having to worry about a database, network, or file system.
const mockService = new MyAwesomeSerive(mockRepo);
await mockService.DoSomething();
