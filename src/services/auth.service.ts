import { createUser, findUserByEmail } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { generateToken } from '../utils/jwt.util';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export const registerService = async (data: RegisterInput) => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new AuthError('Email already in use', 400);
  }

  const hashedPassword = await hashPassword(data.password);
  
  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginService = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new AuthError('Invalid credentials', 401);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new AuthError('Invalid credentials', 401);
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
