import '../postStyles.css';
import { useState } from 'react';
import sendData from '../sendData';
function ShowPost({ title, postedBy, content, replies, pid, user }) {
    const [rcontent, setRcontent] = useState('');
    const[reps,setReps]=useState(replies);
    const getReply = async (event) => {
        event.preventDefault();
        const values = { rid: pid, user: user, content: rcontent };
        const res = await sendData(values, 'http://localhost:5000/reply');
        if (res) {
            // Update the replies list with the new reply
            setReps([... replies, { user, content: rcontent }]);
            setRcontent('');
        }
    };

    const set_Reply = (event) => {
        setRcontent(event.target.value);
    };

    return (
        <div className="post-container">
            <h1>{title}</h1>
            <h4>by: {postedBy}</h4>
            <p>{content}</p>
            
            {/* Display Replies */}
            <div className="replies-section">
                <h3>Replies</h3>
                {reps.length > 0 ? (
                    reps.map((reply, index) => (
                        <div key={index} className="reply">
                            <h4>by: {reply.replyUser}:</h4> <p className='repContent'>{reply.reply}</p>
                        </div>
                    ))
                ) : (
                    <p>No replies yet.</p>
                )}
            </div>

            {/* Reply Textarea */}
            <textarea onChange={set_Reply} value={rcontent} name="reply" id="reply" placeholder="Add a reply"></textarea>
            <button onClick={getReply}>Reply</button>
        </div>
    );
}

export default ShowPost;
