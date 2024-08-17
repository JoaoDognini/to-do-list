<script setup lang="ts">
import { reactive, ref } from 'vue';
import Modal from './components/Modal.vue';

class Tarefa {
	id: number = 0;
	tarefa: string = '';
}

const showModal = ref(false);
const ehModalConfirmacao = ref(false);
const tituloModal = ref('');
const deletar = ref(false)
const novaTarefa = ref('');
const tarefaSelecionada = ref<Tarefa>();
let lista = reactive<Tarefa[]>([]);
let listaConcluida = reactive<Tarefa[]>([]);

lista.push(
	{
		id: 1,
		tarefa: 'Teste tarefa'
	},
	{
		id: 2,
		tarefa: 'Teste tarefa 2'
	},
	{
		id: 3,
		tarefa: 'Teste tarefa 3'
	},
	{
		id: 4,
		tarefa: 'Teste tarefa 4'
	},
	{
		id: 5,
		tarefa: 'Teste tarefa 5'
	});

listaConcluida.push(
	{
		id: 1,
		tarefa: 'Teste tarefa concluída 1'
	},
	{
		id: 2,
		tarefa: 'Teste tarefa concluída 2'
	});

function editarTarefa(tarefa: Tarefa) {
	abrirModal(false, 'Editar tarefa', tarefa);
	novaTarefa.value = tarefa.tarefa;
};

function deletarTarefa(idTarefa: number) {
	const index = lista.findIndex(x => x.id === idTarefa);
	lista.splice(index, 1);
};

function concluirTarefa(tarefa: Tarefa) {
	deletarTarefa(tarefa.id);
	listaConcluida.push(tarefa);
};

function confirmar() {
	deletar.value ? deletarTarefa(tarefaSelecionada.value!.id) : concluirTarefa(tarefaSelecionada.value!);

	fecharModal();
}

function cadastrarOuEditarTarefa() {
	if (tarefaSelecionada.value) {
		const indexAtualizar = lista.findIndex(item => item.id === tarefaSelecionada.value?.id);
		lista[indexAtualizar] = { ...lista[indexAtualizar], tarefa: novaTarefa.value };
	} else {
		const id = lista.length + 1;
		lista.push({ id: id, tarefa: novaTarefa.value });
	}
	novaTarefa.value = '';
}

const fecharModal = () => {
	showModal.value = false
}

const abrirModal = (confirmacao: boolean, titulo: string, tarefa?: Tarefa, ehDeletar: boolean = false) => {
	showModal.value = true;
	ehModalConfirmacao.value = confirmacao;
	tituloModal.value = titulo;
	tarefaSelecionada.value = tarefa;
	deletar.value = ehDeletar;
}

</script>

<template>
	<header>
		<h1>To-Do-List</h1>
	</header>

	<main>
		<section class="tarefas">
			<div class="tarefas_topo">
				<h1>Tarefas</h1>
				<img src="./assets/icons/adicionar.svg" alt="" @click="abrirModal(false, 'Adicionar tarefa')">
			</div>
			<div class="tarefas_conteudo">
				<span v-if="!lista.length">Nenhuma tarefa.</span>
				<ul>
					<li v-for="tarefa in lista">
						<div class="icones">
							<img src="./assets/icons/edit.svg" @click="editarTarefa(tarefa)" />
							<img src="./assets/icons/delete.svg" @click="abrirModal(true, '', tarefa, true)" />
							<img src="./assets/icons/concluir.svg" @click="abrirModal(true, '', tarefa)" />
						</div>
						<p>{{ tarefa.tarefa }}</p>
					</li>
				</ul>
			</div>
		</section>

		<section class="tarefas_concluidas">
			<h1>Tarefas concluídas</h1>
			<div class="tarefas_conteudo">
				<span v-if="!listaConcluida.length">Nenhuma tarefa concluída.</span>
				<ul>
					<li v-for="tarefa in listaConcluida">
						<img src="./assets//icons/check.svg" />
						<p>
							{{ tarefa.tarefa }}
						</p>
					</li>
				</ul>
			</div>
		</section>

		<Modal :is-open="showModal" :titulo="tituloModal" :eh-modal-confirmacao="ehModalConfirmacao"
			@modal-close="fecharModal()" @confirmar="confirmar()">
			<template #content>
				<form @submit.prevent="cadastrarOuEditarTarefa()">
					<input type="text" name="tarefa" placeholder="Digite a tarefa" v-model="novaTarefa" required>
					<button type="submit">Adicionar</button>
				</form>
			</template>
		</Modal>
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

main section {
	min-width: 500px;
}

main section .tarefas_conteudo {
	border: 1px solid #FFF;
	border-radius: 5px;
	margin-top: .5rem;
}

.tarefas_conteudo li:nth-child(odd) {
	background-color: rgb(37, 37, 37);
}

.tarefas_conteudo li:first-child {
	border-radius: 5px 5px 0 0;
}

.tarefas_conteudo li:last-child {
	border-radius: 0 0 5px 5px;
}

.tarefas_conteudo li {
	display: flex;
	align-items: center;
	padding: 1rem;
}

.icones {
	display: flex;
	gap: 0.75rem;
	margin: 0 1rem;
}

.icones img:hover {
	cursor: pointer;
}

.tarefas_topo {
	display: flex;
	justify-content: space-between;
}

.tarefas_topo img {
	cursor: pointer;
}

.tarefas_concluidas h1 {
	text-align: end;
}

.tarefas_concluidas ul li {
	display: flex;
	gap: 1rem;
}

.tarefas_concluidas span {
	padding: 1rem;
	display: block;
}

form {
	display: flex;
	flex-direction: column;
}

form input {
	width: 100%;
	padding: 1rem;
	font-size: 1rem;
	border-radius: 5px;
	border: 1px solid var(--vt-c-black-mute);
	margin-bottom: 1rem;
}

form button {
	padding: 1rem;
	border: none;
	background-color: #125FFF;
	color: #FFF;
	font-weight: 600;
	cursor: pointer;
	align-self: end;
	width: max-content;
}

input:focus {
	outline: none;
}
</style>
