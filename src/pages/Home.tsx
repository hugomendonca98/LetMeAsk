import { FormEvent, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss'
import Button from '../components/Button';
import { useAuth } from '../hooks/userAuth';
import { useState } from 'react';
import { database } from '../services/firebase';


export const Home = () => {

    const history = useHistory();
    const {user, signWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');
    
    const handleCreateRoom = useCallback(async ()=> {
        if (!user) {
            await signWithGoogle()
        }

        history.push('/rooms/new');
    }, [history, user, signWithGoogle]);

    const handleJoiRoom = useCallback(async (event: FormEvent)=> {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room is not exists.');
            return;
        }

        if (roomRef.val().endedAt){
            alert('Room already closed.')
            return;
        }

        history.push(`/rooms/${roomCode}`)

    }, [history, roomCode]);


    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoiRoom}>
                        <input 
                        type="text" 
                        placeholder="Digite o código da sala"
                        onChange={event => setRoomCode(event.target.value)}
                        value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}