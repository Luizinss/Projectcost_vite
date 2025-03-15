import ProjectForm from '../project/ProjectForm';
import styles from './NewProject.module.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase'; // Importa a configuração do Firebase
import { collection, addDoc } from 'firebase/firestore'; // Importa funções do Firestore

function NewProject() {
  const navigate = useNavigate();

  const createPost = async (project) => {
    // Inicializa cost e services
    project.cost = 0;
    project.services = [];

    try {
      // Adiciona o projeto ao Firestore
      const docRef = await addDoc(collection(db, 'projects'), project);
      console.log('Projeto criado com ID:', docRef.id);

      // Redireciona com mensagem de sucesso
      const state = { message: 'Projeto criado com sucesso!' };
      navigate('/projects', { state });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  };

  return (
    <div className={styles.newproject_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
    </div>
  );
}

export default NewProject;