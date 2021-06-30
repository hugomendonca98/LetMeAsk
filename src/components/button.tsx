import {ButtonHTMLAttributes} from 'react'

import '../styles/button.scss';

type ButtonProps  = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};


const Button = ({ isOutlined = false, ...rest }: ButtonProps) => {
    return (
        <button 
            className={`button ${isOutlined ? 'outlined' : ''}`} 
            {...rest} 
        />
    )
}

export default Button;
