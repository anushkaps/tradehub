import { supabase } from './supabaseClient';

export async function createAppointment(appointmentData: {
  job_id: string;
  professional_id: string;
  start_time: string;
  end_time: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify the user is the job owner
    const { data: jobData } = await supabase
      .from('jobs')
      .select('homeowner_id')
      .eq('id', appointmentData.job_id)
      .single();

    if (!jobData || jobData.homeowner_id !== userData.user.id) {
      return { success: false, error: 'Only the job owner can create appointments' };
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        job_id: appointmentData.job_id,
        professional_id: appointmentData.professional_id,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        status: 'scheduled'
      })
      .select();

    if (error) {
      console.error('Error creating appointment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Appointment creation error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAppointmentsByJob(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, users!professional_id(*)')
      .eq('job_id', jobId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Appointment fetching error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string, 
  status: 'scheduled' | 'completed' | 'canceled'
) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get the appointment to check permissions
    const { data: appointmentData } = await supabase
      .from('appointments')
      .select('*, jobs(*)')
      .eq('id', appointmentId)
      .single();

    if (!appointmentData) {
      return { success: false, error: 'Appointment not found' };
    }

    // Check if user is either the homeowner or the professional
    if (
      appointmentData.jobs.homeowner_id !== userData.user.id && 
      appointmentData.professional_id !== userData.user.id
    ) {
      return { success: false, error: 'Only the job owner or professional can update appointments' };
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select();

    if (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Appointment update error:', error);
    return { success: false, error: error.message };
  }
}