import { Request, Response } from 'express'
import * as userService from '../services/userService'
import * as userValidation from '../validations/userValidation'
import multer from 'multer'
import { use } from 'passport'

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage })
export const uploadMiddleware = upload.single('image')


export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await userService.findUserLogged(req.UserEmail as string)

        res.status(200).json({
            user: {
                name: user.name,
                cpf: user.cpf,
                email: user.email,
                enrollment: user.Enrollment,
                rating: user.Rating,
                type: user.type,
                profileImage: user.profileImage || null,
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel acessar o perfil' })
    }
}

export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
        const email = req.UserEmail as string
        const filePath = req.file?.path.replace(/\\/g, '/')
        console.log('Caminho da imagem:', filePath)

        if (!filePath) {
            res.status(400).json({ error: 'Nenhuma imagem enviada' })
            return
        }

        const user = await userService.updateProfileImage(email, filePath)

        res.status(200).json({ message: 'Imagem atualizada com sucesso', imagePath: filePath })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar imagem' })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const safeData = userValidation.userIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const user = await userService.findUserById(parseInt(safeData.data.id))

        res.status(200).json({
            user: {
                name: user.name,
                type: user.type,
                enrollment: user.Enrollment,
                ratings: user.Rating
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel acessar o usuario' })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const safeData = userValidation.updateUserSchema.safeParse(req.body)

    if (!req.body) {
        res.status(400).json({ error: "Mande alguma informação" })
        return
    }

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const updatedUser = await userService.updateUser(req.UserEmail as string, {
            email: safeData.data.email,
            name: safeData.data.name,
            password: safeData.data.password,
            type: safeData.data.type
        })

        res.status(200).json({ user: updatedUser })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel atualizar o usuario' })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await userService.deleteUser(req.UserEmail as string)

        res.status(200).json({ deleted: true })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel deletar o usuario' })
    }
}