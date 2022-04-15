import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', props: true, redirect: () => ({ name: 'home' }) },
    {
        path: '/channels',
        meta: { requiresAuth: true },
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: ':channel',
                props: true,
                component: () => import('pages/Index.vue'),
            },
            {
                path: '',
                name: 'home',
                component: () => import('pages/Index.vue'),
            },
        ],
    },
    {
        path: '/auth',
        component: () => import('layouts/AuthLayout.vue'),
        children: [
            {
                path: 'login',
                name: 'login',
                meta: { guestOnly: true },
                component: () => import('pages/Login.vue'),
            },
            {
                path: 'register',
                name: 'register',
                meta: { guestOnly: true },
                component: () => import('pages/Register.vue'),
            },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
