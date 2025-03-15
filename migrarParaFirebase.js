import { readFile } from "fs/promises"; // Importa o módulo fs para ler o arquivo JSON
import { db } from "./firebase.js"; // Importa a configuração do Firebase
import { collection, addDoc } from "firebase/firestore";

const migrarProjects = async () => {
  try {
    // Lê o arquivo JSON
    const data = await readFile("./db.json", "utf-8");
    const projects = JSON.parse(data).projects; // Converte o JSON em um objeto JavaScript

    // Adiciona cada project ao Firestore
    for (const project of projects) {
      // Valida se os campos obrigatórios existem
      if (!project.name || !project.category || !project.category.name) {
        console.error(`Projeto inválido: ${JSON.stringify(project)}`);
        continue; // Pula para o próximo projeto
      }

      // Adiciona o projeto à coleção "projects"
      await addDoc(collection(db, "projects"), {
        name: project.name,
        budget: parseFloat(project.budget), // Converte o budget para número
        cost: parseFloat(project.cost), // Converte o cost para número
        category: {
          id: project.category.id,
          name: project.category.name,
        },
        services: project.services, // Mantém a lista de serviços
      });

      console.log(`Projeto "${project.name}" migrado com sucesso!`);
    }

    console.log("Migração concluída!");
  } catch (error) {
    console.error("Erro durante a migração:", error);
  }
};

migrarProjects();