@ -0,0 +1,61 @@
<script setup>
import { ref } from "vue";
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
	isOpen: Boolean,
	titulo: String,
	ehModalConfirmacao: Boolean,
	ehDeletar: Boolean
});

const emit = defineEmits(["modal-close", "confirmar", "voltar"]);

const target = ref(null)
onClickOutside(target, () => emit('modal-close'))
</script>

<template>
	<div v-if="isOpen" class="modal-mask">
		<div class="modal-wrapper">
			<div class="modal-container" ref="target">
				<div v-if="!ehModalConfirmacao">
					<div class="modal-header">
						<h2 class="titulo"> {{ titulo }} </h2>
					</div>
					<div class="modal-body">
						<slot name="content"> default content </slot>
					</div>
				</div>

				<div class="modal-confirmacao-container" v-else>
					<h2 class="titulo" v-if="!!ehDeletar">A ação não pode ser desfeita, deseja excluir a tarefa?</h2>
					<h2 class="titulo" v-else>A ação não pode ser desfeita, deseja marcar a tarefa como concluida?</h2>
					<div class="botoes">
						<button @click.prevent="emit('modal-close')">Voltar</button>
						<button @click.prevent="emit('confirmar')" v-if="!ehDeletar" class="concluir">Concluir</button>
						<button @click.prevent="emit('confirmar')" v-else class="excluir">Excluir</button>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<style scoped>
div {
	color: #000
}

.titulo {
	color: #FFF;
	font-weight: 500;
}

.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
	max-width: 500px;
	margin: 10rem auto;
	padding: 1rem;
	background-color: #292929;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	border-radius: 5px;
}

.modal-footer {
	display: flex;
	justify-content: end;
}

.modal-confirmacao-container {
	display: flex;
	flex-direction: column
}

.botoes {
	display: flex;
	gap: 15px
}

.modal-confirmacao-container button {
	padding: 1rem;
	border: none;
	background-color: #125FFF;
	color: #FFF;
	font-weight: 600;
	cursor: pointer;
	border-radius: 5px;
}


.modal-confirmacao-container .excluir {
	background-color: red;
}

.modal-confirmacao-container .concluir {
	background-color: #0b9b36;
}

@media (max-width: 600px) {
	.modal-mask {
		padding: 0 1rem;
	}

	.modal-container {
		text-align: center;
	}

	.botoes {}
}
</style>