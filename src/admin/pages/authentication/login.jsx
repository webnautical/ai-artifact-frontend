import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import logo from '../../assets/images/logo.png'
// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper className="">
      <Grid container spacing={3} className=''>
        <Grid item xs={12}>
        <div className='ai_logo_admin text-center'>
              <img style={{ width:'200px'}} src={logo} alt='logo-website'/>
            </div>
          <Stack direction="row" justifyContent="center" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
           
            <div  className='text-center d-block mt-4'><h5>Admin Login</h5></div>
          </Stack>
        </Grid>
        <Grid item xs={12} className='pt-0'>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
