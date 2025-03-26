import { supabase } from './supabaseClient';

export async function createBid(bidData: {
  job_id: string;
  amount: number;
  message?: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify user is a professional
    const { data: userTypeData } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userData.user.id)
      .single();

    if (userTypeData?.user_type !== 'professional') {
      return { success: false, error: 'Only professionals can create bids' };
    }

    const { data, error } = await supabase
      .from('bids')
      .insert({
        job_id: bidData.job_id,
        professional_id: userData.user.id,
        amount: bidData.amount,
        message: bidData.message || null,
        status: 'pending'
      })
      .select();

    if (error) {
      console.error('Error creating bid:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Bid creation error:', error);
    return { success: false, error: error.message };
  }
}

export async function getBidsByJob(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*, users!professional_id(*)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bids:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Bid fetching error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateBidStatus(bidId: string, status: 'accepted' | 'rejected' | 'withdrawn') {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get the bid to check permissions
    const { data: bidData } = await supabase
      .from('bids')
      .select('*, jobs(*)')
      .eq('id', bidId)
      .single();

    if (!bidData) {
      return { success: false, error: 'Bid not found' };
    }

    // Check permissions: only professionals can withdraw, only homeowners can accept/reject
    const { data: userTypeData } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userData.user.id)
      .single();

    if (status === 'withdrawn' && userData.user.id !== bidData.professional_id) {
      return { success: false, error: 'Only the professional who created the bid can withdraw it' };
    }

    if (['accepted', 'rejected'].includes(status) && userData.user.id !== bidData.jobs.homeowner_id) {
      return { success: false, error: 'Only the homeowner can accept or reject bids' };
    }

    // Update the bid status
    const { data, error } = await supabase
      .from('bids')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bidId)
      .select();

    if (error) {
      console.error('Error updating bid:', error);
      return { success: false, error: error.message };
    }

    // If bid is accepted, update job status to in_progress
    if (status === 'accepted') {
      await supabase
        .from('jobs')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', bidData.job_id);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Bid update error:', error);
    return { success: false, error: error.message };
  }
}