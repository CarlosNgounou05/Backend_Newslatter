import { Router } from 'express'
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js'
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/create', authMiddleware, createPost)

router.post('/createPost', authMiddleware, createPost)

router.get('/getAllPosts', optionalAuthMiddleware, getAllPosts)
router.get('/', optionalAuthMiddleware, getAllPosts)
router.get('/:id', optionalAuthMiddleware, getPostById)
router.put('/updatepost/:id', authMiddleware, updatePost)
router.delete('/deletepost/:id', authMiddleware, deletePost)

router.put('/:id', authMiddleware, updatePost)
router.delete('/:id', authMiddleware, deletePost)

export default router
