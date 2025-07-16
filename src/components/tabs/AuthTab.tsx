'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/forms/LoginForm';
import { RegisterForm } from '@/components/forms/RegisterForm';

export function AuthTab() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-sm mx-auto px-7">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="login"
          className="data-[state=active]:text-blue-400 text-gray-400"
        >
          Masuk
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="data-[state=active]:text-blue-400 text-gray-400"
        >
          Daftar
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}
