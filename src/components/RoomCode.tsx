import { useCallback } from 'react';
import copyImg from '../assets/images/copy.svg';

import '../styles/roomCode.scss';

interface RoomCodeProps {
    code: string
}

const RoomCode = (props: RoomCodeProps) => {
    const {code} = props;

    const copyRoomCodeToClipboard = useCallback(()=> {
        navigator.clipboard.writeText(code)
    }, [code]) 

    return (
        <button onClick={copyRoomCodeToClipboard} className="room-code">
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala {code}</span>
        </button>
    )
}

export default RoomCode
