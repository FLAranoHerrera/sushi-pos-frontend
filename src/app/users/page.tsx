'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRole } from '@/hooks/useRole'
import { authService, CreateUserDto } from '@/services/auth.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Utensils, ArrowLeft, UserPlus, Users, Shield, User } from 'lucide-react'
import { User as UserType } from '@/types'

export default function UsersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isAdmin } = useRole()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'MESERO'
  })
  const router = useRouter()

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!isAdmin) {
      router.push('/dashboard')
      return
    }

    // Cargar usuarios
    loadUsers()
  }, [isAuthenticated, authLoading, router, isAdmin])

  const loadUsers = async () => {
    try {
      const response = await authService.getUsers()
      console.log('Users response:', response)
      
      // Verificar si la respuesta es un array o tiene una propiedad data
      const usersData = Array.isArray(response) ? response : ((response as { data?: unknown; users?: unknown }).data || (response as { users?: unknown }).users || [])
      
      // Asegurar que sea un array
      if (Array.isArray(usersData)) {
        setUsers(usersData)
      } else {
        console.warn('Users data is not an array:', usersData)
        setUsers([])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userData: CreateUserDto = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone || undefined,
        role: newUser.role
      }
      
      await authService.createUser(userData)
      
      // Recargar la lista de usuarios
      await loadUsers()
      
      // Limpiar el formulario y cerrar
      setShowCreateForm(false)
      setNewUser({ name: '', email: '', password: '', phone: '', role: 'MESERO' })
      
      console.log('Usuario creado exitosamente')
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear el usuario. Verifica los datos e intenta nuevamente.')
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const userData: {
        name: string;
        email: string;
        phone?: string;
        role: string;
        password?: string;
      } = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || undefined,
        role: newUser.role
      }

      // Solo incluir password si se proporciona
      if (newUser.password.trim()) {
        userData.password = newUser.password
      }

      await authService.updateUser(editingUser.id, userData)
      await loadUsers()
      setShowEditForm(false)
      setEditingUser(null)
      setNewUser({ name: '', email: '', password: '', phone: '', role: 'MESERO' })
      
      alert('Usuario actualizado exitosamente')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar el usuario')
    }
  }

  const openEditForm = (user: UserType) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      password: '', // No pre-llenar password por seguridad
      phone: user.phone || '',
      role: user.role as string
    })
    setShowEditForm(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return
    
    try {
      await authService.deleteUser(userId)
      await loadUsers()
      alert('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar el usuario')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} (👑 Administrador)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h2>
          <p className="text-gray-600">Gestiona los usuarios y sus permisos</p>
        </div>

        {/* Create User Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Crear Nuevo Usuario
          </Button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nuevo Usuario</CardTitle>
              <CardDescription>
                Registra un nuevo usuario en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MESERO">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Mesero
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Administrador
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    Crear Usuario
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Edit User Form */}
        {showEditForm && editingUser && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-orange-600" />
                Editar Usuario
              </CardTitle>
              <CardDescription>
                Actualiza la información del usuario: {editingUser.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Nombre</Label>
                    <Input
                      id="edit-name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-password">Nueva Contraseña (Opcional)</Label>
                    <Input
                      id="edit-password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Dejar vacío para mantener la actual"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Teléfono</Label>
                    <Input
                      id="edit-phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-role">Rol</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MESERO">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Mesero
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Administrador
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    Actualizar Usuario
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditForm(false)
                      setEditingUser(null)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
              <p className="text-gray-600">Crea el primer usuario para comenzar</p>
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {user.role?.name === 'ADMIN' ? (
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                    ) : (
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                    )}
                    {user.name}
                  </CardTitle>
                  <CardDescription>
                    {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rol:</span>
                      <span className={`text-sm font-medium ${
                        user.role?.name === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'
                      }`}>
                        {user.role?.name === 'ADMIN' ? '👑 Administrador' : '🍽️ Mesero'}
                      </span>
                    </div>
                    {user.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Teléfono:</span>
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Creado:</span>
                      <span className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditForm(user)}
                      className="flex-1"
                    >
                      ✏️ Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1"
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
