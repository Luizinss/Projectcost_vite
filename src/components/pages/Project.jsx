import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import styles from './Project.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import Message from '../layout/Message';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard'; // Certifique-se de que o caminho está correto
import { db } from '../../../firebase'; // Importa a configuração do Firebase
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; // Importa funções do Firestore

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  // Busca o projeto do Firestore
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, 'projects', id);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          const projectData = projectSnap.data();
          setProject({ ...projectData, id: projectSnap.id });
          setServices(projectData.services || []);
        } else {
          console.log('Projeto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar projeto:', error);
      }
    };

    setTimeout(() => {
      fetchProject();
    }, 500);
  }, [id]);

  // Adiciona um serviço ao projeto
  const createService = async (service) => {
    setMessage('');

    // Verifica se o array `services` existe no projeto
    if (!project.services) {
      project.services = []; // Inicializa o array se ele não existir
    }

    // Verifica se o serviço está completo
    if (!service.name || !service.cost || !service.description) {
      console.error('O serviço está incompleto:', service);
      setMessage('Preencha todos os campos do serviço!');
      setType('error');
      return false;
    }

    // Adiciona um ID único ao serviço
    service.id = uuidv4();

    // Calcula o novo custo total
    const serviceCost = parseFloat(service.cost);
    const newCost = parseFloat(project.cost) + serviceCost;

    // Validação do orçamento
    if (newCost > parseFloat(project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço');
      setType('error');
      return false;
    }

    // Atualiza o custo total do projeto
    project.cost = newCost;
    const updatedServices = [...project.services, service];

    try {
      const projectRef = doc(db, 'projects', project.id);

      // Atualiza o projeto no Firestore
      await updateDoc(projectRef, {
        services: updatedServices, // Atualiza o array de serviços
        cost: newCost, // Atualiza o custo total
      });

      // Atualiza o estado local
      setProject({ ...project, services: updatedServices });
      setServices(updatedServices); // Atualiza o estado local dos serviços
      setShowServiceForm(false); // Fecha o formulário de adição de serviço
      setMessage('Serviço adicionado com sucesso!');
      setType('success');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      setMessage('Erro ao adicionar serviço');
      setType('error');
    }
  };

  // Remove um serviço do projeto
  const removeService = async (serviceId, cost) => {
    const servicesUpdated = project.services.filter(
      (service) => service.id !== serviceId
    );

    const projectUpdated = {
      ...project,
      services: servicesUpdated,
      cost: parseFloat(project.cost) - parseFloat(cost),
    };

    try {
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        services: arrayRemove(project.services.find((service) => service.id === serviceId)),
        cost: projectUpdated.cost,
      });

      setProject(projectUpdated);
      setServices(servicesUpdated);
      setMessage('Serviço removido com sucesso');
      setType('success');
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      setMessage('Erro ao remover serviço');
      setType('error');
    }
  };

  // Alterna o formulário de edição do projeto
  const toggleProjectForm = () => {
    setShowProjectForm(!showProjectForm);
  };

  // Alterna o formulário de adição de serviço
  const toggleServiceForm = () => {
    setShowServiceForm(!showServiceForm);
  };

  // Edita o projeto
  const editPost = async (project) => {
    setMessage('');

    // Validação do orçamento
    if (project.budget < project.cost) {
      setMessage('O orçamento não pode ser menor que o custo do projeto!');
      setType('error');
      return false;
    }

    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, project);

      setProject(project);
      setShowProjectForm(false);
      setMessage('Projeto atualizado com sucesso!');
      setType('success');
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      setMessage('Erro ao atualizar projeto');
      setType('error');
    }
  };

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button onClick={toggleProjectForm} className={styles.btn}>
                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria: </span>{project.category.name}
                  </p>
                  <p>
                    <span>Total de Orçamento: </span>R${project.budget}
                  </p>
                  <p>
                    <span>Total Utilizado: </span>R${project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button onClick={toggleServiceForm} className={styles.btn}>
                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar Serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id} // Certifique-se de que a chave é única
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>Não há serviços cadastrados.</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Project;