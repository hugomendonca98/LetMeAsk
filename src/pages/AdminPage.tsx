import { useHistory, useParams } from 'react-router-dom';

import logoIgm from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import Question from '../components/Question';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { useCallback } from 'react';
import { database } from '../services/firebase';

interface RoomParams {
    id: string;
}

export const AdminRoom = () => {

    const { id } = useParams<RoomParams>();
    const { questions, title } = useRoom(id);
    const history = useHistory();

    const handleEndRoom = useCallback(async()=> {
        await database.ref(`rooms/${id}`).update({
            endedAt: new Date(),
        });

        history.push('/');

    }, [history, id]);

    const handleDeleteQuestion = useCallback(async(questionId: string)=> {
       if(window.confirm('Tem certeza que você deseja excluir essa pergunta?')){
           await database.ref(`rooms/${id}/questions/${questionId}`).remove();
       }
    }, [id]);

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoIgm} alt="LetMeAsk" />
                    <div>
                        <RoomCode code={id} />
                        <Button isOutlined onClick={handleEndRoom}>Encerar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        >
                            <button type="button" onClick={()=> handleDeleteQuestion(question.id)}>
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    )
};
