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
	await api.post('', {
		tarefa: tarefa,
		concluida: false
	})
}

export const editarTarefa = async (tarefa: Tarefa, novaTarefa: string) => {
	await api.put(`/${tarefa.id}`, {
		...tarefa, tarefa: novaTarefa
	})
}