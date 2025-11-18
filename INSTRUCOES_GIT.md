# Como Adicionar Suas Informações do Git e Enviar um Projeto

Este guia descreve os passos para configurar o Git em seu projeto e enviá-lo para um repositório remoto como o GitHub.

## 1. Configurar seu nome de usuário e e-mail no Git

Se esta é a primeira vez que você usa o Git nesta máquina, você precisa configurar seu nome e e-mail. O Git associará essa informação aos seus commits.

Abra seu terminal ou prompt de comando na pasta do projeto e execute os seguintes comandos, substituindo as informações de exemplo pelas suas:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

## 2. Iniciar um repositório Git

Se o seu projeto ainda não é um repositório Git, você precisa iniciá-lo. Navegue até a raiz do seu projeto (`c:\jrmundotech`) no terminal e execute:

```bash
git init
```

Isso criará uma pasta oculta `.git` que contém todas as informações do seu repositório.

## 3. Adicionar arquivos ao "Stage"

Em seguida, você precisa dizer ao Git quais arquivos você quer incluir no seu primeiro commit. Para adicionar todos os arquivos do projeto, use o comando:

```bash
git add .
```

## 4. Fazer o primeiro commit

Um commit é como um "snapshot" do seu projeto em um determinado momento. Para fazer seu primeiro commit, use:

```bash
git commit -m "Commit inicial do projeto"
```

## 5. Criar um repositório remoto

Vá para uma plataforma de hospedagem Git como [GitHub](https://github.com), [GitLab](https://gitlab.com) ou [Bitbucket](https://bitbucket.org) e crie um novo repositório. A plataforma fornecerá uma URL para o seu repositório remoto. Geralmente é algo como `https://github.com/seu-usuario/nome-do-projeto.git`.

## 6. Conectar seu repositório local ao remoto

Use o seguinte comando para vincular seu repositório local ao repositório remoto que você acabou de criar. Substitua a URL pela URL do seu repositório.

```bash
git remote add origin https://github.com/seu-usuario/nome-do-projeto.git
```

## 7. Enviar (push) seu código

Finalmente, envie seu commit para o repositório remoto. O comando `-u` define o branch remoto como o destino padrão para futuros pushes do seu branch atual.

```bash
git push -u origin main
```
*Observação: O nome do seu branch principal pode ser `master` em vez de `main`, dependendo da sua configuração do Git.*

Pronto! Seu projeto agora está no repositório remoto.
