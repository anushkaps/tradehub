import { supabase } from './supabaseClient';

export async function createJob(jobData: {
  title: string;
  description: string;
  postal_code: string;
  budget?: number;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        homeowner_id: userData.user.id,
        title: jobData.title,
        description: jobData.description,
        postal_code: jobData.postal_code,
        budget: jobData.budget || null,
        status: 'open'
      })
      .select();

    if (error) {
      console.error('Error creating job:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Job creation error:', error);
    return { success: false, error: error.message };
  }
}

export async function getJobs(status?: string) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Start the query
    let query = supabase
      .from('jobs')
      .select('*, bids(*)');

    // Check if the user is a homeowner (only show their jobs)
    const { data: userTypeData } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userData.user.id)
      .single();

    if (userTypeData?.user_type === 'homeowner') {
      query = query.eq('homeowner_id', userData.user.id);
    }

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Order by creation date, newest first
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Job fetching error:', error);
    return { success: false, error: error.message };
  }
}

export async function getJobById(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, bids(*), appointments(*)')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Job fetching error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateJobStatus(jobId: string, status: 'open' | 'in_progress' | 'closed' | 'canceled') {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify the user is the job owner
    const { data: jobData } = await supabase
      .from('jobs')
      .select('homeowner_id')
      .eq('id', jobId)
      .single();

    if (!jobData || jobData.homeowner_id !== userData.user.id) {
      return { success: false, error: 'Only the job owner can update status' };
    }

    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select();

    if (error) {
      console.error('Error updating job:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Job update error:', error);
    return { success: false, error: error.message };
  }
}