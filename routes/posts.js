const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

//  GET ALL — trazer todos os posts
router.get("/getAll", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar todos os posts" });
  }
});

//  GET by ID — trazer um post específico
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post não encontrado" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: "Erro ao buscar o post" });
  }
});

//  Criar post
router.post("/", async (req, res) => {
  try {
    const { author, authorImageBytes, content, likes, isLiked } = req.body;

    const newPost = await Post.create({
      author,
      authorImageBytes,
      content,
      likes: likes || 0,
      isLiked: isLiked || false,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Atualizar post
router.put("/:id", async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Post não encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Deletar post
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post não encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//  Atualizar apenas curtidas
router.patch("/:id/like", async (req, res) => {
  try {
    const { isLiked } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post não encontrado" });

    // Atualiza contagem de likes de acordo com o estado atual
    if (isLiked && !post.isLiked) {
      post.likes += 1;
    } else if (!isLiked && post.isLiked) {
      post.likes -= 1;
    }

    post.isLiked = isLiked;
    await post.save();

    res.json({ likes: post.likes, isLiked: post.isLiked });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Verificar se há posts novos ou atualizados
router.get("/shouldUpdate/:lastSync", async (req, res) => {
  try {
    const lastSync = new Date(req.params.lastSync);

    // Busca posts criados ou atualizados após a data informada
    const hasNew = await Post.exists({
      updatedAt: { $gt: lastSync }
    });

    res.json({ shouldUpdate: !!hasNew });
  } catch (err) {
    res.status(400).json({ error: "Data inválida ou erro na verificação" });
  }
});



module.exports = router;
