export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
}

export class UsersRepository {
	private users: User[] = [];

	async findAll(): Promise<User[]> {
		return this.users;
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find((user) => user.email === email);
	}

	async findById(id: string): Promise<User | undefined> {
		return this.users.find((user) => user.id === id);
	}

	async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
		const newUser: User = {
			id: crypto.randomUUID(),
			name: data.name,
			email: data.email,
			password: data.password,
			createdAt: new Date(),
		};

		this.users.push(newUser);

		return newUser;
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		const userIndex = this.users.findIndex((user) => user.id === id);

		const updateUser = { ...this.users[userIndex], ...data };
		this.users[userIndex] = updateUser;

		return updateUser;
	}

	async delete(id: string): Promise<void> {
		this.users = this.users.filter((user) => user.id !== id);
	}
}
