import Message from "../layout/Message";
import { useLocation } from "react-router-dom";
import Container from "../layout/Container";
import Loading from "../layout/Loading";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";
import { useState, useEffect } from "react";
import styles from "./Projects.module.css";
import { db } from "../../../firebase"; // Importa a configuração do Firebase
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Importa funções do Firestore

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');

  const location = useLocation();
  let message = '';
  if (location.state) {
    message = location.state.message;
  }

  // Busca os projetos do Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
        setRemoveLoading(true);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    setTimeout(() => {
      fetchProjects();
    }, 800);
  }, []);

  // Remove um projeto do Firestore
  const removeProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter((project) => project.id !== id));
      setProjectMessage('Projeto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
    }
  };

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Novo Projeto" />
      </div>
      {message && <Message msg={message} type="success" />}
      {projectMessage && <Message msg={projectMessage} type="success" />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project.category.name}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>
    </div>
  );
}

export default Projects;