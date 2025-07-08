import React, { useState } from "react";

const Signup = () => {
    const [users, setUsers] = useState(null)
    return <div>
        <h1>Welcom to Signup Page</h1>
        {users.map(user => <p>{user.name}</p>)}
    </div>
}

export default Signup