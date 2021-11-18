/*
* Generates the form, that enables users to create a new post
*/
import React, { useState, FormEvent} from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import "../stylesheets/Create.css"

const Create = () => {
    // maintain state for each field, so that they can be cleared after a succesful submit
    const [img, setImg] = useState("")
    const [link, setLink] = useState("")
    const [error, setError] = useState("")
    const [username , setUsername] = useState("")
    const [title , setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault()

        const url = "https://workers-api.sutherlb.workers.dev/posts"
        const request = {
            method: "POST",
            mode: "cors" as RequestMode,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                username: username,
                content: content,
                img: img,
                link: link
            })
        }

        try {
            const result = await fetch(url, request)

            // if the result is not 200, throw and error to be caught
            if (!result.ok) { 
                const response = await result.text()
                throw new Error(response)
            }

            // reset fields on succesful submit
            setError("")
            setUsername("")
            setTitle("")
            setContent("")
            setImg("")
            setLink("")
        } catch(e) {
            const isServerError = (candidate: any): candidate is Error => {
                return candidate instanceof Error
            }

            // if the try block threw an error, then generate an error message to the user
            if (isServerError(e)) {
                console.log(e);
                setError(e.toString()) // update state with error
            }
        }
    }

    // Converts an image file to base64, so that it can be posted to the API
    const getBase64 = (file: Blob): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)

            fileReader.onload = () => {
                resolve(fileReader.result as string);
            }

            fileReader.onerror = (error) => {
                reject(error);
            }

        })
    }

    // If an image is submitted, convert to base64 and update state
    const handleImgUpload = async (e: any) => {
        const file = e.target.files[0]
        try {
            const base64: string = await getBase64(file);
            setImg(base64)
        } catch(e) {
            console.log(e)
        }
    }

    // returns a form, if an error occured posting, it will also display the error to the user, ie. "Username cannot be empty"
    return (
        <Form className="text" onSubmit={handleSubmit}>
            <span className="text-size"> Create a Post! </span><br/>
            {error !== "" && 
                <span> {error} </span>
            }   
            <Row>
                <Form.Group as={Col}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control value={username} onChange={ e => setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={title} onChange={ e => setTitle(e.target.value)}/>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group>
                    <Form.Label>Content</Form.Label>
                    <div className="no-border">
                        <Form.Control as="textarea" value={content} onChange={ e => setContent(e.target.value)}/>
                    </div>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group>
                    <Form.Label>Share a link</Form.Label>
                    <Form.Control value={link} onChange={ e => setLink(e.target.value)}/>
                </Form.Group>
            </Row>

            <Row>
                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={ e => handleImgUpload(e)}/>
                </Form.Group>
            </Row>

            <Button variant="custom" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default Create