# Promptplace
Promptplace is a self-hosted tool to keep track of prompts for AI models. It features tools to store prompts and a simple templating language to add "fragments" or variables to your prompts that can be changed in an intuitive UI.
## Installation
Promptplace requires a MongoDB server. If you do not have one already, please create or rent one.
### Install Dependencies
Before you can use Promptplace, you'll need to install the dependencies using NPM.
```
npm install
```
### Setting up environment variables
Create a `.env.local` file in your copy of this repository and set the `MONGODB_URL` environment variable to point to your MongoDB server and database.
```
MONGODB_URL=mongodb://127.0.0.1:27017/promptplace
```
### Building and running the server
After your environment variables are configured, build the server using NPM.
```
npm run build
```
After the build is finished, start the server.
```
npm run start
```
Finally, connect to your Promptplace instance on port `3000`.
## How to use
The Promptplace interface is split into three panels: the sidebar (left), the template editor (bottom right), and the fragment editor (top right). The sidebar contains a list of all of your prompts. Click on a prompt to start editing or viewing it. The template editor allows you to edit the name of your prompt, the prompt itself, save it, and delete the prompt.
### Fragments
Fragments are like variables, but for prompts. They are parts of a prompt that can be edited independantly of the rest of the prompt for things that change every execution. In Promptplace, fragments can be edited in the fragment editor. Each fragment has a name and a text input. Once you are done editing fragments, press "Compile Prompt" to substitute them into the template. To define fragments in your template, write them with two sets of curly brackets like this: `{{Fragment Name}}`. Save your prompt, and the fragment editor will update to show your new fragments.