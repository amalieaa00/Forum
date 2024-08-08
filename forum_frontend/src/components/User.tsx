import { useState } from "react";
import PageInfo from "./PageInfo";
import sendData from "./sendData";
function LogIn() {
    const [disp, setDisp] = useState("welcome");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [rpwd, setRpwd] = useState('');
    const logInButton = async (event) => {
        event.preventDefault();
        const loginInfo = await logInReq(email, pwd);
        console.log(loginInfo);
        if (loginInfo) {
            setName(loginInfo.name);
            setDisp("registered");
        } else {
            setDisp('failed');
        }
    };

    const register = () => {
        setDisp("register");
    };

    const getEmail = (event) => {
        setEmail(event.target.value);
    };

    const getPwd = (event) => {
        setPwd(event.target.value);
    };

    const logInB = () => {
        setDisp("logIn");
    };
    const getRpwd = (event) => {
        setRpwd(event.target.value);
    };
    const getName = (event) => {
        setName(event.target.value);
    };

    const createUser = async (e) => {
        e.preventDefault();
        let values = { name: name, email: email, password: pwd, rpwd: rpwd };
        let regInfo = await sendData(values, 'http://localhost:5000/register');
        if (regInfo) {
            setDisp('registered');
        }
        else {
            setDisp('failed');
        }
    };

    let welcome = (
        <div>
            <h1>Welcome!</h1>
            <h2>Log in or register new user: </h2>
            <button onClick={logInB}>Log In</button>
            <button onClick={register}>Register</button>
        </div>
    );

    const logIn = (
        <form onSubmit={logInButton}>
            <h1>Enter login info: </h1>
            <input type="text" value={email} placeholder="E-Mail" onChange={getEmail} />
            <input value={pwd} type="password" placeholder="Password" onChange={getPwd} />
            <button type="submit">Log In</button>
        </form>
    );

    const registerUser = (
        <form onSubmit={createUser}>
            <h1>Register</h1>
            <input type="text" value={name} placeholder="Name" onChange={getName} />
            <input type="text" value={email} placeholder="E-Mail" onChange={getEmail} />
            <input type="password" value={pwd} placeholder="Password" onChange={getPwd} />
            <input type="password" placeholder="Repeat Password" value={rpwd} onChange={getRpwd} />
            <button type="submit">Create User</button>
        </form>
    );

    if (disp === 'welcome') {
        return welcome;
    } else if (disp === 'logIn') {
        return logIn;
    } else if (disp === 'register') {
        return registerUser;
    } else if (disp === 'registered') {
        return (
            <div>
                <PageInfo name={name} email={email} />
            </div>
        );
    } else if (disp === 'failed') {
        return (
            <div>
                <h1>Login failed, {email}</h1>
            </div>
        );
    }
}


const logInReq = async (email, password) => {
    const data = { email: email, password: password };
    const res = await sendData(data, 'http://localhost:5000/logIn');
    return res;
};

export default LogIn;
