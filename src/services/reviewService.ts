import { supabase } from './supabaseClient';

export async function createReview(reviewData: {
  job_id: string;
  professional_id: string;
  rating: number;
  comment: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify the user is the job owner
    const { data: jobData } = await supabase
      .from('jobs')
      .select('homeowner_id, status')
      .eq('id', reviewData.job_id)
      .single();

    if (!jobData || jobData.homeowner_id !== userData.user.id) {
      return { success: false, error: 'Only the job owner can create reviews' };
    }

    if (jobData.status !== 'closed') {
      return { success: false, error: 'Reviews can only be created for closed jobs' };
    }

    // Ensure rating is between 1 and 5
    const rating = Math.min(Math.max(reviewData.rating, 1), 5);

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        job_id: reviewData.job_id,
        professional_id: reviewData.professional_id,
        rating,
        comment: reviewData.comment,
        approved_by_admin: false // Set to true if no admin approval is needed
      })
      .select();

    if (error) {
      console.error('Error creating review:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Review creation error:', error);
    return { success: false, error: error.message };
  }
}

export async function getProfessionalReviews(professionalId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, jobs(*)')
      .eq('professional_id', professionalId)
      .eq('approved_by_admin', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Review fetching error:', error);
    return { success: false, error: error.message };
  }
}