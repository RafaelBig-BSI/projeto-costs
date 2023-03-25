import styles from './Project.module.css';

import { useParams } from 'react-router-dom'; //pega o ":id" passado pela URL
import { useState, useEffect } from 'react';

import Loading from '../layout/Loading';
import Container from '../layout/Container';
import Message from '../layout/Message';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

import {parse, v4 as uuidv4} from 'uuid';

function Project(){

    const {id} = useParams(); //coloca o id dessa maneira para o React enteneder que o id vem da URL.

    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    
    const [showProjectForm, setShowProjectForm] = useState(false); //não exibe inicialemnte o formulário do projeto, e sim exibe os dados do projeto primeiro.
    const [showServiceForm, setShowServiceForm] = useState(false);

    const [message, setMessage] = useState('');
    const [type, setType] = useState();
    
    useEffect(() => {
        
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
            })
            .then(resp => resp.json())
            .then(dataJson => {
                setProject(dataJson)

                setServices(dataJson.services)
            })
            .catch(err => console.log("ERRO: ", err))
        }, 500);

    }, [id]) //o useEffect está monitorando o "id" do projeto como referencia.

    
    function editPost(project){
        setMessage('');

        //budget validation
        if(project.budget < project.cost){
            //message
            setMessage('O orçamento não pode ser menor que o custo do projeto!');
            setType('error');
            return false;
        }
        
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(dataJson => {

            setProject(dataJson)
            setShowProjectForm(false)

            //message
            setMessage('Projeto atualizado!')
            setType('success')
        })
        .catch(err => console.log("ERRO: ", err))

    }

    function createService(project){
        setMessage('');

        //last service - validação
        const lastService = project.services[project.services.length - 1]; //pega o ultimo servico que acabou de adicionar.

        lastService.id = uuidv4(); //fornece um id unico para o ultimo service, pois será preciso imprimir na tela e o React pede uma chave key.
        
        const lastServiceCost = lastService.cost;
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        //maximun value validation
        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado! Verifique o valor do serviço.');
            setType('error');
            project.services.pop();
            return false;
        }

        //add service cost to project total cost
        project.cost = newCost;

        //update project
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(dataJson => {
            setShowProjectForm(false)
        })
        .catch(err => console.log("ERRO: ", err))
    }
    
    function removeService(id, cost){

        const servicesUpdate = project.services.filter(service => service.id !== id); //tira o serviço que tem o "id" igual ao que foi passado por parametro. Ficará apenas os serviços com IDs diferentes do que foi passado por parametro, que seria o removivel.
 
        const projectUpdated = project;
        projectUpdated.services = servicesUpdate;
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

        //Atualizar na base de dados
        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(resp => resp.json())
        .then(dataJson => {
            setProject(projectUpdated)
            setServices(servicesUpdate)
            setMessage('Serviço removido com sucesso!')
            setType('success')
        })
        .catch(err => console.log("ERRO: ", err))
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">

                        {
                            message && <Message type={type} msg={message} />
                        }

                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>

                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado: </span> R${project.cost}
                                    </p>
                                </div>
                            ) : 
                            (
                                <div className={styles.project_info} >
                                    <ProjectForm handleSubmit={editPost}
                                         btnText="Concluir edição"
                                         projectData={project} />
                                </div>
                            )}
                        </div>

                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>

                            <div className={styles.project_info}>
                                {
                                    showServiceForm && (
                                        <ServiceForm
                                             handleSubmit={createService}
                                             btnText="Adicionar Serviço"
                                             projectData={project} />
                                    )
                                }
                            </div>
                        </div>
                        
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {
                                services.length > 0 && 
                                services.map(service => (
                                    <ServiceCard key={service.id}
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {
                                services.length === 0 &&
                                <p>Não há serviços cadastrados. </p>
                            }
                        </Container>
                    </Container>
                </div>
            ) : 
            ( <Loading /> )}
        </>
    )
}

export default Project;