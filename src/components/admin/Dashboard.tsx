import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Progress } from '../ui/progress'
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function AdminDashboard() {
  const [activity,setActivity] = useState<any[]>()
  const [loginActivity,setLoginActivity] = useState<any[]>([
    {
      icon: Users,
      title: 'New User Registration',
      description: 'John Smith registered as a professional',
    },
    {
      icon: Briefcase,
      title: 'Job Posted',
      description: 'New plumbing job posted in Seattle area',
      time: '15 minutes ago',
    },
    {
      icon: AlertCircle,
      title: 'Report Submitted',
      description: 'User reported inappropriate content',
      time: '1 hour ago',
    },
    {
      icon: TrendingUp,
      title: 'Traffic Spike',
      description: 'Unusual traffic detected from IP range',
      time: '2 hours ago',
    },
  ])
  async function getActivities(){
    const { data,error } = await supabase.from('login_activity').select('*');
    console.log(data,error)
    if (data) {
      setActivity(data);
    }
  }
  async function getProfile(id: string){
    const { data,error } = await supabase.from('profiles').select('email').eq('id',id);
    console.log(data,error)
  }
  useEffect(() => {
    getActivities();
    getProfile("e8de659d-00ba-4f4f-8e63-92013e47e41e");
  },[])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin! Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">
              +180 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +340 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              System events from the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="rounded-full p-2 bg-secondary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: 45 },
                { label: 'Memory Usage', value: 72 },
                { label: 'Storage', value: 63 },
                { label: 'Network', value: 89 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.value}%
                    </p>
                  </div>
                  <Progress value={item.value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}