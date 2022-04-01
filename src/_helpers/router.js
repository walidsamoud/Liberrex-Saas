import Vue from 'vue'
import Router from 'vue-router'
import {membershipService} from '../_services'

Vue.use(Router)

export const router = new Router({
    mode: 'history',
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },
    base: process.env.BASE_URL,
    routes: [
        // ======================
        // Blank Layout
        // ======================    
        {
            path: '',
            component: () => import('../layout/blank/Blank.vue'),
            // ======================
            // Theme routes / pages
            // ======================
            children: [{
                path: '/',
                redirect: '/login',
                meta:{
                    authRequired: false
                }
            }, {
                path: '/login',
                name: 'Login',
                index: 1,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/Login.vue')
            },{
                path: '/password/forgot',
                name: 'Forgot Password',
                index: 6,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/ForgotPassword.vue')
            },{
                path: '/password/reset',
                name: 'Reset Password',
                index: 7,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/ResetPassword.vue')
            }, {
                path: '/error404',
                name: 'Error 404',
                index: 2,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/Error404.vue')
            }, {
                path: '/register',
                name: 'Register',
                index: 3,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/Register.vue')
            }, {
                path: '/privacy',
                name: 'Privacy Policy',
                index: 4,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/Privacy.vue')
            }, {
                path: '/terms',
                name: 'Terms & Conditions',
                index: 5,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/authentication/Terms.vue')
            },
            {
                path: '/t/:uid',
                name: 'Track',
                index: 8,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/tracking/Ticket.vue')
            },
            {
                path: '/f/:uid',
                name: 'Feedback',
                index: 9,
                meta:{
                    authRequired: false,
                    authorize: ['*'],
                    membership: ['*']
                },
                component: () => import('../views/tracking/Feedback.vue')
            },
            {
                path: '/queues/:id/display',
                name: 'Queues',
                index: 10,
                meta:{
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*']
                },
                component: () => import('../views/queues/Display.vue')
            }]
        },
        {
            // ======================
            // Full Layout
            // ======================
            path: '',
            component: () => import('../layout/full/MainContainer.vue'),
            // ======================
            // Theme routes / pages
            // ======================
            children: [{
                path: '/bookings',
                name: 'Menu.Bookings.Bookings',
                index: 49,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                    {
                        title: 'Menu.Bookings.Bookings',
                        active: true
                    },
                    ],
                },
                component: () => import('../views/bookings/Index.vue')
            },{
                path: '/bookings/table',
                name: 'Menu.Bookings.Bookings',
                index: 491,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                    {
                        title: 'Menu.Bookings.Bookings',
                        active: true
                    },
                    ],
                },
                component: () => import('../views/bookings/table.vue')
            },{
                path: '/bookings/request',
                name: 'Menu.Bookings.Request',
                index: 492,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                    {
                        title: 'Menu.Bookings.Request',
                        active: true
                    },
                    ],
                },
                component: () => import('../views/bookings/request.vue')
            },{
                path: '/bookings/availability',
                name: 'Menu.Bookings.BookingDays',
                index: 493,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                    {
                        title: 'Menu.Bookings.BookingDays',
                        active: true
                    },
                    ],
                },
                component: () => import('../views/bookings/workingdays.vue')
            }, {
                path: '/dashboard',
                name: 'Menu.Dashboard',
                index: 50,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                    {
                        title: 'Menu.Dashboard',
                        active: true
                    },
                    ],
                },
                component: () => import('../views/dashboard/Index.vue')
            }, {
                path: '/customers',
                name: 'Menu.Customers',
                index: 56,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                    {
                        title: 'Menu.Customers',
                        active: true
                    },
                    ],
                },
                component: () => import('../views/customers/Index.vue')
            },
            {
                path: '/queues',
                name: 'Menu.Queues',
                index: 57,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Queues',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/queues/Index.vue')
            },

            {
                path: '/queues/create',
                name: 'Menu.NewQueue',
                index: 57.1,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Queues',
                            url: '/queues'
                        },
                        {
                            title: 'Menu.NewQueue',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/queues/Create.vue')
            },

            {
                path: '/queues/:id/edit',
                name: 'Menu.EditQueue',
                index: 57.2,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Queues',
                            url: '/queues'
                        },
                        {
                            title: 'Menu.EditQueue',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/queues/Edit.vue')
            },

            {
                path: '/queues/:id/archive',
                name: 'Menu.QueueArchive',
                index: 57.4,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Queues',
                            url: '/queues'
                        },
                        {
                            title: 'Menu.QueueArchive',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/queues/Archive.vue')
            },


            {
                path: '/queues/:id/waitinglist',
                name: 'Menu.WaitingList',
                index: 57.3,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Queues',
                            url: '/queues'
                        },
                        {
                            title: 'Menu.WaitingList',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/queues/WaitingList.vue')
            },

            {
                path: '/profile',
                name: 'Menu.Profile',
                index: 58,
                meta: {
                    authRequired: true,
                    authorize: ['*'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Profile',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/profile/Index.vue')
            },


            {
                path: '/feedback',
                name: 'Menu.Feedback',
                index: 99,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Feedback',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/feedback/Index.vue')
            },


            {
                path: '/coupons',
                name: 'Menu.Coupons',
                index: 99,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Coupons',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/coupons/Index.vue')
            },

            {
                path: '/displays',
                name: 'Menu.Displays',
                index: 399,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['LIBERUP','LIBERPRO'],
                    breadcrumb: [
                        {
                            title: 'Menu.Displays',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/displays/Index.vue')
            },


            {
                path: '/statistics',
                name: 'Menu.Statistics',
                index: 199,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Statistics',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/statistics/Index.vue')
            },


            {
                path: '/kiosks',
                name: 'Menu.Kiosks',
                index: 299,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['LIBERUP','LIBERPRO'],
                    breadcrumb: [
                        {
                            title: 'Menu.Kiosks',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/kiosks/Index.vue')
            },


            {
                path: '/settings/business',
                name: 'Menu.SettingsBusiness',
                index: 59,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsBusiness',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Business.vue')
            },

            {
                path: '/settings/holidays',
                name: 'Menu.Holidays',
                index: 59,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.Holidays',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Holidays.vue')
            },

            {
                path: '/settings/services',
                name: 'Menu.SettingsServices',
                index: 60,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsServices',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Services.vue')
            },

            {
                path: '/settings/rules',
                name: 'Menu.SettingsRules',
                index: 61,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsRules',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Rules/Index.vue')
            },


            {
                path: '/settings/rules/create',
                name: 'Menu.SettingsRuleCreate',
                index: 63,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsRules',
                            url: '/settings/rules'
                        },
                        {
                            title: 'Menu.SettingsRuleCreate',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Rules/Create.vue')
            },

            {
                path: '/settings/rules/:id',
                name: 'Menu.SettingsRuleEdit',
                index: 62,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Business Rules',
                            url: '/settings/rules'
                        },
                        {
                            title: 'Menu.SettingsRuleEdit',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Rules/Edit.vue')
            },

            {
                path: '/settings/team',
                name: 'Menu.SettingsTeam',
                index: 64,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsTeam',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Team.vue')
            },

            {
                path: '/settings/departments',
                name: 'Menu.SettingsDepartments',
                index: 69,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN', 'MANAGER'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsDepartments',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Department.vue')
            },


            {
                path: '/settings/membership',
                name: 'Menu.SettingsMembership',
                index: 65,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsMembership',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Membership.vue')
            },


            {
                path: '/settings/billing',
                name: 'Menu.SettingsBilling',
                index: 66,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsBilling',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Billing.vue')
            },


            {
                path: '/settings/sms',
                name: 'Menu.SettingsSms',
                index: 67,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsSms',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Sms.vue')
            },


            {
                path: '/settings/general',
                name: 'Menu.SettingsGeneral',
                index: 68,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings'
                        },
                        {
                            title: 'Menu.SettingsGeneral',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/General.vue')
            },
            {
                path: '/settings/payment',
                name: 'Menu.SettingsPayment',
                index: 69,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsPayment',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Payment.vue')
            },
            {
                path: '/settings/forms',
                name: 'Menu.SettingsForms',
                index: 70,
                meta: {
                    authRequired: true,
                    authorize: ['ADMIN'],
                    membership: ['*'],
                    breadcrumb: [
                        {
                            title: 'Menu.Settings',
                            url: '/settings/business'
                        },
                        {
                            title: 'Menu.SettingsForms',
                            active: true
                        },
                    ],
                },
                component: () => import('../views/settings/Forms.vue')
            }
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/Error404'
        }
    ]
})

import NProgress from 'nprogress';

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const userLoggedIn = JSON.parse(localStorage.getItem('user'));

    if (to.meta.authRequired && !(userLoggedIn)) {
        if(!userLoggedIn) { localStorage.setItem('user', null) }
        return next('/login');
    }
    if(userLoggedIn && to.path=='/login')
    {
        return next('/dashboard');
    }
    console.log(userLoggedIn)
    if(userLoggedIn && !(to.meta.authorize.find((obj) => obj == userLoggedIn.user.role) || to.meta.authorize.find((obj) => obj == '*'))){
        return next('/Error404');
    }

    next();
})

router.beforeResolve(async(to, from, next) => {
    const userLoggedIn = JSON.parse(localStorage.getItem('user'));
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    let membership='';
    let isValidMembership =true;
    // if(userLoggedIn&&(!to.meta.membership.includes('*'))){
    //     await membershipService.getAll().then(data =>{
    //         membership = data.subscription.package;
    //     })
    //     isValidMembership=to.meta.membership.includes(membership);
    //     if(!isValidMembership)
    //         next('/Error404');
    //     else
    //         next();
    // }
    // else
        next()
})

router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done()
})
export default router