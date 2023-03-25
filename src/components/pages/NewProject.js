import ProjectForm from '../project/ProjectForm';
import styles from './NewProject.module.css';

import { useNavigate } from 'react-router-dom';

function NewProject(){

    // useNavigate: permitir fazer redirects nas páginas do sistema.
    const navigate = useNavigate();

    function createPost(project){ //idCategory
        
        //initialize cost and services
        project.cost = 0;
        project.services = [];

        fetch(`http://localhost:5000/projects`,{ //localhost:8080/projetos/cadastrar/${idCategory}
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((dataJson) => {
            
            //redirect
            navigate('/projects', { state: {message: 'Projeto criado com sucesso!'}} )
        })
        .catch(err => console.log("ERRO: ", err))
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie o seu projeto para depois adicionar os serviços</p>
            
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    )
}

export default NewProject;