import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { useDispatch } from 'react-redux';
import { login } from '../functions/auth';
import { Button } from '@mui/material';
import { login as loginRedux } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
const Login = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const dispatch = useDispatch();
    const navigate = useNavigate();
	useEffect(() => {
		liffInit();
	}, []);

	const liffInit = async () => {
		await liff.init({ liffId: '2007482513-EZ1ngjap' });
		if (liff.isLoggedIn()) {
			setLoggedIn(true);
			handleLogin();
		} else {
			setLoggedIn(false);
			handleLoginLiff();
		}
	};

	const handleLoginLiff = () => {
		try {
			//code
			liff.login();
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogin = async () => {
		try {			
			const profile = await liff.getProfile();
	
			const res = await login(profile);

			dispatch(loginRedux(res.data.payload.user));
			localStorage.setItem("token", res.data.token);
			console.log(res.data);
			navigate("/");
			navigate("/");
			navigate("/");
			navigate("/");
		} catch (error) {
			console.log(error)
		}
	};
	return (
		<>
			กำลังเข้าสู่ระบบ...
			State: {loggedIn ? 'LoggedIn' : 'Not Login'}
			<br />
			{!loggedIn && (
				<Button onClick={handleLoginLiff}>Login with Line</Button>
			)}
		</>
	);
};

export default Login;
