import styles from './Projects.module.css';

import Message from "../layout/Message";
import Container from '../layout/Container';
import LinkButton from '../layout/LinkButton';
import Loading from '../layout/Loading';
import ProjectCard from '../project/ProjectCard';

import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';

function Projects(){

    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [projectMessage, setProjectMessage] = useState('');

    const location = useLocation();
    let message = '';

    if(location.state){
        //essa "message" dentro de location vem do arquivo NewProject quando fazemos o navigate().
        message = location.state.message;
    }

    useEffect(() => {
        //Esse timeout é apenas para o ícone de load demorar um pouqinho na tela.
        setTimeout(() => {
            fetch("http://localhost:5000/projects", { //http://localhost:8080/projetos/listar
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(resp => resp.json())
            .then(dataJson => {
                setProjects(dataJson)

                setRemoveLoading(true); //"true" para remover o loading, pois ele sempre começa iniciando.
            })
            .catch(err => console.log("ERRO: ", err))
        }, 500);
    }, [])


    function removeProject(id){
        fetch(`http://localhost:5000/projects/${id}`,{
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then(resp => resp.json())
        .then(() => {
            setProjects(projects.filter(p => p.id !== id)) //remove o projeto de mesmo id passado por request

            //message
            setProjectMessage('Projeto removido com sucesso!');
        })
        .catch(err => console.log("ERRO: ", err))
    }

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />

            </div>
            {
                message && <Message type="success" msg={message}  />
            }

            {
                projectMessage && <Message type="success" msg={projectMessage}  />
            }
            
            <Container customClass="start">
                {
                    projects.length > 0 && projects.map((project) => (
                        <ProjectCard key={project.id}
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project?.category?.name}
                            handleRemove={removeProject}
                             />
                    ))
                }

                {
                    !removeLoading && <Loading />
                }

                {
                    removeLoading && projects.length === 0 &&
                    (<p>Não há projetos cadastrados</p>)
                }
            </Container>

        </div>
    )
}

export default Projects;