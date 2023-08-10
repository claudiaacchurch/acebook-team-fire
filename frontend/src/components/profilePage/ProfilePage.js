import React, { useState, useEffect } from 'react';
import Post from "../post/Post";

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem("token"));

    useEffect(() => {
        const fetchProfile = async () => {
        
                const response = await fetch('/users/@me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                setUser(data);
                window.localStorage.setItem("token", data.token);
                setToken(window.localStorage.getItem("token"));
                if (data && data.userId) {
                    await getUserPosts(data);
                }
        };
        fetchProfile();
    }, []);
    
    const getUserPosts = async (user) => {
        let response = await fetch(`/posts/user/${user.userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            let data = await (await response).json();
            setPosts(data.posts)
            window.localStorage.setItem("token", data.token);
            setToken(window.localStorage.getItem("token"));
        } else {
            console.log(response.status);
        }};

    return (
        
        <div>
            <h2>Profile</h2>
            <p>Username: {user.username}</p>
            <div>
            <h2>User Posts</h2>
            {posts?.map((post) => (
                <Post post={post} key={post._id} />
            ))}
        </div>

        </div>
    );
}

export default ProfilePage;
