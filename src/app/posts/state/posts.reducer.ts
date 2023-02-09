import { createReducer, on } from '@ngrx/store';
import {
  addPostSuccess,
  deletePostSuccess,
  loadPostsSuccess,
  updatePostSuccess,
} from './posts.actions';
import { initialState, postsAdapter } from './posts.state';

const _postsReducer = createReducer(
  initialState,
  on(addPostSuccess, (state, action) => {
    return postsAdapter.addOne(action.post, state);
    // let post = { ...action.post };

    // return {
    //     ...state,
    //     posts: [...state.posts, post]
    // }
  }),
  on(updatePostSuccess, (state, action) => {
    return postsAdapter.updateOne(action.post, state);
    // const updatedPosts = state.posts.map((post) => {
    //     return action.post.id === post.id ? action.post : post
    // })
    // return {
    //     ...state,
    //     posts: updatedPosts
    // }
  }),
  on(deletePostSuccess, (state, { id }) => {
    return postsAdapter.removeOne(id, state);
    // const updatedPosts = state.posts.filter((post) => {
    //     return post.id !== id;
    // })
    // return {
    //     ...state,
    //     posts: updatedPosts
    // }
  }),
  on(loadPostsSuccess, (state, action) => {
    return postsAdapter.setAll(action.posts, state);
    // return {
    //     ...state,
    //     posts: action.posts
    // }
  })
);

export function postsReducer(state: any, action: any) {
  return _postsReducer(state, action);
}
