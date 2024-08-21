import type Tarefa from "@/interfaces/Tarefa";
import api from "./api";

export const buscarTarefas = async () => {
	try {
		const resposta = await api.get('');

		return resposta.data.data
	} catch (error) {
		console.error('Erro ao buscar tarefas', error);
		return;
	}
}

export const deletarTarefa = async (id: number) => {
	try {
		await api.delete(`${id}`)
	} catch (error) {
		console.log('Erro ao deletar', error);
		return;
	}
}

export const concluirTarefa = async (tarefa: Tarefa | undefined) => {
	if (!tarefa) return;

	try {
		await api.put(`${tarefa.id}`, { ...tarefa, concluida: true })
	} catch (error) {
		console.log('Erro ao concluir tarefa', error);
		return;
	}
}

export const criarTarefa = async (tarefa: string) => {
	if (!tarefa) return;
	try {
		await api.post('', {
			tarefa: tarefa,
			concluida: false
		})
	} catch (error) {
		return console.error('Não é possível criar tarefa vazia.', error)
	}
}

export const editarTarefa = async (tarefa: Tarefa, novaTarefa: string) => {
	if (!novaTarefa) return;
	try {
		await api.put(`/${tarefa.id}`, {
			...tarefa, tarefa: novaTarefa
		})
	} catch (error) {
		return console.error('Não é possível criar tarefa vazia.', error)
	}
}