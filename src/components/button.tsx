import {ButtonHTMLAttributes} from 'react'

import '../styles/button.scss';

type ButtonProps  = ButtonHTMLAttributes<HTMLButtonElement>;


const Button = (rest: ButtonProps) => {
    return (
        <button className="button" {...rest} />
    )
}

export default Button;
