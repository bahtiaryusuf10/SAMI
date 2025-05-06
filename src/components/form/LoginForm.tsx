'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalid' }),
  password: z.string().min(6, { message: 'Minimal 8 character' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginSchema) => {
    console.log('Login Data:', data);
    // TODO: Kirim ke API atau otentikasi
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow w-75 lg:w-82 mx-auto"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="maikel@gmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use your listed email in the system.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormDescription>Minimal 8 character.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right -mt-4">
            <Link href={'/'}>
              <p className="text-red-600 text-xs font-medium hover:underline">
                Forgot Password?
              </p>
            </Link>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="submit"
                className="w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
              >
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Login Success</DialogTitle>
                <DialogDescription>
                  Login successfully, you&apos;re on the system now.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className="bg-blue-400 hover:opacity-80 hover:bg-blue-400"
                  onClick={() => (window.location.href = '/')}
                >
                  Go To dashboard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  );
}
