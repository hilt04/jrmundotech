<script setup>


import { ref, computed } from 'vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';

import GuestLayout from '@/Layouts/GuestLayout.vue';

const props = defineProps({
    products: Array,
    categories: Array,
    currentCategory: String,
});
// Lógica do carrinho ///
const cart = ref([]);
const isCartVisible = ref(false);

// Helper de teste (somente quando ?e2e=1) para adicionar um produto de teste ao carrinho
if (typeof window !== 'undefined' && window.location && window.location.search.includes('e2e=1')) {
    window.addTestProduct = () => {
        if (!cart.value.find(p => p && p.id === 'e2e-test-product')) {
            cart.value.push({ id: 'e2e-test-product', name: 'Produto Teste (E2E)', price: 10.0, quantity: 1, image_url: '' });
        }
    };
}

// Lógica do Usuário ///
const isUserDropdownVisible = ref(false);
const page = usePage();
const user = computed(()=> page.props.auth.user);

const loginForm = useForm({
    email: '',
    password: '',
    remember: false,
});

const handleLogin = () => {
    loginForm.post(route('login'), {
        onFinish: () => {
            loginForm.reset('password');
            isUserDropdownVisible.value = false;
        },
        onError: (errors) => {
            if (errors.email || errors.password) {
                alert('Erro ao fazer login: ' + (errors.email || errors.password));
            } else {
                alert('Erro desconhecido ao fazer login.');
            }
        },
    });
};

const banners = ref([
    {
        image: '/banner/blackfriday.jpg',
        message: 'Olá! Vim pelo banner da promoção Black Friday do site.'
    },
]);

const cartItemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

// Retirada e Pagamento (opções do dropdown do carrinho)
const pickupMethod = ref('retirar'); // 'retirar' ou 'entrega'
const paymentMethod = ref('especie_pix'); // 'especie_pix' ou 'cartao'

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

    // Adiciona método de retirada e forma de pagamento ao pedido
    message += `\n*Retirada:* ${pickupMethod.value === 'retirar' ? 'Retirar em loja' : 'Entrega'}`;
    message += `\n*Pagamento:* ${paymentMethod.value === 'especie_pix' ? 'Espécie/PIX' : 'Cartão'}`;
    message += `\n\n*Total do Pedido: ${formatCurrency(totalCost.value)}*`;
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

    <Head title="JR Mundo Tech"/>

    <GuestLayout>
        <div class="bg-gray-50 font-sans min-h-screen">
            <div class="container mx-auto p-4 md:p-8 w-full max-w-7xl">

                <!-- Cabeçalho -->
                <header class="mb-8 p-4 bg-white rounded-lg shadow-lg flex justify-between items-center relative z-30">
                    <!-- Esquerda: Logo -->
                    <div class="flex items-center">
                        <img src="/LOGO1.png" alt="JR Mundo Tech Logo" class="h-10 mr-3"> 
                        <span class="text-3xl font-bold text-gray-800 hidden sm:inline">
                            <span class="text-blue-600">Mundo Tech</span>
                        </span>
                    </div>

                    <!-- Centro: Menu -->
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

                    <!-- Direita: Ícones -->
                    <div class="flex items-center space-x-4">
                        
                        <!-- Ícone de Usuário (NOVO) -->
                        <div class="relative">
                             <button @click="isUserDropdownVisible = !isUserDropdownVisible" class="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                             </button>

                             <!-- Dropdown de Login/Menu -->
                             <div v-if="isUserDropdownVisible" class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 p-4 rounded-lg shadow-xl z-50" tabindex="-1">
                                
                                <!-- Se NÃO logado: Form de Login -->
                                <div v-if="!user">
                                    <h3 class="text-lg font-semibold text-gray-700 mb-3">Acesso Admin</h3>
                                    <form @submit.prevent="handleLogin">
                                        <div class="mb-3">
                                            <label class="block text-sm text-gray-600 mb-1">Email</label>
                                            <input type="email" v-model="loginForm.email" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2" required>
                                            <div v-if="loginForm.errors.email" class="text-red-500 text-xs mt-1">{{ loginForm.errors.email }}</div>
                                        </div>
                                        <div class="mb-4">
                                            <label class="block text-sm text-gray-600 mb-1">Senha</label>
                                            <input type="password" v-model="loginForm.password" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2" required>
                                        </div>
                                        <button type="submit" :disabled="loginForm.processing" class="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors">
                                            {{ loginForm.processing ? 'Entrando...' : 'Entrar' }}
                                        </button>
                                    </form>
                                </div>

                                <!-- Se logado: Menu Admin -->
                                                                <div v-else>
                                                                        <p class="text-sm text-gray-500 mb-2" v-if="user">Olá, <span class="font-bold text-gray-800">{{ user.name }}</span></p>
                                                                        <hr class="my-2" v-if="user">
                                                                        <Link
                                                                            v-if="user && user.is_admin"
                                                                            :href="route('admin.products.create')"
                                                                            class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded font-semibold"
                                                                        >
                                                                            + Adicionar Produto
                                                                        </Link>
                                                                        <Link v-if="user" :href="route('logout')" method="post" as="button" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded mt-1">
                                                                                Sair
                                                                        </Link>
                                                                </div>
                             </div>
                        </div>

                        <!-- Botão Carrinho -->
                        <div class="relative">
                            <button @click="isCartVisible = !isCartVisible" class="relative flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                    {{ cartItemCount }}
                                </span>
                            </button>
                            <!-- Dropdown Carrinho (Sem alterações funcionais) -->
                            <div v-if="isCartVisible" @click.outside="isCartVisible = false" @click.stop @mousedown.stop class="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 p-4 rounded-lg shadow-xl z-40">
                                <h2 class="text-xl font-semibold mb-3 flex items-center text-gray-700">Meu Carrinho</h2>
                                <div v-if="cart.length === 0" class="text-gray-500 italic py-8 text-center">Seu carrinho está vazio.</div>
                                <ul v-else class="divide-y divide-gray-200 max-h-64 overflow-y-auto pr-2 mb-4">
                                    <li v-for="item in cart" :key="item.id" class="flex items-center py-3">
                                        <img :src="item.image_url" :alt="item.name" class="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200">
                                        <div class="flex-1">
                                            <p class="font-bold text-gray-800 text-sm">{{ item.name }}</p>
                                            <p class="text-sm text-blue-600 font-semibold">{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</p>
                                        </div>
                                        <button @click="removeFromCart(item.id)" class="ml-4 text-gray-400 hover:text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </li>
                                </ul>
                                <div v-if="cart.length > 0">
                                    <div class="mb-4">
                                        <div class="mb-3">
                                            <label class="block text-sm font-semibold text-gray-700 mb-1">Retirada</label>
                                            <div class="flex items-center space-x-3">
                                                <label class="inline-flex items-center text-sm">
                                                    <input type="radio" v-model="pickupMethod" value="retirar" class="form-radio h-4 w-4 text-blue-600" />
                                                    <span class="ms-2">Retirar em loja</span>
                                                </label>
                                                <label class="inline-flex items-center text-sm">
                                                    <input type="radio" v-model="pickupMethod" value="entrega" class="form-radio h-4 w-4 text-blue-600" />
                                                    <span class="ms-2">Entrega</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label class="block text-sm font-semibold text-gray-700 mb-1">Forma de pagamento</label>
                                            <div class="flex items-center space-x-3">
                                                <label class="inline-flex items-center text-sm">
                                                    <input type="radio" v-model="paymentMethod" value="especie_pix" class="form-radio h-4 w-4 text-blue-600" />
                                                    <span class="ms-2">Espécie/PIX</span>
                                                </label>
                                                <label class="inline-flex items-center text-sm">
                                                    <input type="radio" v-model="paymentMethod" value="cartao" class="form-radio h-4 w-4 text-blue-600" />
                                                    <span class="ms-2">Cartão</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center mb-4"><span class="font-bold">Total:</span><span class="text-blue-600 font-bold">{{ formatCurrency(totalCost) }}</span></div>
                                        <button @click="sendToWhatsApp" class="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">Finalizar Pedido</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Grid de Produtos (Sem alterações) -->
                <main>
                    <h2 class="text-3xl font-bold text-gray-800 mb-8">
                        <span v-if="props.currentCategory">{{ props.currentCategory }}</span>
                        <span v-else>Nossos Produtos</span>
                    </h2>

                    <div v-if="props.products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div v-for="product in props.products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200 flex flex-col h-full">
                            <div class="relative group w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/300x200/e2e8f0/64748b?text=Produto'">
                            </div>
                            <div class="p-5 flex flex-col flex-grow">
                                <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate">{{ product.name }}</h3>
                                <p class="text-2xl font-bold text-blue-600 mb-4">{{ formatCurrency(product.price) }}</p>
                                <button @click="addToCart(product)" class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 mt-auto">Adicionar</button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-500 py-16"><p class="text-xl font-semibold">Nenhum produto encontrado.</p></div>
                </main>
            </div>
        </div>
    </GuestLayout>
</template>