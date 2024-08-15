<script setup lang="ts">
import { reactive, ref } from 'vue';

class Tarefa {
	id: number = 0;
	tarefa: string = '';
}

const lista = reactive<Tarefa[]>([]);
const listaConcluida = reactive<Tarefa[]>([]);

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
	},
)

listaConcluida.push(
	{
		id: 1,
		tarefa: 'Teste tarefa concluída 1'
	},
	{
		id: 2,
		tarefa: 'Teste tarefa concluída 2'
	})


function editarTarefa(tarefa: Tarefa) {

};

function deletarTarefa(idTarefa: number) {
	const index = lista.findIndex(x => x.id === idTarefa);
	lista.splice(index, 1)
};

function concluirTarefa(tarefa: Tarefa) {
	deletarTarefa(tarefa.id)
	listaConcluida.push({ id: tarefa.id, tarefa: tarefa.tarefa })
};

function adicionarTarefa() { }

</script>

<template>
	<header>
		<h1>To-Do-List</h1>
	</header>

	<main>
		<section class="tarefas">
			<div class="tarefas_topo">
				<h1>Tarefas</h1>
				<img src="./assets/icons/adicionar.svg" alt="" @click="adicionarTarefa()">
			</div>
			<div class="tarefas_conteudo">
				<span v-if="!lista.length">Nenhuma tarefa.</span>
				<ul>
					<li v-for="tarefa in lista">
						<div class="icones">
							<img src="./assets/icons/edit.svg" @click="editarTarefa(tarefa)" />
							<img src="./assets/icons/delete.svg" @click="deletarTarefa(tarefa.id)" />
							<img src="./assets/icons/concluir.svg" @click="concluirTarefa(tarefa)" />
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
</style>
