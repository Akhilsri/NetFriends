import { supabase } from '../lib/supabase';

export const updateUserData = async (userId, data) => {
    try {
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(data)
            .eq('id', userId)
            .select(); // Fetch updated user data

        if (error) {
            return { success: false, msg: error.message };
        }

        return { success: true, data: updatedUser[0] }; // Return updated user object
    } catch (error) {
        console.log("Update Error:", error);
        return { success: false, msg: error.message };
    }
};


export const getUserData = async (userId) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single(); // Fetch only one record

        if (error) {
            return { success: false, msg: error.message };
        }

        return { success: true, data: user }; // Return user object
    } catch (error) {
        console.log("Fetch Error:", error);
        return { success: false, msg: error.message };
    }
};

