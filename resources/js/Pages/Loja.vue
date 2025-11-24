<script setup>

import { ref, computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';

import GuestLayout from '@/Layouts/GuestLayout.vue';

const props = defineProps({
    products: Array,
    categories: Array,
    currentCategory: String,
});

const cart = ref([]);
const isCartVisible = ref(false);

const banners = ref([
    {
        image: '/banner/blackfriday.jpg',
        message: 'Olá! Vim pelo banner da promoção Black Friday do site.'
    },
]);

const cartItemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

const addToCart = (product) => {
    const itemInCart = cart.value.find(item => item.id === product.id);
    if (itemInCart) {
        itemInCart.quantity++;
    } else {
        cart.value.push({ ...product, quantity: 1 });
    }
};

const incrementQuantity = (item) => {
    item.quantity++;
};

const decrementQuantity = (item) => {
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(item.id);
    }
};

const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId);
};

const totalCost = computed(() => {
    return cart.value.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
});

const formatCurrency = (value) => {
    if (typeof value !== "number") {
        value = parseFloat(value);
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const sendToWhatsApp = () => {
    const storePhoneNumber = '5584986335004'; // 55 (pais) + DDD + Numero
    let message = 'Olá, gostaria de fazer o pedido: \n\n';

    cart.value.forEach(item => {
        message += `*Produto:* ${item.name}\n`;
        message += `*Qtd:* ${item.quantity}\n`;
        message += `*Preço Unit.:* ${formatCurrency(item.price)}\n`;
        message += `*Subtotal:* ${formatCurrency(parseFloat(item.price) * item.quantity)}\n`;
        message += '-----------------------\n';
    });

    message += `\n*Total do Pedido: ${formatCurrency(totalCost.value)}*`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${storePhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
};

const sendPromotionToWhatsApp = (message) => {
    const storePhoneNumber = '5584986335004'; // 55 (pais) + DDD + Numero
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${storePhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
};

</script>

<template>

     <Head title="JR Mundo Tech" />

    <!-- Usamos o GuestLayout como base da página -->
    <GuestLayout>
        <div class="bg-gray-50 font-sans">
            <div class="container mx-auto p-4 md:p-8 w-full max-w-7xl">

                <!-- Cabeçalho e Carrinho -->
                <header class="mb-8 p-4 bg-white rounded-lg shadow-lg flex justify-between items-center relative">
                    <!-- Esquerda: Logo e Nome -->
                    <div class="flex items-center">
                        <img src="/LOGO1.png" alt="JR Mundo Tech Logo" class="h-10 mr-3"> 
                        <span class="text-3xl font-bold text-gray-800 hidden sm:inline">
                            <span class="text-blue-600">Mundo Tech</span>
                        </span>
                    </div>

                    <!-- Centro: Menu de Navegação (Editável) -->
                    <nav class="hidden md:flex">
                        <ul class="flex items-center space-x-6 lg:space-x-8 text-gray-600 font-semibold">
                            <li>
                                <Link href="/loja" :class="{ 'text-blue-600 font-bold': !props.currentCategory }" class="hover:text-blue-600 transition-colors">Todos</Link>
                            </li>
                            <li v-for="category in props.categories" :key="category.id">
                                <Link :href="`/loja?category=${category.slug}`"
                                    :class="{ 'text-blue-600 font-bold': props.currentCategory === category.name }"
                                    class="hover:text-blue-600 transition-colors whitespace-nowrap">
                                    {{ category.name }}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <!-- Direita: Carrinho -->
                    <div class="relative">
                        <button @click="isCartVisible = !isCartVisible" class="relative flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {{ cartItemCount }}
                            </span>
                        </button>
                        
                        <!-- Dropdown do Carrinho -->
                        <div v-if="isCartVisible" @click.outside="isCartVisible = false" class="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 p-4 rounded-lg shadow-xl z-20">
                            <h2 class="text-xl font-semibold mb-3 flex items-center text-gray-700">
                                Meu Carrinho
                            </h2>
                            
                            <div v-if="cart.length === 0" class="text-gray-500 italic py-8 text-center">
                                Seu carrinho está vazio.
                            </div>
                            <ul v-else class="divide-y divide-gray-200 max-h-64 overflow-y-auto pr-2 mb-4">
                                <li v-for="item in cart" :key="item.id" class="flex items-center py-3">
                                    <img :src="item.image_url" :alt="item.name" class="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200">
                                    <div class="flex-1">
                                        <p class="font-bold text-gray-800 text-sm">{{ item.name }}</p>
                                        <p class="text-sm text-blue-600 font-semibold">{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</p>
                                        <div class="flex items-center mt-2">
                                            <button @click="decrementQuantity(item)" class="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">-</button>
                                            <span class="mx-3 font-semibold text-gray-700">{{ item.quantity }}</span>
                                            <button @click="incrementQuantity(item)" class="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">+</button>
                                        </div>
                                    </div>
                                    <button @click="removeFromCart(item.id)" class="ml-4 text-gray-400 hover:text-red-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>

                            <div v-if="cart.length > 0">
                                <hr class="my-3">
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-lg font-bold text-gray-900">Total:</span>
                                    <span class="text-lg font-bold text-blue-600">{{ formatCurrency(totalCost) }}</span>
                                </div>
                                <button 
                                    @click="sendToWhatsApp"
                                    class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center text-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.794.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                    Finalizar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Banner Promocional -->
                <section class="mb-10">
                    <!-- Exemplo de banner simples. Você pode substituir por um componente de carrossel -->
                    <div v-for="(banner, index) in banners" :key="index"
                         @click="sendPromotionToWhatsApp(banner.message)"
                         class="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group">
                        <img :src="banner.image" alt="Banner Promocional" class="w-full h-auto transition-transform duration-300 group-hover:scale-105">
                        <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>
                </section>

                <!-- Grid de Produtos -->
                <main>
                    <h2 class="text-3xl font-bold text-gray-800 mb-8">
                        <span v-if="props.currentCategory">{{ props.currentCategory }}</span>
                        <span v-else>Nossos Produtos</span>
                    </h2>

                    <div v-if="props.products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <!-- Loop nos produtos que vieram do Laravel -->
                        <div v-for="product in props.products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 flex flex-col h-full">
                            <div class="relative group w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" 
                                    onerror="this.src='https://placehold.co/300x200/e2e8f0/64748b?text=Produto'">
                                
                                <!-- Overlay com a descrição do produto -->
                                <div v-if="product.description" class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <p class="text-white text-center text-sm leading-relaxed">{{ product.description }}</p>
                                </div>
                            </div>
                            <div class="p-5 flex flex-col flex-grow">
                                <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate" :title="product.name">{{ product.name }}</h3>
                                <p class="text-2xl font-bold text-blue-600 mb-4">{{ formatCurrency(product.price) }}</p>
                                <button 
                                    @click="addToCart(product)"
                                    class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center mt-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center text-gray-500 py-16">
                        <p class="text-xl font-semibold">Nenhum produto encontrado.</p>
                        <p v-if="props.currentCategory" class="mt-2">Não há produtos nesta categoria no momento.</p>
                    </div>
                </main>
            </div>
        </div>

        <!-- Rodapé -->
        <footer class="bg-gray-800 text-gray-300 py-8">
            <div class="container mx-auto px-4 md:px-8 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <p class="text-sm mb-4 md:mb-0">
                    &copy; {{ new Date().getFullYear() }} JR Mundo Tech. Todos os direitos reservados.
                </p>
                <div class="flex items-center space-x-6">
                    <a href="https://instagram.com/jrmundotech" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors" aria-label="Instagram">
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                        </svg>
                    </a>
                    <a href="https://wa.me/5584986335004" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors" aria-label="WhatsApp">
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.794.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    </a>
                </div>
            </div>
        </footer>
    </GuestLayout>

</template>
