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
import { Search, UserPlus,Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import UserModal from './modals/UserModal';
import UserUpdateModal from './modals/UserUpdateModal';

export default function AdminUsers() {

  const [users, setUsers] = useState<any[]>([])
  const [isModal,setIsModal] = useState<boolean>(false)
  const [isUpdateModal,setIsUpdateModal] = useState<boolean>(false)
  const [id,setId] = useState<string>("")

  async function getUsers() {
    const { data, error } = await supabase.from('profiles').select('*');
    console.log(data);
    if (data) {
      setUsers(data);
    }
    if (error) {
      console.error(error)
    }
  }

  async function deleteUser(id: string) {
    const { data, error } = await supabase.from('profiles').delete().eq('id',id);
    console.log(data, error);
    if (data) {
      setUsers(users.filter((user)=>user.id !== id))
    }
  }

  useEffect(() => {
    getUsers();
  },[users])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={()=>setIsModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.confirmed === true 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {user.confirmed.toString()}
                  </span>
                </TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell className="text-center">
                  <Button onClick={()=>{setIsUpdateModal(true)
                    setId(user.id)
                  }} variant="ghost" size="sm">Edit</Button>
                  <Button onClick={()=>deleteUser(user.id)} variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserModal isOpen={isModal} onClose={()=>setIsModal(false)}/>
      <UserUpdateModal isOpen={isUpdateModal} onClose={()=>setIsUpdateModal(false)} id={id}/>
    </div>
  );
}