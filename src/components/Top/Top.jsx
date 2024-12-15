import './Top.scss';
import logo from '../../assets/strajk-logo.svg';

function Top({ title }) {
    return (
        <header className='top'>
            <img src={ logo } className="top__logo" />
            <h1 className="top__title">{ title }</h1>
        </header>
    )
}

export default Top;