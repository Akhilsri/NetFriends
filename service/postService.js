import { uploadFile } from './imageService';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

export const createOrUpdatePost = async (post) => {
    try {
        // Upload image
        if (post.file && typeof post.file === 'object') {
            let isImage = post.file.type?.startsWith('image'); // Ensure correct type checking
            let folderName = isImage ? 'postImages' : 'postVideos';

            let fileResult = await uploadFile(folderName, post.file.uri, isImage);
            if (fileResult.success) {
                post.file = fileResult.data; // Update post.file with uploaded path
            } else {
                return fileResult; // Return error if upload fails
            }
        }

        // Insert or update post in Supabase
        const { data, error } = await supabase
            .from('posts')
            .upsert(post)
            .select(); // Removed `.single()`, only use it when expecting exactly one row

        if (error) {
            console.log('createPost error:', error);
            return { success: false, msg: 'Could not create your post' };
        }

        return { success: true, data };

    } catch (error) {
        console.log('createPost error:', error);
        return { success: false, msg: 'Could not create your post' };
    }
};


export const fetchPost = async (limit = 10,userId) => {
    try {
        if(userId){
            const { data, error } = await supabase
            .from('posts')
            .select('*, users(name), postLikes(*),comments(count)') // Fetch postLikes too
            .order('created_at', { ascending: false })
            .eq('userId',userId)
            .limit(limit);

        if (error) {
            console.log('fetchPost error:', error);
            return { success: false, msg: 'Could not fetch the posts' };
        }

        return { success: true, data };
        }else{
            const { data, error } = await supabase
            .from('posts')
            .select('*, users(name), postLikes(*),comments(count)') // Fetch postLikes too
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.log('fetchPost error:', error);
            return { success: false, msg: 'Could not fetch the posts' };
        }

        return { success: true, data };
        }
    } catch (error) {
        console.log('fetchPost error:', error);
        return { success: false, msg: 'Could not fetch the posts' };
    }
};

export const createPostLike = async (postLike) => {
    try {
        
        const { data, error } = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single()

       if(error){
        console.log('createPostLike error:', error);
        return { success: false, msg: 'Could not like the posts' };
       }
       return {success:true,data:data}

    } catch (error) {
        console.log('createPostLike error:', error);
        return { success: false, msg: 'Could not like the posts' };
    }
};
export const removePostLike = async (postId,userId) => {
    try {
        
        const { error } = await supabase
        .from('postLikes')
        .delete()
        .eq('userId',userId)
        .eq('postId',postId)

       if(error){
        console.log('removePostLike error:', error);
        return { success: false, msg: 'Could not remove the posts like' };
       }
       return {success:true}

    } catch (error) {
        console.log('removePostLike error:', error);
        return { success: false, msg: 'Could not remove the posts like' };
    }
};

export const fetchPostDetails = async (postId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, users(name), postLikes(*),comments(*,user:users(id,name,image))') // Fetch postLikes too
            .eq('id',postId)
            .order("created_at",{ascending:false,foreignTable:'comments'})
            .single()

        if (error) {
            console.log('fetchPostDetails error:', error);
            return { success: false, msg: 'Could not fetch the posts details' };
        }

        return { success: true, data };
    } catch (error) {
        console.log('fetchPostDetails error:', error);
        return { success: false, msg: 'Could not fetch the posts details' };
    }
};

export const createComment = async (comment) => {
    try {
        
        const {data,error}= await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single()

       if(error){
        console.log('createComment error:', error);
        return { success: false, msg: 'Could not create the comment' };
       }
       return {success:true,data:data}

    } catch (error) {
        console.log('createComment error:', error);
        return { success: false, msg: 'Could not create the comment' };
    }
};

export const removeComment = async (commentId) => {
    try {
        
        const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id',commentId)

       if(error){
        console.log('removeComment error:', error);
        return { success: false, msg: 'Could not remove the comment' };
       }
       return {success:true,data:{commentId }}

    } catch (error) {
        console.log('removeComment error:', error);
        return { success: false, msg: 'Could not remove the comment' };
    }
};
export const removePost = async(postId) => {
    try {
        
        const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id',postId)

       if(error){
        console.log('removePost error:', error);
        return { success: false, msg: 'Could not remove the post' };
       }
       return {success:true,data:{postId }}

    } catch (error) {
        console.log('removePost error:', error);
        return { success: false, msg: 'Could not remove the post' };
    }
};

export const fetchUserById = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)  // Filter by user ID
      .single();         // Get only one row
  
    if (error) {
      console.error("Error fetching user:", error);
    } else {
      console.log("User data:", data);
    }
  };
  


  export const fetchNotifications = async (receiverId) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*, sender : senderId(id,name,image)') // Fetch postLikes too
            // .eq('receiverId',receiverId)
            .order("created_at",{ascending:false})
            // .limit(1)
    
            
            
         

        if (error) {
            console.log('fetchNotifications error:', error);
            return { success: false, msg: 'Could not fetch the notifications details' };
        }

        return { success: true, data };
    } catch (error) {
        console.log('fetchNotifications error:', error);
        return { success: false, msg: 'Could not fetch the notifications details' };
    }
};