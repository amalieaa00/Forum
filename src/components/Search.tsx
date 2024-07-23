import { useState } from "react";
import sendData from "./sendData";
import Table from "./Table";

function Search() {
    const [term, setTerm] = useState('');
    const [disp, setDisp] = useState('search');
    const [ks, setKs] = useState([]);
    const [vals, setVals] = useState([]);

    const getTerm = (event) => {
        setTerm(event.target.value);
    }

    const searchButton = async (event) => {
        event.preventDefault();
        const t = { term: term };
        const res = await sendData(t, 'http://localhost:5000/search');
        if (res.length > 0) {
            const keys = res.map(post_k => Object.keys(post_k));
            const values = res.map(post => Object.values(post));
            setKs(keys);
            setVals(values);
            setDisp('results');
        } else {
            setDisp('notFound');
        }
    }

    const search = (
        <form onSubmit={searchButton}>
            <label htmlFor="search"></label>
            <input type="search" placeholder="Search" value={term} onChange={getTerm} />
            <button type='submit'>Search</button>
        </form>
    );

    if (disp === 'notFound') {
        return (
            <div>
                <h1>No results found for {term}</h1>
            </div>
        );
    } else if (disp === 'results') {
        return (
            <Table ks={ks} vals={vals}></Table>
        );
    }

    return search;
}

export default Search;
