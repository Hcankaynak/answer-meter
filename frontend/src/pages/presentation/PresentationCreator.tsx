import * as React from 'react';
import {Button} from "react-bootstrap";
import "./presentationCreator.scss"
import Form from "react-bootstrap/Form";
import {addDoc, collection, getDocs} from "firebase/firestore"
import {db} from "../../config/firebase-config";

export interface IPresentationCreator {
    userId: string;
}

interface IPresentationTopic {
    id: number;
    topic: string;
}

/**
 * TODO
 *
 * [x] Delete button visible on hover.
 * [ ] list items should be movable.
 * [ ] If adding successful navigate to qr page.
 * [ ] Design a beautiful list item.
 * [ ] Add order number
 */


/**
 *
 * @param props
 * @constructor
 */
export const PresentationCreator = (props: IPresentationCreator) => {
    const COLLECTION_NAME = "Presentations";
    const [presentationTopics, setPresentationTopics] = React.useState<IPresentationTopic[]>([]);
    const colRef = collection(db, COLLECTION_NAME)

    React.useEffect(() => {
        const docsSnap = getDocs(colRef);
        docsSnap.then((value) => {
            value.forEach(result => console.log(result.data()))
        }).catch(err => console.log(err))
    }, [])

    const deleteTopic = (id: number) => {
        setPresentationTopics((prev) => {
            return prev.filter(item => item.id !== id);
        })
    }

    const addNewTopic = () => {
        setPresentationTopics((prev) => {
            // TODO:change epoch to uuid. or write your own unique id generator.
            return [...prev, {id: new Date().getTime(), topic: ""}];
        })
    }

    const createPresentation = () => {
        // await setDoc(doc(db, ""))
        addDoc(colRef, {
            list: presentationTopics,
            user: props.userId
        }).then(r => console.log(r)).catch(err => console.log(err))
    }

    const renderPresentationTopics = () => {
        return presentationTopics.map((item) => {
            return (
                <div
                    key={item.id}
                    className="topic-element"
                >
                    <Form.Group className="topic input-element" controlId="formGroupName">
                        <Form.Control
                            required
                            type="topic"
                            placeholder="Enter Topic"
                            onChange={(value) => setPresentationTopics((prevState => {
                                const elementIndex = prevState.findIndex((el => el.id === item.id))
                                const updatedList = [...prevState];
                                updatedList[elementIndex].topic = value.target.value;
                                return updatedList;
                            }))}
                        />
                    </Form.Group>
                    <div className="delete-item-button">
                        <Button variant="danger" onClick={event => deleteTopic(item.id)}>Delete</Button>
                    </div>
                </div>
            )
        })
    }
    return (
        <div className="presentation-creator">
            {renderPresentationTopics()}


            <Button variant="primary" onClick={event => addNewTopic()}>Add new topic</Button>
            <div className="btn-continue-shell">
                <Button variant="success" onClick={event => createPresentation()}>Create Presentation</Button>
            </div>

        </div>
    );
}