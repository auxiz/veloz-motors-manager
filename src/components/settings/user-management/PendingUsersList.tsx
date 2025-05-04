
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AuthUser } from '@/types/auth';

interface PendingUsersListProps {
  pendingUsers: AuthUser[];
  onApprove: (user: AuthUser) => void;
  onReject: (user: AuthUser) => void;
  onSetRole: (user: AuthUser) => void;
}

export function PendingUsersList({ pendingUsers, onApprove, onReject, onSetRole }: PendingUsersListProps) {
  if (pendingUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <p>Não há usuários pendentes de aprovação.</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[200px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.profile?.first_name} {user.profile?.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Pendente
              </Badge>
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1" 
                onClick={() => onSetRole(user)}
              >
                <UserCog className="h-4 w-4" />
                Definir Função
              </Button>
              <Button 
                size="icon" 
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(user)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="destructive"
                onClick={() => onReject(user)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
