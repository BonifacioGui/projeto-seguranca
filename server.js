// 1. Importar as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));



const connectionString = "mongodb+srv://gbf1:TYBbtRiW98D9qntm@projeto-seguranca.tsk4xsx.mongodb.net/?retryWrites=true&w=majority&appName=projeto-seguranca"; // Lembre-se de colar sua string aqui

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conexão com o MongoDB Atlas estabelecida com sucesso!");
}).catch(err => {
  console.error("Erro ao conectar com o MongoDB Atlas:", err);
});

const UsuarioSchema = new mongoose.Schema({
  nome_usuario: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);



app.post('/registrar', async (req, res) => {
  try {
    const { nome_usuario, senha } = req.body;
    const sal = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, sal);
    const novoUsuario = new Usuario({ nome_usuario, senha_hash });
    await novoUsuario.save();
    res.status(201).send({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ erro: 'Este nome de usuário já está em uso.' });
    }
    res.status(500).send({ erro: 'Erro ao registrar usuário: ' + error.message });
  }
});

app.post('/login', async (req, res) => {
  const { nome_usuario, senha } = req.body;
  const usuario = await Usuario.findOne({ nome_usuario });
  if (!usuario) {
    return res.status(404).send({ erro: 'Usuário não encontrado.' });
  }
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    return res.status(400).send({ erro: 'Senha inválida.' });
  }
  res.status(200).send({ mensagem: 'Login bem-sucedido!' });
});

app.post('/alterar-senha', async (req, res) => {
  const { nome_usuario, senha_atual, nova_senha } = req.body;

  const usuario = await Usuario.findOne({ nome_usuario });
  if (!usuario) {
    return res.status(404).send({ erro: 'Usuário não encontrado.' });
  }

  const senhaValida = await bcrypt.compare(senha_atual, usuario.senha_hash);
  if (!senhaValida) {
    return res.status(400).send({ erro: 'A senha atual está incorreta.' });
  }

  const novo_sal = await bcrypt.genSalt(10);
  const nova_senha_hash = await bcrypt.hash(nova_senha, novo_sal);

  await Usuario.updateOne(
    { nome_usuario: nome_usuario },
    { $set: { senha_hash: nova_senha_hash } }
  );

  res.status(200).send({ mensagem: 'Senha alterada com sucesso!' });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
