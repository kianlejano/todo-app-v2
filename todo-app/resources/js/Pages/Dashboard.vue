<template>
    <Head title="Home" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Home
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <div class="mb-4 flex justify-end">
                            <button
                                @click="openCreateModal"
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>

                        <!-- Todo Table -->
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(todo, index) in todos.rows" :key="todo.id">
                                    <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
                                    <td class="px-6 py-4 text-sm">{{ todo.title }}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <span :class="todo.completed ? 'text-green-600' : 'text-red-600'">
                                            {{ todo.completed ? 'Yes' : 'No' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm font-medium">
                                        <button @click="openEditModal(todo)" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                                        <button @click="openDeleteModal(todo)" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-2">
                                <label for="limit" class="text-sm text-gray-700">Items per page:</label>
                                <input
                                    id="limit"
                                    type="number"
                                    min="1"
                                    max="50"
                                    v-model.number="limit"
                                    @change="fetchTodos(1)"
                                    class="border border-gray-300 rounded px-2 py-1 w-20"
                                />
                            </div>
                            <div class="flex justify-end space-x-2">
                                <button
                                    @click="changePage(currentPage - 1)"
                                    :disabled="currentPage === 1"
                                    class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <button
                                    v-for="page in totalPages"
                                    :key="page"
                                    @click="changePage(page)"
                                    :class="['px-3 py-1 rounded',
                                        page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                    ]"
                                >
                                    {{ page }}
                                </button>
                                <button
                                    @click="changePage(currentPage + 1)"
                                    :disabled="currentPage === totalPages"
                                    class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showFormModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit' : 'Create' }}</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input v-model="form.title" type="text" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Completed</label>
                        <select v-model="form.completed" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" @click="closeModals" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {{ isEditing ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 class="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p class="mb-4">Are you sure you want to delete this todo?</p>
                <div class="flex justify-end space-x-2">
                    <button @click="closeModals" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import { Head, usePage } from '@inertiajs/vue3'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const page = usePage()

const todos = ref([])
const userId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(10)

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)

const form = ref({ title: '', completed: false })
const editingId = ref(null)
const deleteId = ref(null)

onMounted(async () => {
    await fetchTodos()
})

async function fetchTodos(pageNumber = 1) {
    userId.value = page.props.auth.user.id
    const res = await fetch(`${API_BASE_URL}/todos/user/${userId.value}?page=${pageNumber}&limit=${limit.value}`)
    const data = await res.json()
    todos.value = data
    totalPages.value = data.totalPages
    currentPage.value = data.currentPage
}

function changePage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages.value) return
    currentPage.value = pageNum
    fetchTodos(pageNum)
}

function openCreateModal() {
    form.value = { title: '', completed: false }
    isEditing.value = false
    showFormModal.value = true
}

function openEditModal(todo) {
    form.value = { title: todo.title, completed: todo.completed }
    editingId.value = todo.id
    isEditing.value = true
    showFormModal.value = true
}

function openDeleteModal(todo) {
    deleteId.value = todo.id
    showDeleteModal.value = true
}

function closeModals() {
    showFormModal.value = false
    showDeleteModal.value = false
    editingId.value = null
    deleteId.value = null
}

async function handleSubmit() {
    const url = isEditing.value
        ? `${API_BASE_URL}/todos/${editingId.value}`
        : `${API_BASE_URL}/todos`

    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form.value, userId: userId.value }),
    })

    if (res.ok) {
        await fetchTodos()
        closeModals()
    }
}

async function confirmDelete() {
    const res = await fetch(`${API_BASE_URL}/todos/${deleteId.value}`, {
        method: 'DELETE',
    })

    if (res.ok) {
        await fetchTodos()
        closeModals()
    }
}
</script>
