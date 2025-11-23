import React from 'react';
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const EditProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [avatarUrl, setAvatarUrl] = useState('https://github.com/shadcn.png'); // Default avatar

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data (name, email, avatarUrl) to your backend API
    console.log('Profile updated:', { name, email, avatarUrl });
    toast.success('Profile updated successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar-upload" className="cursor-pointer text-primary hover:underline">
                Change Avatar
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;