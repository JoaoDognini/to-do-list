@ -0,0 +1,61 @@
<script setup>
import { ref } from "vue";
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
	isOpen: Boolean,
	titulo: String,
	ehModalConfirmacao: Boolean
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
						<span name="header"> {{ titulo }} </span>
					</div>
					<div class="modal-body">
						<slot name="content"> default content </slot>
					</div>
				</div>
				<!-- <div class="modal-footer">
					<slot name="footer">
						<div>
							<button @click.prevent="emit('confirmar')">Adicionar</button>
						</div>
					</slot>
				</div> -->

				<div class="modal-confirmacao-container" v-else>
					<h2>A ação não pode ser desfeita, deseja continuar?</h2>
					<div class="botoes">
						<button @click.prevent="emit('modal-close')">Voltar</button>
						<button @click.prevent="emit('confirmar')">Confirmar</button>
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
	width: 500px;
	margin: 10rem auto;
	padding: 1rem;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-body {
	margin: 1rem 0;
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
}

.modal-confirmacao-container button:last-child {
	background-color: #0b9b36;
}
</style>