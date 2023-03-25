import styles from './Container.module.css';

function Container(props){
    //props.children serve para encapsular algo dentro de algum componente.
    //No caso, <Container> encapsula as rotas

    return (
        <div className={`${styles.container} ${styles[props.customClass]}`}>
            {props.children} 
        </div>
    )
}

export default Container;