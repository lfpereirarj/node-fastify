import type { User } from "@prisma/client";

export class InMemoryUsersRepository {
	public items: User[] = [];

	async findAll(): Promise<User[]> {
		return this.items;
	}

	async findById(id: string): Promise<User | null> {
		const user = this.items.find((item) => item.id === id);
		return user || null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.items.find((item) => item.email === email);
		return user || null;
	}

	async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
		const user: User = {
			id: crypto.randomUUID(),
			name: data.name,
			email: data.email,
			password: data.password,
			createdAt: new Date(),
		};
		this.items.push(user);
		return user;
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		const userIndex = this.items.findIndex((item) => item.id === id);
		this.items[userIndex] = { ...this.items[userIndex], ...data };
		return this.items[userIndex];
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((item) => item.id !== id);
	}
}
