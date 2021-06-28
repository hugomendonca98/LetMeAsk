import { FormEvent, useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import logoIgm from '../assets/images/logo.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import { useAuth } from '../hooks/userAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';

interface RoomProps {}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string
    }
    content: string;
    isAnswred: boolean;
    isHighLighted: boolean;
}>;

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string
    }
    content: string;
    isAnswred: boolean;
    isHighLighted: boolean;
}

interface RoomParams {
    id: string;
}

export const Room = (props: RoomProps) => {

    const { user } = useAuth();
    const { id } = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    useEffect(()=> {
        const roomRef = database.ref(`rooms/${id}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();

            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;

            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswred: value.isAnswred,
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });
    }, [id]);

    const handleSendQuestion = useCallback(async (event: FormEvent)=> {

        event.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        };

        if (!user) {
            throw new Error('You must be logged in')
        };

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${id}/questions`).push(question);

        setNewQuestion('');

    }, [id, newQuestion, user]);

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoIgm} alt="LetMeAsk" />
                    <RoomCode code={id}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}
                    placeholder="O que você quer perguntar?"
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ): 
                        (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        )
                        }
                        <Button disabled={!user} type="submit">Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
};
