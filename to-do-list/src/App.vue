<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Modal from './components/Modal.vue';
import type Tarefa from './interfaces/Tarefa';
import { buscarTarefas, concluirTarefa, criarTarefa, deletarTarefa, editarTarefa } from './services/tarefaService';

enum TarefaStatus {
	FALSO,
	VERDADEIRO
}

const showModal = ref(false);
const ehModalConfirmacao = ref(false);
const tituloModal = ref('');
const deletar = ref(false)
const novaTarefa = ref('');
const tarefaSelecionada = ref<Tarefa>();
let tarefas = ref<Tarefa[]>([]);
let tarefasConcluidas = ref<Tarefa[]>([]);

function edicaoTarefa(tarefa: Tarefa) {
	abrirModal(false, 'Editar tarefa', tarefa);
	novaTarefa.value = tarefa.tarefa;
};

function confirmar() {
	deletar.value ? deletaTarefa(tarefaSelecionada.value!.id) : concluiTarefa(tarefaSelecionada.value);

	fecharModal();
}

function cadastrarOuEditarTarefa() {
	if (tarefaSelecionada.value) {
		editaTarefa(tarefaSelecionada.value);
	} else {
		criaTarefa();
	}

	fecharModal();
}

const fecharModal = () => {
	showModal.value = false;
	novaTarefa.value = '';
}

const abrirModal = (confirmacao: boolean, titulo: string, tarefa?: Tarefa, ehDeletar: boolean = false) => {
	showModal.value = true;
	ehModalConfirmacao.value = confirmacao;
	tituloModal.value = titulo;
	tarefaSelecionada.value = tarefa;
	deletar.value = ehDeletar;
}

const buscaTarefas = async () => {
	tarefas.value = [];
	tarefasConcluidas.value = [];

	const tarefasEncontradas = await buscarTarefas();

	tarefasEncontradas.forEach((tarefa: Tarefa) => {
		tarefa.concluida === TarefaStatus.VERDADEIRO ? tarefasConcluidas.value.push(tarefa) : tarefas.value.push(tarefa);
	})
}

const deletaTarefa = async (id: number) => {
	await deletarTarefa(id);

	buscaTarefas();
}

const concluiTarefa = async (tarefa: Tarefa | undefined) => {
	await concluirTarefa(tarefa);

	buscaTarefas();
}

const criaTarefa = async () => {
	await criarTarefa(novaTarefa.value);

	buscaTarefas();
}

const editaTarefa = async (tarefa: Tarefa) => {
	await editarTarefa(tarefa, novaTarefa.value);

	buscaTarefas();
}

onMounted(() => {
	buscaTarefas();
})

</script>

<template>
	<div class="header-bg">
		<header>
			<h1>To-Do-List</h1>

			<nav class="menu_mobile">
				<a href="#tarefas">Incompletas</a>
				<a href="#tarefas_concluidas">Concluídas</a>
			</nav>
		</header>
	</div>

	<main>
		<section class="tarefas" id="tarefas">
			<div class="tarefas_topo">
				<h1>Tarefas</h1>
				<img src="./assets/icons/adicionar.svg" alt="" @click="abrirModal(false, 'Adicionar tarefa')">
			</div>
			<div class="tarefas_conteudo">
				<span v-if="!tarefas.length">Nenhuma tarefa.</span>
				<ul v-else>
					<li v-for="tarefa in tarefas">
						<div class="icones">
							<img src="./assets/icons/edit.svg" @click="edicaoTarefa(tarefa)" />
							<img src="./assets/icons/delete.svg" @click="abrirModal(true, '', tarefa, true)" />
							<img src="./assets/icons/concluir.svg" @click="abrirModal(true, '', tarefa)" />
						</div>
						<p>{{ tarefa.tarefa }}</p>
					</li>
				</ul>
			</div>
		</section>

		<section class="tarefas_concluidas" id="tarefas_concluidas">
			<h1>Tarefas concluídas</h1>
			<div class="tarefas_conteudo">
				<span v-if="!tarefasConcluidas.length">Nenhuma tarefa concluída.</span>
				<ul>
					<li v-for="tarefa in tarefasConcluidas">
						<img src="./assets//icons/check.svg" />
						<p>
							{{ tarefa.tarefa }}
						</p>
					</li>
				</ul>
			</div>
		</section>

		<Modal :is-open="showModal" :titulo="tituloModal" :eh-modal-confirmacao="ehModalConfirmacao"
			:eh-deletar="deletar" @modal-close="fecharModal()" @confirmar="confirmar()">
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
.menu_mobile {
	display: none;
}

header {
	padding: 2rem 2rem 0 2rem;
}

main {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
	padding: 1rem 2rem;
}

main section {
	min-width: min-content;
}

main section .tarefas_conteudo {
	border-radius: 5px;
	margin-top: .5rem;
}

ul {
	max-height: 80dvh;
	overflow-y: auto;
}

ul::-webkit-scrollbar-track {
	background-color: #353535;
}

ul::-webkit-scrollbar {
	width: 6px;
	background: #2e2e2e;
}

ul::-webkit-scrollbar-thumb {
	background: #292929;
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
	margin-right: 0.75rem;
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
	margin: 1rem 0;
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
	border-radius: 5px;
}

input:focus {
	outline: none;
}

@media (max-width: 600px) {
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		padding: 0 1rem;
		background-color: var(--vt-c-black-mute);
	}

	.header-bg {
		position: sticky;
		top: 0;
	}

	.menu_mobile {
		display: flex;
		gap: 2rem;
	}

	main {
		grid-template-columns: 1fr;
	}

	.tarefas_conteudo {
		height: max-content;
	}

	ul {
		max-height: none;
	}

	.tarefas_conteudo li {
		flex-direction: column;
		align-items: start;
		padding: 1rem;
		gap: 10px;
	}

	li .icones {
		margin: 0;
		width: 100%;
	}

}
</style>
