import { useState } from 'react'

import { useGetAllUsers, useDeleteStudent } from '@/features/users'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Input,
} from '@/shared/ui'
import {
    Users as UsersIcon,
    Loader,
    AlertCircle,
    Trash2,
    Shield,
} from 'lucide-react'

export const AdminPanelPage = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const pageSize = 20

    const { data, isLoading, error } = useGetAllUsers({ page, pageSize })
    const deleteStudentMutation = useDeleteStudent()

    const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0

    const filteredUsers = data?.items.filter((user) => {
        const matchesSearch =
            !search ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase())
        const matchesRole = !roleFilter || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleDeleteStudent = (studentId: number, name: string) => {
        if (confirm(`Вы уверены, что хотите удалить студента ${name}?`)) {
            deleteStudentMutation.mutate(studentId)
        }
    }

    return (
        <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3 mb-2">
                        <Shield className="w-10 h-10 text-primary-600" />
                        Панель администратора
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Управляйте пользователями и отслеживайте статистику системы
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            label: 'Пользователей',
                            value: data?.totalCount || 0,
                            icon: <UsersIcon className="w-10 h-10 text-primary-600" />,
                            bg: 'bg-blue-50',
                            text: 'text-blue-700',
                        },
                        {
                            label: 'Студентов',
                            value: data?.items.filter((u) => u.role === 'Student').length || 0,
                            icon: <UsersIcon className="w-10 h-10 text-green-600" />,
                            bg: 'bg-green-50',
                            text: 'text-green-700',
                        },
                        {
                            label: 'Преподавателей',
                            value: data?.items.filter((u) => u.role === 'Teacher').length || 0,
                            icon: <UsersIcon className="w-10 h-10 text-purple-600" />,
                            bg: 'bg-purple-50',
                            text: 'text-purple-700',
                        },
                    ].map((stat, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className={`p-3 rounded-full ${stat.bg} flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm text-gray-500">{stat.label}</span>
                                    <span className={`text-3xl font-bold ${stat.text}`}>{stat.value}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Фильтры и поиск</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Поиск без иконки */}
                            <div>
                                <Input
                                    placeholder="Поиск по email или имени"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                    className="w-full"
                                />
                            </div>

                            {/* Селект ролей */}
                            <div>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Все роли</option>
                                    <option value="Student">Студент</option>
                                    <option value="Teacher">Преподаватель</option>
                                    <option value="Admin">Администратор</option>
                                </select>
                            </div>

                            {/* Кнопка очистки */}
                            <div className="flex items-center">
                                <Button
                                    onClick={() => { setSearch(''); setRoleFilter(''); setPage(1) }}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Очистить фильтры
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading & Error */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader className="w-10 h-10 animate-spin text-primary-600" />
                    </div>
                )}

                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-red-900">Ошибка загрузки</h3>
                                <p className="text-red-800 text-sm">
                                    Не удалось загрузить пользователей. Попробуйте позже.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Users Table */}
                {!isLoading && filteredUsers && filteredUsers.length > 0 && (
                    <Card className="overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Имя</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Роль</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Дата регистрации</th>
                                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold">{user.firstName} {user.lastName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.role === 'Student' ? 'bg-blue-100 text-blue-700' :
                                                    user.role === 'Teacher' ? 'bg-green-100 text-green-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {user.role === 'Student' ? 'Студент' :
                                                     user.role === 'Teacher' ? 'Преподаватель' :
                                                     'Администратор'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {user.role === 'Student' && (
                                                    <Button
                                                        onClick={() => handleDeleteStudent(user.id, `${user.firstName} ${user.lastName}`)}
                                                        disabled={deleteStudentMutation.isPending}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-4 py-2 flex-wrap">
                                <Button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    variant="outline"
                                >
                                    Предыдущая
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        variant={p === page ? 'default' : 'outline'}
                                        className="w-10 h-10 p-0 rounded-full"
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    variant="outline"
                                >
                                    Следующая
                                </Button>
                            </div>
                        )}
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && filteredUsers && filteredUsers.length === 0 && (
                    <Card className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">Пользователи не найдены</h3>
                        <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
                    </Card>
                )}
            </div>
        </div>
    )
}
