import React from 'react'
import { Metadata } from 'next';
import SignUp from './sign-up';

export const metadata: Metadata = {
  title: 'Sign up - Dinoverse',
  description: 'Create an account and join the Dinoverse!',
};

const Page = () => {
  return <SignUp/>
};

export default Page;