import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import AdminNavigationLogin from '@/app/admin-navigation-login';
import Login from './login';

const LoginPage = () => {

    return (
        <div className='login-page'>  
            <AdminNavigationLogin />
            <div className="container">
                <Login/>
            </div>
        </div>
    );
}

export default LoginPage;
