import styles from '../project/ProjectForm.module.css';
import { useState } from 'react';
import Input from '../form/Input';
import SubmitButton from '../form/SubmitButton';

const ServiceForm = ({ handleSubmit, btnText, projectData }) => {
  const [service, setService] = useState({
    name: '',
    cost: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(service);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Input
        type="text"
        text="Nome do serviço"
        name="name"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
        value={service.name}
      />
      <Input
        type="number"
        text="Custo do serviço"
        name="cost"
        placeholder="Insira o valor total"
        handleOnChange={handleChange}
        value={service.cost}
      />
      <Input
        type="text"
        text="Descrição do serviço"
        name="description"
        placeholder="Descreva o serviço"
        handleOnChange={handleChange}
        value={service.description}
      />
      <SubmitButton text={btnText} />
    </form>
  );
};

export default ServiceForm;