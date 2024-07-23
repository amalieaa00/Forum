function Table({ks, vals}) {
    return (
        <div>
            <h4>All</h4>
            <table>
                <thead>
                    <tr>
                        <th>{ks[0]+' '} </th>
                        
                    </tr>
                </thead>
                <tbody>
                    {vals.map((post, index) => (
                        <tr key={index}>
                            <td>{post+' '}</td>
                        
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
