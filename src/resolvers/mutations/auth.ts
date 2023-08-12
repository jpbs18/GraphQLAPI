import { Context } from "../.."
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "./keys";

interface SignupArgs{
    name: string;
    credentials:{
      email: string
      password: string
    }
    bio: string;
}

interface SigninArgs{
  credentials:{
    email: string
    password: string
  } 
}

interface UserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async( _: any, { name, credentials, bio }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
    const { email, password } = credentials;
    const isValidEmail = validator.isEmail(email);

    if(!isValidEmail){
        return {
            userErrors: [{ message: "Please provide a valid email" }],
            token: null
        }
    }

    const isValidPassword = validator.isLength(password, { min: 5 });

    if(!isValidPassword){
        return {
          userErrors: [{ message: "Please provide a password with more than 5 characters" }],
          token: null,
        };
    }

    if(!name || !bio){
        return {
          userErrors: [{ message: "Please provide a valid name and bio" }],
          token: null,
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPassword
        }
    });

    console.log(user);

    await prisma.profile.create({
        data:{
            bio,
            userId: user.id
        }
    })

    return {
      userErrors: [],
      token: JWT.sign({ userId: user.id }, JSON_SIGNATURE, { expiresIn: 360000 })
    };
  },
  signin: async(_: any, { credentials }: SigninArgs, { prisma }: Context): Promise<UserPayload> => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where:{
        email
      }
    })

    console.log(user)

    if(!user){
       return {
         userErrors: [{ message: "Invalid credentials" }],
         token: null,
       };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch){
      return {
        userErrors: [{ message: "Invalid credentials" }],
        token: null,
      };
    }

    return {
      userErrors: [],
      token: JWT.sign({ userId: user.id }, JSON_SIGNATURE, { expiresIn: 360000 })
    };
 }
};
