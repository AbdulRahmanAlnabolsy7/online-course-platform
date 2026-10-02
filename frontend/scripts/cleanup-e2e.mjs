// Removes only the course created by one known local e2e run; the API enforces ownership.
import axios from 'axios';
const stamp=process.argv[2];
if(!/^\d{13}$/.test(stamp||''))throw new Error('Provide the timestamp from the test course title.');
const api=axios.create({baseURL:process.env.VITE_API_URL||'http://localhost:5000/api/v1'});
async function cleanup(){
const login=await api.post('/auth/login',{email:`teacher-${stamp}@example.com`,password:'PlatformTest123!'});
api.defaults.headers.common.Authorization=`Bearer ${login.data.data.token}`;
let page=1,removed=0;
while(true){const result=(await api.get('/instructor/courses',{params:{page,limit:100}})).data;
 for(const course of result.data){if([`Creative Backend ${stamp}`,`Creative Backend ${stamp} Updated`].includes(course.title)){await api.delete(`/courses/${course._id}`);removed++;}}
 if(page>=result.pagination.totalPages)break;page++;
}
console.log(`Removed ${removed} course(s) from the specified local test run.`);
}
cleanup().catch(error=>{console.error(error.response?.data?.message||'Local test cleanup failed.');process.exitCode=1;});
