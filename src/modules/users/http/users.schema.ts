import { z } from "zod";

export const listUsersResponseSuccessSchema = z
	.object({
		users: z.array(z.any()),
	})
	.describe("Lista de usuários cadastrados");

export const createUserBodySchema = z.object({
	name: z.string().min(3).describe("Nome do usuário"),
	email: z.string().email().describe("E-mail único"),
	password: z.string().min(6).describe("Senha de acesso"),
});

export const createUserResponseSuccessSchema = z
	.object({ user: z.any() })
	.describe("Usuário criado com sucesso");
export const createUserResponseErrorSchema = z
	.object({ message: z.string() })
	.describe("Não foi possível criar o usuário");
export const updateUserParamsSchema = z.object({
	id: z.string().uuid().describe("ID do usuário"),
});

export const updateUserBodySchema = z.object({
	name: z.string().min(3).describe("Nome do usuário"),
	email: z.string().email().describe("E-mail único"),
	password: z.string().min(6).describe("Senha de acesso"),
});

export const updateUserResponseSuccessSchema = z
	.object({ user: z.any() })
	.describe("Usuário criado com sucesso");
export const updateUserResponseErrorSchema = z
	.object({ message: z.string() })
	.describe("Não foi possível criar o usuário");

export const partialUpdateUserParamsSchema = z.object({
	id: z.string().uuid().describe("ID do usuário"),
});

export const partialUpdateUserBodySchema = z.object({
	name: z.string().min(3).optional().describe("Novo nome (opcional)"),
	email: z.string().email().optional().describe("Novo e-mail (opcional)"),
	password: z.string().min(6).optional().describe("Nova senha (opcional)"),
});

export const partialUpdateUserResponseSuccessSchema = z
	.object({ user: z.any() })
	.describe("Usuário criado com sucesso");

export const partialUpdateUserResponseErrorSchema = z
	.object({ message: z.string() })
	.describe("Não foi possível criar o usuário");

export const deleteUserParamsSchema = z.object({
	id: z.string().uuid().describe("ID do usuário a ser removido"),
});

export const deleteUserSuccessResponseSchema = z
	.null()
	.describe("Usuário removido com sucesso");

export const deleteUserErrorResponseSchema = z
	.object({ message: z.string() })
	.describe("Usuário não encontrado");

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type PartialUpdateUserParams = z.infer<
	typeof partialUpdateUserParamsSchema
>;
export type PartialUpdateUserBody = z.infer<typeof partialUpdateUserBodySchema>;
export type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;
