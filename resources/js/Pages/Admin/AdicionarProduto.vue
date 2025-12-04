<script setup>

import { useForm, Head, Link } from '@inertiajs/vue3';
import GuestLayout from '@Layouts/GuestLayout.vue';

defineProps({ categories: Array });

const form = useForm({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: null,
});

const submit = () => {
    form.post(route('admin.products.store'), {
        forceFormData: true,
    });
};

</script>

<template>

    <head title="Adicionar Produto" />

    <GuestLayout>
        <div class="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div class="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Novo Produto</h2>
                    <Link href="/loja" class="text-sm text-blue-600 hover:underline">← Voltar</Link>
                </div>

                <form @submit.prevent="submit" enctype="multipart/form-data">
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Nome</label>
                        <input v-model="form.name" type="text" class="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                        <div v-if="form.errors.name" class="text-red-500 text-sm mt-1">{{ form.errors.name }}</div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Descrição</label>
                        <textarea v-model="form.description" class="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows="3"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Preço (R$)</label>
                            <input v-model="form.price" type="number" step="0.01" class="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                            <div v-if="form.errors.price" class="text-red-500 text-sm mt-1">{{ form.errors.price }}</div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Categoria</label>
                            <select v-model="form.category_id" class="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="" disabled>Selecione...</option>
                                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-700 font-bold mb-2">Imagem</label>
                        <input type="file" @input="form.image = $event.target.files[0]" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/*">
                        <div v-if="form.errors.image" class="text-red-500 text-sm mt-1">{{ form.errors.image }}</div>
                    </div>

                    <div class="flex justify-end">
                        <button type="submit" :disabled="form.processing" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                            {{ form.processing ? 'Salvando...' : 'Salvar Produto' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </GuestLayout>
</template>