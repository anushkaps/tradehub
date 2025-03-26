import { supabase } from './supabaseClient';

export async function sendMessage(messageData: {
  recipient_id: string;
  job_id: string;
  content: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userData.user.id,
        recipient_id: messageData.recipient_id,
        job_id: messageData.job_id,
        content: messageData.content,
        read: false
      })
      .select();

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Message sending error:', error);
    return { success: false, error: error.message };
  }
}

export async function getConversation(otherUserId: string, jobId: string) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userData.user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userData.user.id})`)
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return { success: false, error: error.message };
    }

    // Mark messages as read
    const unreadMessages = data
      .filter(msg => msg.recipient_id === userData.user.id && !msg.read)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessages);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Message fetching error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUnreadMessageCount() {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userData.user.id)
      .eq('read', false);

    if (error) {
      console.error('Error counting messages:', error);
      return { success: false, error: error.message };
    }

    return { success: true, count };
  } catch (error: any) {
    console.error('Message count error:', error);
    return { success: false, error: error.message };
  }
}