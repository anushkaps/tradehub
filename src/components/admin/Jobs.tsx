import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search,Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import JobModal from './modals/JobModal';
import JobUpdateModal from './modals/JobUpdateModal';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [isModal,setIsModal] = useState<boolean>(false)

  const [isUpdateModal,setIsUpdateModal] = useState<boolean>(false)
  const [id,setId] = useState<string>("")

  // const [users, setUsers] = useState<any[]>([])

  // async function getUsers(id: string) {
  //     const { data, error } = await supabase.from('profiles').select('email').eq('id', id).single();
  //     console.log(data, error);
  //     if (data) {
  //       setJobs((jobs) => [...jobs, { email: data.email }]);
  //     }
  // }

  async function getJobs(){
    const { data,error } = await supabase.from('jobs').select('*').setHeader("x-user-role",localStorage.getItem("role") || "defaultRole");
    console.log(data,error)
    // data?.forEach((e)=>getUsers(e.homeowner_id))
    if (data) {
      setJobs(data);
      console.log(jobs)
    }
  }

  async function deleteJob(id: string) {
    const { data, error } = await supabase.from('jobs').delete().eq('id',id);
    console.log(data, error);
    if (data) {
      setJobs(jobs.filter((job)=>job.id !== id))
    }
  }

  useEffect(() => {
    getJobs();
  },[jobs])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground">
          Monitor and manage job postings
        </p>
        </div>
        <Button onClick={()=>setIsModal(true)}>
          Add Job
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.created_at}</TableCell>
                <TableCell>{job.homeowner_id}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    job.status === 'Active' 
                      ? 'bg-green-50 text-green-700'
                      : job.status === 'Completed'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {job.status}
                  </span>
                </TableCell>
                {/* <TableCell>{job.postedDate}</TableCell> */}
                <TableCell className='text-center'>
                  <Button variant="ghost" size="sm" onClick={()=>{
                    setIsUpdateModal(true)
                    setId(job.id)
                  }}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={()=>deleteJob(job.id)}><Trash className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <JobModal isOpen={isModal} onClose={()=>setIsModal(false)}/>
      <JobUpdateModal isOpen={isUpdateModal} onClose={()=>setIsUpdateModal(false)} id={id}/>
    </div>
  );
}