import type { User } from "@prisma/client";
import { prisma } from "@/config/prisma.js";

export class UsersRepository {
	async findAll(): Promise<User[]> {
		return prisma.user.findMany();
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return prisma.user.findUnique({
			where: { email },
		});
	}

	async findById(id: string): Promise<User | undefined> {
		return prisma.user.findUnique({
			where: { id },
		});
	}

	async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
		const { name, email, password } = data;
		return prisma.user.create({
			data: {
				name,
				email,
				password,
			},
		});
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		return prisma.user.update({
			where: { id },
			data,
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.user.delete({
			where: { id },
		});
	}
}
