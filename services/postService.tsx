import { supabase } from '@/lib/supabase';
import { uploadFile } from './imageService';

// for example, post that is passed on in newPost looks like
/* let data = {
      file,
      body: bodyRef?.current,
      userId: user?.id,
    }; */
export const createOrUpdatePost = async (post: any) => {
  try {
    if (post.file && typeof post.file == 'object') {
      let isImage = post?.file?.type == 'image';
      let folderName = isImage ? 'postImages' : 'postVideos';
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);

      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.error(`createPost error: `, error);
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`createPost error: `, error);
    return { succes: false, msg: 'Could not create the post' };
  }
};

export const fetchPosts = async (limit = 10, userId?: string) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `*, 
        user: users (id, name, image),
        postLikes (*),
        comments (count)`
        )
        .order('created_at', { ascending: false })
        .eq('userId', userId)
        .limit(limit);

      if (error) {
        console.error(`fetchPost error: `, error);
        return { success: false, msg: 'Could not fetchPosts' };
      }

      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `*, 
      user: users (id, name, image),
      postLikes (*),
      comments (count)`
        )
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`fetchPost error: `, error);
        return { success: false, msg: 'Could not fetchPosts' };
      }

      return { success: true, data: data };
    }
  } catch (error) {
    console.error(`fetchPost error: `, error);
    return { success: false, msg: 'Could not fetchPosts' };
  }
};

export const fetchPostDetails = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *, 
        user: users(id, name, image),
        postLikes (*),
        comments (*, user: users(id, name, image))
        `
      )
      .eq('id', postId)
      .order('created_at', { ascending: false, referencedTable: 'comments' })
      .single();

    if (error) {
      // Code 22P02 is a current bug recognized in supabase: https://tinyurl.com/msbb9dtt
      error.code != '22P02' && console.error(`fetchPostDetails error: `, error);
      return { success: false, msg: 'Could not fetch post details' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchPost error: `, error);
    return { success: false, msg: 'Could not fetchPosts' };
  }
};

export const createPostLike = async (postLike: any) => {
  try {
    const { data, error } = await supabase
      .from('postLikes')
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error(`postLike error: `, error);
      return { success: false, msg: 'Could not like the post' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`postLike error: `, error);
    return { success: false, msg: 'Could not like the post' };
  }
};

export const removePostLike = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('postLikes')
      .delete()
      .eq('userId', userId)
      .eq('postId', postId);

    if (error) {
      console.error(`postLike error: `, error);
      return { success: false, msg: 'Could not remove the postLike' };
    }

    return { success: true };
  } catch (error) {
    console.error(`postLike error: `, error);
    return { success: false, msg: 'Could not remove the postLike' };
  }
};

export const createComment = async (comment: string) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error(`comment error: `, error);
      return { success: false, msg: 'Could not comment on post' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`comment error: `, error);
    return { success: false, msg: 'Could not comment on post' };
  }
};

export const removeComment = async (commentId: string) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error(`removeComment error: `, error);
      return { success: false, msg: 'Could not remove the comment' };
    }

    return { success: true, data: { commentId } };
  } catch (error) {
    console.error(`removeComment error: `, error);
    return { success: false, msg: 'Could not remove the comment' };
  }
};

export const removePost = async (postId: any) => {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      console.error(`removePost error: `, error);
      return { success: false, msg: 'Could not remove the post' };
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.error(`removePost error: `, error);
    return { success: false, msg: 'Could not remove the post' };
  }
};
