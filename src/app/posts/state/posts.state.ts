import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Post } from "src/app/models/posts.model";

export interface PostsState extends EntityState<Post> {}

// export interface PostsState {
//     posts: Post[];
// }

export const postsAdapter = createEntityAdapter<Post>();

export const initialState: PostsState = postsAdapter.getInitialState();

// export const initialState: PostsState = {
//     posts: []
// }
