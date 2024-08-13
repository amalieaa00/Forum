import { useState } from 'react';
import sendData from '../sendData';
import ShowPost from './ShowPost';

function Table({ ks, vals, user }) {
    const [disp, setDisp] = useState('table');
    const [logInUser, setLogInUser] = useState(user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState({});
    const [id, setId] = useState('');
    const [postedBy, setPostedBy] = useState({});
    const [replies, setReplies] = useState([]);

    const getPost = async (event) => {
        const selectedTitle = event.target.value;
        setTitle(selectedTitle); 
        const response = await sendData({ title: selectedTitle }, 'http://localhost:5000/getSelected');
        if (response && response.length > 0) {
            // Assuming the first item in the response is the post, and the rest are replies
            const mainPost = response[0];
            setPostedBy(mainPost.postedBy);
            setId(mainPost.id);
            setContent(mainPost.mainContent);

            // Extract replies from the response
            const postReplies = response.map(item => ({
                replyUser: item.repUser,
                reply: item.answer,
            })); // Filter out any null values

            setReplies(postReplies);
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

    return disp === 'table' ? table : <ShowPost title={title} postedBy={postedBy} content={content} replies={replies} pid={id} user={logInUser}></ShowPost>;
}

export default Table;
