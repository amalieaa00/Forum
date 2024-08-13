import { useState } from "react";
import Search from "./Search";
import AddNew from './AddNew';
import { getData } from "../getData";
import Table from "./Table";
function PageInfo({ name, email }) {
    const [disp, setDisp] = useState("seeInfo");
    const [allPosts,setAllPosts]=useState({});
    const [allKeys,setAllKeys]=useState({});
    const addNew = () => {
        setDisp("addNewEvent");
    };
    const searchButton =()=>{
        setDisp('search');
    };
    
    const seeAll = async (event)=>{
        event.preventDefault();
        const posts = await getData('http://localhost:5000/seeAll');
        if (posts){
            const ks = posts.map(post => Object.keys(post));
            const vals = posts.map(post => Object.values(post));
            setAllPosts(vals);
            setAllKeys(ks)
            setDisp('seeAll');
        } else{
            setDisp('noPosts');
        }
    };
    

    const info = (
        <div>
            <h1>Welcome to Calendar, {name}</h1>
            <p>Select what you wish to do: </p>
            <button onClick={addNew}>Add new</button>
            <button onClick={searchButton}>Search for post</button>
            <button onClick={seeAll}>See all</button>
        </div>
    );
    if (disp=='search'){
        return (
            <div>
                <Search></Search>
            </div>
        );
    } 
    if (disp === 'addNewEvent') {
        return (
            <div>
                <AddNew email={email} />
            </div>
        );
    } else if (disp == 'seeAll') {
        return (
            <div>
                <Table ks={allKeys} vals={allPosts} user={email}></Table>
            </div>
        );
    } else if (disp =='noPosts'){
        return (
            <div>
                <h1>No posts found.</h1>
            </div>
        );
    
    } else {
        return info;
    }
}

export default PageInfo;
