<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- O Inertia irá injetar o título aqui (da sua tag <Head> no Vue) -->
        <title inertia>{{ config('app.name', 'JR Mundo Tech') }}</title>

        <!-- Fonts (O Breeze adiciona isso por padrão) -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- 
          O Vite irá injetar seus arquivos JS e CSS compilados aqui.
          Ele também sabe qual componente de página (ex: Loja.vue) carregar.
        -->
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        
        <!-- O Inertia usa isso para passar dados do Controller para o Vue -->
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- 
          É AQUI QUE O INERTIA VAI MONTAR SEU APP VUE!
          Isso basicamente se torna o <div id="app">
        -->
        @inertia
    </body>
</html>