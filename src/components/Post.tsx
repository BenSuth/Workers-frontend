import React, { useEffect, useState } from 'react'
import { ListGroup, Card, Button } from 'react-bootstrap'
import { Comment } from "./Comments"
import Comments from "./Comments"
import "../stylesheets/Post.css"

export interface Post {
    index: number;
    title: string;
    username: string;
    content: string;
    img: string;
    link: string;
    likes: number;
    comments: Comment[];
}

const Posts = () => {
    const[posts, setPosts] = useState<Post[]>([])

    const handleClick = async (index: number, likes: number) => {
        let updated_posts = posts.map(post => {
            if (post["index"] === index) {
                post["likes"] = likes + 1
                return post
            } 
            return post
        })

        const url = "/likes"
        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                index: index,
                likes: likes
            })
        }

        try {
            await fetch(url, request)
            setPosts(updated_posts)
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const url = "/posts"
        
        const fetchPost = async () => {
            try {
                const response_posts = await fetch(url)
                
                const json_posts = await response_posts.json();
                
                const compare_posts = (a: Post, b: Post): number => {
                    if (b.likes < a.likes) return -1
                    if (b.likes > a.likes) return 1
                    return 0
                }
                json_posts.sort(compare_posts)
                setPosts(json_posts)
            } catch(error) {
                console.log(error)
            }
        }

        fetchPost()
    }, [])

    return (
    <ListGroup variant="flush">
        {posts.map(post => {
            return (
            <ListGroup.Item className="custom-list-group" key={post["index"]}>
                <Card className="custom-card">
                    <Card.Header> {post["username"]} </Card.Header>
                    <Card.Body>
                        <Card.Title> {post["title"]} </Card.Title>
                        <Card.Text> {post["content"]} </Card.Text>
                        {post["link"] !== "" ? (
                            <div>
                                <Card.Link href={post["link"]}> {post["link"]} </Card.Link>
                            </div>
                        ): <div/>}
                    </Card.Body>
                    {post["img"] !== "" ? (
                        <div style={{textAlign: "center"}}>
                            <Card.Img style={{width: 350}} variant="bottom" src={post["img"]}/>
                        </div>
                    ): <div/>}
                    <Card.Footer> 
                        <div className="remove-outline">
                            <Button variant="custom-no-pad" onClick={() => handleClick(post["index"], post["likes"])}> Likes: {post["likes"]} </Button>
                        </div>
                        <Comments index={post["index"]} comments={post["comments"]}/>
                    </Card.Footer>
                </Card>
            </ListGroup.Item>
            )
        })}
    </ListGroup>
    )
}

export default Posts;