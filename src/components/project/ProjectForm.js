import Input from '../form/Input';
import Select from '../form/Select';
import SubmitButton from '../form/SubmitButton';
import styles from './ProjectForm.module.css';

import { useEffect, useState } from 'react';

function ProjectForm({handleSubmit, btnText, projectData}){

    const [categories, setCategories] = useState([]);
    const [project, setProject] = useState(projectData || {}); //se for uma alteração, o objeto será inicializado com o ProjectData, caso contrario sera inicializado como {}.
    
    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((resp) => resp.json())
            .then((dataJson) => {
                setCategories(dataJson);
            })
            .catch(err => console.log("ERRO: ", err))
    }, [])
    
    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project); //project.category.id
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})
        /*
            Pega os dados do projeto até então por "...project"
            Informa que o "name" do input (name/budget) será igual ao "e.target.value"

            Isso quer dizer que, independente do input a ser preenchido, mudará a propriedade da variavel "project"
        */
       console.log(project);
    }

    function handleCategory(e){
        setProject({
            ...project, 
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
            }
    })
        
    }

    return(
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text" 
                text="Nome do projeto"
                name="name"
                placeholder="Insira o nome do projeto"
                handleOnChange={handleChange}
                value={project.name ? project.name : ''}
                 />

            <Input 
                type="number" 
                text="Orçamento do projeto"
                name="budget"
                placeholder="Insira o orçamento total"
                handleOnChange={handleChange}
                value={project.budget ? project.budget : ''}
                 />

            <Select name="category_id" text="Selecione a categoria" 
                options={categories} 
                handleOnChange={handleCategory}
                value={project.category ? project.category.id : ''} />
            
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ProjectForm
