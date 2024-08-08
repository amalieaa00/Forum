import '../tableStyles.css';
import sendData from '../sendData';
import { useState } from 'react';

function Table({ ks, vals }) {
    const [disp, setDisp] = useState('table');
    const [user, setUser] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState({});

    const getPost = async (event) => {
        const selectedTitle = event.target.value;
        setTitle(selectedTitle); // Set title for consistency, though not necessary for the request
        const response = await sendData({ title: selectedTitle }, 'http://localhost:5000/getSelected');
        if (response) {
            setContent(response.content);
            setDisp('p');
        }
    };

    const table = (
        <div>
            <h1>All</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {vals.map((post, index) => (
                        <tr key={index}>
                            <td id={post[0]}>{post[0]}</td>
                            <td><button value={post[1]} onClick={getPost}>{post[1]}</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const para = (
        <div>
        <h1>{title}</h1>
            <p>
                {content}
            </p>
        </div>
    );

    return disp === 'table' ? table : para;
}

export default Table;
