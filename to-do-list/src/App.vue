<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type Tarefa from './interfaces/Tarefa';
import { buscarTarefas, concluirTarefa, criarTarefa, deletarTarefa, editarTarefa } from './services/tarefaService';

const showErro = ref(false);
const mensagemErro = ref('');
const showLoading = ref(false);

const novaTarefa = ref('');
const tarefaSelecionada = ref<Tarefa>();

let tarefas = ref<Tarefa[]>([]);

const inputField = ref()
const focusInput = () => {
	inputField.value.focus();
};

const mostrarErro = () => {
	showErro.value = true;
	mensagemErro.value = 'Não é possível salvar tarefas vazias.';

	setTimeout(() => {
		showErro.value = false;
		mensagemErro.value = ''
	}, 5000)
}

function edicaoTarefa(tarefa: Tarefa) {
	focusInput();
	tarefaSelecionada.value = tarefa;
	novaTarefa.value = tarefa.tarefa;
};

function cadastrarOuEditarTarefa() {
	if (tarefaSelecionada.value) {
		editaTarefa(tarefaSelecionada.value);
	} else {
		criaTarefa();
	}

	novaTarefa.value = '';
	tarefaSelecionada.value = undefined;
}

const buscaTarefas = async () => {
	tarefas.value = [];
	novaTarefa.value = '';
	showLoading.value = true;
	try {
		tarefas.value = await buscarTarefas();
	} finally {
		showLoading.value = false;
	}
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
	if (!novaTarefa.value) {
		mostrarErro();
		return;
	}

	await criarTarefa(novaTarefa.value);

	buscaTarefas();
}

const editaTarefa = async (tarefa: Tarefa) => {
	if (!novaTarefa.value) {
		mostrarErro();
		return;
	}

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
			<h1>To Do List</h1>
		</header>
	</div>

	<main>
		<div v-if="!tarefas.length && !showLoading" class="nenhuma_tarefa">
			<span>Nenhuma tarefa encontrada. <br>Comece adicionando uma!</span>

			<div class="adicionar_tarefa">
				<input type="text" v-model="novaTarefa" placeholder="Adicionar nova tarefa" @keyup.enter="criaTarefa()"
					ref="inputField" required>
				<img class="adicionar" src="./assets/icons/adicionar.svg" @click="cadastrarOuEditarTarefa()"
					alt="Ícone adicionar" />
			</div>
		</div>

		<div v-else>
			<div class="adicionar_tarefa_container">
				<div class="adicionar_tarefa">
					<input type="text" v-model="novaTarefa" placeholder="Adicionar nova tarefa"
						@keyup.enter="cadastrarOuEditarTarefa()" ref="inputField" required>
					<img class="adicionar" src="./assets/icons/adicionar.svg" @click="cadastrarOuEditarTarefa()"
						alt="Ícone adicionar" />
				</div>
				<span v-if="showErro" class="span_erro">{{ mensagemErro }}</span>
			</div>

			<ul>
				<li v-for="tarefa in tarefas" class="lista_item">
					<div class="lista_item_conteudo">
						<img v-if="tarefa.concluida" src="./assets/icons/marcado.svg" alt="Ícone marcado" />
						<img v-else src="./assets/icons/desmarcado.svg" @click="concluiTarefa(tarefa)"
							alt="Ícone desmarcado" />

						<span v-bind:class="{ concluida: tarefa.concluida }">{{ tarefa.tarefa }}</span>
					</div>
					<div class="lista_item_botoes">
						<img v-bind:class="{ naoEditar: tarefa.concluida }" src="./assets/icons/editar.svg"
							@click="edicaoTarefa(tarefa)" alt="Ícone editar">
						<img src="./assets/icons/excluir.svg" @click="deletaTarefa(tarefa.id)" alt="Ícone excluir">
					</div>
				</li>
			</ul>
		</div>

		<div v-if="showLoading" class="loading">
			<div class="loader"></div>
		</div>
	</main>
</template>

<style scoped>
header {
	padding: 2rem 2rem 2rem 2rem;
}

main {
	padding: 1rem;
	background-color: var(--bg-preto-secundario);
	border-radius: 5px;
	max-width: 600px;
}

main img {
	cursor: pointer;
}

.nenhuma_tarefa {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.nenhuma_tarefa>span {
	color: var(--c4);
	font-size: 1.5rem;
	margin-bottom: 2rem;
	text-align: center;
}

.span_erro {
	padding: 0.5rem 1rem;
	display: block;
	font-weight: 500;
}

input {
	padding: 1rem 3rem 1rem 1rem;
	font-size: 1.15rem;
	width: 100%;
	border: none;
	background-color: var(--bg-preto);
	color: var(--branco);
	border-radius: 5px;
}

input:focus {
	outline: 1px solid #646464;
	border: none;
}

.adicionar_tarefa_container {
	margin-bottom: 1rem;
}

.adicionar_tarefa {
	display: flex;
	align-items: center;
	position: relative;
}

.adicionar_tarefa .adicionar {
	position: absolute;
	right: 16px;
}

.lista_item {
	display: flex;
	justify-content: space-between;
	gap: 2rem;
	padding: 1rem 0.5rem;
	color: var(--branco);
}

.lista_item:nth-child(odd) {
	background-color: #2b2b2b;
	border-radius: 5px;
}

.lista_item span {
	font-weight: 600;
	font-size: 1rem;
}

.lista_item .lista_item_conteudo {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.lista_item .lista_item_botoes {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	opacity: 0;
}

.lista_item:hover>.lista_item_botoes {
	opacity: 1;
	transition: 0.5s;
}

.lista_item_botoes img:hover {
	scale: 1.25;
	transition: 0.3s;
}

.concluida {
	color: var(--c1);
	text-decoration: line-through;
}

.naoEditar {
	display: none;
}

.loading {
	display: flex;
	justify-content: center;
	padding: 1rem;
}

.loader {
	width: 50px;
	height: 50px;
	border: 4px solid var(--c4);
	border-radius: 50%;
	border-top-color: transparent;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

@media (max-width: 960px) {
	.lista_item .lista_item_botoes {
		opacity: 1;
	}
}
</style>
