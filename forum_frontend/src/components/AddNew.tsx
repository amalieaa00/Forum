import  { useState } from "react";
import sendData from "./sendData";
import '../addNewStyle.css';
function AddNew({ email }) {
    const [disp, setDisp] = useState('AddNew');
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');

    const getTitle = (event) => {
        setTitle(event.target.value);
    };
    
    const getCont = (event) => {
        setPost(event.target.value);
    };

    const sendPost = async (ev) => {
        ev.preventDefault();
        const vals = { email:email, title:title, post:post };
        const added = await sendData(vals, 'http://localhost:5000/addPost');
        if (added) {
            setDisp('added');
        }else{
            setDisp('AddErr');
        }

    };

    const addNewForm = (
        <form onSubmit={sendPost}>
            <h1>Add new post</h1>
            <div>
                <label htmlFor="title"></label>
                <input type="text" placeholder="Title" value={title} onChange={getTitle} />
                <textarea value={post} onChange={getCont} name="Write post" id="content" placeholder="Add text"></textarea>
                <input type="file" name="Upload file" id="fileUpl" />
                <button type="submit" name="Submit">Submit</button>
            </div>
        </form>
    );

    if (disp === 'AddNew') {
        return addNewForm;
    } else if (disp === 'added') {
        return (
            <div>
                <h1>Post added:</h1>
                <h1>{title}</h1>
                <p>{post}</p>
            </div>
        );
    } else if (disp=='AddErr'){
        return (
            <div>
                <h1>Adding failed</h1>
            </div>
        );
    }
}
export default AddNew;