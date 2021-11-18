import React, { useState, FormEvent } from "react"
import { ListGroup, Button, Collapse, Form } from "react-bootstrap"
import "..//stylesheets/Comments.css"

export interface Comment {
    index: number;
    username: string;
    content: string;
}

interface Props {
    index: number;
    comments: Comment[]
}

const Comments = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [username , setUsername] = useState("")
    const [content, setContent] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault()

        const url = "https://workers-api.sutherlb.workers.dev/comments"
        let new_comment = {
            index: props.index,
            username: username,
            content: content,
        }
        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(new_comment)
        }
        try {
            const result = await fetch(url, request)

            if (!result.ok) { 
                const response = await result.text()
                throw new Error(response)
            }

            props.comments.push(new_comment)
            setUsername("")
            setContent("")
        } catch(e) {
            const isServerError = (candidate: any): candidate is Error => {
                return candidate instanceof Error
            }

            if (isServerError(e)) {
                console.log(e);
                setError(e.toString())
            }
        }
    }

    return (
        <ListGroup variant="flush" className="comment">
            <div className="custom-button">
                <Button variant="link" onClick={() => setOpen(!open)}aria-expanded={open} aria-controls="collapseID"> Comments: </Button>
            </div>    
            <Collapse in={open}>
                <div id="collapseId">
                <Form onSubmit={handleSubmit}>
                    <span> Leave a Comment! </span> <br/>
                    {error !== "" && 
                        <span> {error} </span>
                    }   
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={username} onChange={ e => setUsername(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Content</Form.Label>
                        <div className="no-border">
                            <Form.Control as="textarea" value={content} onChange={ e => setContent(e.target.value)}/>
                        </div>
                    </Form.Group>
                    <div className="submit-button-padding">
                        <Button variant="custom" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
                    {props.comments.map(comment => {
                        return (
                        <ListGroup.Item className="comment" key={comment["index"]}>
                            {comment["username"] + " | " + comment["content"]}    
                        </ListGroup.Item>
                        )
                    })}
                </div>
            </Collapse>
        </ListGroup>
    )
}

export default Comments;